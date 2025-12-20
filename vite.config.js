import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    server: {
        port: 4173
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    },
    test: {
        environment: 'node',
        coverage: {
            reporter: ['text', 'lcov'],
            provider: 'v8'
        }
    }
});
