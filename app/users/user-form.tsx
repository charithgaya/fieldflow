"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "./action";

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
        <form action={handleSubmit} className="space-y-5">
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
                    className="w-full rounded-md border px-3 py-2"
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
                    className="w-full rounded-md border px-3 py-2"
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
                    className="w-full rounded-md border px-3 py-2"
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
                    className="w-full rounded-md border px-3 py-2"
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="DISPATCHER">DISPATCHER</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                </select>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-800"
                >
                    Create User
                </button>

                <a
                    href="/users"
                    className="rounded-md bg-gray-200 px-5 py-2 text-gray-800 hover:bg-gray-300"
                >
                    Cancel
                </a>
            </div>
        </form>
    );
}