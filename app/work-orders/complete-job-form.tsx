"use client";

import { useActionState } from "react";
import {
    completeWorkOrder,
    type CompleteWorkOrderFormState
} from "./action";

type CompleteJobFormProps = {
    workOrderId: string;
};

const initialState: CompleteWorkOrderFormState = {};

export default function CompleteJobForm({ 
    workOrderId 
}: CompleteJobFormProps) {
    const [state, formAction, isPending] = useActionState(
        completeWorkOrder, 
        initialState
    );

    return (
       <form action={formAction} className="mt-4 space-y-4">
            <input
                type="hidden"
                name="workOrderId"
                value={workOrderId}
            />

            <div>
                <label 
                    htmlFor="completionNotes" 
                    className="block text-sm font-medium"
                >
                   Completion Notes
                </label> 

                <textarea
                    id="completionNotes"
                    name="completionNotes"
                    rows={5}
                    placeholder="Describe what was completed & final result..."
                    className="mt-2 w-full rounded-md border border-white px-3 py-2 text-sm"
                    required
                />

            </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {isPending ? "Completing..." : "Complete Job"}
                </button>

            {state.error && (
                <p className="text-sm text-red-600">
                    {state.error}
                </p>
            )}

            {state.success && (
                <p className="text-sm text-green-600">
                    {state.success}
                </p>
            )}
        </form>
    );
}

