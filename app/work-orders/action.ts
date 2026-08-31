"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

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

        const updatedWorkOrder = await prisma.$transaction(async (tx) => {
            const updatedWorkOrder = await tx.workOrder.update({
                where: { id: workOrderId },
                data: {
                    technicianId,
                    status: "ASSIGNED",
                },
            });

            console.log("BEFORE TECHNICIAN UPDATE:", technicianId);

        const updatedTechnician = await tx.technician.update({
                where: { id: technicianId },
                data: {
                    status: "BUSY",
                },
            });

            console.log(
        "AFTER TECHNICIAN UPDATE:",
        updatedTechnician.id,
        updatedTechnician.status
    );

            await tx.activity.create({
                data: {
                    workOrderId: updatedWorkOrder.id,
                    userId: user.id,
                    action: "ASSIGNED",
                    note: "Work order assigned to technician",
                },
            });

            return updatedWorkOrder;
        });
        
    } catch (error: unknown) {
        console.error("Error assigning technician:", error);

        return {
            error: "An error occurred while assigning the technician. Please try again.",
        };
    }

    redirect(`/work-orders/${workOrderId}`);    
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

        // Server-side ownership protection
        if(workOrder.technicianId !== technician.id){
            return {
                error: "You do not have permission to start this work order.",
            };
        }
    
        // Only an assigned job can be started
        if(workOrder.status !== "ASSIGNED"){
            return {
                error: "Only an assigned work order can be started.",
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
