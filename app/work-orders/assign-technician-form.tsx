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
                    className="block text-sm font-medium"
                >
                    Technician
                </label>

                <select
                    id="technicianId"
                    name="technicianId"
                    defaultValue={currentTechnicianId ?? ""}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    required
                >
                    <option value="" disabled>
                        Select technician
                    </option>

                    {technicians.map((technician) => (
                        <option
                            key={technician.id}
                            value={technician.id}
                        >
                            {technician.name} — {technician.status}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {pending
                    ? "Assigning..."
                    : "Assign Technician"}
            </button>
        </form>
    );
}