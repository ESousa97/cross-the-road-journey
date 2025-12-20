import './style.css';
import { gameConfig } from './config/gameConfig.js';
import {
    gameData,
    gameStates,
    getGameState,
    setGameState,
    resetGameData,
    loadHighScore,
    saveHighScore
} from './state/gameState.js';
import { getActiveLanes, getAllLanes } from './systems/laneSystem.js';
import { Player } from './entities/player.js';
import { Car } from './entities/car.js';
import { Particle } from './entities/particle.js';
import { updateUI, showOverlay, hideOverlay } from './ui/ui.js';
import { levelUpAnimation, triggerLevelUpAnimation, drawLevelUpAnimation } from './animations/levelUp.js';
import { computeScoreIncrement, shouldLevelUp, nextLaneUnlockInfo } from './core/progression.js';

let player;
let cars = [];
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
let controlsHintVisible = true;

function calculateResponsiveSize() {
    canvasWidth = window.innerWidth;
    let safeArea = 0;
    if (window.CSS && CSS.supports('padding-bottom: env(safe-area-inset-bottom)')) {
        safeArea = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)'), 10) || 0;
    }
    const mobileSafeBar = document.getElementById('mobileSafeBar');
    if (mobileSafeBar && mobileSafeBar.offsetHeight) safeArea = Math.max(safeArea, mobileSafeBar.offsetHeight);
    canvasHeight = window.innerHeight - safeArea;
}

function getCanvasWidth() { return canvasWidth; }
function getCanvasHeight() { return canvasHeight; }

