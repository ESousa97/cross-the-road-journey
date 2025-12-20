# Contribuindo para o Cross the Road Journey

Obrigado por querer ajudar! Siga as orientacoes abaixo para manter o padrao do projeto.

## Fluxo de trabalho
1. **Fork** e crie uma branch a partir de `main` (`feature/nome-curto`, `fix/bug-xyz`).
2. Garanta que `npm install` foi executado.
3. Rodar qualidade local antes do PR:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
4. Abra o PR usando o template e descreva:
   - O que mudou e por que.
   - Como validar (comandos e passos).
   - Screenshots/GIFs se a mudança for visual.

## Padrao de commits
- Use **Conventional Commits**: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `refactor: ...`.
- Commits devem ser pequenos e coesos.

## Estilo de codigo
- JavaScript: ESLint + Prettier (rodados no pre-commit via Husky).
- CSS: Stylelint.
- Evite globais; prefira injecao de dependencias e funcoes puras para logica.

## Testes
- Vitest com jsdom. Adicione testes sempre que alterar logica.
- `npm run test:watch` ajuda em TDD.

## Reportando bugs
Abra issue com:
- Passos para reproduzir
- Resultado esperado x obtido
- Ambiente (SO, browser, resolucao)

## Sugestoes de features
Descreva o problema/motivacao e impacto esperado. Propostas bem definidas sao mais provaveis de serem aceitas.

## Segurança
Nao abra PR com detalhes de vulnerabilidades. Siga [SECURITY.md](SECURITY.md) para reportar.
