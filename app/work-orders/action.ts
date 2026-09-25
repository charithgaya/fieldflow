"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { canStartWorkOrder } from "@/lib/work-order-rules"; 

const workOrderSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    customerId: z.string().min(1, "Customer ID is required"),
    scheduledDate: z.string().min(1, "Scheduled date is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

export type WorkOrderFormState = {
    error?: string;
    fieldErrors?: {
        title?: string[];
        description?: string[];
        customerId?: string[];
        scheduledDate?: string[];
        priority?: string[];
    };
};

export async function createWorkOrder(
    _previousState: WorkOrderFormState,
    formData: FormData
): Promise<WorkOrderFormState> {

    const user = await requireUser();

    // Server-side authorization
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return {
            error: "You do not have permission to create a work order.",
        };
    }

    const result = workOrderSchema.safeParse({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        customerId: formData.get("customerId") as string,
        scheduledDate: formData.get("scheduledDate") as string,
        priority: formData.get("priority") as string,
    });

    if (!result.success) {
        return {
            error: "Please correct the errors below",
            fieldErrors: result.error.flatten().fieldErrors,
        }
    };

    const { title, description, customerId, scheduledDate, priority } = result.data;

    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!customer) {
        return {
            error: "Selected customer was not found.",
            fieldErrors: {
                customerId: ["Please select a valid customer."],
            }
        };
    }

    const scheduleDateValue = new Date(scheduledDate);

    if (Number.isNaN(scheduleDateValue.getTime())) {
        return {
            error: "Invalid scheduled date.",
        };
    }

    try {
        const workOrder = await prisma.workOrder.create({
            data: {
                title,
                description,
                customerId,
                scheduledDate: scheduleDateValue,
                priority,
                status: "OPEN",
            },
        });

        await prisma.activity.create({
            data: {
                workOrderId: workOrder.id,
                userId: user.id,
                action: "CREATED",
                note: "Work order created",
            },
        });
    } catch (error: unknown) {
        console.error("Error creating work order:", error);

        return {
            error: "An error occurred while creating the work order. Please try again.",
        };
    }

    redirect("/work-orders");
}

export async function updateWorkOrder(
    _previousState: WorkOrderFormState,
    formData: FormData
): Promise<WorkOrderFormState> {

    const user = await requireUser();

    // Server-side authorization
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return {
            error: "You do not have permission to edit a work order.",
        };
    }

    const workOrderId = formData.get("workOrderId");

    if (typeof workOrderId !== "string" || !workOrderId) {
        return {
            error: "Invalid work order ID.",
        };
    }

    const result = workOrderSchema.safeParse({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        customerId: formData.get("customerId") as string,
        scheduledDate: formData.get("scheduledDate") as string,
        priority: formData.get("priority") as string,
    });

    if (!result.success) {
        return {
            error: "Please correct the errors below",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const {
        title,
        description,
        customerId,
        scheduledDate,
        priority,
    } = result.data;

    const workOrder = await prisma.workOrder.findUnique({
        where: {
            id: workOrderId,
        },
    });

    if (!workOrder) {
        return {
            error: "Work order not found.",
        };
    }

    if (
        workOrder.status !== "OPEN" &&
        workOrder.status !== "ASSIGNED"
    ) {
        return {
            error: "This work order can no longer be edited.",
        };
    }

    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!customer) {
        return {
            error: "Selected customer was not found.",
            fieldErrors: {
                customerId: ["Please select a valid customer."],
            },
        };
    }

    const scheduledDateValue = new Date(scheduledDate);

    if (Number.isNaN(scheduledDateValue.getTime())) {
        return {
            error: "Invalid scheduled date.",
            fieldErrors: {
                scheduledDate: ["Please enter a valid scheduled date."],
            },
        };
    }

    try {
        await prisma.workOrder.update({
            where: {
                id: workOrderId,
            },
            data: {
                title,
                description,
                customerId,
                scheduledDate: scheduledDateValue,
                priority,
            },
        });
    } catch (error: unknown) {
        console.error("Error updating work order:", error);

        return {
            error: "An error occurred while updating the work order. Please try again.",
        };
    }

    redirect(`/work-orders/${workOrderId}`);
}

