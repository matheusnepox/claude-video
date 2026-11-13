# A força de Sansão (Desbravador e Jesus, episódio 2)

- Estilo: `escala-em-blocos`, 1080 × 1920 (9:16), 30 qps, ~2 min 44 s, com voz e trilha.
- Personagens v2 (`proj/personagens.js`): blocos de cantos arredondados (como a referência), braços com cotovelo
  (muque, continência, mão no queixo, rezar, mão no ombro), sobrancelhas, olhos que arregalam, boca pela voz.
  Novos: Sansão com sete tranças (`pessoa({cabeloEstilo:'trancas'})`), Dalila, o leão.
- Vozes: ElevenLabs `eleven_v4`, Jesus = Roberto Valença (`bZztR6P62TDbe6sgaZgz`), Desbravador = Filipe (`mQTtm28IjDcoO2sbXmov`).
  `gerar_eleven.py` gera cada fala com o tempo de cada caractere; `conferir.py` transcreve de volta e compara com o roteiro.
- Trilha: ElevenLabs Music (`trilha.py`), instrumental, com o arco da história; abaixa sozinha sob a voz (sidechain).
- Fundo desfocado nos closes: dois canvas (fundo com blur em CSS, personagens nítidos por cima).

## Cenas
| Cena | Falas | O que se vê |
|---|---|---|
| 1 | 1–3 | Desbravador chega correndo e faz muque; Jesus ri; "do cabelo, ué!" |
| 2 | 4–7 | Deserto: Sansão nazireu (Jz 13:5); o leão salta e Sansão vence (Jz 14:6); faixa "A FORÇA ERA DE DEUS" |
| 3 | 8–13 | Casa de Dalila à noite; contador 1ª, 2ª, 3ª, 4ª vez (Jz 16:17); as tranças caem (Jz 16:20); faixa "O PECADO COMEÇA PEQUENO" |
| 4 | 14–17 | Moinho, o cabelo volta a crescer (Jz 16:22); templo: a oração (Jz 16:28) e **as colunas desabam em "respondeu"** |
| 5 | 18–19 | Faixa "COM DEUS DÁ PRA RECOMEÇAR" |
| 6 | 20–24 | Contador 3 jeitos de ser forte; card do Voto do Desbravador; continência |
| 7 | 25–27 | Muque duplo; distintivo "Músculo da fé"; fim "A minha força vem do Senhor" (Salmo 28:7) |
