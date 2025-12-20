# Guia de testes

## Stack
- Vitest + jsdom (configurado em `vite.config.js`).
- Cobertura via V8 (`npm run test -- --coverage` opcional).

## Como rodar
```bash
npm run test          # execucao unica
npm run test:watch    # modo watch
npm run check         # lint + test (usado na CI)
```

## Escopo de testes atuais
- `src/core/progression.test.js`: calculo de score/level e thresholds.
- `src/systems/laneSystem.test.js`: distribuicao e quantidade de faixas ativas.

## Boas praticas
- Adicione logica pura em `core/` ou funcoes utilitarias para facilitar testes sem p5.
- Mantenha testes curtos e deterministas; evite acessar DOM real.
- Se usar DOM/jsdom, prefira selecionar por ids existentes em `index.html`.

## Cobertura
Para gerar relatorio LCOV/text:
```bash
npm run test -- --coverage
```
O relatorio LCOV sera escrito em `coverage/lcov.info` (ignorado no git por padrao).
