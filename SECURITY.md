# Politica de Segurança

## Versoes suportadas
- `main` (ativa): correcoes de seguranca serao priorizadas.
- Versoes antigas nao recebem correcoes retroativas.

## Como reportar
1. Nao abra issues publicas com detalhes tecnicos.
2. Envie um email para o mantenedor (listado no perfil do repo) com:
   - Descricao clara da vulnerabilidade e impacto.
   - Passos para reproduzir (se possivel, gravação ou logs).
   - Ambiente (SO, navegador, versao do repo).
3. Aguarde confirmacao (SLR: 5 dias uteis). Manteremos voce informado sobre o andamento e correcao.

## Escopo tipico
- XSS/CSRF em interacoes do jogo.
- Quebra de sandbox ou execucao de codigo arbitrario.
- Exposicao de dados sensiveis (pouco provavel em jogo estatico, mas possivel via deps).

## Fora de escopo
- Problemas ja conhecidos ou sem impacto pratico.
- Recomendacoes genericas sem PoC.

Obrigado por manter o projeto seguro!
