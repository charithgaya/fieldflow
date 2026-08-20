import { requireUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function UsersPage() {
    const user = await requireUser();

    if (user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
        }
    });

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Users
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Manage user accounts and their roles in the system.
                        </p>
                    </div>

                    <Link 
                        href="/users/new" 
                        className="rounded-md bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-800"
                    >
                        Add User
                    </Link>
                </div>

                <div className="rounded-lg border overflow-hidden"> 
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-semibold">
                            {users.length} user{users.length !== 1 ? "s" : ""} found
                        </h2>
                    </div>

                    {users.length === 0 ? (
                        <div className="p-6 text-gray-600">
                            No users found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Name
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Email
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Role
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Email Verified
                                        </th>

                                        <th className="px-6 py-3 text-left text-sm font-medium">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr 
                                            key={user.id} 
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-6 py-4">
                                                {user.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>

                                            <td className="px-6 py-4 font-medium">
                                                {user.role}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                {user.emailVerified ? "Yes" : "No"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {user.createdAt.toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}