const SRI_LANKA_OFFSET_MINUTES = 330;

export function parseSriLankaDateTime(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const [, year, month, day, hour, minute] = match;

    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    const h = Number(hour);
    const min = Number(minute);

    const localAsUTC = new Date(
        Date.UTC(y, m - 1, d, h, min)
    );

    // Validate the date components before applying the Sri Lanka offset.
    if (
        localAsUTC.getUTCFullYear() !== y ||
        localAsUTC.getUTCMonth() !== m - 1 ||
        localAsUTC.getUTCDate() !== d ||
        localAsUTC.getUTCHours() !== h ||
        localAsUTC.getUTCMinutes() !== min
    ) {
        return null;
    }

    // Interpret the entered time as Sri Lanka time (UTC+05:30)
    return new Date(
        localAsUTC.getTime() -
            SRI_LANKA_OFFSET_MINUTES * 60 * 1000
    );
}

export function formatSriLankaDateTime(
    value: Date | string | number
) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Colombo",
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}