// Motor de papel recortado: corte à mão, grão de papel, folha com filete de luz e sombra dupla.
//
// As funções noise1, hash2, vnoise, cut e o grão procedural foram portadas da peça "paper-world" da skill
// Claude Video 2.0 — Copyright (c) Jack Roberts, licença MIT:
//   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//   documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//   the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//   to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above
//   copyright notice and this permission notice shall be included in all copies or substantial portions of the
//   Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
// O restante (peças, tiras de texto, molduras, página, cena) foi escrito para este projeto.
(function () {
  const S = STUDIO, rng = S.rng;

  // paleta: as cores da SEVEN como papéis (o branco vira papel creme, como papel de verdade)
  const COR = {
    profundo: '#043D2D', verde: '#07583F', medio: '#1F6E52', claro: '#DCEBE3', creme: '#F3EFE3', tinta: '#02261C',
  };
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };

  // ---------- ruído e corte à mão (portado do paper-world, MIT) ----------
  function noise1(seed) { const r = rng(seed), N = 1024, v = new Float32Array(N); for (let i = 0; i < N; i++) v[i] = r() * 2 - 1;
    return (x) => { const i = Math.floor(x), f = x - i, a = v[((i % N) + N) % N], b = v[(((i + 1) % N) + N) % N], s = f * f * (3 - 2 * f); return a + (b - a) * s; }; }
  function hash2(x, y, s) { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, s, per) { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), m = (a) => ((a % per) + per) % per;
    const a = hash2(m(xi), m(yi), s), b = hash2(m(xi + 1), m(yi), s), c = hash2(m(xi), m(yi + 1), s), d = hash2(m(xi + 1), m(yi + 1), s); return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy; }
  function cut(pts, seed, step, amp, wob, closed) {
    step = step || 12; amp = amp === undefined ? 1.1 : amp; wob = wob === undefined ? 2.2 : wob; closed = closed === undefined ? true : closed;
    const r = rng(seed), nz = noise1(seed + 7), n = pts.length, segs = closed ? n : n - 1, L = [0];
    for (let i = 1; i <= segs; i++) { const a = pts[i - 1], b = pts[i % n]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const tot = L[segs], out = []; let s = 0, j = 0;
    while (s < tot) {
      while (L[j + 1] < s) j++;
      const a = pts[j], b = pts[(j + 1) % n], f = (s - L[j]) / ((L[j + 1] - L[j]) || 1), dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1;
      const d = nz(s / 70) * wob + (r() - 0.5) * amp * 2;
      out.push([a[0] + dx * f - dy / dl * d, a[1] + dy * f + dx / dl * d]);
      s += step * (0.5 + r());
    }
    if (!closed) out.push(pts[n - 1]);
    return out;
  }
  const toPath = (pts) => { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); return p; };
  const bbox = (pts) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const q of pts) { a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); } return [a, b, c, d]; };
  const ret = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
  const circ = (r, n) => Array.from({ length: n || 72 }, (_, i) => { const a = i / (n || 72) * Math.PI * 2; return [Math.cos(a) * r, Math.sin(a) * r]; });

  // ---------- grão de papel (procedural, portado do paper-world, MIT) ----------
  const GT = 512, grainC = document.createElement('canvas'); grainC.width = GT; grainC.height = GT;
  { const x = grainC.getContext('2d'), id = x.createImageData(GT, GT), d = id.data;
    for (let j = 0; j < GT; j++) for (let i = 0; i < GT; i++) {
      const v = (hash2(i, j, 11) - 0.5) * 0.75 + (vnoise(i / 48, j / 48, 2, GT / 48) - 0.5) * 0.3 + (vnoise(i / 12, j / 12, 3, GT / 12) - 0.5) * 0.22 + (vnoise(i / 3, j / 3, 5, GT / 3) - 0.5) * 0.3;
      const o = (j * GT + i) * 4, c = v > 0 ? 255 : 0; d[o] = c; d[o + 1] = c; d[o + 2] = c; d[o + 3] = Math.min(255, Math.abs(v) * 78);
    }
    x.putImageData(id, 0, 0);
    const r = rng(77);
    for (let k = 0; k < 300; k++) { const sx = 20 + r() * (GT - 40), sy = 20 + r() * (GT - 40), a = r() * 6.283, l = 6 + r() * 22;
      x.strokeStyle = r() < 0.6 ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.10)'; x.lineWidth = 0.6 + r() * 0.7;
      x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + Math.cos(a + 0.6) * l * 0.6, sy + Math.sin(a + 0.6) * l * 0.6, sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke(); }
  }

  // ---------- a peça de papel ----------
  // forma: Path2D em coordenadas locais; bb: caixa; cor: cor do papel
  function Peca(path, bb, cor) { this.p = path; this.bb = bb; this.cor = cor; }
  Peca.daForma = (pts, cor, seed, passo, amp) => { const c = cut(pts, seed, passo || 11, amp, 1.8); return new Peca(toPath(c), bbox(c), cor); };
  // desenha a peça: x, y (canto da caixa local), rot (rad), s (escala), ar (0 no chão, 1 no ar), alfa
  Peca.prototype.desenha = function (ctx, x, y, rot, s, ar, alfa, depois) {
    if (alfa <= 0) return;
    const bb = this.bb, cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2;
    ctx.save();
    ctx.globalAlpha = alfa;
    ctx.translate(x + cx * s, y + cy * s); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.translate(-cx, -cy);
    ar = Math.max(0, Math.min(1, ar || 0));
    // sombra larga e suave (cresce no ar) + sombra curta de contato
    ctx.shadowColor = `rgba(2,24,17,${(0.42 - 0.12 * ar).toFixed(3)})`;
    ctx.shadowBlur = 16 + ar * 34; ctx.shadowOffsetX = 5 + ar * 14; ctx.shadowOffsetY = 9 + ar * 34;
    ctx.fillStyle = mix(this.cor, '#FFFFFF', 0.28); ctx.fill(this.p);
    ctx.shadowColor = `rgba(2,24,17,${(0.30 * (1 - ar)).toFixed(3)})`;
    ctx.shadowBlur = 3; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 2;
    ctx.fill(this.p);
    ctx.shadowColor = 'rgba(0,0,0,0)';
    // corpo do papel deslocado 2,4 px: sobra o filete de luz na borda de cima
    ctx.save(); ctx.clip(this.p); ctx.translate(0, 2.4); ctx.fillStyle = this.cor; ctx.fill(this.p); ctx.translate(0, -2.4);
    ctx.globalAlpha = alfa * 0.6; ctx.fillStyle = Peca.grao(ctx); ctx.fillRect(bb[0] - 4, bb[1] - 4, bb[2] - bb[0] + 8, bb[3] - bb[1] + 8);
    ctx.globalAlpha = alfa;
    if (depois) depois(ctx);
    ctx.restore();
    ctx.restore();
  };
  Peca.grao = (ctx) => ctx.__grao || (ctx.__grao = ctx.createPattern(grainC, 'repeat'));

  // tira de papel com texto (etiqueta): mede o texto, recorta a tira e escreve por cima
  function Tira(texto, o) {
    this.t = texto; this.o = Object.assign({ tam: 80, peso: 600, cor: COR.creme, tinta: COR.profundo, padX: 0.42, padY: 0.24, ls: 0 }, o);
    this.medida = -1;
  }
  Tira.prototype.prepara = function (ctx) {
    const o = this.o;
    ctx.font = `${o.peso} ${o.tam}px 'Instrument Sans'`;
    ctx.letterSpacing = (o.ls * o.tam) + 'px';
    const w = Math.ceil(ctx.measureText(this.t).width);
    ctx.letterSpacing = '0px';
    if (w === this.medida) return;
    this.medida = w;
    this.w = w + o.tam * o.padX * 2; this.h = o.tam * (1 + o.padY * 2);
    this.peca = Peca.daForma(ret(this.w, this.h), o.cor, o.semente || this.t.length * 13 + o.tam, 9, 1.0);
  };
  Tira.prototype.desenha = function (ctx, x, y, rot, ar, alfa) {
    this.prepara(ctx);
    const o = this.o, me = this;
    this.peca.desenha(ctx, x, y, rot, 1, ar, alfa, (c) => {
      c.font = `${o.peso} ${o.tam}px 'Instrument Sans'`; c.letterSpacing = (o.ls * o.tam) + 'px';
      c.fillStyle = o.tinta; c.textBaseline = 'alphabetic';
      c.fillText(me.t, o.tam * o.padX, o.tam * (o.padY + 0.84));
      c.letterSpacing = '0px';
    });
  };

  // foto impressa numa moldura de papel creme recortada
  function Moldura(img, w, h, foco, borda, semente) {
    this.img = img; this.w = w; this.h = h; this.foco = foco || [0.5, 0.5]; this.b = borda || 18;
    this.peca = Peca.daForma(ret(w + this.b * 2, h + this.b * 2), COR.creme, semente || 5, 12, 1.1);
  }
  Moldura.prototype.desenha = function (ctx, x, y, rot, ar, alfa, zoom) {
    const me = this;
    this.peca.desenha(ctx, x, y, rot, 1, ar, alfa, (c) => {
      const im = me.img;
      if (!im.complete || !im.naturalWidth) return;
      const k = Math.max(me.w / im.naturalWidth, me.h / im.naturalHeight) * (zoom || 1);
      const sw = me.w / k, sh = me.h / k;
      const sx = (im.naturalWidth - sw) * me.foco[0], sy = (im.naturalHeight - sh) * me.foco[1];
      c.save(); c.beginPath(); c.rect(me.b, me.b, me.w, me.h); c.clip();
      c.drawImage(im, sx, sy, sw, sh, me.b, me.b, me.w, me.h);
      // um leve véu de papel por cima da foto (impressão fosca)
      c.globalAlpha = 0.10; c.fillStyle = COR.creme; c.fillRect(me.b, me.b, me.w, me.h);
      c.restore();
    });
  };

  // curva de pouso de uma peça: entra de baixo (ou de cima), gira e assenta; devolve {dy, rot, ar, alfa}
  function pouso(t, t0, o) {
    o = o || {};
    const d = o.dur || 0.5;
    const p = S.seg(t, t0, d, o.curva || 'back.out(1.5)');
    const pr = S.seg(t, t0, d + 0.25, 'back.out(1.4)');
    // saída: se a peça não tem uma própria, usa a saída da cena (as peças caem uma a uma antes da próxima página)
    let ts = o.sai;
    if (ts == null && PAPEL.saida) ts = PAPEL.saida.t0 + (PAPEL.saida.n++) * 0.045;
    const sai = ts != null ? S.seg(t, ts, 0.55, 'power2.in') : 0;
    const dist = o.dist || 260;
    return {
      on: t >= t0 && sai < 1,
      dy: (1 - p) * dist * (o.deCima ? -1 : 1) + sai * (o.distSai || 1500),
      rot: (o.rot || 0) + (1 - pr) * (o.giro || 0.09),
      ar: Math.max(1 - S.seg(t, t0, d * 0.9, 'power2.out'), sai * 0.8),
      alfa: Math.min(1, (t - t0) / 0.08),
    };
  }

  window.PAPEL = { COR, mix, cut, toPath, bbox, ret, circ, Peca, Tira, Moldura, pouso, noise1 };
})();
