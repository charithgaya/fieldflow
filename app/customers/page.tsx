import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

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
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Customers
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Manage customer records & service history.
                        </p>
                    </div>

                    <Link 
                        href="/customers/new"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + New Customer
                    </Link>
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
                        className="w-full text-sm text-gray-900 rounded-md bg-white px-4 py-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
                    />

                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Search
                    </button>

                    {search && (
                        <Link 
                            className="rounded-md px-5 py-2 text-sm bg-white font-medium text-gray-700 border border-gray-300 hover:bg-gray-100" 
                            href="/customers"
                        >
                            Clear
                        </Link>
                    )}
                </form>

                {/* Results */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {customers.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {search ? "No customers found." : "No customers yet."}
                            </h2>

                            <p className="mt-2 text-gray-500 text-sm">
                                {search
                                    ? `No customers match your search for "${search}".`
                                    : "Create first customer to get started."}
                            </p>
                            
                            {!search && (
                                <Link 
                                    className="mt-4 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700"
                                    href="/customers/new"
                                >
                                    Create Customer
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {customers.map((customer) => (
                                        <tr 
                                            key={customer.id} 
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {customer.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {customer.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {customer.phone}
                                            </td>
                                            <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600">
                                                {customer.address}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={`/customers/${customer.id}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
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

                {/* Result count */}
                <p className="mt-3 text-sm text-gray-500">
                    {customers.length}{" "}
                    {customers.length === 1 ? "customer" : "customers"} found.
                    {search ? `matching "${search}"` : ""}
                </p>
            </div>
        </main>
    )
} 
