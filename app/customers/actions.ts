"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

const customerSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z.string().trim().min(1, "Phone number is required"),
    address: z.string().trim().min(1, "Address is required"),
});

export type CustomerFormState = {
    error?: string;
    fieldErrors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        address?: string[];
    };
};

export async function createCustomer(
    _previousState: CustomerFormState,
    formData: FormData
): Promise<CustomerFormState>{
    const user = await requireUser();

    //Server-side authorization
    if(user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return {
            error: "You are not authorized to create a customer",
        }
    }

    const result = customerSchema.safeParse({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string
    });

    if (!result.success) {
        return {
            error: "Please correct the errors below",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const { name, email, phone, address } = result.data;

    try {
        await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                address,
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
                error: "A customer with this email already exists.",
                fieldErrors: {
                    email: ["This email is already in use."],
                },
            };
        };

        console.error("Failed o create customer: ", error);

        return {
            error: "Something went wrong while creating the customer.",
        };
    }

    redirect("/customers");
}