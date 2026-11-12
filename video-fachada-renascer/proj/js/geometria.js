// GeometricTransitions + SceneTransitions.
// Linhas de construção, formas da marca em profundidade e a cortina diagonal na inclinação do 7.
(function () {
  const S = STUDIO, M = MARCA;

  // Cortina diagonal: revela uma camada da esquerda para a direita, com a borda na inclinação do 7.
  // Uma faixa verde-clara corre na frente (o "fio de luz" da troca de cena).
  function Cortina(parent, cor, ini, dur, z) {
    this.faixa = M.div('', parent, { position: 'absolute', inset: '0', background: 'var(--claro)', zIndex: z });
    this.cor = M.div('', parent, { position: 'absolute', inset: '0', background: cor, zIndex: z });
    this.ini = ini; this.dur = dur;
  }
  Cortina.prototype.poly = function (xs) {
    const k = M.K;
    return `polygon(-20px -20px, ${(xs + 980 * k).toFixed(1)}px -20px, ${(xs - 980 * k).toFixed(1)}px 1940px, -20px 1940px)`;
  };
  Cortina.prototype.set = function (t) {
    const p = S.seg(t, this.ini, this.dur, 'power3.inOut');
    const xs = S.mix(-700, 1800, p);
    const on = t >= this.ini;
    this.cor.style.visibility = this.faixa.style.visibility = on ? 'visible' : 'hidden';
    this.cor.style.clipPath = this.poly(xs);
    this.faixa.style.clipPath = this.poly(xs + 70 * (1 - p) + 18);
    this.faixa.style.visibility = on && p < 1 ? 'visible' : 'hidden';
  };
  Cortina.prototype.feita = function (t) { return t >= this.ini + this.dur; };

  // Linha que se desenha de um ponto, nos dois sentidos ou num só
  function Traco(svg, x1, y1, x2, y2, o) {
    this.e = M.svgEl('line', { x1, y1, x2, y2, stroke: o.cor || '#fff', 'stroke-width': o.w || 2,
      'stroke-linecap': 'round', opacity: o.op || 0.4 }, svg);
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; this.o = o;
    this.len = Math.hypot(x2 - x1, y2 - y1);
    this.e.setAttribute('stroke-dasharray', this.len + ' ' + this.len);
  }
  Traco.prototype.set = function (t) {
    const o = this.o;
    const p = S.seg(t, o.in, o.dur || 1.2, o.ease || 'expo.inOut');
    const po = o.out != null ? S.seg(t, o.out, o.outDur || 0.6, 'power2.in') : 0;
    // do centro para fora: o tracejado começa no meio
    if (o.centro) {
      const l = this.len * p;
      this.e.setAttribute('stroke-dasharray', `0 ${(this.len - l) / 2} ${l} ${this.len}`);
    } else {
      this.e.setAttribute('stroke-dashoffset', (this.len * (1 - p)).toFixed(1));
    }
    this.e.setAttribute('opacity', ((o.op || 0.4) * (1 - po)).toFixed(3));
    this.e.style.visibility = p > 0 && po < 1 ? 'visible' : 'hidden';
  };

  // Formas da marca (diagonal, triângulo, barra) espalhadas em profundidade: a câmera atravessa.
  function Tunel(svg, n) {
    const rng = S.rng(77);
    this.f = [];
    for (let i = 0; i < n; i++) {
      const tipo = ['diag', 'tri', 'barra'][i % 3];
      const g = M.svgEl('g', {}, svg);
      let e;
      if (tipo === 'diag') e = M.svgEl('polygon', { points: M.pts(M.paralelogramo(0, 0, 250, 720)) }, g);
      else if (tipo === 'tri') e = M.svgEl('polygon', { points: '-150,-110 150,-110 0,150', 'stroke-linejoin': 'round' }, g);
      else e = M.svgEl('rect', { x: -380, y: -95, width: 760, height: 190, rx: 95 }, g);
      e.setAttribute('fill', 'none'); e.setAttribute('stroke', '#fff');
      e.setAttribute('vector-effect', 'non-scaling-stroke');
      this.f.push({ g, e, z: 1.0 + i * 1.05, ox: (rng() - 0.5) * 520, oy: (rng() - 0.5) * 700, rot: (rng() - 0.5) * 24 });
    }
  }
  // cz: posição da câmera; cx, cy: centro da tela; luz: 0..1 intensidade geral
  Tunel.prototype.set = function (cz, cx, cy, luz) {
    this.f.forEach((f) => {
      const d = f.z - cz;
      if (d <= 0.12 || luz <= 0) { f.g.style.visibility = 'hidden'; return; }
      const s = 1.5 / d;
      const op = M.clamp((d - 0.12) / 0.7, 0, 1) * M.clamp((7.5 - d) / 3, 0, 1) * 0.55 * luz;
      f.g.style.visibility = op > 0.003 ? 'visible' : 'hidden';
      f.g.setAttribute('transform', `translate(${(cx + f.ox * s).toFixed(1)} ${(cy + f.oy * s).toFixed(1)}) rotate(${f.rot.toFixed(2)}) scale(${s.toFixed(4)})`);
      f.e.setAttribute('stroke-width', (1.2 + 1.6 / d).toFixed(2));
      f.e.setAttribute('opacity', op.toFixed(3));
    });
  };

  window.GEO = { Cortina, Traco, Tunel };
})();
