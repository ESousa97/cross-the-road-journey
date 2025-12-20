import { gameConfig } from '../config/gameConfig.js';

export class Car {
    constructor(x, y, speed, carType, isFast) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 30;
        this.baseSpeed = speed;
        this.speed = speed;
        this.isFast = isFast;
        this.type = carType;
        this.direction = random() > 0.5 ? 1 : -1;
        this.trail = [];
        this.color = this.getRandomColor();

        if (this.isFast) {
            this.speed *= gameConfig.cars.fastSpeedMultiplier;
            this.baseSpeed *= gameConfig.cars.fastSpeedMultiplier;
        }
    }

    getRandomColor() {
        if (this.isFast) {
            const fastColors = [
                color(255, 0, 0),
                color(255, 100, 0),
                color(255, 0, 255),
                color(0, 255, 255),
                color(255, 255, 0)
            ];
            return random(fastColors);
        }
        const normalColors = [
            color(100, 150, 255),
            color(150, 100, 255),
            color(100, 255, 150),
            color(255, 150, 100),
            color(200, 200, 100),
            color(150, 200, 200)
        ];
        return random(normalColors);
    }

    update(canvasWidth) {
        this.x += this.speed * this.direction;
        if (this.isFast) {
            this.trail.push({ x: this.x + this.width / 2, y: this.y + this.height / 2 });
            if (this.trail.length > 8) this.trail.shift();
        }
        if (this.direction > 0 && this.x > canvasWidth + this.width) {
            this.x = -this.width;
            this.color = this.getRandomColor();
        } else if (this.direction < 0 && this.x < -this.width) {
            this.x = canvasWidth + this.width;
            this.color = this.getRandomColor();
        }
    }

    updateSpeed(levelMultiplier) {
        this.speed = this.baseSpeed * levelMultiplier;
        if (this.isFast) this.speed *= gameConfig.cars.fastSpeedMultiplier;
    }

    draw() {
        push();
        if (this.isFast && this.trail.length > 0) {
            for (let i = 0; i < this.trail.length; i += 1) {
                const alpha = map(i, 0, this.trail.length, 0, 150);
                fill(red(this.color), green(this.color), blue(this.color), alpha);
                noStroke();
                ellipse(this.trail[i].x, this.trail[i].y, 8 - i);
            }
        }
        if (this.isFast) {
            fill(255, 255, 255, 100);
            noStroke();
            rect(this.x - 2, this.y - 2, this.width + 4, this.height + 4, 7);
        }
        fill(this.color);
        stroke(this.isFast ? 255 : 50);
        strokeWeight(this.isFast ? 3 : 2);
        rect(this.x, this.y, this.width, this.height, 5);
        fill(150, 200, 255, this.isFast ? 200 : 150);
        rect(this.x + 5, this.y + 5, this.width - 10, this.height - 10, 3);
        fill(this.isFast ? color(255, 255, 0) : color(255, 255, 150));
        if (this.direction > 0) {
            ellipse(this.x + this.width - 5, this.y + 8, this.isFast ? 8 : 6);
            ellipse(this.x + this.width - 5, this.y + this.height - 8, this.isFast ? 8 : 6);
        } else {
            ellipse(this.x + 5, this.y + 8, this.isFast ? 8 : 6);
            ellipse(this.x + 5, this.y + this.height - 8, this.isFast ? 8 : 6);
        }
        fill(50);
        ellipse(this.x + 10, this.y + this.height + 3, this.isFast ? 10 : 8);
        ellipse(this.x + this.width - 10, this.y + this.height + 3, this.isFast ? 10 : 8);
        if (this.isFast) {
            fill(255, 0, 0);
            noStroke();
            ellipse(this.x + this.width / 2, this.y - 5, 6);
        }
        pop();
    }
}
