import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-utils";
import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function DispatcherDashboard(){
    const user = await requireUser();

    if (user.role !== "DISPATCHER") {
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
        take: 5,
        include: {
            customer: true,
            technician: true,
        }
    });

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dispatcher Dashboard</h1>

                        <p className="mt-2 text-gray-600">
                            Welcome, {user.name}!.
                        </p>
                        <p className="mt-1">
                            Role: <strong>{user.role}</strong>
                        </p>
                    </div>
                    
                    
                    <Link href="/login">
                        <button className="mt-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                            Logout
                        </button>
                    </Link>
                </div>



                {/* Summary Cards */}
                <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Open Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{openJobs}</p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Assigned Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{assignedJobs}</p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Completed Jobs</p>
                        <p className="mt-2 text-3xl font-bold">{completedJobs}</p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Available Technicians</p>
                        <p className="mt-2 text-3xl font-bold">{availableTechnicians}</p>
                    </div>
                    <div className="rounded-lg border p-5">
                        <p className="text-sm text-gray-500">Busy Technicians</p>
                        <p className="mt-2 text-3xl font-bold">{busyTechnicians}</p>
                    </div>

                </section>

                {/* Recent Work Orders */}
                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Recent Work Orders</h2>

                        <Link 
                            href="/work-orders" 
                            className="text-sm font-medium underline"
                        >
                            View All
                        </Link>
                    </div>

                        {recentWorkOrders.length === 0 ? (
                            <div className="mt-4 rounded-lg border p-6 text-center text-gray-500">
                                No work orders have been created yet.
                            </div>
                        ): (
                            <div className="mt-4 overflow-x-auto rounded-lg border">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b">
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
                                                    {workOrder.technician ? workOrder.technician.name : "Unassigned"}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {workOrder.status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {workOrder.createdAt.toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </section>

                <section className="mt-8">
                    <h2 className="text-xl text-center font-semibold">Quick Actions</h2>

                    <div className="mt-4 flex justify-center flex-wrap gap-4">
                        <Link 
                            href="/work-orders/new"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Create New Work Order
                        </Link>

                        <Link 
                            href="/customers"
                            className="rounded-md border px-4 py-2 text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >    
                            Customers    
                        </Link>

                        <Link 
                            href="/technicians"
                            className="rounded-md border px-4 py-2 text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >    
                            Technicians    
                        </Link>
                    </div>
                </section>
                
            </div>
        </main>
    );
}