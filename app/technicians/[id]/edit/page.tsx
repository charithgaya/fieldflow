import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

import TechnicianForm from "../../technician-form";

type EditTechnicianPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditTechnicianPage({
    params,
}: EditTechnicianPageProps) {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    const { id } = await params;

    const technician = await prisma.technician.findUnique({
        where: {
            id,
        },
    });

    if (!technician) {
        notFound();
    }

    const users = await prisma.user.findMany({
        where: {
            role: "TECHNICIAN",
            OR: [
                {
                    technician: null,
                },
                {
                    technician: {
                        id,
                    },
                },
            ],
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
                        Technicians / Edit
                    </p>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Technician
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update technician information.
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <TechnicianForm
                        mode="edit"
                        users={users}
                        technician={technician}
                    />
                </div>
            </div>
        </main>
    );
}