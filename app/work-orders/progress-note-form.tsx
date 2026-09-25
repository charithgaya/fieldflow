"use client";

import { useActionState } from "react";
import {
    addProgressNote,
    type AddProgressNoteFormState,
} from "./action";

type ProgressNoteFormProps = {
    workOrderId: string;
};

const initialState: AddProgressNoteFormState = {};

export default function ProgressNoteForm({ 
    workOrderId 
}: ProgressNoteFormProps) {
    const [state, formAction, isPending] = useActionState(
        addProgressNote,
        initialState
    );

    return(
        <form action={formAction} className="mt-4 space-y-4">
            <input 
                type="hidden"
                name="workOrderId"
                value={workOrderId}
            />

            <div>
                <label 
                    htmlFor="note" 
                    className="block text-sm font-medium"
                >
                    Progress Note
                </label>

                <textarea
                    id="note"
                    name="note"
                    rows={4}
                    placeholder="Describe the work or progress..."
                    className="mt-2 w-full px-3 py-2 border border-gray-700 bg-transparent rounded-md text-sm text-white outline-none focus:border-indigo-500"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-fit text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                disabled={isPending}
            >
                {isPending ? "Adding..." : "Add Progress Note"}
            </button>

            {state.error && (
                <div className="text-red-600 text-sm">
                    {state.error}
                </div>
            )}

            {state.success && (
                <p className="text-green-600 text-sm">
                    {state.success}
                </p>
            )}
        </form>
    );
}
