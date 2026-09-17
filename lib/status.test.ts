import { describe, expect, it } from 'vitest';
import { formatStatus } from './status';

describe('formatStatus', () => {
    it('formats a simple status', () => {
        expect(formatStatus("OPEN")).toBe("Open");
    });

    it('formats a status with underscores', () => {
        expect(formatStatus("IN_PROGRESS")).toBe("In Progress");
    });

    it('formats a completed status', () => {
        expect(formatStatus("COMPLETED")).toBe("Completed");
    });
});