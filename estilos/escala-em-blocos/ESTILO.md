# Escala em blocos

id: escala-em-blocos
Bom para: explicação narrada para Reels/Shorts/TikTok, história (bíblica, histórica) contada com números, "quanto é isso de verdade?", comparação de tamanho e quantidade, curiosidade com contador, vídeo de canal com mascote
Clima: um mundinho de blocos ao pôr do sol, fofo e calmo, onde cada número da história vira uma quantidade que dá pra ver.
Formato: 1080 × 1920 (9:16), 30 qps, ~130 s, **com narração** (voz guia o ritmo), sem loop
Peça de partida: estilos/escala-em-blocos/projeto/index.html (6 s, cena de teste dos personagens, sem loop) + `projeto/personagens.js`
Vídeo da galeria: ainda não tem (a referência é de terceiros e não é distribuída; o tile entra quando renderizarmos a nossa primeira peça)

## Como usar esta referência
1. Ler a ficha inteira antes de desenhar. Ela é a lei da peça.
2. Copiar o **método** (mundo de blocos, número que vira quantidade, contador, legenda palavra a palavra, ritmo). Nunca o conteúdo: tema, roteiro, personagens, mascote, nome do perfil e marca d'água são da referência e não entram.
3. O companheiro do herói é o **Desbravador** (no lugar do mascote laranja da referência), sempre ao lado de Jesus. Os dois estão prontos em `projeto/personagens.js`.

## Mecanismo em uma frase
Um narrador conta uma história em frases curtas; num mundo de blocos, cada número dito vira coisa contável na tela (gente, moedas, pães, cestos) enquanto um contador sobe, e a câmera abre para mostrar a escala, sempre com o Desbravador ao lado de Jesus para dar a medida.

## Estrutura medida (referência: 131,8 s, 1080 × 1920, 30 qps, com áudio)
- **~20 cenas**, 21 cortes secos (um a cada ~6 s). Dentro de cada cena a câmera anda devagar e a legenda troca a cada 1,5 a 2 s (2 a 5 palavras).
- Arco: **gancho** (0–9 s, Jesus + Desbravador, pergunta) → **número 1** (multidão: 5.000 → 15.000, a câmera sobe de perto até a vista aérea) → **comparação com o mundo real** ("tamanho de uma cidade de 10 mil habitantes", "44,8 % das cidades do Brasil") → **diálogo** (personagens em fila, falas na legenda) → **número 2** (dinheiro: pilha de moedas, contador 139 → 200 "dias de trabalho", chip "≈ 8 meses de salário") → **número 3** (5 pães ÷ 15 mil pessoas, chip "1 pão ÷ 3.000 pessoas") → **o milagre** (pilha de pães que sobe: 1.496 → 15.000, chip "≈ 750 kg") → **sobra** (11 → 12 cestos, "antes / depois") → **virada** (fundo esvazia, céu fica cinza, o Desbravador estranha ("Ué...")) → **frase-tese** (faixa amarela fixa no topo) → **clímax** (cruz contra o sol) → **chamada** ("COMENTA: <palavra>!") → fade escuro com o @ e o ícone (~4 s).
- Fecho: CTA grande com a palavra-resposta num chip laranja, segura ~4 s, escurece para o cartão do perfil.

## Personagens (`projeto/personagens.js`, three.js r149)
- **Jesus:** túnica #ece4da, faixa vermelha #c55446 do ombro direito ao quadril esquerdo, cabelo comprido #8d5c3c, barba #7a4c30, pele #e6c6aa, sandálias #9c6941. ~5,2 unidades de altura.
- **Desbravador** (o companheiro, no papel do mascote): boné verde #28483c com faixa amarela #d2af32 e o triângulo vermelho e branco na frente; camisa cáqui #c4aa80; lenço amarelo #f0c428 em V com anel #b48c3c; distintivo azul na manga esquerda e triângulo vermelho na direita; calça e cinto verdes #26463a com fivela amarela; sapatos #221e1e; rosto com olhos pretos com brilho, sobrancelhas, bochechas rosadas #f0aa96 e sorriso. ~5 unidades de altura, cabeça grande (35 % da altura).
- Os dois ficam lado a lado (centros a 3,1 unidades), virados 0,1 rad um para o outro. Só o chão recebe sombra; os corpos não se sombreiam (acabamento de brinquedo).
- Pose a partir do tempo: `PERSONAGENS.pose(boneco, { andar, acenar, acenarFase, piscar, respirar, olhar })`. Piscar dura 0,14 s; aceno entra com back.out(1.6) em 0,35 s.

## Paleta (hex, amostrada dos quadros)
- céu dia (topo → horizonte): #2c6181 → #57748a → #968a7e
- céu pôr do sol (topo → horizonte): #664981 → #a9696a → #a07157
- céu da virada (dessaturado, sem sol): #99a1a4
- sol (disco chapado, sem raios): #fce4cc
- grama: #7b9951 (perto) · #525925 (longe, com névoa)
- cards e chips: #f5f6f2 (branco quente, opaco)
- número do contador: **#d55423 (o ÚNICO destaque)**
- palavra-chave da legenda: #f4b24f (o mesmo destaque em tom de legenda; nunca uma terceira cor)
- legenda: #fdf8fc com contorno e sombra #352725
- chip de versículo/fonte: fundo #2a2f45 a 85 %, texto branco
- túnica/terracota dos personagens: #c3644e · madeira: #5e4e3b

