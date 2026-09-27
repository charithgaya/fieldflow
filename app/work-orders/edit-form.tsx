"use client";

import { useActionState } from "react";
import { updateWorkOrder, type WorkOrderFormState } from "./action";

type Customer = {
    id: string;
    name: string;
};

type EditWorkOrderFormProps = {
    workOrder: {
        id: string;
        title: string;
        description: string;
        customerId: string;
        scheduledDate: Date;
        priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    };
    customers: Customer[];
};

const initialState: WorkOrderFormState = {};

function formatDateTimeLocal(date: Date) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date);

    const values = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export default function EditWorkOrderForm({
    workOrder,
    customers,
}: EditWorkOrderFormProps) {

    const [state, formAction, isPending] = useActionState(
        updateWorkOrder,
        initialState
    );

    return (
        <form action={formAction} className="space-y-5">

            <input
                type="hidden"
                name="workOrderId"
                value={workOrder.id}
            />

            <div>
                <label
                    htmlFor="title"
                    className="mb-1 block text-sm font-medium"
                >
                    Title
                </label>

                <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={workOrder.title}
                    className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />

                {state.fieldErrors?.title && (
                    <p className="mt-1 text-sm text-red-400">
                        {state.fieldErrors.title[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-medium"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={workOrder.description}
                    className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />

                {state.fieldErrors?.description && (
                    <p className="mt-1 text-sm text-red-400">
                        {state.fieldErrors.description[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="customerId"
                    className="mb-1 block text-sm font-medium"
                >
                    Customer
                </label>

                <select
                    id="customerId"
                    name="customerId"
                    defaultValue={workOrder.customerId}
                    className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                >
                    <option value="">Select customer</option>

                    {customers.map((customer) => (
                        <option
                            key={customer.id}
                            value={customer.id}
                        >
                            {customer.name}
                        </option>
                    ))}
                </select>

                {state.fieldErrors?.customerId && (
                    <p className="mt-1 text-sm text-red-400">
                        {state.fieldErrors.customerId[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="priority"
                    className="mb-1 block text-sm font-medium"
                >
                    Priority
                </label>

                <select
                    id="priority"
                    name="priority"
                    defaultValue={workOrder.priority}
                    className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>

                {state.fieldErrors?.priority && (
                    <p className="mt-1 text-sm text-red-400">
                        {state.fieldErrors.priority[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="scheduledDate"
                    className="mb-1 block text-sm font-medium"
                >
                    Scheduled Date
                </label>

                <input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="datetime-local"
                    defaultValue={formatDateTimeLocal(
                        workOrder.scheduledDate
                    )}
                    className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                />

                {state.fieldErrors?.scheduledDate && (
                    <p className="mt-1 text-sm text-red-400">
                        {state.fieldErrors.scheduledDate[0]}
                    </p>
                )}
            </div>

            {state.error && (
                <p className="text-sm text-red-400">
                    {state.error}
                </p>
            )}

            <div className="flex flex-col gap-3 sm:justify-end sm:flex-row">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}