// particle.js
window.Particle = function(x, y, colorValue) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.life = 60;
    this.maxLife = 60;
    this.color = colorValue;

    this.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.vx *= 0.98;
        this.vy *= 0.98;
    };

    this.draw = function() {
        push();
        var alpha = map(this.life, 0, this.maxLife, 0, 255);
        fill(red(this.color), green(this.color), blue(this.color), alpha);
        noStroke();
        ellipse(this.x, this.y, 6);
        pop();
    };

    this.isDead = function() {
        return this.life <= 0;
    };
};
