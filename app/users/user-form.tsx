"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "./action";
import Link from "next/link";

export default function UserForm() {
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError("");

        try {
            await createUser(formData);

            router.push("/users");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create user."
            );
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 border border-gray-700 p-6 rounded-md">
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                >
                    Name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="e.g. John Silva"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="e.g. john@fieldflow.test"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                >
                    Password
                </label>

                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    placeholder="Minimum 8 characters"
                />
            </div>

            <div>
                <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium"
                >
                    Role
                </label>

                <select
                    id="role"
                    name="role"
                    defaultValue="TECHNICIAN"
                    className="w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                >
                    <option value="ADMIN" className="bg-gray-900">ADMIN</option>
                    <option value="DISPATCHER" className="bg-gray-900">DISPATCHER</option>
                    <option value="TECHNICIAN" className="bg-gray-900">TECHNICIAN</option>
                </select>
            </div>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href="/users"
                    className="rounded-md text-gray-400 border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                    Create User
                </button>
            </div>
        </form>
    );
}