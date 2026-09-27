import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { FiPlus } from "react-icons/fi";
import BackLink from "@/app/components/back-link";

type CustomerPageProps = {
    searchParams: Promise<{
        search?: string;
    }>;
};
export default async function CustomersPage({
    searchParams,
}: CustomerPageProps) {
    const user = await requireUser();

    //Only Admin & Dispatcher can manage customers.
    if(user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    const params = await searchParams;
    const search = params.search?.trim() ?? "";

    const customers = await prisma.customer.findMany({
        where: search
            ? {
                  OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                    ],
                }
            : undefined,
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Customers
                        </h1>

                        <p className="mt-1 text-sm text-gray-300">
                            Manage customer records & service history.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        {user.role === "ADMIN" ? (
                            <BackLink href="/admin" label="Admin" />
                        ) : (user.role === "DISPATCHER" ?(
                            <BackLink href="/dispatcher" label="Dispatcher" />
                        ) : null)}

                        <Link 
                            href="/customers/new"
                            className="inline-flex items-center justify-center min-h-10 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition sm:w-fit"
                        >
                            <FiPlus className="inline-block mr-1 text-lg" /> New Customer
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <form
                    method="GET"
                    className="mb-6 flex flex-col gap-3 sm:flex-row"
                >
                    <input 
                        type="search"
                        name="search"
                        defaultValue={search}
                        placeholder="Search by name, email, or phone..."
                        className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    />

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm border border-gray-700 rounded-md font-medium text-white hover:bg-gray-800"
                    >
                        Search
                    </button>

                    {search && (
                        <Link 
                            className="px-4 py-2 text-sm border border-gray-700 rounded-md text-center text-gray-400 font-medium hover:bg-gray-800 hover:text-white" 
                            href="/customers"
                        >
                            Clear
                        </Link>
                    )}
                </form>
                
                {/* Results */}
                <div className="overflow-hidden rounded-lg border border-gray-700 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-700">
                        {/* Result count */}
                        <p className="text-sm text-gray-400">
                            {customers.length}{" "}
                            {customers.length === 1 ? "customer" : "customers"} found.
                            {search ? `matching "${search}"` : ""}
                        </p>
                    </div>
                    
                    {customers.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <h2 className="text-lg font-semibold">
                                {search ? "No customers found." : "No customers yet."}
                            </h2>

                            <p className="mt-2 text-gray-400 text-sm">
                                {search
                                    ? `No customers match your search for "${search}".`
                                    : "Create first customer to get started."}
                            </p>
                            
                            {!search && (
                                <Link 
                                    className="mt-4 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm text-white font-medium hover:bg-indigo-700"
                                    href="/customers/new"
                                >
                                    Create Customer
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-175">
                                <thead className="border-b border-gray-800 bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-400">
                                    {customers.map((customer) => (
                                        <tr 
                                            key={customer.id} 
                                            className=""
                                        >
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {customer.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {customer.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {customer.phone}
                                            </td>
                                            <td className="max-w-xs truncate px-6 py-4 text-sm">
                                                {customer.address}
                                            </td>
                                            <td className="px-6 py-4 text-left">
                                                <Link 
                                                    href={`/customers/${customer.id}`}
                                                    className="text-sm font-medium hover:underline"
                                                >
                                                    View
                                                </Link>
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
    )
} 
