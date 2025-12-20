import { gameConfig } from '../config/gameConfig.js';

export const gameStates = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

export const gameData = {
    score: 0,
    highScore: 0,
    level: gameConfig.difficulty.initialLevel,
    lives: gameConfig.difficulty.initialLives,
    soundEnabled: true
};

let currentState = gameStates.MENU;

export const getGameState = () => currentState;
export const setGameState = (nextState) => { currentState = nextState; };

export function resetGameData() {
    gameData.score = 0;
    gameData.level = gameConfig.difficulty.initialLevel;
    gameData.lives = gameConfig.difficulty.initialLives;
}

export function loadHighScore() {
    const saved = localStorage.getItem(gameConfig.storage.highScoreKey);
    if (saved) gameData.highScore = parseInt(saved, 10);
    return gameData.highScore;
}

export function saveHighScore() {
    localStorage.setItem(gameConfig.storage.highScoreKey, gameData.highScore.toString());
}
