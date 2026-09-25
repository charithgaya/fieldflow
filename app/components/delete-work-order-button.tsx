"use client";

import { useActionState } from "react";
import { deleteWorkOrder, type DeleteWorkOrderFormState } from "@/app/work-orders/action";
import { MdDelete } from "react-icons/md";

const initialState: DeleteWorkOrderFormState = {};

type DeleteWorkOrderButtonProps = {
    workOrderId: string;
};

export default function DeleteWorkOrderButton({
    workOrderId,
}: DeleteWorkOrderButtonProps) {
    const [state, formAction, pending] = useActionState(
        deleteWorkOrder,
        initialState
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this work order? This action cannot be undone."
        );

        if (!confirmed) {
            event.preventDefault();
        }
    }

    return (
        <form action={formAction} onSubmit={handleSubmit}>
            <input
                type="hidden"
                name="workOrderId"
                value={workOrderId}
            />

            <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-1 w-full whitespace-nowrap rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
                <MdDelete className="inline-block mr-1 text-lg" />
                {pending ? "Deleting..." : "Delete Work Order"}
            </button>

            {state.error && (
                <p className="mt-2 text-sm text-red-400">
                    {state.error}
                </p>
            )}
        </form>
    );
}