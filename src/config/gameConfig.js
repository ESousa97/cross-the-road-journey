export const gameConfig = {
    canvas: {
        fps: 244
    },
    difficulty: {
        initialLevel: 1,
        initialLives: 3,
        increment: 2,
        maxLevel: 50,
        scorePerCrossing: 10,
        levelUpEvery: 50,
        minLanes: 3,
        maxLanes: 12
    },
    player: {
        size: 25,
        speed: 4,
        invulnerableFrames: 60,
        trailLength: 10
    },
    cars: {
        maxCars: 50,
        baseSpeedRange: [1.5, 3],
        fastExtraPerLevel: 0.3,
        extraCarsPerLevel: 0.5,
        fastSpeedMultiplier: 1.8
    },
    particles: {
        count: 10,
        life: 60
    },
    storage: {
        highScoreKey: 'roadCrossingHighScore'
    }
};
