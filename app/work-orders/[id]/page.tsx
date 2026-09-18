import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AssignTechnicianForm from "../assign-technician-form";
import { requireUser } from "@/lib/auth-utils";
import StartWorkButton from "../start-work-button";
import ProgressNoteForm from "../progress-note-form";
import CompleteJobForm from "../complete-job-form";
import StatusBadge from "@/app/components/status-badge";
import BackLink from "@/app/components/back-link";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPriority(priority: string) {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
}

function formatActivityAction(action: string) {
    return action
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function WorkOrderDetailsPage(
    { params }: { params: Promise<{ id: string }> }
){
    const user = await requireUser();

    const { id } = await params;

    const workOrder = await prisma.workOrder.findUnique({
        where: { 
            id, 
        },
        include: {
            customer: true,
            technician: true,
            activities: { 
                include: { 
                    user: true, 
                }, 
                orderBy: {
                    createdAt: "desc", 
                },
            },
        },
    });
    
    if (!workOrder) {
        notFound();
    }

    // Technicians can only access their assigned work orders
    if(user.role === "TECHNICIAN") {
        const technician = await prisma.technician.findUnique({
            where: { userId: user.id },
        });
        
        if (!technician || workOrder.technicianId !== technician.id) {
            redirect("/my-jobs");
        }
    }

    // Only Admin & Dispatcher can access the assignment data/form
    const technicians = user.role === "ADMIN" || user.role === "DISPATCHER"
        ? await prisma.technician.findMany({
            orderBy: { name: "asc" },
        })
        : [];

    const isTerminalStatus = 
        workOrder.status === "COMPLETED" ||
        workOrder.status === "CANCELLED";
    
    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-5xl">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {workOrder.title}
                        </h1>

                        <p className="mt-1 text-sm text-gray-400">
                            Work Order Details
                        </p>
                    </div>

                    <BackLink 
                        href={
                            user.role === "TECHNICIAN" 
                                ? "/my-jobs" 
                                : "/work-orders"
                        } 
                        label={
                            user.role === "TECHNICIAN" 
                                ? "My Jobs" 
                                : "Work Orders"
                            }
                    />
                    
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <section className="rounded-lg border border-gray-700 p-5">
                        <h2 className="font-semibold">
                            Job Information
                        </h2>

                        <div className="mt-4 space-y-4 text-sm">
                            <div>
                                <p className="font-medium">
                                    Description
                                </p>

                                <p className="mt-1 text-gray-400">
                                    {workOrder.description}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">
                                    Customer
                                </p>

                                <p className="mt-1 text-gray-400">
                                    {workOrder.customer.name}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">
                                    Priority
                                </p>

                                <p className="mt-1 text-gray-400">
                                    {formatPriority(workOrder.priority)}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">
                                    Status
                                </p>

                                <StatusBadge status={workOrder.status} />
                            </div>

                            <div>
                                <p className="font-medium">
                                    Scheduled Date
                                </p>

                                <p className="mt-1 text-gray-400">
                                    {formatDate(workOrder.scheduledDate)}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">
                                    Technician
                                </p>

                                <p className="mt-1 text-gray-400">
                                    {workOrder.technician 
                                        ? workOrder.technician.name 
                                        : "Not assigned"}
                                </p>
                            </div>

                            {workOrder.completionNotes && (
                                <div>
                                    <p className="font-medium">
                                        Completion Notes
                                    </p>

                                    <p className="mt-1 text-gray-400">
                                        {workOrder.completionNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {user.role === "ADMIN" || user.role === "DISPATCHER" ? (
                        <section className="rounded-lg border border-gray-700 p-5">
                           {isTerminalStatus ? (
                                <>
                                    <h2 className="font-semibold">
                                        Work Order Status
                                    </h2>

                                    <div className="mt-4 rounded-md border border-gray-700 p-4">
                                        <p className="text-sm text-gray-300">
                                            This work order is{" "}
                                            <span className="font-medium">
                                                {formatStatus(workOrder.status)}
                                            </span>
                                            .
                                        </p>

                                        <p className="mt-2 text-sm text-gray-400">
                                            Technician assignment is no longer available for this work order.
                                        </p>
                                    </div>
                                </>
                           ): (
                                <>
                                    <h2 className="font-semibold">
                                        Assign Technician
                                    </h2>
                                    
                                    <AssignTechnicianForm
                                        workOrderId={workOrder.id}
                                        currentTechnicianId={workOrder.technicianId}
                                        technicians={technicians}
                                    />
                                </>
                           )}
                        </section>
                    ) : (
                        <section className="rounded-lg border border-gray-700 p-5">
                            <h2 className="font-semibold">
                                Technician
                            </h2>

                            <p className="mt-4 text-sm text-gray-400">
                                {workOrder.technician 
                                    ? workOrder.technician.name 
                                    : "Not assigned"}
                            </p>

                            {workOrder.status === "ASSIGNED" && (
                                <StartWorkButton
                                    workOrderId={workOrder.id}
                                />
                            )}

                            {workOrder.status === "IN_PROGRESS" && (
                                <ProgressNoteForm 
                                    workOrderId={workOrder.id}
                                />
                            )}

                            {workOrder.status === "IN_PROGRESS" && (
                                <CompleteJobForm 
                                    workOrderId={workOrder.id}
                                />
                            )}

                            {workOrder.status === "COMPLETED" && (
                                <div className="mt-4 rounded-md border border-gray-700 p-4">
                                    <p className="text-sm font-medium">
                                        Job completed
                                    </p>
                                    <p className="mt-1 text-sm text-gray-400">
                                        This work order has already been completed.
                                    </p>
                                </div>
                            )}
                        </section>
                    )} 
                </div>

                <section className="mt-6 rounded-lg border border-gray-700 p-5">
                    <h2 className="font-semibold">
                        Activity History
                    </h2>

                    {workOrder.activities.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-400">
                            No activities recorded for this work order.
                        </p>
                    ) : (
                        <div className="mt-5 space-y-4">
                            {workOrder.activities.map((activity) => (
                                <div 
                                    key={activity.id} 
                                    className="border-b border-gray-700 pb-4 last:border-0"
                                >
                                    <p className="text-sm font-medium">
                                        {formatActivityAction(activity.action)}
                                    </p>

                                   {activity.note && (
                                        <p className="mt-1 text-sm text-gray-400">
                                            {activity.note}
                                        </p>
                                    )}

                                    <p className="mt-1 text-xs text-gray-500">
                                        By {activity.user.name} on{"  "}
                                        {formatDate(activity.createdAt)}

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