# Reels "O que a SEVEN faz?" — versão papel recortado

Vertical 1080 × 1920, 33 s, 30 fps, H.264 + AAC (−14,5 LUFS). Mesmos tempos da versão em motion graphic (`../video-seven-servicos/`), para a locução encaixar.
Trilha própria (`proj/trilha.py`): house-pop animado a 120 BPM em lá maior, sintetizado em código.
As fotos de mockup foram trocadas por ilustrações vetoriais em papel recortado (`proj/js/ilustracoes.js`): gráfica, fachada, publicidade e embalagem, com a logo original aplicada.
Estilo: papel recortado (ficha `barco-e-montanha` / paper-world da skill), com as cores da SEVEN. Cada peça tem corte à mão, grão, filete de luz e sombra dupla; as peças pousam uma por batida e caem para fora antes da próxima página subir.
- `proj/js/papel.js`: motor de papel (corte à mão e grão portados do paper-world, licença MIT, aviso no arquivo).
- `proj/js/cena.js`: as cenas. `proj/js/roteiro.js`: textos e tempos.
- Locução: `ROTEIRO-LOCUCAO.md`.
- Renderizar: `cd proj && npx hyperframes@0.8.181 render . -o ../entrega/seven-o-que-fazemos-papel-9x16.mp4 -q high`

## Locução (ElevenLabs)
- Voz: "André - Natural excitement" (biblioteca da ElevenLabs), modelo eleven_v4, gerada pelo conector da ElevenLabs.
- `locucao/take1.mp3` (usada) e `locucao/take2.mp3` (segunda tomada).
- `proj/mixa_voz.py` corta as 7 falas, posiciona cada uma na cena, trata a voz e abaixa a música ~9 dB durante a fala → `proj/assets/trilha-com-voz.wav`.
- Vídeo com locução: `entrega/seven-o-que-fazemos-papel-locucao-9x16.mp4` (e `-leve`).
