// player.js
window.Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.speed = 4;
    this.color = color(255, 100, 100);
    this.trail = [];
    this.invulnerable = false;
    this.invulnerableTime = 0;
    this.lastPosition = { x: x, y: y };

    this.update = function() {
        this.handleInput();
        this.updateTrail();
        this.updateInvulnerability();
        this.checkBounds();
        this.checkGoal();
        this.checkOutOfBounds();
    };

    this.handleInput = function() {
        if (gameState !== gameStates.PLAYING) return;
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.speed;
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.speed;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.speed;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.speed;
    };

    this.updateTrail = function() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();
    };

    this.updateInvulnerability = function() {
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) this.invulnerable = false;
        }
    };

    this.checkBounds = function() {
        this.y = constrain(this.y, 0, canvasHeight - this.size);
        this.x = constrain(this.x, this.size/2, canvasWidth - this.size/2);
    };

    this.checkOutOfBounds = function() {
        if (this.x < -this.size || this.x > canvasWidth + this.size ||
            this.y < -this.size || this.y > canvasHeight + this.size) {
            this.respawnCentral();
        }
    };

    this.checkGoal = function() {
        if (this.y <= 30) {
            this.respawnRandom();
            gameData.score += 10 * gameData.level;
            updateUI();
            createParticles(this.x, this.y, color(0, 255, 0));
            if (gameData.score > 0 && gameData.score % 50 === 0) {
                var oldLevel = gameData.level;
                gameData.level++;
                if (gameData.level > oldLevel) triggerLevelUpAnimation();
                updateCarsForNewLevel();
            }
        }
    };

    this.respawnCentral = function() {
        this.x = canvasWidth / 2;
        this.y = canvasHeight - 35;
        this.invulnerable = true;
        this.invulnerableTime = 60;
        this.lastPosition = { x: this.x, y: this.y };
    };

    this.respawnRandom = function() {
        var randomPositions = [
            { x: 100, y: canvasHeight - 35 },
            { x: canvasWidth / 4, y: canvasHeight - 35 },
            { x: canvasWidth / 2, y: canvasHeight - 35 },
            { x: (canvasWidth * 3) / 4, y: canvasHeight - 35 },
            { x: canvasWidth - 100, y: canvasHeight - 35 }
        ];
        var randomPos = random(randomPositions);
        this.x = randomPos.x;
        this.y = randomPos.y;
        this.invulnerable = true;
        this.invulnerableTime = 60;
        this.lastPosition = { x: this.x, y: this.y };
    };

    this.draw = function() {
        push();
        for (var i = 0; i < this.trail.length; i++) {
            var alpha = map(i, 0, this.trail.length, 0, 100);
            fill(red(this.color), green(this.color), blue(this.color), alpha);
            noStroke();
            ellipse(this.trail[i].x, this.trail[i].y, this.size * 0.7);
        }
        if (this.invulnerable && frameCount % 10 < 5) tint(255, 150);
        else noTint();
        fill(this.color);
        stroke(255);
        strokeWeight(2);
        ellipse(this.x, this.y, this.size);
        fill(255);
        ellipse(this.x - 5, this.y - 5, 6);
        ellipse(this.x + 5, this.y - 5, 6);
        fill(0);
        ellipse(this.x - 5, this.y - 5, 3);
        ellipse(this.x + 5, this.y - 5, 3);
        fill(255, 200);
        noStroke();
        if (keyIsDown(UP_ARROW) || keyIsDown(87))
            triangle(this.x, this.y - this.size/2 - 5, this.x - 5, this.y - this.size/2, this.x + 5, this.y - this.size/2);
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
            triangle(this.x, this.y + this.size/2 + 5, this.x - 5, this.y + this.size/2, this.x + 5, this.y + this.size/2);
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
            triangle(this.x - this.size/2 - 5, this.y, this.x - this.size/2, this.y - 5, this.x - this.size/2, this.y + 5);
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
            triangle(this.x + this.size/2 + 5, this.y, this.x + this.size/2, this.y - 5, this.x + this.size/2, this.y + 5);
        noTint();
        pop();
    };

    this.checkCollision = function(car) {
        if (this.invulnerable) return false;
        var distance = dist(this.x, this.y, car.x + car.width/2, car.y + car.height/2);
        return distance < (this.size/2 + car.width/2);
    };

    this.hit = function() {
        if (this.invulnerable) return;
        this.respawnRandom();
        gameData.lives--;
        createParticles(this.x, this.y, color(255, 0, 0));
        if (gameData.lives <= 0) gameOver();
    };
};
