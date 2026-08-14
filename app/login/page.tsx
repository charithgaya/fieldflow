"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const { error } = await authClient.signIn.email({ 
            email, password
        });

        setLoading(false);

        if (error) {
            setError(error.message || "Invalid email or password");
            return;
        }

        router.push("/dashboard");
    }

    return(
        <main className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md rounded-lg border p-6 shadow-md">
                <h1 className="mb-4 text-2xl font-bold">
                    FieldFlow
                </h1>

                <p className="mb-6 text-gray-600 text-sm">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            className="mb-1 block text-sm font-medium"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label 
                            className="mb-1 block text-sm font-medium"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-green-500 py-2 px-4 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </main>
    )
    
}