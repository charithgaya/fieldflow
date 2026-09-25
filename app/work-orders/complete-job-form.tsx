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
                    className="mt-2 w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    required
                />

            </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-fit text-sm font-medium px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
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

