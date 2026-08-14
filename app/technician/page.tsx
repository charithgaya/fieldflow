import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-utils";


export default async function TechnicianDashboard(){
    const user = await requireUser();

    if (user.role !== "TECHNICIAN") {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold">Technician Dashboard</h1>

            <p className="mt-2 text-gray-600">
                Welcome, {user.name}!.
            </p>

            <p className="mt-4">
                Role: <strong>{user.role}</strong>
            </p>
        </main>
    );
}