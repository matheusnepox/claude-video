// KineticTypography: linhas de texto que entram e saem deslizando dentro de uma máscara.
// Nada de fade: o texto sobe de dentro da linha (expo.out) e sai por cima (power3.in).
(function () {
  const S = STUDIO, M = MARCA;

  // o = { x, y, size, weight, color, ls, align:'left'|'center', in, out, dur, outDur, expand }
  function Linha(parent, texto, o) {
    const mask = M.div('linha', parent, {
      position: 'absolute', top: o.y + 'px', overflow: 'hidden',
      padding: '0.16em 0.04em 0.12em', margin: '-0.16em -0.04em 0',
      fontSize: o.size + 'px', fontWeight: o.weight || 600, lineHeight: 1,
      letterSpacing: (o.ls != null ? o.ls : -0.02) + 'em', whiteSpace: 'nowrap',
      color: o.color || 'var(--branco)',
    });
    if (o.align === 'center') { mask.style.left = '0'; mask.style.width = '1080px'; mask.style.textAlign = 'center'; }
    else mask.style.left = o.x + 'px';
    const inner = M.div('', mask, { display: 'inline-block', willChange: 'transform' });
    inner.textContent = texto;
    this.mask = mask; this.inner = inner; this.o = o;
  }
  Linha.prototype.set = function (t) {
    const o = this.o;
    const pin = S.seg(t, o.in, o.dur || 0.75, o.ease || 'expo.out');
    const pout = o.out != null ? S.seg(t, o.out, o.outDur || 0.42, 'power3.in') : 0;
    const vis = t >= o.in && pout < 1;
    this.mask.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) return;
    const y = (1 - pin) * 112 - pout * 112;
    let tr = `translateY(${y.toFixed(2)}%)`;
    if (o.expand) {
      // expansão: o tracking abre e a palavra cresce de 0,88 para 1 (nunca a partir do zero)
      const pe = S.seg(t, o.in, o.expand, 'expo.out');
      this.inner.style.letterSpacing = S.mix(-0.11, o.ls != null ? o.ls : -0.03, pe) + 'em';
      tr += ` scale(${S.mix(0.88, 1, pe).toFixed(4)})`;
      this.inner.style.transformOrigin = '0% 80%';
    }
    this.inner.style.transform = tr;
  };

  // um bloco de linhas com o mesmo ritmo
  function Bloco(parent, linhas) {
    this.l = linhas.map((d) => new Linha(parent, d.texto, d));
  }
  Bloco.prototype.set = function (t) { this.l.forEach((x) => x.set(t)); };

  window.TIPO = { Linha, Bloco };
})();
