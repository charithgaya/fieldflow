"use client"

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { IoMdLogOut } from "react-icons/io";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
           <IoMdLogOut className="inline-block text-lg" /> Logout
        </button>
    );
}