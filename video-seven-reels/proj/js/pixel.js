// Motor de pixel: paleta da marca, sprites desenhados à mão, rasterização da logo original,
// pontilhado (Bayer) e helpers. Tudo desenhado numa tela de 270 × 480 ampliada 4× sem suavização.
(function () {
  const W = 270, H = 480;
  // paleta: as 4 cores da SEVEN + 3 tons de verde para sombra e volume
  const PAL = {
    k: '#02261C', // sombra (verde quase preto)
    p: '#043D2D', // VERDE PROFUNDO
    v: '#07583F', // VERDE SEVEN
    m: '#0E7A57', // verde médio
    g: '#7DB89B', // verde-claro médio
    l: '#DCEBE3', // VERDE CLARO
    w: '#FFFFFF', // BRANCO
  };

  // ---------- sprites (cada letra é uma cor da paleta; "." é transparente) ----------
  const LAMPADA = [
    '...kkkkkk...',
    '..kwwwwwwk..',
    '.kwlwwwwwwk.',
    'kwlwwwwwwwwk',
    'kwlwwwwwwwwk',
    'kwwwkwwwkwwk',
    'kwwwkwwwkwwk',
    'kwwwwwwwwwwk',
    '.kwwwkkwwwk.',
    '..kwwwwwwk..',
    '...kggggk...',
    '...kmmmmk...',
    '...kggggk...',
    '...kmmmmk...',
    '....kkkk....',
  ];
  const PERNAS = [
    ['....k..k....', '...kk..kk...'],
    ['...k....k...', '..kk....kk..'],
    ['....k...k...', '...kk..kk...'],
  ];
  const PESSOA = [
    '..kkkk..',
    '.kllllk.',
    '.kllllk.',
    '..kkkk..',
    '.kmmmmk.',
    'kmmmmmmk',
    'kmmmmmmk',
    'kmmmmmmk',
    '.kmmmmk.',
    '.kmkkmk.',
    '.kmk.km.',
    '.kk..kk.',
  ];
  const EXCLAMA = [
    'kkkkk',
    'kwwwk',
    'kwkwk',
    'kwkwk',
    'kwwwk',
    'kwkwk',
    'kwwwk',
    'kkkkk',
    '.kk..',
  ];
  const ICONES = {
    'CARTÕES': [
      '............',
      'kkkkkkkkkkkk',
      'kvvvvvvvvvvk',
      'kvwwwwvvvvvk',
      'kvvvvwvvvvvk',
      'kvvvwvvllllk',
      'kvvwvvvvvvvk',
      'kvvvvvvlllvk',
      'kvvvvvvvvvvk',
      'kkkkkkkkkkkk',
      '............',
      '............',
    ],
    'PANFLETOS': [
      'kkkkkkkkk...',
      'klllllllkk..',
      'klvvvvvlklk.',
      'kllllllllkkk',
      'klvvvvvvvvlk',
      'kllllllllllk',
      'klvvvvvvvllk',
      'kllllllllllk',
      'klvvvvvvvvlk',
      'kllllllllllk',
      'kkkkkkkkkkkk',
      '............',
    ],
    'ADESIVOS': [
      '...kkkkkk...',
      '..kwwwwwwk..',
      '.kwvvvvvvwk.',
      'kwvvwwwwvvwk',
      'kwvvvvvwvvwk',
      'kwvvvvwvvvwk',
      'kwvvvwvvvvwk',
      'kwvvwvvvvvwk',
      '.kwvvvvvvkk.',
      '..kwwwwwklk.',
      '...kkkkkkk..',
      '............',
    ],
    'BANNERS': [
      'kk..........',
      'kkkkkkkkkkk.',
      'kmlllllllllk',
      'kmlvvvvvvvlk',
      'kmlllllllllk',
      'kmlvvvvvlllk',
      'kmlllllllllk',
      'kmkkkkkkkkkk',
      'km..........',
      'km..........',
      'km..........',
      'kk..........',
    ],
    'FACHADAS': [
      'kkkkkkkkkkkk',
      'klvlvlvlvlvk',
      'kkkkkkkkkkkk',
      'kvvvvvvvvvvk',
      'kvllvvvvkkvk',
      'kvllvvvvkpvk',
      'kvvvvvvvkpvk',
      'kvllvvvvkpvk',
      'kvllvvvvkpvk',
      'kvvvvvvvkpvk',
      'kkkkkkkkkkkk',
      '............',
    ],
  };
  // estágios da planta (de broto a planta)
  const PLANTA = [
    ['..m..', '..m..'],
    ['.g.g.', '..m..', '..m..'],
    ['g...g', 'gg.gg', '.gmg.', '..m..', '..m..'],
    ['..l..', '.lgl.', 'g.m.g', 'gg.gg', '.gmg.', '..m..', '..m..'],
    ['.lll.', 'llgll', '.lml.', 'g.m.g', 'gglgg', '.gmg.', '..m..', '..m..', '..m..'],
  ];

  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
  const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];

  function Tela(canvas) {
    this.c = canvas;
    this.x = canvas.getContext('2d');
    this.x.imageSmoothingEnabled = false;
  }
  Tela.prototype.ret = function (x, y, w, h, cor) {
    this.x.fillStyle = PAL[cor] || cor;
    this.x.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  // desenha um sprite; esc = tamanho do pixel; troca = mapa de cores; espelha = vira na horizontal
  Tela.prototype.spr = function (linhas, x, y, esc, troca, espelha) {
    esc = esc || 1; x = Math.round(x); y = Math.round(y);
    const ctx = this.x;
    for (let j = 0; j < linhas.length; j++) {
      const L = linhas[j];
      for (let i = 0; i < L.length; i++) {
        let ch = L[espelha ? L.length - 1 - i : i];
        if (ch === '.') continue;
        if (troca && troca[ch]) ch = troca[ch];
        ctx.fillStyle = PAL[ch];
        ctx.fillRect(x + i * esc, y + j * esc, esc, esc);
      }
    }
  };
  // grade de células (true/false) desenhada em blocos
  Tela.prototype.grade = function (g, x, y, cel, cor) {
    this.x.fillStyle = PAL[cor] || cor;
    for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) if (g.d[j * g.w + i]) this.x.fillRect(x + i * cel, y + j * cel, cel, cel);
  };
  // cobre (ou descobre) a área com pontilhado Bayer em blocos de 3 px; p de 0 a 1
  Tela.prototype.pontilha = function (p, cor, y0, y1) {
    if (p <= 0) return;
    const ctx = this.x, b = 3;
    ctx.fillStyle = PAL[cor] || cor;
    for (let y = y0 || 0; y < (y1 || H); y += b) for (let x = 0; x < W; x += b) if (bayer(x / b, y / b) < p) ctx.fillRect(x, y, b, b);
  };

  // rasteriza caminhos SVG (a logo original) numa grade: vb = [x, y, w, h] e largura em células
  function rasterizar(caminhos, vb, cols, linhas) {
    const esc = cols / vb[2];
    const rows = linhas || Math.ceil(vb[3] * esc);
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const o = off.getContext('2d');
    o.setTransform(esc, 0, 0, esc, -vb[0] * esc, -vb[1] * esc);
    o.fillStyle = '#fff';
    caminhos.forEach((d) => o.fill(new Path2D(d), 'evenodd'));
    const px = o.getImageData(0, 0, cols, rows).data;
    const d = new Array(cols * rows);
    for (let i = 0; i < cols * rows; i++) d[i] = px[i * 4 + 3] > 110;
    return { w: cols, h: rows, d };
  }

  window.PIX = { W, H, PAL, LAMPADA, PERNAS, PESSOA, EXCLAMA, ICONES, PLANTA, Tela, rasterizar, bayer };
})();
