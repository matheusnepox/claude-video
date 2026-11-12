// LogoReveal: monta o símbolo 7 (e o lockup "seven" + assinatura) a partir da logo original vetorizada.
// Nada é redesenhado: as formas vêm de js/logo-dados.js. A animação só corta e desloca as partes.
(function () {
  const S = STUDIO, M = MARCA;
  let uid = 0;

  // dados: LOGO.simbolo ou LOGO.lockup; barraFim: y onde a barra do 7 termina (medido na original)
  function Logo(parent, dados, barraFim, css) {
    const id = 'lg' + (uid++);
    const [vx, vy, vw, vh] = dados.vb;
    const svg = M.svgEl('svg', { viewBox: `${vx} ${vy} ${vw} ${vh}`, width: vw, height: vh, overflow: 'visible' });
    Object.assign(svg.style, { position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', overflow: 'visible' }, css || {});
    parent.appendChild(svg);
    const defs = M.svgEl('defs', {}, svg);
    const b = dados.corpo.box;
    this.b = b; this.barraFim = barraFim; this.vw = vw; this.vh = vh; this.svg = svg;

    // linhas de construção (antes do preenchimento)
    this.guias = M.svgEl('g', { stroke: '#fff', 'stroke-width': 2, fill: 'none', 'vector-effect': 'non-scaling-stroke' }, svg);

    const cb = M.svgEl('clipPath', { id: id + 'b' }, defs);
    this.rBar = M.svgEl('rect', { x: b[0] - 4, y: b[1] - 4, width: 0, height: barraFim - b[1] + 4 }, cb);
    const cs = M.svgEl('clipPath', { id: id + 's' }, defs);
    M.svgEl('rect', { x: b[0] - 400, y: barraFim - 0.5, width: b[2] + 800, height: b[3] + 400 }, cs);

    const gb = M.svgEl('g', { 'clip-path': `url(#${id}b)` }, svg);
    M.svgEl('path', { d: dados.corpo.d, fill: '#fff' }, gb);
    const gs = M.svgEl('g', { 'clip-path': `url(#${id}s)` }, svg);
    this.haste = M.svgEl('path', { d: dados.corpo.d, fill: '#fff' }, gs);
    this.tri = M.svgEl('path', { d: dados.triangulo.d, fill: '#fff' }, svg);
    this.triBox = dados.triangulo.box;
    this.dist = (b[1] + b[3] - barraFim) / Math.sin(M.ANG);

    this.letras = (dados.letras || []).map((p, i) => {
      const c = M.svgEl('clipPath', { id: id + 'l' + i }, defs);
      M.svgEl('rect', { x: p.box[0] - 6, y: p.box[1] - 40, width: p.box[2] + 12, height: p.box[3] + 46 }, c);
      const g = M.svgEl('g', { 'clip-path': `url(#${id}l${i})` }, svg);
      return { e: M.svgEl('path', { d: p.d, fill: '#fff' }, g), h: p.box[3] };
    });
    this.assin = (dados.assinatura || []).map((p) => M.svgEl('path', { d: p.d, fill: '#fff' }, svg));
  }

  // tm: { guias, barra, haste, tri, letras, assin } (instantes de início, em segundos)
  Logo.prototype.set = function (t, tm) {
    const b = this.b;
    const pg = tm.guias != null ? S.seg(t, tm.guias, 0.8, 'expo.inOut') : 1;
    const pgo = tm.guias != null ? S.seg(t, tm.barra + 0.5, 0.6, 'power2.in') : 1;
    this.guias.style.opacity = (0.45 * pg * (1 - pgo)).toFixed(3);
    this.guias.style.visibility = pg > 0 && pgo < 1 ? 'visible' : 'hidden';
    if (this._guiasLen) this._guias.forEach((l) => l.setAttribute('stroke-dashoffset', (l._len * (1 - pg)).toFixed(1)));

    const pb = S.seg(t, tm.barra, tm.dBarra || 0.7, 'expo.out');
    this.rBar.setAttribute('width', ((b[2] + 8) * pb).toFixed(2));
    const ph = S.seg(t, tm.haste, tm.dHaste || 0.75, 'expo.out');
    const dx = Math.cos(M.ANG) * this.dist * (1 - ph), dy = -Math.sin(M.ANG) * this.dist * (1 - ph);
    this.haste.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
    this.haste.style.visibility = ph > 0 ? 'visible' : 'hidden';

    const pt = S.seg(t, tm.tri, tm.dTri || 0.6, 'back.out(1.3)');
    const pto = S.seg(t, tm.tri, 0.25, 'power1.out');
    const tb = this.triBox, cx = tb[0] + tb[2] / 2, cy = tb[1] + tb[3] / 2;
    const s = S.mix(0.7, 1, pt);
    this.tri.setAttribute('transform', `translate(${cx} ${cy + (1 - pt) * -tb[3] * 0.5}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})`);
    this.tri.style.opacity = pto.toFixed(3);

    this.letras.forEach((l, i) => {
      const p = S.seg(t, tm.letras + i * 0.075, 0.8, 'expo.out');
      l.e.setAttribute('transform', `translate(0 ${((1 - p) * (l.h + 30)).toFixed(2)})`);
    });
    this.assin.forEach((e, i) => {
      const p = S.seg(t, tm.assin + i * 0.028, 0.55, 'expo.out');
      e.setAttribute('transform', `translate(0 ${((1 - p) * 16).toFixed(2)})`);
      e.style.opacity = p.toFixed(3);
    });
  };

  // guias de construção: a linha de topo da barra e a borda direita da haste, estendidas
  Logo.prototype.comGuias = function (linhas) {
    this._guias = linhas.map(([x1, y1, x2, y2]) => {
      const l = M.svgEl('line', { x1, y1, x2, y2 }, this.guias);
      l._len = Math.hypot(x2 - x1, y2 - y1);
      l.setAttribute('stroke-dasharray', l._len + ' ' + l._len);
      return l;
    });
    this._guiasLen = true;
    return this;
  };

  // posiciona: canto (x, y) em pixels de tela e escala
  Logo.prototype.pos = function (x, y, s) {
    this.svg.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(5)})`;
  };

  window.LogoReveal = Logo;
})();
