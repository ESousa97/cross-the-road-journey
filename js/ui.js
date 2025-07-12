// ui.js
window.updateUI = function() {
    document.getElementById('scoreDisplay').textContent = gameData.score;
    document.getElementById('highScoreDisplay').textContent = gameData.highScore;
    document.getElementById('levelDisplay').textContent = gameData.level;
};

window.showOverlay = function(title, text) {
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlayText').textContent = text;
    document.getElementById('gameOverlay').classList.remove('hidden');
};
