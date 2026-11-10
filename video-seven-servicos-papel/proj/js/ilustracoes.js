// Ilustrações em papel recortado dos serviços (substituem as fotos de baixa resolução).
// Tudo vetorial, com a logo original da SEVEN aplicada como impressão. Cada peça pousa sozinha.
(function () {
  const S = STUDIO, P = PAPEL, C = P.COR;
  const L = LOGO;
  const pathsLock = [L.lockup.corpo.d, L.lockup.triangulo.d].concat(L.lockup.letras.map((x) => x.d), L.lockup.assinatura.map((x) => x.d)).map((d) => new Path2D(d));
  const pathsSim = [L.simbolo.corpo.d, L.simbolo.triangulo.d].map((d) => new Path2D(d));
  // logo impressa (tinta chapada, sem relevo): x, y = canto; larg = largura
  function logo(ctx, qual, x, y, larg, cor) {
    const lock = qual === 'lockup';
    const box = lock ? [18, 18, 1152, 275] : [33, 32, 844, 759];
    const s = larg / box[2];
    ctx.save(); ctx.translate(x - box[0] * s, y - box[1] * s); ctx.scale(s, s); ctx.fillStyle = cor;
    (lock ? pathsLock : pathsSim).forEach((p) => ctx.fill(p, 'evenodd'));
    ctx.restore();
  }
  const altLogo = (qual, larg) => qual === 'lockup' ? larg * 275 / 1152 : larg * 759 / 844;
  const barra = (ctx, x, y, w, h, cor) => { ctx.fillStyle = cor; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill(); };
  const peca = (pts, cor, seed, passo) => P.Peca.daForma(pts, cor, seed, passo || 9, 0.9);
  const R = P.ret;
  const desloca = (pts, dx, dy) => pts.map((q) => [q[0] + dx, q[1] + dy]);
  const circ = (r, n) => P.circ(r, n || 48).map((q) => [q[0] + r, q[1] + r]);

  // cada ilustração: lista de elementos { peca, x, y, rot, depois(ctx) }, desenhados na ordem, pousando um por vez
  function grafica() {
    return [
      { peca: peca(R(300, 420), C.creme, 201), x: 70, y: 120, rot: -0.12, depois(c) {
        c.fillStyle = C.verde; c.fillRect(0, 0, 300, 112); logo(c, 'lockup', 36, 34, 228, C.creme);
        [220, 190, 220, 160].forEach((w, i) => barra(c, 34, 148 + i * 28, w, 12, C.medio));
        c.fillStyle = C.claro; c.fillRect(34, 278, 232, 96); logo(c, 'simbolo', 124, 296, 54, C.verde);
      } },
      ...[0, 1, 2].map((i) => ({ peca: peca(R(320, 180), i === 2 ? C.verde : C.medio, 210 + i), x: 430 + i * 10, y: 330 - i * 12, rot: 0.1, depois: i === 2 ? (c) => logo(c, 'lockup', 50, 52, 220, C.creme) : null })),
      { peca: peca(R(320, 180), C.creme, 220), x: 470, y: 90, rot: -0.07, depois(c) {
        logo(c, 'simbolo', 30, 46, 92, C.verde);
        [150, 110, 130].forEach((w, i) => barra(c, 146, 58 + i * 26, w, 11, C.medio));
      } },
      { peca: peca(circ(88), C.creme, 230, 7), x: 300, y: 440, rot: 0.15, depois(c) {
        c.fillStyle = C.verde; c.beginPath(); c.arc(88, 88, 72, 0, Math.PI * 2); c.fill();
        logo(c, 'simbolo', 54, 58, 68, C.creme);
        c.fillStyle = C.claro; c.beginPath(); c.moveTo(150, 136); c.lineTo(176, 120); c.lineTo(160, 160); c.closePath(); c.fill();
      } },
    ];
  }
  function fachada() {
    const folhas = (x, y) => [[0, 0], [26, -40], [52, 0], [40, 22], [12, 22]].map((q) => [q[0] + x, q[1] + y]);
    return [
      { peca: peca([[0, 22], [70, 0], [150, 18], [190, 8], [240, 30], [230, 60], [10, 60]], C.creme, 240), x: 60, y: 40, rot: 0 },
      { peca: peca([[0, 20], [60, 0], [130, 14], [170, 30], [160, 56], [6, 56]], C.creme, 241), x: 600, y: 70, rot: 0 },
      { peca: peca(R(940, 120), C.medio, 242, 12), x: -20, y: 560, rot: 0 },
      { peca: peca(R(620, 400), C.creme, 243), x: 120, y: 180, rot: 0 },
      { peca: peca(R(560, 116), C.profundo, 244), x: 150, y: 196, rot: 0, depois(c) { logo(c, 'lockup', 70, 22, 420, C.creme); } },
      { peca: peca(R(590, 62), C.verde, 245), x: 135, y: 322, rot: 0, depois(c) { c.fillStyle = C.creme; for (let i = 0; i < 10; i += 2) c.fillRect(i * 59, 0, 59, 62); } },
      { peca: peca(R(150, 150), C.profundo, 246), x: 170, y: 410, rot: 0, depois(c) { c.fillStyle = C.claro; c.globalAlpha *= 0.5; c.beginPath(); c.moveTo(20, 130); c.lineTo(90, 20); c.lineTo(110, 20); c.lineTo(40, 130); c.fill(); } },
      { peca: peca(R(150, 150), C.profundo, 247), x: 540, y: 410, rot: 0, depois(c) { c.fillStyle = C.claro; c.globalAlpha *= 0.5; c.beginPath(); c.moveTo(20, 130); c.lineTo(90, 20); c.lineTo(110, 20); c.lineTo(40, 130); c.fill(); } },
      { peca: peca(R(140, 190), C.verde, 248), x: 360, y: 390, rot: 0, depois(c) { c.fillStyle = C.claro; c.fillRect(112, 92, 10, 28); } },
      { peca: peca(R(110, 290), C.verde, 249), x: 770, y: 200, rot: 0.03, depois(c) {
        logo(c, 'simbolo', 22, 30, 66, C.creme); [70, 54, 70].forEach((w, i) => barra(c, 20, 130 + i * 24, w, 10, C.claro));
      } },
      { peca: peca([[0, 0], [60, 0], [50, 50], [10, 50]], C.medio, 250, 6), x: 300, y: 520, rot: 0 },
      { peca: peca(folhas(0, 40), C.verde, 251, 6), x: 304, y: 470, rot: -0.1 },
      { peca: peca([[0, 0], [60, 0], [50, 50], [10, 50]], C.medio, 252, 6), x: 520, y: 520, rot: 0 },
      { peca: peca(folhas(0, 40), C.verde, 253, 6), x: 524, y: 470, rot: 0.1 },
    ];
  }
  function publicidade() {
    return [
      { peca: peca([[160, 0], [220, 0], [250, 90], [130, 90]], C.medio, 260, 7), x: 230, y: 420, rot: 0 },
      { peca: peca(R(260, 26), C.medio, 261, 7), x: 210, y: 500, rot: 0 },
      { peca: peca(R(540, 350), C.profundo, 262), x: 60, y: 80, rot: 0, depois(c) {
        c.fillStyle = C.creme; c.fillRect(18, 18, 504, 300);
        logo(c, 'simbolo', 50, 60, 170, C.verde);
        [C.verde, C.profundo, C.claro].forEach((cor, i) => { c.fillStyle = cor; c.beginPath(); c.arc(300 + i * 70, 100, 28, 0, Math.PI * 2); c.fill(); });
        c.strokeStyle = C.medio; c.lineWidth = 2; c.beginPath(); c.arc(300 + 2 * 70, 100, 28, 0, Math.PI * 2); c.stroke();
        c.fillStyle = C.profundo; c.font = "700 92px 'Instrument Sans'"; c.fillText('Aa', 270, 238);
        [120, 90].forEach((w, i) => barra(c, 400, 190 + i * 26, w, 12, C.medio));
        c.fillStyle = C.claro; c.fillRect(50, 262, 440, 30); logo(c, 'lockup', 60, 266, 92, C.verde);
      } },
      { peca: peca(R(210, 390), C.profundo, 263), x: 640, y: 150, rot: 0.06, depois(c) {
        c.fillStyle = C.creme; c.fillRect(14, 30, 182, 330);
        c.fillStyle = C.verde; c.fillRect(26, 60, 158, 158); logo(c, 'simbolo', 64, 88, 82, C.creme);
        [140, 100].forEach((w, i) => barra(c, 26, 236 + i * 24, w, 11, C.medio));
        c.fillStyle = C.verde; c.beginPath(); c.arc(40, 310, 11, 0, Math.PI * 2); c.arc(62, 310, 11, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(29, 314); c.lineTo(51, 338); c.lineTo(73, 314); c.fill();
      } },
      { peca: peca([[0, 40], [120, 0], [130, 150], [0, 110]], C.verde, 264, 7), x: 560, y: 470, rot: -0.25 },
      { peca: peca([[0, 0], [34, 0], [34, 70], [0, 70]], C.medio, 265, 6), x: 520, y: 520, rot: -0.25 },
    ];
  }
  function caixa() {
    return [
      { peca: peca([[0, 60], [200, 0], [400, 60], [200, 120]], C.claro, 270, 8), x: 250, y: 120, rot: 0 },
      { peca: peca([[0, 0], [200, 60], [200, 360], [0, 300]], C.verde, 271, 8), x: 250, y: 180, rot: 0, depois(c) {
        c.save(); c.transform(1, 0.3, 0, 1, 0, 0); logo(c, 'simbolo', 40, 110, 120, C.creme); c.restore();
      } },
      { peca: peca([[0, 60], [200, 0], [200, 300], [0, 360]], C.profundo, 272, 8), x: 450, y: 180, rot: 0, depois(c) {
        c.save(); c.transform(1, -0.3, 0, 1, 0, 0); logo(c, 'lockup', 24, 220, 150, C.claro); c.restore();
      } },
    ];
  }
  const CENAS = { grafica, fachada, publicidade, caixa };

  // quadro: moldura de papel creme com fundo próprio, e a ilustração dentro, recortada pela janela
  function Quadro(nome, w, h, fundo, semente) {
    this.w = w; this.h = h; this.b = 18; this.fundo = fundo || C.claro;
    this.peca = P.Peca.daForma(R(w + 36, h + 36), C.creme, semente || 9, 12, 1.1);
    this.el = CENAS[nome]();
    this.esc = Math.min(w / 900, h / 640);
    this.ox = (w - 900 * this.esc) / 2; this.oy = (h - 640 * this.esc) / 2;
  }
  // t0: quando os elementos internos começam a pousar
  Quadro.prototype.desenha = function (ctx, x, y, rot, ar, alfa, t, t0) {
    const me = this;
    this.peca.desenha(ctx, x, y, rot, 1, ar, alfa, (c) => {
      c.save(); c.beginPath(); c.rect(me.b, me.b, me.w, me.h); c.clip();
      c.fillStyle = me.fundo; c.fillRect(me.b, me.b, me.w, me.h);
      c.translate(me.b + me.ox, me.b + me.oy); c.scale(me.esc, me.esc);
      const salva = P.saida; P.saida = null;
      me.el.forEach((e, i) => {
        const a = P.pouso(t, t0 + i * 0.09, { dur: 0.42, dist: 160, rot: e.rot, giro: 0.12 });
        if (!a.on) return;
        e.peca.desenha(c, e.x, e.y + a.dy, a.rot, 1, a.ar * 0.6, a.alfa, e.depois);
      });
      P.saida = salva;
      c.restore();
    });
  };

  window.ILUSTRA = { Quadro, logo };
})();
