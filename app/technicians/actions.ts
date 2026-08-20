"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

const technicianSchema = z.object({
    userId: z.string().min(1, "User account is required"),
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().optional(),
    skills: z.string().trim().min(1, "Skills are required"),
    status: z.enum(["AVAILABLE", "BUSY", "UNAVAILABLE"]),
});

export type TechnicianFormState = {
    error?: string;
    fieldErrors?: {
        userId?: string[];
        name?: string[];
        email?: string[];
        phone?: string[];
        skills?: string[];
        status?: string[];
    };
};

async function requireTechnicianManager() {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return null;
    }

    return user;
}

export async function createTechnician(
    _previousState: TechnicianFormState,
    formData: FormData
): Promise<TechnicianFormState> {
    const user = await requireTechnicianManager();

    if (!user) {
        return {
            error: "You are not authorized to create technicians.",
        };
    }

    const result = technicianSchema.safeParse({
        userId: formData.get("userId"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        skills: formData.get("skills"),
        status: formData.get("status") || "AVAILABLE",
    });

    if (!result.success) {
        return {
            error: "Please correct the errors below.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const {
        userId,
        name,
        email,
        phone,
        skills,
        status,
    } = result.data;

    try {
        const linkedUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!linkedUser) {
            return {
                error: "Selected user account was not found.",
            };
        }

        if (linkedUser.role !== "TECHNICIAN") {
            return {
                error: "The selected user must have the TECHNICIAN role.",
            };
        }

        await prisma.technician.create({
            data: {
                userId,
                name,
                email,
                phone: phone || null,
                skills,
                status,
            },
        });
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                error:
                    "This user or email is already linked to a technician.",
            };
        }

        console.error("Failed to create technician:", error);

        return {
            error: "Something went wrong while creating the technician.",
        };
    }

    redirect("/technicians");
}

const updateTechnicianSchema = technicianSchema.extend({
    id: z.string().min(1, "Technician ID is required"),
});

export async function updateTechnician(
    _previousState: TechnicianFormState,
    formData: FormData
): Promise<TechnicianFormState> {
    const user = await requireTechnicianManager();

    if (!user) {
        return {
            error: "You are not authorized to update technicians.",
        };
    }

    const result = updateTechnicianSchema.safeParse({
        id: formData.get("id"),
        userId: formData.get("userId"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        skills: formData.get("skills"),
        status: formData.get("status"),
    });

    if (!result.success) {
        return {
            error: "Please correct the errors below.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const {
        id,
        userId,
        name,
        email,
        phone,
        skills,
        status,
    } = result.data;

    try {
        const linkedUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!linkedUser || linkedUser.role !== "TECHNICIAN") {
            return {
                error: "The selected user must have the TECHNICIAN role.",
            };
        }

        await prisma.technician.update({
            where: {
                id,
            },
            data: {
                userId,
                name,
                email,
                phone: phone || null,
                skills,
                status,
            },
        });
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                error:
                    "This user or email is already linked to another technician.",
            };
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2025"
        ) {
            return {
                error: "Technician not found.",
            };
        }

        console.error("Failed to update technician:", error);

        return {
            error: "Something went wrong while updating the technician.",
        };
    }

    redirect(`/technicians/${id}`);
}
