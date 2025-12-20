import { describe, expect, it } from 'vitest';
import { computeScoreIncrement, nextLaneUnlockInfo, pointsToNextLevel, shouldLevelUp } from './progression.js';

describe('progression helpers', () => {
    it('increments score based on current level', () => {
        expect(computeScoreIncrement(1)).toBe(10);
        expect(computeScoreIncrement(3)).toBe(30);
    });

    it('detects when a level up should occur', () => {
        expect(shouldLevelUp(0)).toBe(false);
        expect(shouldLevelUp(10)).toBe(false);
        expect(shouldLevelUp(50)).toBe(true);
        expect(shouldLevelUp(100)).toBe(true);
    });

    it('calculates points remaining to the next level threshold', () => {
        expect(pointsToNextLevel(0)).toBe(50);
        expect(pointsToNextLevel(10)).toBe(40);
        expect(pointsToNextLevel(50)).toBe(50);
        expect(pointsToNextLevel(71)).toBe(29);
    });

    it('returns unlock info for next lane', () => {
        expect(nextLaneUnlockInfo(10, 1)).toEqual({ remaining: 40, willUnlock: true });
        expect(nextLaneUnlockInfo(50, 5)).toEqual({ remaining: 50, willUnlock: true });
        expect(nextLaneUnlockInfo(1000, 12)).toEqual({ remaining: 0, willUnlock: false });
    });
});
