import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import { FiPlus } from "react-icons/fi";
import BackLink from "@/app/components/back-link";
import { MdFilterAlt } from "react-icons/md";

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
        <main className="min-h-screen p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                        Technicians
                    </h1>

                    <p className="mt-1 text-sm text-gray-300">
                        Manage technicians, skills and availability.
                    </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        {user.role === "ADMIN" ? (
                            <BackLink href="/admin" label="Admin" />
                        ) : (user.role === "DISPATCHER" ? (
                            <BackLink href="/dispatcher" label="Dispatcher" />
                        ) : null)}

                        <Link
                            href="/technicians/new"
                            className="inline-flex min-h-10 items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 font-medium transition sm:w-fit"
                        >
                            <FiPlus className="inline-block mr-1 text-lg" /> Add Technician
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <form
                    method="GET"
                    className="mb-6 rounded-lg border border-gray-700 p-4 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="search"
                                className="mb-2 block text-sm font-medium text-white"
                            >
                                Search
                            </label>

                            <input
                                type="search"
                                name="search"
                                id="search"
                                className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                                placeholder="Search by name, email or phone"
                                defaultValue={search}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-medium text-white"
                            >
                                Status
                            </label>

                            <select
                                name="status"
                                id="status"
                                className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                                defaultValue={status}
                            >
                                <option value="" className="bg-gray-900">All</option>
                                <option value="AVAILABLE" className="bg-gray-900">Available</option>
                                <option value="BUSY" className="bg-gray-900">Busy</option>
                                <option value="UNAVAILABLE" className="bg-gray-900">Unavailable</option>
                            </select>
                        </div>

                        {/* Skill */}
                        <div>
                            <label
                                htmlFor="skill"
                                className="mb-2 block text-sm font-medium text-white"
                            >
                                Skill
                            </label>

                            <input 
                                id="skill"
                                name="skill"
                                type="search"
                                defaultValue={skill}
                                placeholder="e.g. AC repair"
                                className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm border border-gray-700 rounded-md font-medium text-white hover:bg-gray-800"
                        >
                           <MdFilterAlt className="inline-block text-lg" /> Apply Filters
                        </button>

                        <Link
                            href="/technicians"
                            className="px-4 py-2 text-sm border border-gray-700 rounded-md text-gray-400 font-medium hover:bg-gray-800 hover:text-white"
                        >
                            Clear
                        </Link>
                    </div>
                </form>

                {/* Results */}
                <section className="overflow-hidden rounded-lg border border-gray-700 shadow-sm">
                    <div className="border-b border-gray-700 px-6 py-4">
                        <p className="text-sm text-gray-400">
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
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-300">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-300">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-300">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-300">
                                            Skills
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-300">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-300">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {technicians.map((technician) => (
                                        <tr key={technician.id}>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {technician.name}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                {technician.email}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                {technician.phone || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                {technician.skills}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold">
                                                {technician.status}
                                            </td>

                                            <td className="px-6 py-4 text-left">
                                                <Link 
                                                    href={`/technicians/${technician.id}`}
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
                </section>
            </div>
        </main>
    );
}