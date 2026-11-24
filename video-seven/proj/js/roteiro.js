// Roteiro: todos os textos e tempos do filme num lugar só.
// Mudou um texto ou quer mais respiro? Mude aqui. Os tempos estão em segundos.
// A trilha (trilha.py) usa os mesmos marcos: se mexer num marco, rode a trilha de novo.
window.ROTEIRO = {
  duracao: 42,
  marcos: {
    // ATO 1 — ORIGEM
    ponto: 0.7, ideiaTexto: 2.2, ideia: 2.75, ideiaSai: 4.45,
    // ATO 2 — INSPIRAÇÃO
    tunel: 4.6, criados: 5.6, criadosSai: 7.85, para: 8.35, criar: 8.7, criarSai: 10.5,
    // ATO 3 — IDENTIDADE
    cortina1: 10.45, guias: 11.0, barra: 11.5, haste: 11.8, tri: 12.25,
    sete: 12.95, seteSai: 15.05, simboloSobe: 15.25, broto: 15.5, esperanca: 16.15, criatividade: 17.05, atoTresSai: 18.4,
    // ATO 4 — EXPRESSÃO
    cortina2: 18.55, vitrine: [19.15, 22.15, 25.45], panoramica: [22.05, 25.35], vitrineSai: 28.35,
    // ATO 5 — REVELAÇÃO
    cortina3: 28.4, convergem: 29.2, impacto: 31.0, letras: 31.95, assinatura: 32.85,
    sobe: 36.0, frase: 36.6, fraseSai: 39.85, volta: 40.05, pouso: 40.9,
  },
  textos: {
    ideia: ['TUDO COMEÇA', 'COM UMA', 'IDEIA.'],
    criados: ['CRIADOS PELO', 'CRIADOR...'],
    criar: ['...PARA', 'CRIAR.'],
    sete: ['SETE.', 'UMA REFERÊNCIA', 'À CRIAÇÃO.'],
    esperanca: ['ESPERANÇA', 'PARA CRESCER.', 'CRIATIVIDADE', 'PARA TRANSFORMAR.'],
    vitrine: [
      { linhas: ['IDEIAS QUE', 'GANHAM FORMA.'], fotos: ['media/cartoes.jpg', 'media/cartoes2.jpg'] },
      { linhas: ['MARCAS QUE GANHAM', 'IDENTIDADE.'], fotos: ['media/fachada.jpg', 'media/fachada2.jpg'] },
      { linhas: ['SOLUÇÕES QUE', 'GERAM VALOR.'], fotos: ['media/caixa.jpg', 'media/cartaz.jpg'] },
    ],
    frase: ['UMA NOVA IDENTIDADE.', 'UM PROPÓSITO', 'QUE PERMANECE.'],
  },
};
