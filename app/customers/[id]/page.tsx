import React from 'react';
import Link from "next/link";
import { notFound, redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";

type CustomerDetailsPageProps = {
    params: Promise<{ 
        id: string 
    }>;
}

export default async function CustomerDetailsPage({
    params,
}: CustomerDetailsPageProps) {
    const user = await requireUser();

    if (user.role !== "ADMIN" && user.role !== "DISPATCHER") {
        redirect("/technician");
    }

    const { id } = await params;

    const customer = await prisma.customer.findUnique({
         where: {
            id, 
        },
        include: {
            workOrders: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        }
    });

    if (!customer) {
        notFound();
    }

    return (
        <main className='min-h-screen bg-gray-50 p-6'>
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='mb-1 text-sm text-gray-500'>
                            Customers / Details
                        </p>

                        <h1 className='text-2xl font-bold text-gray-900'>
                            {customer.name}
                        </h1>
                    </div>

                    <div className='flex gap-3'>
                        <Link 
                            href="/customers"
                            className='rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                        >
                            Back
                        </Link>

                        <Link 
                            href={`/customers/${customer.id}/edit`}
                            className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'
                        >
                            Edit
                        </Link>
                    </div> 
                </div>

                {/* Customer Information */}
                <section className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                    <h2 className='mb-5 text-lg font-semibold text-gray-900'>
                        Customer Information
                    </h2>

                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div>
                            <p className='text-sm font-medium text-gray-500'>
                                Name
                            </p>
                            <p className='mt-1 text-sm text-gray-900'>
                                {customer.name}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-medium text-gray-500'>
                                Email
                            </p>
                            <p className='mt-1 text-sm text-gray-900'>
                                {customer.email}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-medium text-gray-500'>
                                Phone
                            </p>
                            <p className='mt-1 text-sm text-gray-900'>
                                {customer.phone}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-medium text-gray-500'>
                                Created
                            </p>
                            <p className='mt-1 text-sm text-gray-900'>
                                {customer.createdAt.toLocaleDateString()}
                            </p>
                        </div>

                        <div className='sm:col-span-2'>
                            <p className='text-sm font-medium text-gray-500'>
                                Address
                            </p>
                            <p className='mt-1 text-sm text-gray-900'>
                                {customer.address}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Work Orders */}
                <section className='rounded-lg border border-gray-200 bg-white shadow-sm'>
                    <div className='border-b border-gray-200 py-4 px-6'>
                        <h2 className='text-lg font-semibold text-gray-900'>
                            Related Work Orders
                        </h2>

                        <p className='mt-1 text-sm text-gray-500'>
                            Work orders associated with this customer.
                        </p>
                    </div>

                    {customer.workOrders.length === 0 ? (
                        <div className='px-6 py-10 text-center'>
                            <p className='text-sm font-medium text-gray-900'>
                                No work orders yet
                            </p>

                            <p className='mt-1 text-sm text-gray-500'>
                                work orders for this customer will appear here.
                            </p>
                        </div>
                    ) :(
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='border-b border-gray-200 bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                            Title
                                        </th>

                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                            Status
                                        </th>

                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                            Priority
                                        </th>

                                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'>
                                            Scheduled
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-gray-200'>
                                {customer.workOrders.map((workOrder) => (
                                    <tr key={workOrder.id}>
                                        <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                                            {workOrder.title}
                                        </td>

                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {workOrder.status}
                                        </td>

                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {workOrder.priority}
                                        </td>

                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {workOrder.scheduledDate.toLocaleDateString()}
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
  )

}
 
  



