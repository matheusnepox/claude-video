// Roteiro da apresentação do projeto de fachada (todos os tempos em segundos e todos os textos).
window.ROTEIRO = {
  duracao: 34,
  marcos: {
    // 1. abertura
    simbolo: 0.35, titulo: 0.7, medidas: 1.7, aberturaSai: 2.85,
    // 2. antes
    cortinaAntes: 3.05, cartaoAntes: 3.9, antesSai: 7.0,
    // 3. o projeto (desenho técnico)
    cortinaProjeto: 7.3, tituloProjeto: 7.9, contorno: 8.3, frisos: 9.2, cotas: 10.0, adesivos: 11.6, legenda: 12.2, projetoSai: 13.9,
    // 4. do traço à fachada
    encaixe: 14.2, preenche: 15.5, expande: 16.3, cartaoDepois: 17.2, depoisSai: 19.7,
    // 5. antes × depois
    comparar: 20.0, divisor: [20.3, 22.0], compararSai: 24.5,
    // 6. detalhes
    detalhe1: 24.8, detalhe2: 26.7,
    // 7. assinatura
    cortinaFim: 28.55, fimTexto: 29.1, lockup: 30.2,
  },
  textos: {
    abertura: ['PROJETO DE FACHADA', 'Floricultura', 'Renascer'],
    medidas: '3,95 m × 4,3 m',
    antes: ['ANTES', 'Fachada atual'],
    projeto: ['O PROJETO', 'Medidas e áreas de adesivo'],
    legenda: 'Áreas de adesivo',
    depois: ['DEPOIS', 'Imagem ilustrativa do projeto'],
    detalhe1: ['Logo em destaque', 'na faixa superior'],
    detalhe2: ['Adesivos florais', 'nos pilares'],
    fim: ['Floricultura Renascer', 'Por um mundo mais verde.', 'Projeto de fachada'],
  },
  // posição da fachada na foto "depois" (px do vídeo, 1080 × 1920): cantos do contorno
  fachadaNaFoto: [[124, 328], [1062, 340], [1062, 1244], [124, 1292]],
  // posição do desenho na tela do projeto
  desenhoNaTela: [[136, 560], [944, 560], [944, 1440], [136, 1440]],
};
