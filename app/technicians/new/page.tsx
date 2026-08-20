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
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-500">
                        Technicians / New
                    </p>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Technician
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Create a technician profile and link it to a user
                        account.
                    </p>
                </div>

                {users.length === 0 ? (
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
                        <h2 className="font-semibold text-yellow-900">
                            No available technician users
                        </h2>

                        <p className="mt-1 text-sm text-yellow-800">
                            Create a user with the TECHNICIAN role first.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <TechnicianForm mode="create" users={users} />
                    </div>
                )}
            </div>
        </main>
    );
}