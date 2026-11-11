# E-book "Tráfego Pago na Prática" — anúncio em motion (9:16, 26 s)

- Gancho: "Pare de anunciar no escuro." + preço R$ 34,39 logo no começo.
- Livro 3D com a capa real, sumário real com os 8 capítulos e 6 páginas reais do e-book (caps. 01, 04, 04, 05, 07, 08), para ninguém comprar no escuro.
- Chamada: preço de novo + botão "Garanta o seu" + logo Seven.
- Trilha: `proj/trilha.py` (lê `proj/trilha.json`). Render: `render.sh proj entrega/ebook-trafego-pago-9x16.mp4 high`.

## Versão com locução (47,5 s)
- Voz "Lotus - Educacional e Cativante" (ElevenLabs, eleven_v4), tomada 2 em `locucao/take2.mp3`.
- Falas recortadas em `proj/assets/falas/` com `tempos.json`; mix com ducking: `python3 mixa_voz.py` → `assets/trilha-com-voz.wav`.
- Cenas retimadas para a voz: gancho 0–7,6 · livro 7,6–15 · sumário 15–24 · destaques 24–38,2 · chamada 38,2–47,5.
