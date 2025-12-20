import { describe, expect, it } from 'vitest';
import { getActiveLanes, getAllLanes } from './laneSystem.js';

const canvasHeight = 800;

describe('lane system', () => {
    it('returns max lane count respecting margins', () => {
        const lanes = getAllLanes(canvasHeight);
        expect(lanes.length).toBe(12);
        expect(lanes[0]).toBeCloseTo(canvasHeight * 0.12);
        expect(lanes[lanes.length - 1]).toBeCloseTo(canvasHeight - canvasHeight * 0.15);
    });

    it('activates lanes progressively per level', () => {
        expect(getActiveLanes(1, canvasHeight).length).toBe(3);
        expect(getActiveLanes(5, canvasHeight).length).toBe(7);
        expect(getActiveLanes(20, canvasHeight).length).toBe(12);
    });
});
