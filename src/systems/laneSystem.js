import { gameConfig } from '../config/gameConfig.js';

export function getAllLanes(canvasHeight) {
    const lanes = [];
    const marginTop = canvasHeight * 0.12;
    const marginBottom = canvasHeight * 0.15;
    const areaHeight = canvasHeight - marginTop - marginBottom;
    const laneCount = gameConfig.difficulty.maxLanes;

    for (let i = 0; i < laneCount; i += 1) {
        const y = marginTop + (i / (laneCount - 1)) * areaHeight;
        lanes.push(y);
    }
    return lanes;
}

export function getActiveLanes(level, canvasHeight) {
    const laneCount = Math.min(
        gameConfig.difficulty.minLanes + (level - 1),
        gameConfig.difficulty.maxLanes
    );
    return getAllLanes(canvasHeight).slice(0, laneCount);
}

export function getFastLaneChance(level) {
    const base = 0.2 + (level - 4) * 0.1;
    return Math.min(base, 0.8);
}
