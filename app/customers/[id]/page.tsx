import Link from "next/link";
import { notFound, redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-utils";
import BackLink from "@/app/components/back-link";
import { FaUserEdit } from "react-icons/fa";
import { formatSriLankaDateTime } from "@/lib/date-utils";

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
        <main className='min-h-screen p-6'>
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='mb-1 text-sm text-gray-300'>
                            Customers / Details
                        </p>

                        <h1 className='text-2xl font-bold text-white'>
                            {customer.name}
                        </h1>
                    </div>

                    <div className='flex gap-3'>
                        <BackLink href="/customers" label="Customers" />

                        <Link 
                            href={`/customers/${customer.id}/edit`}
                            className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'
                        >
                            <FaUserEdit className="inline-block mr-1 text-lg" />Edit Customer
                        </Link>
                    </div> 
                </div>

                {/* Customer Information */}
                <section className='mb-6 rounded-lg border border-gray-700 p-6 shadow-sm'>
                    <h2 className='mb-5 text-lg font-semibold text-gray-300'>
                        Customer Information
                    </h2>

                    <div className='grid gap-5 sm:grid-cols-2'>
                        <div>
                            <p className='text-sm font-medium text-gray-400'>
                                Name
                            </p>
                            <p className='mt-1 text-sm text-white'>
                                {customer.name}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-medium text-gray-400'>
                                Email
                            </p>
                            <p className='mt-1 text-sm text-white'>
                                {customer.email}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-medium text-gray-400'>
                                Phone
                            </p>
                            <p className='mt-1 text-sm text-white'>
                                {customer.phone}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-medium text-gray-400'>
                                Created
                            </p>
                            <p className='mt-1 text-sm text-white'>
                                {formatSriLankaDateTime(customer.createdAt)}
                            </p>
                        </div>

                        <div className='sm:col-span-2'>
                            <p className='text-sm font-medium text-gray-400'>
                                Address
                            </p>
                            <p className='mt-1 text-sm text-white'>
                                {customer.address}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related Work Orders */}
                <section className='rounded-lg border border-gray-700 shadow-sm'>
                    <div className='border-b border-gray-700 py-4 px-6'>
                        <h2 className='text-lg font-semibold text-gray-300'>
                            Related Work Orders
                        </h2>

                        <p className='mt-1 text-sm text-gray-400'>
                            Work orders associated with this customer.
                        </p>
                    </div>

                    {customer.workOrders.length === 0 ? (
                        <div className='px-6 py-10 text-center'>
                            <p className='text-sm font-medium text-white'>
                                No work orders yet
                            </p>

                            <p className='mt-1 text-sm text-gray-400'>
                                work orders for this customer will appear here.
                            </p>
                        </div>
                    ) :(
                        <div className='overflow-x-auto'>
                            <table className='w-full min-w-175'>
                                <thead className='border-b border-gray-800 bg-gray-900/50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'>
                                            Title
                                        </th>

                                        <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'>
                                            Status
                                        </th>

                                        <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'>
                                            Priority
                                        </th>

                                        <th className='px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'>
                                            Scheduled
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-gray-400'>
                                {customer.workOrders.map((workOrder) => (
                                    <tr key={workOrder.id}>
                                        <td className='px-6 py-4 text-sm font-medium'>
                                            {workOrder.title}
                                        </td>

                                        <td className='px-6 py-4 text-sm'>
                                            {workOrder.status}
                                        </td>

                                        <td className='px-6 py-4 text-sm'>
                                            {workOrder.priority}
                                        </td>

                                        <td className='px-6 py-4 text-sm'>
                                            {formatSriLankaDateTime(workOrder.scheduledDate)}
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
 
  



