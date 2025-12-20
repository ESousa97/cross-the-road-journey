# Changelog
Todas as mudancas notaveis deste projeto serao documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) e o versionamento segue [SemVer](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-12-20
### Adicionado
- Toolchain moderna com Vite, ESLint, Stylelint, Prettier, Vitest e Husky (pre-commit).
- Testes unitarios para progressao de nivel e sistema de faixas.
- Documentacao completa (README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, docs de arquitetura e testes).
- CI base (lint/test/build) e dependabot (configurado em .github).
- Templates de issue/PR e roteiro de governanca.

### Alterado
- Reestruturacao do codigo em módulos ESM sob `src/` com separacao clara de responsabilidades.
- Novo sistema de configuracoes em `src/config/gameConfig.js` e logica pura em `src/core/progression.js`.
- UI e fluxo de jogo ajustados para integracao com Vite e build estatico.

### Removido
- Scripts legacy em `js/` e CSS em `css/` (substituidos por assets em `src/`).

[0.2.0]: https://github.com/ESousa97/cross-the-road-journey/releases
