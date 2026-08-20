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
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-1 text-sm text-gray-500">
                            Technicians / Details
                        </p>

                        <h1 className="text-2xl font-bold text-gray-900">
                            {technician.name}
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/technicians"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </Link>

                        <Link
                            href={`/technicians/${technician.id}/edit`}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Edit Technician
                        </Link>
                    </div>
                </div>

                <section className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Technician Information
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Name
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                                {technician.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Email
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                                {technician.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Phone
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                                {technician.phone || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Status
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {technician.status}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                                Skills
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                                {technician.skills}
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">
                                Linked User Account
                            </p>
                            <p className="mt-1 text-sm text-gray-900">
                                {technician.user.email}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Assigned Work Orders
                        </h2>
                    </div>

                    {technician.workOrders.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm font-medium text-gray-900">
                                No work orders assigned
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Assigned work orders will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {technician.workOrders.map((workOrder) => (
                                <div
                                    key={workOrder.id}
                                    className="px-6 py-4"
                                >
                                    <p className="text-sm font-medium text-gray-900">
                                        {workOrder.title}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
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