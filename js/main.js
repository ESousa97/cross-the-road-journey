// main.js
var player, cars = [], particles = [];
var scaleFactor = 1, canvasWidth, canvasHeight;

// --- Responsividade: Ajusta o tamanho do canvas conforme tela ---
function calculateResponsiveSize() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight - (isMobile() ? 180 : 120); // Mais espaço para botões touch
    scaleFactor = Math.min(windowWidth / gameConfig.width, windowHeight / gameConfig.height) * 0.99;
    scaleFactor = Math.max(scaleFactor, 0.42); // Menor escala em celulares
    scaleFactor = Math.min(scaleFactor, 1.6);
    canvasWidth = Math.floor(gameConfig.width * scaleFactor);
    canvasHeight = Math.floor(gameConfig.height * scaleFactor);
}

// --- Setup do jogo ---
window.setup = function() {
    calculateResponsiveSize();
    gameCanvas = createCanvas(canvasWidth, canvasHeight);
    gameCanvas.parent('gameContainer');
    gameCanvas.id('gameCanvas');
    player = new Player(canvasWidth / 2, canvasHeight - 35);
    initializeCars();
    loadHighScore();
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('muteButton').addEventListener('click', toggleSound);
    window.addEventListener('resize', handleResize);

    // Ajusta controles touch
    setupTouchControls();
};

function handleResize() {
    calculateResponsiveSize();
    resizeCanvas(canvasWidth, canvasHeight);
    setupTouchControls();
}

// --- Inicialização dos carros ---
window.initializeCars = function() {
    cars = [];
    var activeLanes = laneSystem.getActiveLanes(gameData.level);
    var fastChance = laneSystem.getFastLaneChance(gameData.level);
    for (var i = 0; i < activeLanes.length; i++) {
        var lane = activeLanes[i];
        var baseSpeed = random(1.5, 3);
        var isFast = gameData.level >= 4 && random() < fastChance;
        var startX = random() > 0.5 ? canvasWidth + random(50, 200) : -random(50, 200);
        cars.push(new Car(startX, lane, baseSpeed, i, isFast));
    }
    if (gameData.level >= 3) {
        var extraCars = Math.floor(gameData.level / 2);
        for (var j = 0; j < extraCars && cars.length < 20; j++) {
            var lane2 = random(activeLanes);
            var baseSpeed2 = random(2, 5);
            var isFast2 = gameData.level >= 4 && random() < fastChance;
            var startX2 = random() > 0.5 ? canvasWidth + random(200, 600) : -random(200, 600);
            cars.push(new Car(startX2, lane2, baseSpeed2, cars.length, isFast2));
        }
    }
};

window.updateCarsForNewLevel = function() {
    var speedMultiplier = 1 + (gameData.level - 1) * 0.3;
    for (var i = 0; i < cars.length; i++) cars[i].updateSpeed(speedMultiplier);
    initializeCars();
};

// --- Loop principal de desenho ---
window.draw = function() {
    background(50, 50, 100);
    drawRoad();
    if (gameState === gameStates.PLAYING) {
        player.update();
        player.draw();
        for (var i = 0; i < cars.length; i++) {
            cars[i].update();
            cars[i].draw();
            if (player.checkCollision(cars[i])) player.hit();
        }
        for (var j = particles.length - 1; j >= 0; j--) {
            particles[j].update();
            particles[j].draw();
            if (particles[j].isDead()) particles.splice(j, 1);
        }
        drawLives();
        drawSpawnIndicators();
        drawLevelInfo();
        if (levelUpAnimation.active) drawLevelUpAnimation();
    }
};

window.drawRoad = function() {
    fill(100, 150, 100); rect(0, 0, canvasWidth, 30);
    fill(70, 70, 70); rect(0, 30, canvasWidth, canvasHeight - 80);
    var allLanes = laneSystem.allLanes;
    var activeLanes = laneSystem.getActiveLanes(gameData.level);
    stroke(255, 255, 0); strokeWeight(1);
    for (var i = 0; i < allLanes.length - 1; i++) {
        var y1 = allLanes[i] + 8, y2 = allLanes[i + 1] - 8, y = (y1 + y2) / 2;
        if (i >= activeLanes.length - 1) stroke(255, 255, 0, 80);
        else stroke(255, 255, 0, 255);
        drawDashedLine(0, y, canvasWidth, y);
    }
    stroke(255, 255, 0, 255);
    drawDashedLine(0, allLanes[0] - 8, canvasWidth, allLanes[0] - 8);
    drawDashedLine(0, allLanes[allLanes.length - 1] + 8, canvasWidth, allLanes[allLanes.length - 1] + 8);
    for (var j = activeLanes.length; j < allLanes.length; j++) {
        fill(50, 50, 50, 120); noStroke();
        rect(0, allLanes[j] - 8, canvasWidth, 16);
        fill(255, 100, 100, 180);
        textAlign(CENTER); textSize(10);
        text("NÍVEL " + (j + 1 - 2), canvasWidth / 2, allLanes[j] + 3);
    }
    fill(100, 150, 100); rect(0, canvasHeight - 50, canvasWidth, 50); noStroke();
};

window.drawDashedLine = function(x1, y1, x2, y2) {
    var segments = 20, segmentLength = (x2 - x1) / segments;
    for (var i = 0; i < segments; i += 2) {
        var startX = x1 + i * segmentLength, endX = x1 + (i + 1) * segmentLength;
        line(startX, y1, endX, y2);
    }
};

window.drawLives = function() {
    for (var i = 0; i < gameData.lives; i++) {
        push();
        fill(255, 100, 100); stroke(255); strokeWeight(2);
        ellipse(canvasWidth - 30 - i * 35, 25, 20);
        pop();
    }
};

