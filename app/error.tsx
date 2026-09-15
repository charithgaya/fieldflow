"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
            <p className="text-sm font-medium text-gray-400">
                Something went wrong!
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-white">
                We couldn&apos;t load this page
            </h1>

            <p className="mt-3 text-sm text-gray-400">
                An unexpected error has occurred. Please try again.
            </p>

            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="mt-6 rounded-md text-sm font-medium bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
            >
                Try again
            </button>
        </div>
    </main>
  );

}