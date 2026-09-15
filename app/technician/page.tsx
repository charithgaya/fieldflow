import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-utils";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../components/logout-button";

export default async function TechnicianDashboard(){
    const user = await requireUser();

    if (user.role !== "TECHNICIAN") {
        redirect("/dashboard");
    }

    const technician = await prisma.technician.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!technician){
        return (
            <main className="min-h-screen p-8">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mt-4 font-bold">
                        Technician Dashboard
                    </h1>

                    <p className="mt-4 text-red-600">
                        Technician profile not found.
                    </p>
                </div>
            </main>
        )
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
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Technician Dashboard</h1>

                        <p className="mt-2 text-gray-600">
                            Welcome, {user.name}!.
                        </p>

                        <p className="mt-1">
                            Role: <strong>{user.role}</strong>
                        </p>
                    </div>

                    <LogoutButton />
                </div>

                {/* Summary Cards */}
                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Assigned Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{assignedJobs}</p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">In Progress</p>
                        <p className="mt-2 text-3xl font-bold">{inProgressJobs}</p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Completed Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{completedJobs}</p>
                    </div>
                </section>

                {/* Recent Jobs */}
                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">My Recent Jobs</h2>

                        <Link 
                            href="/my-jobs" 
                            className="text-sm font-medium underline"
                        >
                            View My Jobs
                        </Link>
                    </div>

                        {recentJobs.length === 0 ? (
                            <div className="mt-4 rounded-lg border p-6 text-center text-gray-500">
                                You have no assigned work orders yet.
                            </div>
                        ): (
                            <div className="mt-4 overflow-x-auto rounded-lg border">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Job</th>
                                            <th className="px-4 py-3 font-semibold">Customer</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">Scheduled</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentJobs.map((workOrder) => (
                                            <tr 
                                                key={workOrder.id} 
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="px-4 py-3">
                                                    <Link 
                                                        href={`/work-orders/${workOrder.id}`} 
                                                        className="font-medium underline"
                                                    >
                                                        {workOrder.title}
                                                    </Link>
                                                </td>

                                                <td className="px-4 py-3">
                                                    {workOrder.customer.name}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {workOrder.status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {workOrder.scheduledDate.toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </section>

                <section className="mt-8 text-center">
                    <h2 className="text-xl font-semibold">Quick Actions</h2>

                    <div className="mt-4">
                        <Link 
                            href="/my-jobs"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Open My Jobs
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}