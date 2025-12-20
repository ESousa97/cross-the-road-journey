import { gameConfig } from '../config/gameConfig.js';

export class Particle {
    constructor(x, y, colorValue) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-3, 3);
        this.life = gameConfig.particles.life;
        this.maxLife = gameConfig.particles.life;
        this.color = colorValue;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw() {
        push();
        const alpha = map(this.life, 0, this.maxLife, 0, 255);
        fill(red(this.color), green(this.color), blue(this.color), alpha);
        noStroke();
        ellipse(this.x, this.y, 6);
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
}
