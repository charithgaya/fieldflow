"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
    createWorkOrder,
    type WorkOrderFormState,
} from "./action";

type Customer = {
    id: string;
    name: string;
};

const initialState: WorkOrderFormState = {};

export default function WorkOrderForm({
    customers,
}: {
    customers: Customer[];
}) {
    const [state, formAction, pending] = useActionState(
        createWorkOrder,
        initialState
    );

    return (
        <form action={formAction} className="space-y-6">
            {state.error && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium"
                >
                    Title
                </label>

                <input
                    id="title"
                    name="title"
                    type="text"
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="e.g. AC repair"
                    required
                />

                {state.fieldErrors?.title && (
                    <p className="mt-1 text-sm text-red-600">
                        {state.fieldErrors.title[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    placeholder="Describe the requested work"
                    required
                />

                {state.fieldErrors?.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {state.fieldErrors.description[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="customerId"
                    className="block text-sm font-medium"
                >
                    Customer
                </label>

                <select
                    id="customerId"
                    name="customerId"
                    defaultValue=""
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    required
                >
                    <option value="" disabled>
                        Select a customer
                    </option>

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
                    <p className="mt-1 text-sm text-red-600">
                        {state.fieldErrors.customerId[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="priority"
                    className="block text-sm font-medium"
                >
                    Priority
                </label>

                <select
                    id="priority"
                    name="priority"
                    defaultValue="MEDIUM"
                    className="mt-1 w-full rounded-md border px-3 py-2"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>

                {state.fieldErrors?.priority && (
                    <p className="mt-1 text-sm text-red-600">
                        {state.fieldErrors.priority[0]}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="scheduledDate"
                    className="block text-sm font-medium"
                >
                    Scheduled date and time
                </label>

                <input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="datetime-local"
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    required
                />

                {state.fieldErrors?.scheduledDate && (
                    <p className="mt-1 text-sm text-red-600">
                        {state.fieldErrors.scheduledDate[0]}
                    </p>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                    {pending
                        ? "Creating..."
                        : "Create Work Order"}
                </button>

                <Link
                    href="/work-orders"
                    className="rounded-md border px-4 py-2 text-sm"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}