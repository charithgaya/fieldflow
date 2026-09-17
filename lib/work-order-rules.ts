export function canStartWorkOrder(
    status: string,
    technicianId: string | null,
    currentTechnicianId: string
) {
    if (technicianId !== currentTechnicianId) {
        return {
            allowed: false,
            error: "You do not have permission to start this work order.",
        };
    }

    if (status !== "ASSIGNED") {
        return {
            allowed: false,
            error: "Only an assigned work order can be started.",
        };
    }

    return {
        allowed: true,
    };
}