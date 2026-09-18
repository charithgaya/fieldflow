import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import StatusBadge from "../components/status-badge";
import PageHeader from "../components/page-header";
import { MdFilterAlt } from "react-icons/md";
import BackLink from "../components/back-link";

type SearchParams = Promise<{
    status?: string;
    priority?: string;
    technicianId?: string;
}>;

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function formatPriority(priority: string) {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
}


export default async function WorkOrdersPage({ 
    searchParams
}: { 
    searchParams: SearchParams;
}) {
    const user = await requireUser();

    // Server-side authorization
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        return (
            <main className="min-h-screen p-6">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-2xl font-bold">
                        Access Denied
                    </h1>
                    <p className="mt-2 text-gray-400">
                        You do not have permission to view work orders.
                    </p>
                </div>
            </main>
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
    <main className="min-h-screen p-6">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <PageHeader
                    title="Work Orders"
                    description="Create, assign & track service jobs."
                />

                <div className="flex gap-3">
                    {user.role === "ADMIN" ? (
                        <BackLink href="/admin" label="Admin" />
                    ) : (user.role === "DISPATCHER" ? (
                        <BackLink href="/dispatcher" label="Dispatcher" />
                    ) : null)}

                    <Link
                        href="/work-orders/new"
                        className="w-fit px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 font-medium"
                    >
                        Create Work Order
                    </Link>        
                </div>
            </div>

            {/* Filters */}
            <section className="mt-8">
                <p className="mb-3 font-medium text-sm text-gray-300">
                    Filters
                </p>

                <form
                    method="GET"
                    className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                >
                    <select
                        name="status"
                        defaultValue={status ?? ""}
                        className="px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    >
                        <option value="" className="bg-gray-900">All Status</option>
                        <option value="OPEN" className="bg-gray-900">Open</option>
                        <option value="ASSIGNED" className="bg-gray-900">Assigned</option>
                        <option value="IN_PROGRESS" className="bg-gray-900">In Progress</option>
                        <option value="COMPLETED" className="bg-gray-900">Completed</option>
                        <option value="CANCELLED" className="bg-gray-900">Cancelled</option>
                    </select>

                    <select
                        name="priority"
                        defaultValue={priority ?? ""}
                        className="px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    >
                        <option value="" className="bg-gray-900">All Priorities</option>
                        <option value="LOW" className="bg-gray-900">Low</option>
                        <option value="MEDIUM" className="bg-gray-900">Medium</option>
                        <option value="HIGH" className="bg-gray-900">High</option>
                        <option value="URGENT" className="bg-gray-900">Urgent</option>
                    </select>

                    <select
                        name="technicianId"
                        defaultValue={technicianId ?? ""}
                        className="px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    >
                        <option value="" className="bg-gray-900">All Technicians</option>
                    
                        {technicians.map((technician) => (
                            <option 
                                key={technician.id} 
                                value={technician.id}
                                className="bg-gray-900"
                            >
                                {technician.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm border border-gray-700 rounded-md font-medium text-white hover:bg-gray-800"
                        >
                           <MdFilterAlt className="inline-block text-lg" /> Apply Filters
                        </button>

                        <Link
                            href="/work-orders"
                            className="px-4 py-2 text-sm border border-gray-700 rounded-md text-gray-400 font-medium hover:bg-gray-800 hover:text-white"
                        >
                            Clear
                        </Link>
                    </div>    
                </form>
            </section>

            {/* Work Orders */}
            <section className="mt-8">
                {workOrders.length === 0 ? (
                    <div className="rounded-lg border border-gray-700 p-10 text-center">
                        <h2 className="text-lg font-semibold">
                            No work orders found
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            There are no work orders matching the selected filters.
                        </p>

                        <Link
                            href="/work-orders"
                            className="mt-5 inline-block text-sm font-medium underline"
                        >
                            Clear filters
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-700">
                        <div className="divide-y divide-gray-700">
                            {workOrders.map((workOrder) => (
                                <div
                                    key={workOrder.id}
                                    className="p-4 transition hover:bg-gray-900/60 sm:p-5"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <Link 
                                                href={`/work-orders/${workOrder.id}`} 
                                                className="text-base font-semibold hover:underline"
                                            >
                                                {workOrder.title}
                                            </Link>

                                            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-5 text-sm text-gray-400">
                                                <span>
                                                    Customer: {" "}    
                                                    <span className="text-gray-300">
                                                        {workOrder.customer.name}
                                                    </span>
                                                </span>

                                                <span>
                                                    Technician: {" "}
                                                    <span className="text-gray-300">
                                                        {workOrder.technician
                                                            ? workOrder.technician.name
                                                            : "Not assigned"
                                                        }
                                                    </span>
                                                </span>

                                                <span>
                                                    Scheduled: {" "}
                                                    <span className="text-gray-300">
                                                        {formatDate(workOrder.scheduledDate)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status, Priority, and actions */}
                                        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                                            <span className="rounded-full border border-gray-600 px-3 py-1 text-xs font-medium">
                                                {formatPriority(workOrder.priority)}
                                            </span>
                                            
                                            <StatusBadge status={workOrder.status} />

                                            <Link
                                                href={`/work-orders/${workOrder.id}`}
                                                className="ml-1 text-sm font-medium underline hover:no-underline"
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
            </section>
        </div>
    </main>
    );
}