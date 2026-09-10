"use client";

import { useActionState } from "react";
import { assignTechnician }  from "./action";

type Technician = {
    id: string;
    name: string;
    status: string;
};

type AssignmentState = {
    error?: string;
};

const initialState: AssignmentState = {};

function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AssignTechnicianForm({
    workOrderId,
    currentTechnicianId,
    technicians,
}: {
    workOrderId: string;
    currentTechnicianId: string | null;
    technicians: Technician[];
}) {
    const [state, formAction, pending] = useActionState(
        assignTechnician,
        initialState
    );

    console.log("Technicians: ", technicians);

    return (
        <form action={formAction} className="mt-4 space-y-4">
            {state.error && (
                <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                    {state.error}
                </div>
            )}

            <input
                type="hidden"
                name="workOrderId"
                value={workOrderId}
            />

            <div>
                <label
                    htmlFor="technicianId"
                    className="block text-sm font-medium mb-1"
                >
                    Technician
                </label>

                <select
                    id="technicianId"
                    name="technicianId"
                    defaultValue={currentTechnicianId ?? ""}
                    className="px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    required
                >
                    <option value="" className="bg-gray-900" disabled>
                        Select technician
                    </option>

                    {technicians.map((technician) => (
                        <option
                            key={technician.id}
                            value={technician.id}
                            className="bg-gray-900"
                        >
                            {technician.name} — {formatStatus(technician.status)}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="w-fit px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
            >
                {pending
                    ? "Assigning..."
                    : "Assign Technician"}
            </button>
        </form>
    );
}