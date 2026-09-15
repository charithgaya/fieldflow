import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-utils";
import CustomerForm from "../customer-form";

export default async function NewCustomerPage() {
    const user = await requireUser();

    // Only Admin and Dispatcher can create customers.
    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        Create Customer
                    </h1>

                    <p className="mt-1 text-sm text-gray-400">
                        Add a new customer to FieldFlow.
                    </p>
                </div>

                <div className="rounded-lg border border-gray-700 p-6 shadow-sm">
                    <CustomerForm />
                </div>
            </div>
        </main>
    );
}