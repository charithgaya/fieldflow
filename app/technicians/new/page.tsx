import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

import TechnicianForm from "../technician-form";

export default async function NewTechnicianPage() {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    // Only users who have the TECHNICIAN role
    // and are not already linked to a Technician record.
    const users = await prisma.user.findMany({
        where: {
            role: "TECHNICIAN",
            technician: null,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-300">
                        Technicians / New
                    </p>

                    <h1 className="text-2xl font-bold text-white">
                        Create Technician
                    </h1>

                    <p className="mt-1 text-sm text-gray-400">
                        Create a technician profile and link it to a user
                        account.
                    </p>
                </div>

                {users.length === 0 ? (
                    <div className="rounded-lg border border-gray-700 text-center p-6">
                        <h2 className="font-semibold text-white">
                            No available technician users
                        </h2>

                        <p className="mt-1 text-sm text-gray-300">
                            Create a user with the TECHNICIAN role first.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-700 p-6 shadow-sm">
                        <TechnicianForm mode="create" users={users} />
                    </div>
                )}
            </div>
        </main>
    );
}