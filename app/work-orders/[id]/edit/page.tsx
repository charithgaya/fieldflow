import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import EditWorkOrderForm from "../../edit-form";
import BackLink from "@/app/components/back-link";

export default async function EditWorkOrderPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await requireUser();

    // Only Admin and Dispatcher can edit work orders
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/dashboard");
    }

    const { id } = await params;

    const workOrder = await prisma.workOrder.findUnique({
        where: {
            id,
        },
    });

    if (!workOrder) {
        notFound();
    }

    const customers = await prisma.customer.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-3xl">

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Edit Work Order
                        </h1>

                        <p className="mt-1 text-sm text-gray-400">
                            Update the work order information.
                        </p>
                    </div>

                    <BackLink
                        href={`/work-orders/${workOrder.id}`}
                        label="Work Order"
                    />
                </div>

                <section className="rounded-lg border border-gray-700 p-5">
                    <EditWorkOrderForm
                        workOrder={workOrder}
                        customers={customers}
                    />
                </section>
            </div>
        </main>
    );
}