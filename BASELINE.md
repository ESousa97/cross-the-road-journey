# Baseline

## Inventario atual
- Linguagem: JavaScript (ES5/ES6 misto) + HTML5 + CSS3
- Frameworks/libs: p5.js (1.5.0 via CDN) e p5.sound (CDN)
- Gerenciador de dependencias: inexistente (uso direto via CDN)
- Runtime alvo: navegador moderno (desktop e mobile)
- Tipo de projeto: jogo web (front-end estatico)
- Estrutura: raiz com `index.html`, `css/style.css`, `js/*.js`, `video/`
- Entrypoint: `index.html` carrega p5 e scripts em ordem; loop principal em `js/main.js`
- Como executar hoje: servir `index.html` por um servidor estatico (ex.: `python -m http.server 8000` ou extensao Live Server)

## Estado de qualidade (build/test/lint)
- Build: nao aplicavel (sem bundler). Status: nao automatizado.
- Lint: inexistente. Status: nao executado.
- Testes: inexistentes. Status: nao executado.

## Principais riscos tecnicos
- Ausencia total de automacao (lint/test/CI) torna a qualidade nao verificavel.
- Codigo global (objetos no `window`) favorece colisao de nomes e dificulta manutencao.
- Sem gerenciamento de dependencias ou versionamento de libs (CDN fixa); risco de indisponibilidade.
- Sem estrategia de assets/build; performance e cache nao otimizados.
- Sem politicas de seguranca (headers/Content Security Policy) e sem configuracao de infra.
- Documentacao desatualizada para padroes A+ e sem guias de contribuicao/governanca.

## Proximas etapas
1. Organizar estrutura e padroes do repo (.editorconfig, .gitignore, .gitattributes, .github/ workflows/templates).
2. Introduzir toolchain web padrao (Node/npm), scripts, linter/formatter, testes basicos p5 mock.
3. Refatorar codigo para modulos claros, reduzir globais, melhorar legibilidade e robustez.
4. Reescrever documentacao de ponta a ponta (README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, docs/).
5. Configurar CI/CD (lint/test/build), dependabot e convencoes de commit.
6. Gerar relatorio final com riscos remanescentes e validacao.
