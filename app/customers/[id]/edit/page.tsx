import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import CustomerForm from "../../customer-form";

type EditCustomerPageProps = {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    const { id } = await params;

    const customer = await prisma.customer.findUnique({
        where: {
            id,
        },
    });

    if (!customer) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="mb-1 text-sm text-gray-500">
                        Customers / Edit
                    </p>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Edit Customer
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Update the customer details below.
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <CustomerForm mode="edit" customer={customer} />
                </div>
            </div>
        </main>
    );
}