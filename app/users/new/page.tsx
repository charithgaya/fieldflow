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
                    <p className="text-sm text-gray-300">
                        Users / New
                    </p>

                    <h1 className="mt-1 text-3xl font-bold">
                        Create User
                    </h1>

                    <p className="mt-1 text-gray-400">
                        Create a FieldFlow user account and assign a role.
                    </p>
                </div>

                <div className="rounded-lg border border-gray-700 p-6 shadow-sm">
                    <UserForm />
                </div>
            </div>
        </main>
    );
}