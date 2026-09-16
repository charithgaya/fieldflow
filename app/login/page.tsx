"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            <div className="w-full max-w-md rounded-lg border border-indigo-400 p-6 shadow-md">
                <h1 className="mb-4 text-2xl font-bold text-center">
                    FieldFlow
                </h1>

                <p className="mb-6 text-gray-400 text-sm text-center">
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            className="mb-1 block text-sm font-medium text-gray-300"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 border-gray-700 bg-transparent text-sm text-white outline-none focus:border-indigo-500"
                        />
                    </div>
                        
                    <div>
                        <label 
                            className="mb-1 block text-sm font-medium text-gray-300"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 border-gray-700 bg-transparent text-sm text-white outline-none focus:border-indigo-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </main>
    )
    
}