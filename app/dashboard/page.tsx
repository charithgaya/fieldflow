import { requireUser } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await requireUser();

    switch (user.role) {
        case "ADMIN":
            redirect("/admin");

        case "DISPATCHER":
            redirect("/dispatcher");

        case "TECHNICIAN":
            redirect("/technician");

        default:
            redirect("/login");
    }
}