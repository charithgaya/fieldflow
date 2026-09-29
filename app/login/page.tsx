"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FieldFlowLogo from "@/app/components/fieldflow-logo";
import Link from "next/link";

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
            <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-950 p-6 shadow-md sm:p-8">
                <div className="mb-8 flex justify-center">
                    <Link href="/" className="block shrink-0">
                        <FieldFlowLogo className="h-auto w-54 sm:w-72" />
                    </Link>
                </div>

                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-gray-400 text-sm">
                        Sign in to your Fieldflow account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label 
                            className="mb-1.5 block text-sm font-medium text-gray-300"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full rounded-md border px-3 py-2.5 border-gray-700 bg-transparent text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                        
                    <div>
                        <label 
                            className="mb-1.5 block text-sm font-medium text-gray-300"
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
                                required
                                autoComplete="current-password"
                                className="w-full rounded-md border px-3 py-2.5 border-gray-700 bg-transparent text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 pr-10"
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

                    {error && (
                        <p 
                            role="alert"
                            className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-400"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-indigo-600 py-2.5 px-4 text-white text-sm font-medium transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </main>
    )
    
}