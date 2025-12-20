export function updateUI(gameData) {
    const scoreDisplay = document.getElementById('scoreDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    if (scoreDisplay) scoreDisplay.textContent = gameData.score;
    if (highScoreDisplay) highScoreDisplay.textContent = gameData.highScore;
    if (levelDisplay) levelDisplay.textContent = gameData.level;
}

export function showOverlay(title, text) {
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayText = document.getElementById('overlayText');
    const overlay = document.getElementById('gameOverlay');
    if (overlayTitle) overlayTitle.textContent = title;
    if (overlayText) overlayText.textContent = text;
    if (overlay) overlay.classList.remove('hidden');
}

export function hideOverlay() {
    const overlay = document.getElementById('gameOverlay');
    if (overlay) overlay.classList.add('hidden');
}
