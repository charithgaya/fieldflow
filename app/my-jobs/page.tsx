import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import PageHeader from "../components/page-header";
import StatusBadge from "../components/status-badge";

export default async function MyJobsPage() {
    const user = await requireUser();

    // Only technicians can access My Jobs
    if (user.role !== "TECHNICIAN") {
        redirect("/dashboard");
    }

    // Find the technician profile belonging to the
    // currently signed-in user.
    const technician = await prisma.technician.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!technician) {
        return (
            <main className="min-h-screen px-6 py-8">
                <div className="mx-auto max-w-7xl">
                    <PageHeader
                        title="My Jobs"
                        description="Work orders assigned to you"
                    />

                    <div className="mt-8 rounded-lg border border-red-900/50 bg-red-950/20 p-8 text-center">
                        <p className="font-medium text-red-400">
                            Technician profile not found.
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                           Please contact your administrator to set up your 
                           technician profile.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    // Get only work orders assigned to this technician.
    const workOrders = await prisma.workOrder.findMany({
        where: {
            technicianId: technician.id,
        },
        include: {
            customer: true,
        },
        orderBy: {
            scheduledDate: "asc",
        },
    });

    return (
        <main className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <PageHeader
                        title="My Jobs"
                        description="Work orders assigned to you"
                    />

                    <Link
                        href="/dashboard"
                        className="w-fit rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {workOrders.length === 0 ? (
                    <section className="mt-8 rounded-lg border border-gray-800 p-10 text-center">
                        <h2 className="text-lg font-semibold">
                            No jobs assigned
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            You currently have no work orders assigned to you.
                        </p>
                    </section>
                ) : (
                    <section className="mt-8 space-y-4">
                        {workOrders.map((workOrder) => (
                            <div
                                key={workOrder.id}
                                className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 transition hover:bg-gray-900"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <Link 
                                            href={`/work-orders/${workOrder.id}`} 
                                            className="text-lg font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                                        >
                                            {workOrder.title}
                                        </Link>

                                        <p className="mt-2 text-sm leading-6 text-gray-400">
                                            {workOrder.description}
                                        </p>
                                    </div>

                                    <div className="self-start">
                                        <StatusBadge status={workOrder.status} />
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 border-t border-gray-800 pt-5 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Customer
                                        </p>

                                        <p className="mt-1 text-sm text-gray-300">
                                            {workOrder.customer.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Priority
                                        </p>

                                        <p className="mt-1 text-sm text-gray-300">
                                            {workOrder.priority.charAt(0) +
                                                workOrder.priority.slice(1).toLowerCase()
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Scheduled
                                        </p>

                                        <p className="mt-1 text-sm text-gray-300">
                                            {workOrder.scheduledDate.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Link
                                        href={`/work-orders/${workOrder.id}`}
                                        className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                    >
                                        View Job
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}