export type AssignTechnicianFormState = {
    error?: string;
};
export async function assignTechnician(
    _previousState: AssignTechnicianFormState,
    formData: FormData
): Promise<AssignTechnicianFormState> {

    const user = await requireUser();

    // Server-side authorization
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return {
            error: "You do not have permission to assign a technician.",
        };
    }

    const workOrderId = formData.get("workOrderId");
    const technicianId = formData.get("technicianId");

    if (
        typeof workOrderId !== "string" ||
        !workOrderId ||
        typeof technicianId !== "string" ||
        !technicianId
    ) {
        return {
            error: "Invalid work order ID or technician ID.",
        };
    }

    try {
        const workOrder = await prisma.workOrder.findUnique({
            where: { id: workOrderId },
        });

        if (!workOrder) {
            return {
                error: "Work order not found.",
            };
        }

        // Completed and cancelled work orders cannot be reassigned.
        if (workOrder.status === "COMPLETED" || workOrder.status === "CANCELLED"){
            return {
                error: "Cannot assign a technician to a completed or cancelled work order.",
            };
        }

        const technician = await prisma.technician.findUnique({
            where: { id: technicianId },
        });

        if (!technician) {
            return {
                error: "Technician not found.",
            };
        }

        if (technician.status !== "AVAILABLE") {
            return {
                error: "Technician is not available for assignment.",
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.workOrder.update({
                where: { id: workOrderId },
                data: {
                    technicianId,
                    status: "ASSIGNED",
                },
            });

            await tx.technician.update({
                where: { id: technicianId },
                data: {
                    status: "BUSY",
                },
            });

            await tx.activity.create({
                data: {
                    workOrderId,
                    userId: user.id,
                    action: "ASSIGNED",
                    note: "Work order assigned to technician",
                },
            });
        });
        
    } catch (error: unknown) {
        console.error("Error assigning technician:", error);

        return {
            error: "An error occurred while assigning the technician. Please try again.",
        };
    }

    redirect(`/work-orders/${workOrderId}`);    
}

export type DeleteWorkOrderFormState = {
    error?: string;
};

export async function deleteWorkOrder(
    _previousState: DeleteWorkOrderFormState,
    formData: FormData
): Promise<DeleteWorkOrderFormState> {
    const user = await requireUser();

    // Only Admin and Dispatcher can delete work orders
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return {
            error: "You do not have permission to delete a work order.",
        };
    }

    const workOrderId = formData.get("workOrderId");

    if (typeof workOrderId !== "string" || !workOrderId) {
        return {
            error: "Invalid work order ID.",
        };
    }

    try {
        const workOrder = await prisma.workOrder.findUnique({
            where: {
                id: workOrderId,
            },
        });

        if (!workOrder) {
            return {
                error: "Work order not found.",
            };
        }

        // Only OPEN or CANCELLED work orders can be deleted.
        if (
            workOrder.status !== "OPEN" &&
            workOrder.status !== "CANCELLED"
        ) {
            return {
                error: "Only open or cancelled work orders can be deleted.",
            };
        }

        await prisma.$transaction(async (tx) => {
            // Remove activity history first because activities
            // belong to this work order.
            await tx.activity.deleteMany({
                where: {
                    workOrderId,
                },
            });

            await tx.workOrder.delete({
                where: {
                    id: workOrderId,
                },
            });
        });
    } catch (error: unknown) {
        console.error("Error deleting work order:", error);

        return {
            error: "An error occurred while deleting the work order. Please try again.",
        };
    }

    redirect("/work-orders");
}

export type StartWorkFormState = {
    error?: string;
}

export async function startWork(
    _previousState: StartWorkFormState,
    formData: FormData
): Promise<StartWorkFormState> {

    const user = await requireUser();

    // Only technicians can start assigned work
    if(user.role !== "TECHNICIAN"){
        return {
            error: "Only technicians can start work.",
        };
    }

    const workOrderId = formData.get("workOrderId");

    if (typeof workOrderId !== "string" || !workOrderId) {
        return {
            error: "Invalid work order ID.",
        };
    }

    try {
        // Find the technician profile connected to the currently signed in user
        const technician = await prisma.technician.findUnique({
            where: { userId: user.id },
        });

        if (!technician) {
            return {
                error: "Technician Profile not found.",
            };
        }

        const workOrder = await prisma.workOrder.findUnique({
            where: { id: workOrderId },
        });

        if (!workOrder) {
            return {
                error: "Work order not found.",
            };
        }

        // // Server-side ownership protection
        // if(workOrder.technicianId !== technician.id){
        //     return {
        //         error: "You do not have permission to start this work order.",
        //     };
        // }
    
        // // Only an assigned job can be started
        // if(workOrder.status !== "ASSIGNED"){
        //     return {
        //         error: "Only an assigned work order can be started.",
        //     };
        // }

        const startCheck = canStartWorkOrder(
            workOrder.status,
            workOrder.technicianId,
            technician.id
        );

        if(!startCheck.allowed){
            return {
                error: startCheck.error,
            };
        }

        await prisma.$transaction([
            prisma.workOrder.update({
                where: { id: workOrderId },
                data: {
                    status: "IN_PROGRESS",
                },
            }),
            prisma.activity.create({
                data: {
                    workOrderId,
                    userId: user.id,
                    action: "STATUS_CHANGED",
                    note: "Work order status changed from ASSIGNED to IN_PROGRESS",
                },
            }),
        ]);
    } catch (error: unknown) {
        console.error("Error starting work:", error);

        return {
            error: "An error occurred while starting work. Please try again.",
        };
    }

    redirect(`/work-orders/${workOrderId}`);    
}

