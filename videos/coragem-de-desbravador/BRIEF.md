# Coragem de Desbravador

- Estilo: `escala-em-blocos` (mundo 3D de blocos, legenda gorda com uma palavra em destaque, chip de versículo, contador em card branco, corte seco).
- Formato: 1080 × 1920 (9:16), 30 qps, ~130 s, sem loop, com voz.
- Personagens: Jesus e o Desbravador (`personagens.js`), lado a lado à beira do lago ao entardecer.
- Voz: sintetizada localmente (Kokoro, pt-br): Jesus = `pm_alex` (0,95x), Desbravador = `pf_dora` (1,08x); as duas aceleradas 1,08x sem mudar o tom. Substituível por vozes gravadas: os tempos saem de `voz/fNN.wav` (rode `montar.py` de novo).
- Roteiro: o texto da pessoa, palavra por palavra (`falas.json`). Na tela, "Salmo vinte e três" vira "Salmo 23".
- Paleta: céu tarde #557da0 → #6b8c9f → #c9a888 · noite #141a33 → #5b4b70 · tempestade #333e48 → #6a7378 · grama #6c8544 · lago #6f8fa3 · destaque #f4b24f (palavra) / #d55423 (número) · cards #f5f6f2.
- Fontes: Nunito 800/900 (legenda, chips), Anton (versículo grande e fim).

## Cenas (tempo da voz)
| Cena | Falas | O que se vê |
|---|---|---|
| 1 Abertura | 1–6 | Desbravador chega correndo e ofegante; closes alternados; chips "tempestade no barco / multidão no monte"; contador **3 medos** com escuro, altura, longe de casa; Desbravador cabisbaixo |
| 2 Jesus também sentiu | 7–11 | Getsêmani à noite, Jesus ajoelhado entre oliveiras (Lc 22:42); pulinho de surpresa; faixa amarela "CORAGEM É SENTIR MEDO E CONFIAR" |
| 3 A tempestade | 12–16 | os dois se viram e Jesus aponta o lago; barco com discípulos nas ondas (Mc 4:39-40); **corte seco para a calmaria em "parar"** (o soco do filme) |
| 4 Pedro sobre as águas | 17–20 | Pedro anda até Jesus, afunda quando o vento sobe, Jesus estende a mão (Mt 14:29-31); "Olhe para mim" com a câmera chegando perto |
| 5 As promessas | 21–25 | card grande "Seja forte e corajoso" (Js 1:9); contador **3** poder / amor / equilíbrio (2Tm 1:7); o Desbravador conta nos dedos; distintivo "Especialidade: Coragem" |
| 6 Vida de desbravador | 26–30 | acampamento à noite com barraca e fogueira (Sl 23:4); trilha de degraus (Fp 4:13); close no lenço amarelo |
| 7 Encerramento | 31–33 | continência com o peito estufado; mão de Jesus no ombro; "O amor de Cristo me motiva!" olhando para a câmera; fim "Seja forte e corajoso." Josué 1:9 |

## Proibições (sempre)
Sem crossfade, sem brilho/bloom, sem textura realista, no máximo uma cor de destaque, legenda de até 6 palavras, nada do mascote, roteiro ou @ da referência.

## Como refazer
1. Vozes: `bash gerar.sh` (gera `voz/fNN.wav` com o Kokoro do HyperFrames; precisa de `pip install kokoro-onnx soundfile`). Nesta versão as vozes geradas foram aceleradas 1,08x com `ffmpeg -af atempo=1.08`. Para trocar por vozes gravadas, salve cada fala como `voz/fNN.wav`.
2. Tempos: `python3 montar.py` (escreve `proj/tempos.js` e `proj/media/voz.wav`; troque o `data-duration` do `proj/index.html` pela duração impressa).
3. Render: `bash ../../scripts/render.sh proj out/final-mudo.mp4 high` e junte a voz:
   `ffmpeg -i out/final-mudo.mp4 -i proj/media/voz.wav -c:v copy -c:a aac -b:a 160k -af loudnorm=I=-16:TP=-1.5 -shortest out/final.mp4`
