# Projeto de fachada — Floricultura Renascer (apresentação SEVEN)

Vertical 1080 × 1920, 34 s, 30 fps, H.264 + AAC (−15,6 LUFS). Trilha original sintetizada em `proj/trilha.py`.

| Tempo | Cena |
|---|---|
| 0–3 s | Abertura: símbolo Seven, "Projeto de fachada · Floricultura Renascer · 3,95 m × 4,3 m" |
| 3–7 s | ANTES: foto da fachada atual |
| 7,3–14 s | O PROJETO: o desenho técnico se desenha traço a traço, as cotas contam até 3,95 m e 4,3 m e as áreas de adesivo acendem |
| 14–17 s | O traço viaja até a fachada na foto e a fachada pronta preenche o desenho |
| 17–20 s | DEPOIS (imagem ilustrativa do projeto) |
| 20–24,5 s | Comparação antes × depois com divisor deslizante |
| 24,8–28,5 s | Detalhes: logo na faixa superior, adesivos florais nos pilares |
| 28,5–34 s | Assinatura: Floricultura Renascer · Projeto de fachada · SEVEN |

- O desenho técnico foi refeito em vetor a partir do arquivo enviado (`proj/js/projeto.js`), com as mesmas medidas e posições.
- Textos e tempos: `proj/js/roteiro.js`. Se mudar um tempo, copie para o `T = dict(...)` em `proj/trilha.py` e rode `python3 trilha.py`.
- Renderizar: `cd proj && npx hyperframes@0.8.181 render . -o ../entrega/seven-projeto-fachada-renascer.mp4 -q high`
