import { requireUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import UserForm from "../user-form";

export default async function NewUserPage() {
    const user = await requireUser();

    if (user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <p className="text-sm text-gray-500">
                        Users / New
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Create User
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Create a FieldFlow user account and assign a role.
                    </p>
                </div>

                <div className="rounded-lg border p-6 shadow-sm">
                    <UserForm />
                </div>
            </div>
        </main>
    );
}