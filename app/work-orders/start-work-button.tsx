"use client";

import { useActionState } from "react";
import { startWork, type StartWorkFormState } from "./action";

type StartWorkButtonProps = { workOrderId: string };

const initialState: StartWorkFormState = {};

export default function StartWorkButton({ workOrderId }: StartWorkButtonProps) {

    const [state, formAction, isPending] = useActionState(startWork, initialState);

    return (
        <form action={formAction} className="mt-4">
            <input 
                type="hidden" 
                name="workOrderId" 
                value={workOrderId} 
            />

            <button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm w-fit font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {isPending ? "Starting..." : "Start Work"}
            </button>

            {state.error && (
                <p className="mt-2 text-sm text-red-600">
                    {state.error}
                </p>
            )}
        </form>
    );
}
