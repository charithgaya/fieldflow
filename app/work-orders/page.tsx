import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

type SearchParams = Promise<{
    search?: string;
    priority?: string;
    technicianId?: string;
}>;

export default async function WorkOrdersPage({ 
    searchParams
}: { 
    searchParams: SearchParams;
}) {
    const user = await requireUser();

    // Server-side authorization
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Access Denied
                </h1>
                <p className="mt-2 text-gray-600">
                    You do not have permission to view work orders.
                </p>
            </div>
        );
    }

    const params = await searchParams;

    const status = params.status;
    const priority = params.priority;
    const technicianId = params.technicianId;

    const workOrders = await prisma.workOrder.findMany({
        where: {
            ...(status
                ?   { 
                        status: status as 
                            | "OPEN" 
                            | "ASSIGNED" 
                            | "IN_PROGRESS" 
                            | "CANCELLED" 
                            | "COMPLETED" 
                    } : {}),
            ...(priority
                ?   { 
                        priority: priority as 
                            | "LOW" 
                            | "MEDIUM" 
                            | "HIGH"
                            | "URGENT"
                    } : {}),
            ...(technicianId
                ?   { 
                        technicianId
                    } : {}),
        },
        include: {
            customer: true,
            technician: true,
        },
        orderBy: {
            scheduledDate: "asc",
        }
    });

    const technicians = await prisma.technician.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Work Orders
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Create, assign & track service jobs.
                    </p>
                </div>

                <Link
                    href="/work-orders/new"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                >
                    Create Work Order
                </Link>
            </div>

            <form
                method="GET"
                className="mt-6 flex flex-wrap gap-3"
            >
                <select
                    name="status"
                    defaultValue={status ?? ""}
                    className="px-3 py-2 border rounded-md text-sm"
                >
                    <option value="">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                <select
                    name="priority"
                    defaultValue={priority ?? ""}
                    className="px-3 py-2 border rounded-md text-sm"
                >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>

                <select
                    name="technicianId"
                    defaultValue={technicianId ?? ""}
                    className="px-3 py-2 border rounded-md text-sm"
                >
                    <option value="">All Technicians</option>
                    
                    {technicians.map((technician) => (
                        <option 
                            key={technician.id} 
                            value={technician.id}
                        >
                            {technician.name}
                        </option>
                    ))}
                    </select>

                <button
                    type="submit"
                    className="px-4 py-2 text-sm border rounded-md font-medium"
                >
                    Filter
                </button>

                <Link
                    href="/work-orders"
                    className="px-4 py-2 text-sm border rounded-md text-gray-600"
                >
                    Clear
                </Link>
            </form>

            <div className="mt-6">
                {workOrders.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center">
                        <h2 className="text-lg font-medium">
                            No work orders found
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            There are no work orders matching the selected filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border">
                        <div className="divide-y">
                            {workOrders.map((workOrder) => (
                                <div
                                    key={workOrder.id}
                                    className="p-5"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="font-semibold">
                                                {workOrder.title}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Customer: {" "}
                                                {workOrder.customer.name}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Technician: {" "}
                                                {workOrder.technician
                                                    ? workOrder.technician.name
                                                    : "Not assigned"
                                                }
                                            </p>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Scheduled: {" "}
                                                {workOrder.scheduledDate.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full border px-3 py-1 text-xs font-medium">
                                                {workOrder.priority}
                                            </span>

                                            <span className="rounded-full border px-3 py-1 text-xs font-medium">
                                                {workOrder.status}
                                            </span>

                                            <Link
                                                href={`/work-orders/${workOrder.id}`}
                                                className="text-sm font-medium underline"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}