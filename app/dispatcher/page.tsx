import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-utils";
import Link from "next/link";


export default async function DispatcherDashboard(){
    const user = await requireUser();

    if (user.role !== "DISPATCHER") {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold">Dispatcher Dashboard</h1>

            <p className="mt-2 text-gray-600">
                Welcome, {user.name}!.
            </p>

            <p className="mt-4">
                Role: <strong>{user.role}</strong>
            </p>

            <Link href="/login">
                <button className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white">
                    Logout
                </button>
            </Link>
        </main>
    );
}