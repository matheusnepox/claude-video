# Ótica Losiq — antes e depois da fachada (cobertura da inauguração)

Vertical 1080 × 1920, 34,9 s, 30 fps, H.264 + AAC (−15,5 LUFS). Trilha original sintetizada em `proj/trilha.py`.

| Tempo | Tomada |
|---|---|
| 0–5,85 s | ANTES: a rua com a fachada antiga e a placa antiga de baixo (cor mais fria e contida) |
| 5,85 s | Cortina diagonal com um fio branco (na inclinação do 7 da Seven) |
| 5,85–9,75 s | DEPOIS: a fachada nova da Ótica Losiq |
| 9,75–14,3 s | Comparativo: antes em cima, depois embaixo |
| 14,3–28,6 s | Detalhes: letreiro de perto e de lado, entrada, balões da inauguração, chegada |
| 28,6–34,9 s | Plano aberto, "Uma nova fachada. Um novo começo." e a assinatura SEVEN · Cobertura da inauguração |

- `ferramentas/tomadas.py` corta, estabiliza (vidstab), amplia e corrige a cor de cada tomada a partir dos vídeos brutos (`brutos/`, fora do git).
- `proj/index.html` tem a ordem e o tempo das tomadas; `proj/js/edicao.js`, os textos, transições e o fecho.
- Renderizar: `cd proj && npx hyperframes@0.8.181 render . -o ../entrega/otica-losiq-antes-depois.mp4 -q high`
