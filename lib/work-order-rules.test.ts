import { describe, expect, it } from 'vitest';
import { canStartWorkOrder } from './work-order-rules';

describe('canStartWorkOrder', () => {
    it('allows the assigned technician to start an assigned work order', () => {
        const result = canStartWorkOrder(
            'ASSIGNED', 
            'technician-1', 
            'technician-1'
        );

        expect(result.allowed).toBe(true);
    });

    it('denies a different technician', () => {
        const result = canStartWorkOrder(
            'ASSIGNED', 
            'technician-1', 
            'technician-2'
        );

        expect(result.allowed).toBe(false);
        expect(result.error).toBe(
            "You do not have permission to start this work order."
        );
    });

    it('denies starting a work order that is not assigned', () => {
        const result = canStartWorkOrder(
            'OPEN', 
            'technician-1', 
            'technician-1'
        );

        expect(result.allowed).toBe(false);
        expect(result.error).toBe(
            "Only an assigned work order can be started."
        );
    });
});