window.drawSpawnIndicators = function() {
    var spawnY = canvasHeight - 35;
    var spawnXs = [100, canvasWidth/4, canvasWidth/2, (canvasWidth*3)/4, canvasWidth-100];
    for (var i = 0; i < spawnXs.length; i++) {
        push();
        fill(0, 255, 0, 50); noStroke();
        ellipse(spawnXs[i], spawnY, 15);
        pop();
    }
};

window.drawLevelInfo = function() {
    push();
    fill(255, 255, 255, 200); textAlign(LEFT); textSize(12);
    var activeLanes = laneSystem.getActiveLanes(gameData.level);
    var fastCars = cars.filter(function(car) { return car.isFast; }).length;
    text("Faixas liberadas: " + activeLanes.length + "/12", 10, canvasHeight - 45);
    if (gameData.level >= 4)
        text("Carros rápidos: " + fastCars, 10, canvasHeight - 30);
    if (activeLanes.length < 12) {
        var nextLevel = activeLanes.length + 1;
        var pointsNeeded = (nextLevel - 1) * 50 - gameData.score;
        if (pointsNeeded > 0) {
            fill(255, 255, 100, 180);
            text("Próxima faixa em: " + pointsNeeded + " pts", 10, canvasHeight - 15);
        }
    } else {
        fill(0, 255, 0, 180);
        text("TODAS AS FAIXAS DESBLOQUEADAS!", 10, canvasHeight - 15);
    }
    pop();
};

window.createParticles = function(x, y, particleColor) {
    for (var i = 0; i < 10; i++) particles.push(new Particle(x, y, particleColor));
};

// --- Lógica de eventos principais ---
window.keyPressed = function() {
    if (key === ' ') togglePause();
    if (gameState === gameStates.MENU && (keyCode === ENTER || key === ' ')) startGame();
};

window.startGame = function() {
    gameState = gameStates.PLAYING;
    gameData.score = 0; gameData.level = 1; gameData.lives = 3; levelUpAnimation.active = false;
    player.respawnCentral(); initializeCars(); particles = [];
    document.getElementById('gameOverlay').classList.add('hidden');
    updateUI();
};

window.togglePause = function() {
    if (gameState === gameStates.PLAYING) {
        gameState = gameStates.PAUSED;
        showOverlay('Pausado', 'Pressione ESPAÇO para continuar');
    } else if (gameState === gameStates.PAUSED) {
        gameState = gameStates.PLAYING;
        document.getElementById('gameOverlay').classList.remove('hidden');
        setTimeout(function() {
            document.getElementById('gameOverlay').classList.add('hidden');
        }, 100);
    }
};

window.gameOver = function() {
    gameState = gameStates.GAME_OVER;
    if (gameData.score > gameData.highScore) {
        gameData.highScore = gameData.score;
        saveHighScore();
    }
    showOverlay('Game Over!', 'Pontuação: ' + gameData.score + '\nRecorde: ' + gameData.highScore);
    updateUI();
};

window.toggleSound = function() {
    gameData.soundEnabled = !gameData.soundEnabled;
    var button = document.getElementById('muteButton');
    button.textContent = gameData.soundEnabled ? '🔊 Som' : '🔇 Mudo';
};

window.loadHighScore = function() {
    var saved = localStorage.getItem('roadCrossingHighScore');
    if (saved) gameData.highScore = parseInt(saved);
};

window.saveHighScore = function() {
    localStorage.setItem('roadCrossingHighScore', gameData.highScore.toString());
};

// Previne o comportamento padrão das setas
window.addEventListener('keydown', function(e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();
}, false);

// --- RESPONSIVIDADE E CONTROLES TOUCH --- //

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Esconde instrução de teclas no mobile (UX extra)
function hideDesktopControlsOnMobile() {
    var controls = document.getElementById('controls');
    if (controls) controls.style.display = isMobile() ? 'none' : '';
}

// Cria listeners de touch para os botões
function setupTouchControls() {
    var touchControls = document.getElementById('touchControls');
    if (!touchControls) return;

    if (isMobile()) {
        touchControls.style.display = 'flex';
        hideDesktopControlsOnMobile();

        // Mapeamento de botões para teclas
        var keyMap = {
            touchUp: 38,
            touchDown: 40,
            touchLeft: 37,
            touchRight: 39
        };
        Object.keys(keyMap).forEach(function(btnId) {
            var btn = document.getElementById(btnId);
            if (btn) {
                btn.ontouchstart = function(e) {
                    e.preventDefault();
                    simulateKeyDown(keyMap[btnId]);
                };
                btn.ontouchend = function(e) {
                    e.preventDefault();
                    simulateKeyUp(keyMap[btnId]);
                };
            }
        });
        // Pause
        var btnPause = document.getElementById('touchPause');
        if (btnPause) {
            btnPause.ontouchstart = function(e) {
                e.preventDefault();
                window.togglePause && window.togglePause();
            }
        }
    } else {
        touchControls.style.display = 'none';
        hideDesktopControlsOnMobile();
    }
}
function simulateKeyDown(keyCode) {
    var evt = new KeyboardEvent('keydown', { keyCode: keyCode, which: keyCode });
    window.dispatchEvent(evt);
}
function simulateKeyUp(keyCode) {
    var evt = new KeyboardEvent('keyup', { keyCode: keyCode, which: keyCode });
    window.dispatchEvent(evt);
}

// Inicializa os controles touch e responsividade ao carregar ou redimensionar
window.addEventListener('load', setupTouchControls);
window.addEventListener('resize', setupTouchControls);
