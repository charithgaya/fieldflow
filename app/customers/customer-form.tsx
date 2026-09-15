"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
    createCustomer,
    updateCustomer,
    type CustomerFormState,
} from "./actions";

type CustomerFormProps = {
    mode?: "create" | "edit";
    customer?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
}

const initialState: CustomerFormState = {};

export default function CustomerForm({
    mode = "create",
    customer,
}: CustomerFormProps) {
    const action = mode === "edit" ? updateCustomer : createCustomer;

    const [state, formAction, pending] = useActionState(
        action,
        initialState
    );

    const isEdit = mode === "edit";

    return (
        <form action={formAction} className="space-y-6">
            {isEdit && (
                <input
                    type="hidden"
                    name="id"
                    value={customer?.id ?? ""}
                />
            )}

            {state.error && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {state.error}
                </div>
            )}

            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-400"
                >
                    Name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={customer?.name ?? ""}
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="Enter customer name"
                />

                {state.fieldErrors?.name?.map((error) => (
                    <p
                        key={error}
                        className="mt-1 text-sm text-red-600"
                    >
                        {error}
                    </p>
                ))}
            </div>

            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-400"
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={customer?.email ?? ""}
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="customer@example.com"
                />

                {state.fieldErrors?.email?.map((error) => (
                    <p
                        key={error}
                        className="mt-1 text-sm text-red-600"
                    >
                        {error}
                    </p>
                ))}
            </div>

            {/* Phone */}
            <div>
                <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-400"
                >
                    Phone
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    defaultValue={customer?.phone ?? ""}
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="Enter phone number"
                />

                {state.fieldErrors?.phone?.map((error) => (
                    <p
                        key={error}
                        className="mt-1 text-sm text-red-600"
                    >
                        {error}
                    </p>
                ))}
            </div>

            {/* Address */}
            <div>
                <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-gray-400"
                >
                    Address
                </label>

                <textarea
                    id="address"
                    name="address"
                    required
                    rows={4}
                    defaultValue={customer?.address ?? ""}
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white resize-none outline-none focus:border-indigo-500"
                    placeholder="Enter customer address"
                />

                {state.fieldErrors?.address?.map((error) => (
                    <p
                        key={error}
                        className="mt-1 text-sm text-red-600"
                    >
                        {error}
                    </p>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-5">
                <Link
                    href={
                        isEdit && customer
                            ? `/customers/${customer?.id}`
                            : "/customers"
                    }
                    className="rounded-md text-gray-400 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                    {
                        pending 
                            ? isEdit
                                ? "Saving..."
                                : "Creating..."
                            : isEdit 
                                ? "Save Changes" 
                                : "Create Customer"
                    }
                </button>
            </div>
        </form>
    );
}