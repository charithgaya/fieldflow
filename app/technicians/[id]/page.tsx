import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

type TechnicianDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function TechnicianDetailsPage({
    params,
}: TechnicianDetailsPageProps) {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    const { id } = await params;

    const technician = await prisma.technician.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            workOrders: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!technician) {
        notFound();
    }

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-1 text-sm text-gray-300">
                            Technicians / Details
                        </p>

                        <h1 className="text-2xl font-bold text-white">
                            {technician.name}
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/technicians"
                            className="px-4 py-2 text-sm border border-gray-700 rounded-md font-medium text-white hover:bg-gray-800"
                        >
                            Back
                        </Link>

                        <Link
                            href={`/technicians/${technician.id}/edit`}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 font-medium"
                        >
                            Edit Technician
                        </Link>
                    </div>
                </div>

                <section className="mb-6 rounded-lg border border-gray-700 p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold text-gray-300">
                        Technician Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-400">
                                Name
                            </p>
                            <p className="mt-1 text-sm">
                                {technician.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-400">
                                Email
                            </p>
                            <p className="mt-1 text-sm">
                                {technician.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-400">
                                Phone
                            </p>
                            <p className="mt-1 text-sm">
                                {technician.phone || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-400">
                                Status
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {technician.status}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-400">
                                Skills
                            </p>
                            <p className="mt-1 text-sm">
                                {technician.skills}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-400">
                                Linked User Account
                            </p>
                            <p className="mt-1 text-sm">
                                {technician.user.email}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-gray-700 shadow-sm">
                    <div className="border-b border-gray-700 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-300">
                            Assigned Work Orders
                        </h2>
                    </div>

                    {technician.workOrders.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm font-medium">
                                No work orders assigned
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                                Assigned work orders will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {technician.workOrders.map((workOrder) => (
                                <div
                                    key={workOrder.id}
                                    className="px-6 py-4"
                                >
                                    <p className="text-sm font-medium">
                                        {workOrder.title}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        {workOrder.status} ·{" "}
                                        {workOrder.priority}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}