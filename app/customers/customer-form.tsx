"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
    createCustomer,
    type CustomerFormState,
} from "./actions";

const initialState: CustomerFormState = {};

export default function CustomerForm() {
    const [state, formAction, pending] = useActionState(
        createCustomer,
        initialState
    );

    return (
        <form action={formAction} className="space-y-6">
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
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full text-gray-900 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
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
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full text-gray-900 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
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
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Phone
                </label>

                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full text-gray-900 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
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
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Address
                </label>

                <textarea
                    id="address"
                    name="address"
                    required
                    rows={4}
                    className="w-full text-gray-900 resize-none rounded-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
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
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
                <Link
                    href="/customers"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {pending ? "Creating..." : "Create Customer"}
                </button>
            </div>
        </form>
    );
}