"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
    cancelWorkOrder,
    type CancelWorkOrderFormState,
} from "@/app/work-orders/action";
import { MdCancel } from "react-icons/md";

type CancelWorkOrderButtonProps = {
    workOrderId: string;
};

const initialState: CancelWorkOrderFormState = {};

export default function CancelWorkOrderButton({
    workOrderId,
}: CancelWorkOrderButtonProps) {
    const [showForm, setShowForm] = useState(false);

    const [state, formAction, isPending] = useActionState(
        cancelWorkOrder,
        initialState
    );

    if (!showForm) {
        return (
            <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-600 hover:bg-gray-700 transition"
            >
                <MdCancel className="mr-1 text-lg" />
                Cancel Work Order
            </button>
        );
    }

    return (
        <div className="w-full max-w-md rounded-lg border border-red-900/50 bg-gray-900 p-4">
            <h3 className="font-semibold text-red-400">
                Cancel Work Order
            </h3>

            <p className="mt-1 text-sm text-gray-400">
                Please provide a reason for cancelling this work order.
            </p>

            <form action={formAction} className="mt-4 space-y-4">
                <input
                    type="hidden"
                    name="workOrderId"
                    value={workOrderId}
                />

                <div>
                    <label
                        htmlFor="cancellationReason"
                        className="block text-sm font-medium text-gray-200"
                    >
                        Cancellation Reason
                    </label>

                    <textarea
                        id="cancellationReason"
                        name="cancellationReason"
                        required
                        minLength={5}
                        rows={3}
                        placeholder="Enter the reason for cancellation..."
                        className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {state.error && (
                    <p className="text-sm text-red-400">
                        {state.error}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    >
                        {isPending
                            ? "Cancelling..."
                            : "Confirm Cancellation"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    >
                        Keep Work Order
                    </button>
                </div>
            </form>
        </div>
    );
}