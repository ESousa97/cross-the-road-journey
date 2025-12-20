# Guia de desenvolvimento

## Ambiente
- Node.js 18+ e npm.
- Instale deps: `npm install`.
- Execucao local: `npm run dev` (Vite). Preview de build: `npm run preview`.

## Padroes
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:` etc.).
- Estilo: ESLint + Prettier (JavaScript), Stylelint (CSS).
- Hooks: Husky roda lint+test no pre-commit.

## Scripts uteis
- `npm run lint:js` / `lint:css` — verificacoes separadas.
- `npm run test:watch` — TDD rapido com Vitest.
- `npm run format` — aplica Prettier no repo.
- `npm run check` — lint + test (usado na CI).

## Estrutura resumida
```
index.html
src/
  config/       # constantes
  state/        # estado e persistencia
  core/         # funcoes puras
  entities/     # Player, Car, Particle
  systems/      # pistas, trafego
  animations/   # level up
  ui/           # overlays
  main.js       # orquestrador p5
```

## Fluxo para PRs
1. Abra branch a partir de `main`.
2. Rode `npm run check` antes de subir.
3. Garanta cobertura para nova logica (Vitest).
4. Abra PR preenchendo template, descrevendo testes.

## Dicas para contribuicao
- Prefira funcoes puras em `core/` para logica que pode ser testada sem p5.
- Evite adicionar globais; injete dependencias no construtor das entidades.
- Atualize `CHANGELOG.md` ao alterar comportamento publico.
