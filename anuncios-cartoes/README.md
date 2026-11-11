# Anúncios — Cartões de visita (Seven)

Oferta: 1.000 unidades 9 x 5 cm · 4x0 R$ 99,90 · 4x1 R$ 119,90 · 4x4 R$ 129,90 · Verniz local 4x4 R$ 189,90 · cantos arredondados + R$ 10,00 · entrega em até 7 dias úteis · arte grátis · entrega grátis em Cariacica, Vila Velha, Vitória e alguns bairros da Serra. Destino: WhatsApp.

| Peça | Arquivo |
|---|---|
| Vídeo 1 — Cartão em destaque (motion de produto, 29 s) | `entrega/anuncio-cartoes-v1-produto-9x16.mp4` |
| Vídeo 2 — Feito aqui no ES (papel recortado, 28 s) | `entrega/anuncio-cartoes-v2-papel-9x16.mp4` (e `-leve`) |
| Estático A (oferta) e B (tabela), feed 4:5 e stories 9:16 | `estaticos/png/estatico-*.png` |
| Carrossel 6 cards 4:5 | `estaticos/png/carrossel-*.png` |

- Locução: ElevenLabs, voz "Lotus – Educacional e Cativante", modelo eleven_v4 (`locucao/`). `ferramentas/falas.py` recorta as falas, acelera 7 % e monta a linha do tempo.
- Trilha: house-pop 120 BPM sintetizado (`*/proj/trilha.py`, cortes em `trilha.json`); `mixa_voz.py` mixa voz + trilha com ducking.
- Estáticos: `estaticos/estaticos.html` (fotografado com Playwright).
- Copy aprovada no Google Drive: SEVEN — Tráfego (criativos) / 01 — Cartões de visita.