function handleResize() {
    calculateResponsiveSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function createPlayer() {
    player = new Player(canvasWidth / 2, canvasHeight - 35, {
        isPlaying: () => getGameState() === gameStates.PLAYING,
        getCanvasWidth,
        getCanvasHeight,
        onGoal: handlePlayerGoal,
        onHit: handlePlayerHit
    });
}

function initializeCars() {
    cars = [];
    const activeLanes = getActiveLanes(gameData.level, canvasHeight);
    const [minSpeed, maxSpeed] = gameConfig.cars.baseSpeedRange;
    for (let i = 0; i < activeLanes.length; i += 1) {
        const lane = activeLanes[i];
        const baseSpeed = random(minSpeed, maxSpeed);
        const isFast = true;
        const startX = random() > 0.5 ? canvasWidth + random(50, 200) : -random(50, 200);
        cars.push(new Car(startX, lane, baseSpeed, i, isFast));
    }
    const extraCars = Math.min(
        Math.floor(gameData.level * gameConfig.cars.extraCarsPerLevel),
        gameConfig.cars.maxCars - cars.length
    );
    for (let j = 0; j < extraCars; j += 1) {
        const lane2 = random(activeLanes);
        const baseSpeed2 = random(minSpeed + 0.5, maxSpeed + 2);
        const isFast2 = true;
        const startX2 = random() > 0.5 ? canvasWidth + random(200, 600) : -random(200, 600);
        cars.push(new Car(startX2, lane2, baseSpeed2, cars.length, isFast2));
    }
}

function updateCarsForNewLevel() {
    const speedMultiplier = 1 + (gameData.level - 1) * gameConfig.cars.fastExtraPerLevel;
    cars.forEach((car) => car.updateSpeed(speedMultiplier));
    initializeCars();
}

function drawControlsHint() {
    push();
    fill(0, 0, 0, 220);
    rectMode(CENTER);
    const fontSize = Math.max(14, canvasWidth * 0.018);
    textAlign(CENTER, CENTER);
    textSize(fontSize);
    fill(255, 220, 40);
    const hint = 'Use ↑ ↓ ← → ou W S A D para mover | ESPAÇO para pausar';
    rect(canvasWidth / 2, canvasHeight - 36, textWidth(hint) + 36, fontSize * 2, 20);
    fill(255);
    text(hint, canvasWidth / 2, canvasHeight - 36);
    pop();
}

function showControlsHint() { controlsHintVisible = true; }
function hideControlsHint() {
    if (!controlsHintVisible) return;
    controlsHintVisible = false;
    const controls = document.getElementById('controls');
    if (controls) controls.style.display = 'none';
}
function onPlayerInput() { hideControlsHint(); }

function drawRoad() {
    const marginTop = canvasHeight * 0.12;
    const marginBottom = canvasHeight * 0.15;
    const asfaltoHeight = canvasHeight - marginTop - marginBottom;

    fill(100, 150, 100);
    rect(0, 0, canvasWidth, marginTop);
    rect(0, canvasHeight - marginBottom, canvasWidth, marginBottom);

    fill(70, 70, 70);
    rect(0, marginTop, canvasWidth, asfaltoHeight);

    const allLanes = getAllLanes(canvasHeight);
    const activeLanes = getActiveLanes(gameData.level, canvasHeight);

    stroke(255, 255, 0);
    strokeWeight(1);
    for (let i = 0; i < allLanes.length; i += 1) {
        if (i > 0) {
            if (i >= activeLanes.length) stroke(255, 255, 0, 80);
            else stroke(255, 255, 0, 255);
            drawDashedLine(0, allLanes[i], canvasWidth, allLanes[i]);
        }
    }
    stroke(255, 255, 0, 255);
    drawDashedLine(0, allLanes[0], canvasWidth, allLanes[0]);
    drawDashedLine(0, allLanes[allLanes.length - 1], canvasWidth, allLanes[allLanes.length - 1]);

    for (let j = activeLanes.length; j < allLanes.length; j += 1) {
        fill(50, 50, 50, 120);
        noStroke();
        const yStart = allLanes[j];
        const yEnd = j + 1 < allLanes.length ? allLanes[j + 1] : allLanes[j] + (allLanes[j] - allLanes[j - 1]);
        rect(0, yStart, canvasWidth, yEnd - yStart);
        fill(255, 100, 100, 180);
        textAlign(CENTER);
        textSize(10);
        text(`NIVEL ${j + 1 - 2}`, canvasWidth / 2, yStart + (yEnd - yStart) / 2);
    }
    noStroke();
}

function drawDashedLine(x1, y1, x2, y2) {
    const segments = 20;
    const segmentLength = (x2 - x1) / segments;
    for (let i = 0; i < segments; i += 2) {
        const startX = x1 + i * segmentLength;
        const endX = x1 + (i + 1) * segmentLength;
        line(startX, y1, endX, y2);
    }
}

function drawLives() {
    for (let i = 0; i < gameData.lives; i += 1) {
        push();
        fill(255, 100, 100);
        stroke(255);
        strokeWeight(2);
        ellipse(canvasWidth - 30 - i * 35, 25, 20);
        pop();
    }
}

function drawSpawnIndicators() {
    const marginBottom = canvasHeight * 0.15;
    const spawnY = canvasHeight - marginBottom / 2;
    const spawnXs = [canvasWidth * 0.15, canvasWidth * 0.33, canvasWidth * 0.5, canvasWidth * 0.67, canvasWidth * 0.85];
    for (let i = 0; i < spawnXs.length; i += 1) {
        push();
        fill(0, 255, 0, 50);
        noStroke();
        ellipse(spawnXs[i], spawnY, 15);
        pop();
    }
}

function drawLevelInfo() {
    push();
    fill(255, 255, 255, 200);
    textAlign(LEFT);
    textSize(12);
    const activeLanes = getActiveLanes(gameData.level, canvasHeight);
    const fastCars = cars.filter((car) => car.isFast).length;
    text(`Faixas liberadas: ${activeLanes.length}/${gameConfig.difficulty.maxLanes}`, 10, canvasHeight - 45);
    if (gameData.level >= 4) text(`Carros rapidos: ${fastCars}`, 10, canvasHeight - 30);
    const unlockInfo = nextLaneUnlockInfo(gameData.score, gameData.level);
    if (unlockInfo.willUnlock) {
        fill(255, 255, 100, 180);
        text(`Proxima faixa em: ${unlockInfo.remaining} pts`, 10, canvasHeight - 15);
    } else {
        fill(0, 255, 0, 180);
        text('TODAS AS FAIXAS DESBLOQUEADAS!', 10, canvasHeight - 15);
    }
    pop();
}

function createParticles(x, y, particleColor) {
    for (let i = 0; i < gameConfig.particles.count; i += 1) particles.push(new Particle(x, y, particleColor));
}

function drawParticles() {
    for (let j = particles.length - 1; j >= 0; j -= 1) {
        particles[j].update();
        particles[j].draw();
        if (particles[j].isDead()) particles.splice(j, 1);
    }
}

function handlePlayerGoal() {
    gameData.score += computeScoreIncrement(gameData.level);
    updateUI(gameData);
    createParticles(player.x, player.y, color(0, 255, 0));
    if (shouldLevelUp(gameData.score)) {
        const oldLevel = gameData.level;
        gameData.level += 1;
        if (gameData.level > oldLevel) triggerLevelUpAnimation(canvasWidth, canvasHeight);
        updateCarsForNewLevel();
        updateUI(gameData);
    }
}

function handlePlayerHit() {
    gameData.lives -= 1;
    createParticles(player.x, player.y, color(255, 0, 0));
    if (gameData.lives <= 0) {
        gameOver();
    } else {
        updateUI(gameData);
    }
}

function draw() {
    background(50, 50, 100);
    drawRoad();
    if (getGameState() === gameStates.PLAYING) {
        player.update();
        player.draw();
        for (let i = 0; i < cars.length; i += 1) {
            cars[i].update(canvasWidth);
            cars[i].draw();
            if (player.checkCollision(cars[i])) player.hit();
        }
        drawParticles();
        drawLives();
        drawSpawnIndicators();
        drawLevelInfo();
        if (levelUpAnimation.active) drawLevelUpAnimation(canvasWidth, canvasHeight, gameData.level);
    }
    if (controlsHintVisible) drawControlsHint();
}

function setup() {
    calculateResponsiveSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('gameContainer');
    canvas.id('gameCanvas');
    createPlayer();
    initializeCars();
    loadHighScore();
    document.getElementById('startButton')?.addEventListener('click', startGame);
    document.getElementById('muteButton')?.addEventListener('click', toggleSound);
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', setupTouchControls);
    window.addEventListener('resize', setupTouchControls);
    showControlsHint();
    updateUI(gameData);
}

function keyPressed() {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'a', 's', 'd', ' '].includes(key)) onPlayerInput();
    if (key === ' ') togglePause();
    if (getGameState() === gameStates.MENU && (keyCode === ENTER || key === ' ')) startGame();
}

