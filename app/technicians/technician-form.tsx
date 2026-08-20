"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
    createTechnician,
    updateTechnician,
    type TechnicianFormState,
} from "./actions";

type TechnicianUser = {
    id: string;
    name: string;
    email: string;
    
};

type TechnicianFormProps = {
    users: TechnicianUser[];
    mode: "create" | "edit";
    technician?: {
        id: string;
        userId: string;
        name: string;
        email: string;
        phone: string | null;
        skills: string;
        status: "AVAILABLE" | "BUSY" | "UNAVAILABLE";
    };
};

const initialState: TechnicianFormState = {};

export default function TechnicianForm({ 
    users,
    mode = "create",
    technician,

 }: TechnicianFormProps) {

    const action = mode === "edit" ? updateTechnician : createTechnician;

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
                    value={technician?.id ?? ""}
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

            {/* User account */}
            <div>
                <label 
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    User Account
                </label>

                <select
                    id="userId"
                    name="userId"
                    required
                    defaultValue={technician?.userId ?? ""}
                    className="w-full text-gray-500 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">
                        Select a technician user
                    </option>

                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>

                {state.fieldErrors?.userId?.map((error: string) => (
                    <p key={error} className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            {/* Name */}
            <div>
                <label
                    htmlFor="name" 
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Name
                </label>

                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    defaultValue={technician?.name ?? ""}
                    placeholder="Technician name"
                    className="w-full text-gray-500 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {state.fieldErrors?.name?.map((error: string) => (
                    <p key={error} className="mt-2 text-sm text-red-600">
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
                    type="email"
                    id="email"
                    name="email"
                    required
                    defaultValue={technician?.email ?? ""}
                    placeholder="technician@example.com"
                    className="w-full text-gray-500 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {state.fieldErrors?.email?.map((error: string) => (
                    <p key={error} className="mt-2 text-sm text-red-600">
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
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    defaultValue={technician?.phone ?? ""}
                    placeholder="Phone Number"
                    className="w-full text-gray-700 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                {state.fieldErrors?.phone?.map((error: string) => (
                    <p key={error} className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                ))}
            </div>

            {/* Skills */}
            <div>
                <label
                    htmlFor="skills" 
                    className="mb-2 block text-sm font-medium text-gray-900"
                >
                    Skills
                </label>

                <input
                    type="text"
                    id="skills"
                    name="skills"
                    required
                    defaultValue={technician?.skills ?? ""}
                    placeholder="e.g. HVAC, Electrical, AC repair, etc."
                    className="w-full text-gray-700 rounded-md border border-gray-300 bg-white py-2 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />

                <p className="mt-1 text-xs text-gray-500">
                    Separate multiple skills with a commas.
                </p>

                {state.fieldErrors?.skills?.map((error: string) => (
                    <p key={error} className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                ))}
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
                    id="status"
                    name="status"
                    defaultValue={technician?.status ?? "AVAILABLE"}
                    required
                    className="w-full text-gray-700 rounded-md border border-gray-300 bg-white py-2 px-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="AVAILABLE">Available</option>
                    <option value="BUSY">Busy</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
                <Link
                    href={
                        isEdit && technician
                            ? `/technicians/${technician.id}`
                            : "/technicians"
                    }
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {
                        pending
                            ? isEdit 
                                ? "Saving..."
                                : "Creating..."
                            : isEdit 
                                ? "Save Changes" 
                                : "Create Technician"
                    }
                </button>
            </div>
        </form>
    );
}