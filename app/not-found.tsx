import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <p className="text-gray-400 font-medium">404</p>
                
                <h1 className="mt-2 text-3xl font-semibold">Page Not Found</h1>

                <p className="mt-3 text-sm text-gray-400">
                    Sorry, the page you are looking for does not exist.
                </p>

                <div className="mt-6">
                    <Link
                        href="/dashboard"
                        className="inline-block rounded-md text-sm font-medium bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700"
                    >
                        Back to Daashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}