function startGame() {
    setGameState(gameStates.PLAYING);
    resetGameData();
    levelUpAnimation.active = false;
    createPlayer();
    initializeCars();
    particles = [];
    hideOverlay();
    updateUI(gameData);
    showControlsHint();
}

function togglePause() {
    if (getGameState() === gameStates.PLAYING) {
        setGameState(gameStates.PAUSED);
        showOverlay('Pausado', 'Pressione ESPACO para continuar');
    } else if (getGameState() === gameStates.PAUSED) {
        setGameState(gameStates.PLAYING);
        hideOverlay();
    }
}

function gameOver() {
    setGameState(gameStates.GAME_OVER);
    if (gameData.score > gameData.highScore) {
        gameData.highScore = gameData.score;
        saveHighScore();
    }
    showOverlay('Game Over!', `Pontuacao: ${gameData.score}\nRecorde: ${gameData.highScore}`);
    updateUI(gameData);
}

function toggleSound() {
    gameData.soundEnabled = !gameData.soundEnabled;
    const button = document.getElementById('muteButton');
    if (button) button.textContent = gameData.soundEnabled ? '🔊 Som' : '🔇 Mudo';
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function setupTouchControls() {
    const touchControls = document.getElementById('touchControls');
    if (!touchControls) return;

    if (isMobile()) {
        touchControls.style.display = 'flex';
        const keyMap = {
            touchUp: 38,
            touchDown: 40,
            touchLeft: 37,
            touchRight: 39
        };
        Object.keys(keyMap).forEach((btnId) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.ontouchstart = (e) => {
                    e.preventDefault();
                    onPlayerInput();
                    simulateKeyDown(keyMap[btnId]);
                };
                btn.ontouchend = (e) => {
                    e.preventDefault();
                    simulateKeyUp(keyMap[btnId]);
                };
            }
        });
        const btnPause = document.getElementById('touchPause');
        if (btnPause) {
            btnPause.ontouchstart = (e) => {
                e.preventDefault();
                togglePause();
            };
        }
    } else {
        touchControls.style.display = 'none';
    }
}

function simulateKeyDown(keyCodeValue) {
    const evt = new KeyboardEvent('keydown', { keyCode: keyCodeValue, which: keyCodeValue });
    window.dispatchEvent(evt);
}
function simulateKeyUp(keyCodeValue) {
    const evt = new KeyboardEvent('keyup', { keyCode: keyCodeValue, which: keyCodeValue });
    window.dispatchEvent(evt);
}

window.addEventListener('keydown', (e) => {
    if ([37, 38, 39, 40, 87, 65, 83, 68, 32].includes(e.keyCode)) {
        onPlayerInput();
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
    }
});
['touchUp', 'touchDown', 'touchLeft', 'touchRight'].forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.ontouchstart = onPlayerInput;
});

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

// Exported for testing
export const __internals = {
    handlePlayerGoal,
    handlePlayerHit
};
