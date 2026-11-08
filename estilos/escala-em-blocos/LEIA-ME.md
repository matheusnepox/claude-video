# Escala em blocos

Ficha feita a partir de um reel de referência mandado pela pessoa (história bíblica explicada em escala, num mundo 3D de blocos, 9:16, 131,8 s, narrado).
Mecanismo: um narrador conta a história; cada número dito vira quantidade visível (multidão, moedas, pães, cestos), com contador em card branco e câmera que abre para mostrar a escala.
O que se costuma trocar: o tema e o roteiro (qualquer história com números: bíblica, histórica, ciência, dinheiro), as falas e as poses (os personagens fixos são Jesus e o Desbravador), as referências de comparação ("tamanho de X", "% de Y") e a palavra do CTA final.
O que quebra o estilo: 1) número escrito sem virar quantidade na tela; 2) trocar o Desbravador por outro companheiro ou separar os dois; 3) crossfade ou texto animado no lugar do corte seco no tempo da voz; 4) textura realista, bloom ou terceira cor de destaque.
Ritmo medido: amplitude 16,1x, 62 % em quase-parada, 21 cortes secos (um a cada ~6 s); legenda troca a cada 1,5–2 s.
Peça de partida: `projeto/` tem os personagens em blocos (Jesus e o Desbravador, em `personagens.js`) numa cena de teste de 6 s à beira do lago (`personagens.jpg`). O motor de multidões (malhas instanciadas) ainda vai ser escrito na primeira peça.
Os scripts carregam three.js r149 (build `three.min.js`, global `THREE`) do jsDelivr, como o GSAP.
Precisa de narração: grave a voz (ou traga o áudio) antes do storyboard; os tempos saem dela.
A referência é de terceiros: o vídeo, os quadros, o mascote, os personagens, o roteiro e o @ não são distribuídos nem copiados aqui.
