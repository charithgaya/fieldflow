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

export async function assignTechnician(
    formData: FormData
): Promise<{ error?: string }> {

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

        const technician = await prisma.user.findUnique({
            where: { id: technicianId },
        });

        if (!technician) {
            return {
                error: "Technician not found.",
            };
        }

        if (technician.status === "UNAVAILABLE") {
            return {
                error: "Technician is unavailable.",
            };
        }

        const updatedWorkOrder = await prisma.workOrder.update({
            where: { id: workOrderId },
            data: {
                technicianId,
                status: "ASSIGNED",
            },
        });

        await prisma.activity.create({
            data: {
                workOrderId: updatedWorkOrder.id,
                userId: user.id,
                action: "ASSIGNED",
                note: "Work order assigned to technician",
            },
        });
    } catch (error: unknown) {
        console.error("Error assigning technician:", error);

        return {
            error: "An error occurred while assigning the technician. Please try again.",
        };
    }

    redirect(`/work-orders/${workOrderId}`);    
}