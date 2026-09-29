import Link from "next/link";
import Image from "next/image";
import { LiaSignInAltSolid } from "react-icons/lia";
import { getCurrentUser } from "@/lib/auth-utils";
import LogoutButton from "./components/logout-button";
import { MdDashboard } from "react-icons/md";
import FieldFlowLogo from "./components/fieldflow-logo";
import { IoIosArrowDroprightCircle } from "react-icons/io";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl flex min-h-screen flex-col px-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <Link href="/" className="block shrink-0">
            <FieldFlowLogo className="h-auto w-54 sm:w-64" /> 
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 transition"
              >
                  <MdDashboard className="inline-block text-lg" /> Dashboard
              </Link>

              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium border border-gray-700 px-4 py-2 text-gray-200 transition hover:bg-gray-800"
            > 
              <LiaSignInAltSolid className="inline-block text-lg" /> Sign In
            </Link>
          )}
        </header>
        
        {/* Hero */}
        <section className="flex flex-1 items-center py-12 sm:py-16">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">

            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-wider text-indigo-400 uppercase">
                Field Service Management
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Manage field work from {" "}
                  <span className="text-indigo-400">one place.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                Fieldflow helps teams manage customers, technicians & work orders 
                through a simple & organized workflow.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {user ? (
                  <Link 
                    href="/dashboard"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Go to Dashboard<IoIosArrowDroprightCircle className="inline-block ml-2 text-lg" />
                  </Link>
                ):(
                  <Link
                    href="/login"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    <LiaSignInAltSolid className="inline-block text-lg" /> Sign In to FieldFlow
                  </Link>
                )}

                {!user && (
                  <Link
                    href="/dashboard"
                    className="rounded-md px-6 py-3 text-center text-sm font-medium text-gray-200 border border-gray-700 transition hover:bg-gray-800"
                  >
                    Go to Dashboard<IoIosArrowDroprightCircle className="inline-block ml-2 text-lg" />
                  </Link>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex w-full justify-center lg:justify-end">
                <Image 
                  src="/FSM.png" 
                  alt="FieldFlow - Field Service Management" 
                  width={1200} height={720}
                  className="h-auto w-full max-w-xl object-contain rounded"
                  priority />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-4 border-t border-gray-800 py-10 sm:grid-cols-3">
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
      </div>  
    </main>
  );
}