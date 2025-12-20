import { gameConfig } from '../config/gameConfig.js';

export function computeScoreIncrement(level) {
    return gameConfig.difficulty.scorePerCrossing * level;
}

export function shouldLevelUp(score) {
    if (score <= 0) return false;
    return score % gameConfig.difficulty.levelUpEvery === 0;
}

export function pointsToNextLevel(score) {
    if (score < 0) return 0;
    const mod = score % gameConfig.difficulty.levelUpEvery;
    return mod === 0 ? gameConfig.difficulty.levelUpEvery : gameConfig.difficulty.levelUpEvery - mod;
}

export function isMaxLaneCount(level) {
    const currentLaneCount = gameConfig.difficulty.minLanes + (level - 1);
    return currentLaneCount >= gameConfig.difficulty.maxLanes;
}

export function nextLaneUnlockInfo(score, level) {
    if (isMaxLaneCount(level)) {
        return { remaining: 0, willUnlock: false };
    }
    const remaining = pointsToNextLevel(score);
    return { remaining, willUnlock: true };
}
