// gameState.js
window.gameStates = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};

window.gameData = {
    score: 0,
    highScore: 0,
    level: 1,
    lives: 3,
    soundEnabled: true
};

// Aqui está a linha que resolve seu erro!
window.gameState = window.gameStates.MENU;
