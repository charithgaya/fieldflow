import { requireUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "../components/logout-button";
import PageHeader from "../components/page-header";
import StatusBadge from "../components/status-badge";
import { formatSriLankaDateTime } from "@/lib/date-utils";

export default async function AdminDashboard() {
    const user = await requireUser();

    if (user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const [
        openJobs,
        assignedJobs,
        completedJobs,
        availableTechnicians,
        busyTechnicians,
    ] = await Promise.all([
        prisma.workOrder.count({
            where: {
                status: "OPEN",
            },
        }),

        prisma.workOrder.count({
            where: {
                status: "ASSIGNED",
            },
        }),

         prisma.workOrder.count({
            where: {
                status: "COMPLETED",
            },
        }),

         prisma.technician.count({
            where: {
                status: "AVAILABLE",
            },
        }),

         prisma.technician.count({
            where: {
                status: "BUSY",
            },
        }),
    ]);

    const recentWorkOrders = await prisma.workOrder.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take:5,
        include: {
            customer: true,
            technician: true,
        },
    });

    return (
        <main className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <PageHeader 
                        title="Admin Dashboard"
                        description={`Welcome, ${user.name}. Role: ${user.role}`}
                    />

                    <LogoutButton />
                </div>

                {/* Summary Cards */}
                <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">Open Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{openJobs}</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">Assigned Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{assignedJobs}</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">Completed Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{completedJobs}</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">Available Technicians</p>
                        <p className="mt-2 text-3xl font-bold">{availableTechnicians}</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
                        <p className="text-sm text-gray-400">Busy Technicians</p>
                        <p className="mt-2 text-3xl font-bold">{busyTechnicians}</p>
                    </div>
                </section>

                {/* Recent Work Orders */}
                <section className="mt-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Recent Work Orders</h2>

                        <Link 
                            href="/work-orders" 
                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            View All
                        </Link>
                    </div>

                        {recentWorkOrders.length === 0 ? (
                            <div className="mt-4 rounded-lg p-8 text-center border border-gray-800">
                                <p className="font-medium">
                                    No work orders have been created yet.
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                    Please create a new work order to get started.
                                </p>

                                <Link 
                                    href="/work-orders/new"
                                    className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Create Work Order
                                </Link>
                            </div>
                        ): (
                            <div className="mt-4 overflow-x-auto rounded-lg border border-gray-800">
                                <table className="w-full min-w-175 text-left text-sm">
                                    <thead className="border-b border-gray-800 bg-gray-900/50">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Job</th>
                                            <th className="px-4 py-3 font-semibold">Customer</th>
                                            <th className="px-4 py-3 font-semibold">Technician</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">Created</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentWorkOrders.map((workOrder) => (
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
                                                    {workOrder.technician ? workOrder.technician.name : "Unassigned"}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <StatusBadge status={workOrder.status} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatSriLankaDateTime(workOrder.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </section>

                <section className="mt-10">
                    <h2 className="text-xl text-center font-semibold">
                        Quick Actions
                    </h2>

                    <div className="mt-4 flex justify-center flex-wrap gap-3">
                        <Link 
                            href="/work-orders/new"
                            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                            Create New Work Order
                        </Link>

                        <Link 
                            href="/customers"
                            className="rounded-md border border-gray-700 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800 transition"
                        >    
                            Customers    
                        </Link>

                        <Link 
                            href="/technicians"
                            className="rounded-md border border-gray-700 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800 transition"
                        >    
                            Technicians    
                        </Link>
                        
                        <Link 
                            href="/users"
                            className="rounded-md border border-gray-700 px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800 transition"
                        >    
                            Users    
                        </Link>

                    </div>
                </section>
            </div>
        </main>
    );
}