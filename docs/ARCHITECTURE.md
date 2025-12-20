# Arquitetura do Cross the Road Journey

## Visao geral
- Front-end estatico entregue via Vite (build em `dist/`).
- Loop de jogo em p5.js (modo global), com funcoes `setup/draw/keyPressed` registradas a partir de `src/main.js`.
- Estado centralizado em `src/state/gameState.js` (dados + controle de estado corrente).
- Configuracoes e constantes em `src/config/gameConfig.js`.
- Logica pura (testavel) em `src/core/progression.js` para calculos de pontos/level.

## Fluxo de inicializacao
1. `index.html` carrega p5.js via CDN e o bundle `src/main.js` (Vite).
2. `setup()` calcula dimensoes responsivas, cria canvas, instancia `Player`, `Car`s e carrega recorde.
3. Eventos de UI (`start`, `mute`, resize, touch) sao amarrados.
4. `draw()` roda a cada frame: atualiza jogador, carros, particulas, UI e animacoes.

## Componentes principais
- `Player`: movimento, colisao, respawn. Recebe callbacks `onGoal` e `onHit` para notificar o orquestrador.
- `Car`: entidade com direcao, trilha e velocidade escalavel por nivel.
- `Particle`: particulas visuais em colisao/objetivo.
- `laneSystem`: calcula faixas ativas e distribuicao vertical com margens dinamicas.
- `progression`: regras de pontuacao, thresholds de level e desbloqueio de faixas.
- `levelUp` animation: desenha estrelas e banner com progresso.
- `ui`: atualiza placares e overlays.

## Estados
- `gameStates`: `MENU`, `PLAYING`, `PAUSED`, `GAME_OVER`.
- `gameData`: `score`, `highScore`, `level`, `lives`, `soundEnabled`.
- Transicoes: `startGame` -> PLAYING; `togglePause` -> PAUSED/PLAYING; `gameOver` -> GAME_OVER.

## Tamanho do canvas e responsividade
- `calculateResponsiveSize()` considera `safe-area` e barra de navegacao mobile para definir `canvasWidth` e `canvasHeight`.
- UI fixa com `#gameUI` e `#gameOverlay`; controles touch aparecem apenas em mobile (detector por user-agent).

## Persistencia
- Recorde armazenado em `localStorage` usando chave de `gameConfig.storage.highScoreKey`.

## Extensoes futuras
- Plugar audio: encapsular em `src/systems/audio.js` para respeitar `soundEnabled`.
- Ranking online: adicionar cliente HTTP e sincronizar recorde.
- Skins/temas: introduzir `theme` no `gameConfig` e toggles na UI.
