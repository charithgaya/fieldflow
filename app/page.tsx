import Link from "next/link";
import { LiaSignInAltSolid } from "react-icons/lia";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl flex min-h-screen flex-col px-6">

        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            FieldFlow
          </Link>

          <Link
            href="/login"
            className="rounded-md text-sm font-medium border border-gray-700 px-4 py-2 text-gray-200 hover:bg-gray-800"
          > 
            <LiaSignInAltSolid className="inline-block text-lg" /> Sign In
          </Link>
        </header>
        
        {/* Hero */}
        <section className="flex flex-1 items-center py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-wider text-indigo-400 uppercase">
              Field Service Management
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Manage field work from {" "}
              <span className="text-indigo-400">one place.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Fieldflow helps teams mange customers, technicians & work orders 
              through a simple & organized workflow.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Sign In to FieldFlow
              </Link>

              <Link
                href="/dashboard"
                className="rounded-md px-6 py-3 text-center text-sm font-medium text-gray-200 border border-gray-700 transition hover:bg-gray-800"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-4 border-t border-gray-800 py-10 sm:grids-col-3">
          <div>
            <h2 className="font-semibold">
              Customers
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Keep customer information organized & connected to service jobs.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">
              Technicians
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Manage technician availability & assigned field work.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">
              Work Orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Create, assign, track & complete service jobs through a clear workflow.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FieldFlow - Field Service Management System. All rights reserved.
        </footer>
      </div>  
    </main>
  );
}