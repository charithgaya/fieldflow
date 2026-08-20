"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Role } from "@/app/generated/prisma/client";

const createUserSchema = z.object({

    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().trim().min(8, "Password must be at least 8 characters.").max(128, "Password is too long."),
    role: z.enum(["ADMIN", "DISPATCHER", "TECHNICIAN"]),
});

export async function createUser(formData: FormData) {
    const currentUser = await requireUser();

    if (currentUser.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const result = createUserSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
    });

    if (!result.success) {
        throw new Error(result.error.issues[0].message);
    }
    
    const { name, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("A user with this email already exists.");
    }

    /*
     * Better Auth creates:
     * - User record
     * - Account record containing the password credential
     *
     * The role is intentionally not passed here because
     * our Better Auth configuration marks role as input: false.
     */

    const resultFromAuth = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
    });

    if (!resultFromAuth.user) {
        throw new Error("Failed to create user.");
    }

    /*
     * Role is application-owned, so we set it
     * through our server-side Prisma code.
     */
    
    await prisma.user.update({
        where: {
            id: resultFromAuth.user.id,
        },
        data: {
            role: role as Role,
        },
    });

    revalidatePath("/users");

}