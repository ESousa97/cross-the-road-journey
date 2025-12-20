export const levelUpAnimation = {
    active: false,
    timer: 0,
    duration: 180,
    scale: 1,
    alpha: 255,
    stars: []
};

export function triggerLevelUpAnimation(canvasWidth, canvasHeight) {
    levelUpAnimation.active = true;
    levelUpAnimation.timer = 0;
    levelUpAnimation.scale = 0.5;
    levelUpAnimation.alpha = 255;
    levelUpAnimation.stars = [];
    for (let i = 0; i < 12; i += 1) {
        levelUpAnimation.stars.push({
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            vx: random(-8, 8),
            vy: random(-8, 8),
            rotation: 0,
            rotSpeed: random(-0.3, 0.3),
            size: random(8, 16)
        });
    }
}

export function drawLevelUpAnimation(canvasWidth, canvasHeight, level) {
    if (!levelUpAnimation.active) return;
    levelUpAnimation.timer += 1;
    if (levelUpAnimation.timer < 30)
        levelUpAnimation.scale = map(levelUpAnimation.timer, 0, 30, 0.5, 1.2);
    else if (levelUpAnimation.timer < 60)
        levelUpAnimation.scale = map(levelUpAnimation.timer, 30, 60, 1.2, 1.0);
    if (levelUpAnimation.timer > 120)
        levelUpAnimation.alpha = map(levelUpAnimation.timer, 120, levelUpAnimation.duration, 255, 0);

    for (let i = 0; i < levelUpAnimation.stars.length; i += 1) {
        const star = levelUpAnimation.stars[i];
        star.x += star.vx;
        star.y += star.vy;
        star.rotation += star.rotSpeed;
        star.vx *= 0.95;
        star.vy *= 0.95;
        push();
        translate(star.x, star.y);
        rotate(star.rotation);
        fill(255, 255, 0, levelUpAnimation.alpha * 0.8);
        stroke(255, 255, 255, levelUpAnimation.alpha);
        strokeWeight(2);
        drawStar(0, 0, star.size * 0.5, star.size, 5);
        pop();
    }
    push();
    fill(0, 0, 0, 100);
    rect(0, 0, canvasWidth, canvasHeight);
    pop();
    push();
    translate(canvasWidth / 2, canvasHeight / 2 - 30);
    scale(levelUpAnimation.scale);
    fill(0, 0, 0, levelUpAnimation.alpha * 0.5);
    textAlign(CENTER);
    textSize(32);
    text(`NIVEL ${level}!`, 3, 3);
    fill(255, 215, 0, levelUpAnimation.alpha);
    text(`NIVEL ${level}!`, 0, 0);
    textSize(16);
    fill(255, 255, 255, levelUpAnimation.alpha);
    const messages = [
        'Nova faixa desbloqueada!',
        'Velocidade aumentada!',
        'Carros rapidos liberados!',
        'Trafego mais intenso!',
        'Meio caminho percorrido!',
        'Velocidade maxima!',
        'Trafego caotico!',
        'Quase no limite!',
        'Faixa 10 desbloqueada!',
        'Penultima faixa!',
        '🏆 TODAS AS FAIXAS! 🏆',
        'MODO INSANO ATIVADO!',
        'VELOCIDADE LUDICROUS!',
        'MESTRE DAS ESTRADAS!'
    ];
    const msg = messages[Math.min(level - 2, messages.length - 1)];
    text(msg, 0, 35);
    if (level <= 12) {
        const progressWidth = 200;
        const progressHeight = 8;
        const progress = (level - 1) / 11;
        fill(100, 100, 100, levelUpAnimation.alpha);
        rect(-progressWidth / 2, 55, progressWidth, progressHeight, 4);
        fill(0, 255, 100, levelUpAnimation.alpha);
        rect(-progressWidth / 2, 55, progressWidth * progress, progressHeight, 4);
        textSize(12);
        fill(255, 255, 255, levelUpAnimation.alpha);
        if (level < 12) text(`${Math.round(progress * 100)}% ate todas as faixas`, 0, 75);
        else text('🏆 TODAS AS FAIXAS DESBLOQUEADAS! 🏆', 0, 75);
    }
    pop();
    if (levelUpAnimation.timer >= levelUpAnimation.duration) levelUpAnimation.active = false;
}

export function drawStar(x, y, radius1, radius2, npoints) {
    const angle = TWO_PI / npoints;
    const halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
