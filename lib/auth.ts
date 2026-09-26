import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [
        "http://localhost:3000", 
        "http://10.116.147.247:3000",
        process.env.BETTER_AUTH_URL!,
    ],

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