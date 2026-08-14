import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: ["http://localhost:3000", "http://10.44.29.247:3000"],

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: ["ADMIN", "DISPATCHER", "TECHNICIAN"],
                required: false,
                defaultValue: "TECHNICIAN",
                input: false,
                returned: true,
            }
        }
    }
});