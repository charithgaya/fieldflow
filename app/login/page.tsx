"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/dist/client/components/navigation";
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
        <main>
            <div>
                <h1>
                    FieldFlow
                </h1>

                <p>
                    Sign in to your account
                </p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </main>
    )
    
}