## Tipografia
- Legenda: Nunito 900, 54 px em 1080 de largura, tracking 0, contorno 6 px #352725 + sombra dura 0 4 px; centrada, a ~30 % da altura (ou a ~80 % quando o herói ocupa o topo)
- Contador: Nunito 900, 64 px, #d55423, dentro de card branco 740 × 100 px, raio 22 px; rótulo embaixo em Nunito 800 30 px branco ("homens", "pessoas, com as famílias", "dias de trabalho")
- Chip de dado/fonte: Nunito 800, 22–26 px, pílula raio 999 px
- CTA e faixa-tese: Anton 400 (caixa alta), 150 px; faixa amarela #f4b24f com texto Nunito 900 #2a2f45
- Links:
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&family=Anton&display=swap">

## Easing (números)
- legenda troca: corte seco, sem animação de entrada (ela é a voz; o olho não espera)
- palavra-chave acende: cor muda no tempo da fala, 0 s
- card do contador pousa: back.out(1.6), 0,35 s, de 85 % → 100 %
- contador conta: power2.out, 1,2 a 2,5 s (termina na palavra do número na narração)
- câmera: sine.inOut, 3 a 8 s por movimento (crane up, dolly in, órbita leve); nunca para de vez dentro da cena
- objeto que surge (moeda, pão, cesto): back.out(1.4), 0,25 s, cascata de 0,06 s
- personagem anda: passo de 0,4 s, corpo sobe e desce 4 px, sem rotação de membros além de ±20°

## Regras de movimento
- A narração manda: cada troca de legenda, cada número e cada objeto bate numa sílaba da voz. Sem voz, ninguém sabe o ritmo; grave ou gere o roteiro falado antes.
- Corte seco entre cenas (nunca crossfade). Dentro da cena, só câmera lenta e objetos pousando.
- Número sempre vira quantidade: se o texto diz 15.000, aparecem 15 mil bonequinhos (ou blocos que leem como isso). Instanciar, nunca um "x15000" escrito.
- Escala por comparação: Jesus e o Desbravador pequenos no canto da multidão; depois uma referência real (cidade, % do país, salário).
- O soco do filme é a abertura de câmera da multidão (de perto do herói até a vista aérea em ~4 s) e o "COMENTA:" final, que entra em corte seco.
- Na virada emocional, o mundo esvazia: fundo some, céu dessatura, câmera para. O silêncio prepara o clímax.

## Movimentos de assinatura
1. **Crane up de escala:** começa em Jesus + Desbravador, sobe até a multidão em grade inteira, contador sobe junto.
2. **Contador em card branco** com o número laranja e um chip de conversão embaixo ("≈ 8 meses de salário", "≈ 750 kg").
3. **Pilha que cresce** (pães, moedas, cestos) em cascata, com "antes / depois" em chips.
4. **Legenda gorda com uma palavra laranja**, 2 a 5 palavras por vez, cortando no ritmo da fala.

## Composição
- 9:16 com zona segura: nada importante nos 220 px de cima nem nos 380 px de baixo (interface do app); marca d'água discreta à direita a ~10 % da altura.
- Chip de fonte/versículo sempre centrado no topo da zona segura (y ≈ 110 px em 1080 × 1920 na escala do frame).
- Herói ocupa de 1/3 a 2/3 da altura nos closes; nas vistas abertas eles viram pontos e o Desbravador ao lado dá a escala.
- Horizonte alto (~35 % da altura) nas cenas de multidão; baixo (~55 %) nos closes com sol.

## Com mídia
- Feito para ser 100 % 3D de blocos (three.js com malhas de caixa, luz de sol baixa e sombra suave). Fotos reais não combinam; no máximo uma foto chapada dentro de um quadro de madeira no mundo.
- Comparação com dado real vira chip, nunca print de site.

## Lista de proibições
- Nada de textura realista, rosto realista ou foto do lado de um bloco.
- Nada de bloom, flare, raios de sol, partículas brilhando; o sol é um disco chapado.
- Nada de crossfade entre cenas, nada de texto entrando com efeito (só corte).
- Nada de mais de 5 palavras na legenda ao mesmo tempo, nada de legenda em duas cores além de branco + laranja.
- Nada de terceira cor de destaque: laranja do contador e âmbar da palavra-chave são a mesma família.
- Nada do mascote, do protagonista, do roteiro, do @ ou do nome da referência.

## Movimento (medido com `pericia-movimento.py`, dados em `pericia/movimento.json`)

| Medida | Referência |
|---|---|
| Mediana de energia | 0,38 |
| Pico | 6,16 (127,5 s: o fade do CTA para o cartão escuro) |
| **Amplitude (pico ÷ mediana)** | **16,1x** |
| Em quase-parada | 62 % |
| Cortes duros | 21 (4,7 · 8,9 · 13,5 · 21,5 · 28,6 · 35,6 · 43,8 · 49,7 · 54,8 · 60,4 · 64,7 · 68,6 · 72,0 · 78,9 · 81,8 · 99,8 · 103,9 · 106,3 · 111,9 · 116,9 · 127,7 s) |
| Trechos de energia alta | 9–12 s (crane up da multidão), 35,5–44,5 s (moedas e contador), 68,5–79 s (pilha de pães) |

**Metas para a nossa versão:** amplitude ≥ 11,3x · quase-parada ≥ 52 % · pelo menos 1 pico · cortes secos (sem crossfade) · nenhum trecho parado acima de 1,0 s fora do cartão final.
O vídeo da referência não fica no repositório. Para o teste de aceite (`--contra`), use a cópia local da pessoa; sem ela, compare os números com esta tabela.
