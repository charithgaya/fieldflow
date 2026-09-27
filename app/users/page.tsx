import { requireUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BackLink from "@/app/components/back-link";
import { FiPlus } from "react-icons/fi";
import { formatSriLankaDateTime } from "@/lib/date-utils";

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
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Users
                        </h1>

                        <p className="mt-1 text-sm text-gray-300">
                            Manage user accounts and their roles in the system.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <BackLink href="/admin" label="Admin" />

                        <Link 
                            href="/users/new" 
                            className="inline-flex w-full items-center min-h-10 justify-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition font-medium sm:w-fit"
                        >
                            <FiPlus className="inline-block mr-1 text-lg" />Add User
                        </Link>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-700 overflow-hidden"> 
                    <div className="px-6 py-4 border-b border-gray-700">
                        <p className="text-sm text-gray-400">
                            {users.length} user{users.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    {users.length === 0 ? (
                        <div className="p-6 text-gray-600">
                            No users found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-175">
                                <thead className="border-b border-gray-800 bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Name
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Email
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Role
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Email Verified
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Created At
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-400">
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

                                            <td className="px-6 py-4 text-left">
                                                {user.emailVerified ? "Yes" : "No"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatSriLankaDateTime(user.createdAt)}
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