# SEVEN — Reels "Sua ideia merece forma." (estilo jogo de pixel)

Vertical 1080 × 1920, 40 s, 30 fps, H.264 + AAC. Trilha chiptune original, sintetizada em `proj/trilha.py`.
A locução do roteiro aparece como fala de jogo, digitada numa caixa de diálogo com um bip a cada letra, então o vídeo funciona sem som.

| Tempo | Fase | O que acontece |
|---|---|---|
| 0–4,6 s | Título | "SUA IDEIA" cai letra a letra, a lâmpada-personagem aparece, PRESS START |
| 4,6–10,3 s | Fase 1 · Ser vista | A lâmpada anda apagada no escuro, acende e as pessoas veem ("!") |
| 10,3–20,2 s | Fase 2 · Criar | Corrida: cada bloco 7 solta um material (cartões, panfletos, adesivos, banners, fachadas, identidade visual) |
| 20,2–27,2 s | Fase 3 · Crescer | A loja SEVEN é construída fileira por fileira, a planta cresce, a barra enche, LEVEL UP! |
| 27,2–33,2 s | Fase 4 · Propósito | Amanhecer, broto crescendo, "CRIADOS PARA CRIAR." |
| 33,2–40 s | Final | Blocos montam a logo, ela fica nítida (vetor original) e aparece CHAMA NO DIRECT |

- Textos e tempos: `proj/js/roteiro.js`. Se mudar um tempo, copie para o topo de `proj/trilha.py` e rode `python3 trilha.py`.
- Sprites e paleta: `proj/js/pixel.js`. As fases ficam em `proj/js/jogo.js`.
- Para renderizar: `cd proj && npx hyperframes@0.8.181 render . -o ../entrega/seven-reels-pixel-9x16.mp4 -q high`
- Fontes: Press Start 2P e Pixelify Sans (Google Fonts, licença OFL).
