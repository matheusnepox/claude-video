// Roteiro do Reels "Sua ideia merece forma." em estilo jogo de pixel.
// Textos e tempos num lugar só (segundos). A trilha (trilha.py) usa os mesmos marcos.
window.ROTEIRO = {
  duracao: 40,
  // trocas de fase (transição pontilhada centrada em cada uma)
  trocas: [4.6, 10.3, 20.2, 27.2, 33.2],
  // falas na caixa de diálogo: início, fim (quando some) e texto
  falas: [
    { ini: 0.8, fim: 4.35, txt: 'Toda empresa começa com uma ideia.' },
    { ini: 5.0, fim: 10.05, txt: 'Mas uma ideia só ganha força quando as pessoas conseguem ver.' },
    { ini: 10.6, fim: 19.95, txt: 'Na Seven, a gente transforma ideias em cartões, panfletos, adesivos, banners, fachadas e identidade visual.' },
    { ini: 20.5, fim: 26.95, txt: 'Cada material é pensado pra comunicar o melhor da sua marca e ajudar o seu negócio a crescer.' },
    { ini: 27.5, fim: 32.95, txt: 'Porque a gente acredita que fomos criados pelo Criador... pra criar.' },
    { ini: 33.6, fim: 36.2, txt: 'Seven. Comunicação com propósito.' },
    { ini: 36.4, fim: 40.5, txt: 'Chama a gente no direct e tira a sua ideia do papel.' },
  ],
  cps: 30, // letras por segundo na digitação
  titulo: ['SUA', 'IDEIA'],
  start: 4.0,          // "aperta start"
  luzAcende: 8.5,      // a lâmpada acende na fase 1
  // fase 2: momentos em que a lâmpada bate em cada bloco 7
  batidas: [11.6, 12.95, 14.3, 15.65, 17.0, 18.35],
  itens: ['CARTÕES', 'PANFLETOS', 'ADESIVOS', 'BANNERS', 'FACHADAS', 'IDENTIDADE VISUAL'],
  // fase 3
  obraIni: 20.8, levelUp: 25.4,
  // fase 4
  sol: 27.5, brotoCresce: 28.6, criadosTexto: 29.2,
  // fase 5
  blocos: 33.5, nitidez: [35.3, 35.55, 35.8], cta: 36.5,
};
