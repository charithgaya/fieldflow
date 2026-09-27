export function formatSriLankaDateTime(
    value: Date | string | number
) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Colombo",
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}