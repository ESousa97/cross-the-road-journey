const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

const p5Globals = {
    createCanvas: 'readonly',
    resizeCanvas: 'readonly',
    background: 'readonly',
    fill: 'readonly',
    rect: 'readonly',
    random: 'readonly',
    color: 'readonly',
    ellipse: 'readonly',
    push: 'readonly',
    pop: 'readonly',
    stroke: 'readonly',
    strokeWeight: 'readonly',
    rectMode: 'readonly',
    textAlign: 'readonly',
    textSize: 'readonly',
    text: 'readonly',
    map: 'readonly',
    constrain: 'readonly',
    line: 'readonly',
    noStroke: 'readonly',
    textWidth: 'readonly',
    frameCount: 'readonly',
    tint: 'readonly',
    noTint: 'readonly',
    triangle: 'readonly',
    dist: 'readonly',
    red: 'readonly',
    green: 'readonly',
    blue: 'readonly',
    TWO_PI: 'readonly',
    cos: 'readonly',
    sin: 'readonly',
    beginShape: 'readonly',
    vertex: 'readonly',
    endShape: 'readonly',
    CLOSE: 'readonly',
    translate: 'readonly',
    rotate: 'readonly',
    scale: 'readonly',
    CENTER: 'readonly',
    LEFT: 'readonly',
    ENTER: 'readonly',
    key: 'readonly',
    keyCode: 'readonly',
    keyIsDown: 'readonly',
    UP_ARROW: 'readonly',
    DOWN_ARROW: 'readonly',
    LEFT_ARROW: 'readonly',
    RIGHT_ARROW: 'readonly'
};

module.exports = [
    {
        ignores: ['dist', 'node_modules']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...p5Globals
            }
        },
        plugins: {
            import: importPlugin
        },
        rules: {
            'import/no-unresolved': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-undef': 'error'
        }
    },
    {
        files: ['**/*.test.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly'
            }
        }
    }
];
