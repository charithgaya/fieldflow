import { redirect } from "next/navigation";
import WorkOrderForm from "../work-order-form";
import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export default async function NewWorkOrderPage() {
    const user = await requireUser();

    if(user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/dashboard");
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
        <main className="p-6">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-2xl font-semibold">
                    Create Work Order
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                    Create a new service job for a customer.
                </p>

                {customers.length === 0 ? (
                    <div className="mt-6 rounded-lg border p-6">
                        <h2 className="font-medium">
                            No customers found
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new customer to get started.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6">
                        <WorkOrderForm customers={customers} />
                    </div>
                )}
            </div>
        </main>
    );
}