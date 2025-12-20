import { gameConfig } from '../config/gameConfig.js';

export class Player {
    constructor(x, y, dependencies) {
        this.x = x;
        this.y = y;
        this.size = gameConfig.player.size;
        this.speed = gameConfig.player.speed;
        this.color = color(255, 100, 100);
        this.trail = [];
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.lastPosition = { x, y };
        this.dependencies = dependencies;
    }

    update() {
        this.handleInput();
        this.updateTrail();
        this.updateInvulnerability();
        this.checkBounds();
        this.checkGoal();
        this.checkOutOfBounds();
    }

    handleInput() {
        if (this.dependencies.isPlaying() === false) return;
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.speed;
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.speed;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.speed;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.speed;
    }

    updateTrail() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > gameConfig.player.trailLength) this.trail.shift();
    }

    updateInvulnerability() {
        if (this.invulnerable) {
            this.invulnerableTime -= 1;
            if (this.invulnerableTime <= 0) this.invulnerable = false;
        }
    }

    checkBounds() {
        this.y = constrain(this.y, 0, this.dependencies.getCanvasHeight() - this.size);
        this.x = constrain(this.x, this.size / 2, this.dependencies.getCanvasWidth() - this.size / 2);
    }

    checkOutOfBounds() {
        if (
            this.x < -this.size ||
            this.x > this.dependencies.getCanvasWidth() + this.size ||
            this.y < -this.size ||
            this.y > this.dependencies.getCanvasHeight() + this.size
        ) {
            this.respawnCentral();
        }
    }

    checkGoal() {
        if (this.y <= 30) {
            this.respawnRandom();
            if (this.dependencies.onGoal) this.dependencies.onGoal();
        }
    }

    respawnCentral() {
        this.x = this.dependencies.getCanvasWidth() / 2;
        this.y = this.dependencies.getCanvasHeight() - 35;
        this.invulnerable = true;
        this.invulnerableTime = gameConfig.player.invulnerableFrames;
        this.lastPosition = { x: this.x, y: this.y };
    }

    respawnRandom() {
        const positions = [
            { x: 100, y: this.dependencies.getCanvasHeight() - 35 },
            { x: this.dependencies.getCanvasWidth() / 4, y: this.dependencies.getCanvasHeight() - 35 },
            { x: this.dependencies.getCanvasWidth() / 2, y: this.dependencies.getCanvasHeight() - 35 },
            { x: (this.dependencies.getCanvasWidth() * 3) / 4, y: this.dependencies.getCanvasHeight() - 35 },
            { x: this.dependencies.getCanvasWidth() - 100, y: this.dependencies.getCanvasHeight() - 35 }
        ];
        const randomPos = random(positions);
        this.x = randomPos.x;
        this.y = randomPos.y;
        this.invulnerable = true;
        this.invulnerableTime = gameConfig.player.invulnerableFrames;
        this.lastPosition = { x: this.x, y: this.y };
    }

    draw() {
        push();
        for (let i = 0; i < this.trail.length; i += 1) {
            const alpha = map(i, 0, this.trail.length, 0, 100);
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
            triangle(this.x, this.y - this.size / 2 - 5, this.x - 5, this.y - this.size / 2, this.x + 5, this.y - this.size / 2);
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
            triangle(this.x, this.y + this.size / 2 + 5, this.x - 5, this.y + this.size / 2, this.x + 5, this.y + this.size / 2);
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
            triangle(this.x - this.size / 2 - 5, this.y, this.x - this.size / 2, this.y - 5, this.x - this.size / 2, this.y + 5);
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
            triangle(this.x + this.size / 2 + 5, this.y, this.x + this.size / 2, this.y - 5, this.x + this.size / 2, this.y + 5);
        noTint();
        pop();
    }

    checkCollision(car) {
        if (this.invulnerable) return false;
        const distance = dist(this.x, this.y, car.x + car.width / 2, car.y + car.height / 2);
        return distance < this.size / 2 + car.width / 2;
    }

    hit() {
        if (this.invulnerable) return false;
        this.respawnRandom();
        if (this.dependencies.onHit) this.dependencies.onHit();
        return true;
    }
}
