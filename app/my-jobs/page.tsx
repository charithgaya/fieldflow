import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

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
            <main className="p-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-2xl font-semibold">
                        My Jobs
                    </h1>

                    <p className="mt-4 text-sm text-gray-600">
                        Technician profile not found.
                    </p>
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
        <main className="p-6">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            My Jobs
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Work orders assigned to you
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {workOrders.length === 0 ? (
                    <section className="mt-6 rounded-lg border p-6">
                        <h2 className="font-semibold">
                            No jobs assigned
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            You currently have no work orders assigned to you.
                        </p>
                    </section>
                ) : (
                    <section className="mt-6 space-y-4">
                        {workOrders.map((workOrder) => (
                            <div
                                key={workOrder.id}
                                className="rounded-lg border p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-semibold">
                                            {workOrder.title}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {workOrder.description}
                                        </p>
                                    </div>

                                    <span className="rounded-md border px-2 py-1 text-xs">
                                        {workOrder.status}
                                    </span>
                                </div>

                                <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                                    <div>
                                        <p className="font-medium">
                                            Customer
                                        </p>

                                        <p className="text-gray-600">
                                            {workOrder.customer.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Priority
                                        </p>

                                        <p className="text-gray-600">
                                            {workOrder.priority}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Scheduled
                                        </p>

                                        <p className="text-gray-600">
                                            {workOrder.scheduledDate.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        href={`/work-orders/${workOrder.id}`}
                                        className="inline-block rounded-md border px-4 py-2 text-sm"
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