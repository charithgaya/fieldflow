"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "./action";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function UserForm() {
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full rounded-md border px-3 py-2 border-gray-700 bg-transparent text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10"
                        placeholder="Minimum 8 characters"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
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