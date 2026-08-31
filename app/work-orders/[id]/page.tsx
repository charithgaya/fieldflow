import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AssignTechnicianForm from "../assign-technician-form";
import { requireUser } from "@/lib/auth-utils";
import StartWorkButton from "../start-work-button";

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
    
    return (
        <main className="p-6">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {workOrder.title}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Work Order Details
                        </p>
                    </div>

                    <Link
                        href={
                            user.role === "TECHNICIAN" 
                                ? "/my-jobs" 
                                : "/work-orders"
                        }
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                            {user.role === "TECHNICIAN" 
                                ? "Back to My Jobs" 
                                : "Back to Work Orders"
                            }
                    </Link>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <section className="rounded-lg border p-5">
                        <h2 className="font-semibold">
                            Job Information
                        </h2>

                        <div className="mt-4 space-y-3 text-sm">
                            <div>
                                <p className="font-medium">
                                    Description
                                </p>

                                <p className="text-gray-600">
                                    {workOrder.description}
                                </p>
                            </div>

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
                                    Status
                                </p>

                                <p className="text-gray-600">
                                    {workOrder.status}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">
                                    Scheduled Date
                                </p>

                                <p className="text-gray-600">
                                    {workOrder.scheduledDate.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">
                                    Technician
                                </p>

                                <p className="text-gray-600">
                                    {workOrder.technician 
                                        ? workOrder.technician.name 
                                        : "Not assigned"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {user.role === "ADMIN" || user.role === "DISPATCHER" ? (
                        <section className="rounded-lg border p-5">
                            <h2 className="font-semibold">
                                Assign Technician
                            </h2>

                            <AssignTechnicianForm
                                workOrderId={workOrder.id}
                                currentTechnicianId={workOrder.technicianId}
                                technicians={technicians}
                            />
                        </section>
                    ) : (
                        <section className="rounded-lg border p-5">
                            <h2 className="font-semibold">
                                Technician
                            </h2>

                            <p className="mt-4 text-sm text-gray-600">
                                {workOrder.technician 
                                    ? workOrder.technician.name 
                                    : "Not assigned"}
                            </p>

                            {workOrder.status === "ASSIGNED" && (
                                <StartWorkButton
                                    workOrderId={workOrder.id}
                                />
                            )}
                        </section>
                    )} 
                </div>

                <section className="mt-6 rounded-lg border p-5">
                    <h2 className="font-semibold">
                        Activity History
                    </h2>

                    {workOrder.activities.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-600">
                            No activities recorded for this work order.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {workOrder.activities.map((activity) => (
                                <div 
                                    key={activity.id} 
                                    className="border-b pb-3 last:border-0"
                                >
                                    <p className="text-sm font-medium">
                                        {activity.action}
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {activity.note}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        By {activity.user.name} on {activity.createdAt.toLocaleString()}

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