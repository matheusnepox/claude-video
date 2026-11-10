// Reels "O que a SEVEN faz?" — textos e tempos num lugar só (segundos). Batida de 0,6 s (100 BPM).
window.ROTEIRO = {
  duracao: 33,
  gancho: { ini: 0.0, simbolo: 0.25, texto: 0.6, sai: 2.7, linhas: ['O que a', 'SEVEN', 'faz?'] },
  promessa: { cortina: 2.85, texto: 3.4, sai: 5.45, linhas: ['Transformamos', 'ideias', 'em soluções.'] },
  servicos: [
    { ini: 6.0, cor: 'var(--profundo)', num: '01', titulo: ['GRÁFICA'], icone: 'camadas', foto: 'media/cartoes.jpg', foco: '50% 45%',
      itens: ['Cartões', 'Panfletos', 'Folders', 'Adesivos', 'Materiais impressos'] },
    { ini: 12.0, cor: 'var(--verde)', num: '02', titulo: ['COMUNICAÇÃO', 'VISUAL'], icone: 'imagem', foto: 'media/fachada.jpg', foco: '50% 40%',
      itens: ['Fachadas', 'Banners', 'Placas', 'Lonas', 'Sinalização'] },
    { ini: 18.0, cor: 'var(--profundo)', num: '03', titulo: ['PUBLICIDADE', 'CRIATIVA'], icone: 'lampada', foto: 'media/monitor.jpg', foco: '50% 40%',
      itens: ['Design', 'Identidade visual', 'Campanhas', 'Materiais promocionais'] },
  ],
  valor: { cortina: 23.85, texto: 24.3, sai: 27.85, linhas: ['Mais do que produzir', 'materiais, geramos', 'VALOR.'],
    fotos: ['media/caixa.jpg', 'media/cartaz.jpg', 'media/cartoes2.jpg', 'media/fachada2.jpg'] },
  final: { cortina: 28.05, logo: 28.6, cta: 30.4, textoCta: 'CHAMA NO DIRECT' },
};