export type AddProgressNoteFormState = {
    error?: string;
    success?: string;
};

export async function addProgressNote(
    _previousState: AddProgressNoteFormState,
    formData: FormData
): Promise<AddProgressNoteFormState> {
    const user = await requireUser();

    // Only technicians can add progress notes
    if(user.role !== "TECHNICIAN"){
        return {
            error: "Only technicians can add progress notes.",
        };
    }

    const workOrderId = formData.get("workOrderId");
    const note = formData.get("note");

    if (typeof workOrderId !== "string" || !workOrderId) {
        return {
            error: "Invalid work order ID.",
        };
    }

    if (typeof note !== "string" || !note.trim()) {
        return {
            error: "Progress note is required.",
        };
    }

    const technician = await prisma.technician.findUnique({
        where: { userId: user.id },
    });

    if (!technician) {
        return {
            error: "Technician profile not found.",
        };
    }

    const workOrder = await prisma.workOrder.findUnique({
        where: { id: workOrderId },
    });

    if (!workOrder) {
        return {
            error: "Work order not found.",
        };
    }

    // Server-side ownership protection
    if(workOrder.technicianId !== technician.id){
        return {
            error: "You do not have permission to add a progress note to this work order.",
        };
    }

    // Only an in-progress job can have progress notes added
    if(workOrder.status !== "IN_PROGRESS"){
        return {
            error: "Only an in-progress work order can have progress notes added.",
        };
    }

    try {
        await prisma.activity.create({
            data: {
                workOrderId,
                userId: user.id,
                action: "PROGRESS_NOTE",
                note: note.trim(),
            },
        });
    } catch (error: unknown) {
        console.error("Error adding progress note:", error);

        return {
            error: "An error occurred while adding progress note. Please try again.",
        };
    }

    return {
        success: "Progress note added successfully.",
    };
}

export type CompleteWorkOrderFormState = {
    error?: string;
    success?: string;
};

export async function completeWorkOrder(
    _previousState: CompleteWorkOrderFormState,
    formData: FormData
): Promise<CompleteWorkOrderFormState> {
    const user = await requireUser();
    
    // Only technicians can complete work orders
    if(user.role !== "TECHNICIAN"){
        return {
            error: "Only technicians can complete work orders.",
        };
    }

    const workOrderId = formData.get("workOrderId");
    const completionNotes = formData.get("completionNotes");

    if (typeof workOrderId !== "string" || !workOrderId) {
        return {
            error: "Invalid work order ID.",
        };
    }

    if (typeof completionNotes !== "string" || !completionNotes.trim()) {
        return {
            error: "Completion notes are required.",
        };
    }

    const technician = await prisma.technician.findUnique({
        where: { userId: user.id },
    });

    if (!technician) {
        return {
            error: "Technician profile not found.",
        };
    }

    const workOrder = await prisma.workOrder.findUnique({
        where: {
            id: workOrderId,
        },
    });

    if (!workOrder){
        return {
            error: "Work order not found.",
        };
    }

    // Server-side ownership protection
    if(workOrder.technicianId !== technician.id){
        return {
            error: "You do not have permission to complete this work order.",
        };
    }

    // Only an in-progress job can be completed
    if(workOrder.status !== "IN_PROGRESS"){
        return {
            error: "Only an in-progress work order can be completed.",
        };
    }

    try {
        await prisma.$transaction([
            prisma.workOrder.update({
                where: { 
                    id: workOrderId 
                },
                data: { 
                    status: "COMPLETED",
                    completionNotes: completionNotes.trim(),
                },
            }),

            prisma.activity.create({
                data: {
                    workOrderId,
                    userId: user.id,
                    action: "COMPLETED",
                    note: completionNotes.trim(),
                },
            }),

            prisma.technician.update({
                where: { 
                    id: technician.id,
                },
                data: { 
                    status: "AVAILABLE",
                },
            }),
        ]);
    } catch (error: unknown) {
        console.error("Error completing work order:", error);

        return {
            error: "An error occurred while completing the work order. Please try again.",
        };
    }

    return {
        success: "Work order completed successfully.",
    };
}