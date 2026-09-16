import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-utils";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../components/logout-button";
import PageHeader from "../components/page-header";
import StatusBadge from "../components/status-badge";

export default async function TechnicianDashboard() {
    const user = await requireUser();

    if (user.role !== "TECHNICIAN") {
        redirect("/dashboard");
    }

    const technician = await prisma.technician.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!technician) {
        return (
            <main className="min-h-screen px-6 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <PageHeader
                            title="Technician Dashboard"
                            description={`Welcome, ${user.name}. Role: ${user.role}`}
                        />

                        <LogoutButton />
                    </div>

                    <div className="mt-8 rounded-lg border border-red-900/50 bg-red-950/20 p-8 text-center">
                        <p className="font-medium text-red-400">
                            Technician profile not found.
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                            Please contact an administrator to set up your
                            technician profile.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const [
        assignedJobs,
        inProgressJobs,
        completedJobs,
    ] = await Promise.all([
        prisma.workOrder.count({
            where: {
                technicianId: technician.id,
                status: "ASSIGNED",
            },
        }),

        prisma.workOrder.count({
            where: {
                technicianId: technician.id,
                status: "IN_PROGRESS",
            },
        }),

        prisma.workOrder.count({
            where: {
                technicianId: technician.id,
                status: "COMPLETED",
            },
        }),
    ]);

    const recentJobs = await prisma.workOrder.findMany({
        where: {
            technicianId: technician.id,
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: 5,
        include: {
            customer: true,
        },
    });

    return (
        <main className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <PageHeader
                        title="Technician Dashboard"
                        description={`Welcome, ${user.name}. Role: ${user.role}`}
                    />

                    <LogoutButton />
                </div>

                {/* Summary Cards */}
                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">
                            Assigned Jobs
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {assignedJobs}
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">
                            In Progress
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {inProgressJobs}
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">
                            Completed Jobs
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {completedJobs}
                        </p>
                    </div>
                </section>

                {/* Recent Jobs */}
                <section className="mt-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            My Recent Jobs
                        </h2>

                        <Link
                            href="/my-jobs"
                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            View My Jobs
                        </Link>
                    </div>

                    {recentJobs.length === 0 ? (
                        <div className="mt-4 rounded-lg border border-gray-800 p-8 text-center">
                            <p className="font-medium">
                                No assigned work orders yet.
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                                Assigned jobs will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-800">
                            <table className="w-full min-w-[650px] text-left text-sm">
                                <thead className="border-b border-gray-800 bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">
                                            Job
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Customer
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Scheduled
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentJobs.map((workOrder) => (
                                        <tr
                                            key={workOrder.id}
                                            className="border-b border-gray-800 last:border-b-0"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/work-orders/${workOrder.id}`}
                                                    className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                                                >
                                                    {workOrder.title}
                                                </Link>
                                            </td>

                                            <td className="px-4 py-3">
                                                {workOrder.customer.name}
                                            </td>

                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    status={workOrder.status}
                                                />
                                            </td>

                                            <td className="px-4 py-3 text-gray-400">
                                                {workOrder.scheduledDate.toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <section className="mt-10 text-center">
                    <h2 className="text-xl font-semibold">
                        Quick Actions
                    </h2>

                    <div className="mt-4">
                        <Link
                            href="/my-jobs"
                            className="inline-block rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                        >
                            Open My Jobs
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}