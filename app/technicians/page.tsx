import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

type TechnicianPageProps = {
    searchParams: Promise<{
        search?: string;
        status?: string;
        skill?: string;
    }>;
};

export default async function TechnicianPage({ searchParams }: TechnicianPageProps) {
    const user = await requireUser();

    if(user.role !== "ADMIN" && user.role !== "DISPATCHER"){
        redirect("/technician");
    }

    const params = await searchParams;
    const search = params.search?.trim() ?? "";
    const status = params.status?.trim() ?? "";
    const skill = params.skill?.trim() ?? "";

    const technicians = await prisma.technician.findMany({
        where: {
            AND: [
                search
                    ?   {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                                { phone: { contains: search, mode: "insensitive" } },
                            ],
                        }
                    : {},
                status
                    ?   {
                            status: status as "AVAILABLE" | "BUSY" | "UNAVAILABLE",
                        }
                    : {},
                skill
                    ?   {
                            skills: {
                                contains: skill,
                                mode: "insensitive",
                            },
                        }
                    : {},
            ],
        },
        orderBy: {
            createdAt: "asc",
        }
    });

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                        Technicians
                    </h1>

                    <p className="mt-1 text-sm text-gray-600">
                        Manage technicians, skills and availability.
                    </p>
                    </div>

                    <Link
                    href="/technicians/new"
                    className="font-medium rounded-md bg-black px-5 py-2.5 text-sm text-center text-white hover:bg-gray-800"
                    >
                    Add Technician
                </Link>
                </div>

                {/* Filters */}
                <form
                    method="GET"
                    className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="search"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Search
                            </label>

                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none text-gray-900 focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="Search by name, email or phone"
                                defaultValue={search}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Status
                            </label>

                            <select
                                name="status"
                                id="status"
                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none text-gray-900 focus:border-black focus:ring-1 focus:ring-black"
                                defaultValue={status}
                            >
                                <option value="">All</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="BUSY">Busy</option>
                                <option value="UNAVAILABLE">Unavailable</option>
                            </select>
                        </div>

                        {/* Skill */}
                        <div>
                            <label
                                htmlFor="skill"
                                className="mb-2 block text-sm font-medium text-gray-900"
                            >
                                Skill
                            </label>

                            <input 
                                id="skill"
                                name="skill"
                                type="search"
                                defaultValue={skill}
                                placeholder="e.g. AC repair"
                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none text-gray-900 focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="submit"
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Apply Filters
                        </button>

                        <Link
                            href="/technicians"
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
                        >
                            Clear
                        </Link>
                    </div>
                </form>

                {/* Results */}
                <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <p className="text-sm text-gray-600">
                            {technicians.length} technician
                            {technicians.length === 1 ? "" : "s"} found
                        </p>
                    </div>

                    {technicians.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                No technicians found
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Skills
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {technicians.map((technician) => (
                                        <tr key={technician.id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {technician.name}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {technician.email}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {technician.phone || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {technician.skills}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                                                {technician.status}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={`/technicians/${technician.id}`}
                                                    className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
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
                </section>
            </div>
        </main>
    );
}