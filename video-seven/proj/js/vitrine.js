// ProductShowcase: fotos de mockup em cartões com cantos arredondados (como a marca),
// reveladas por uma cortina diagonal na inclinação do 7, com aproximação lenta e paralaxe.
(function () {
  const S = STUDIO, M = MARCA;

  // o = { x, y, w, h, src, in, raio, foco:'50% 50%' }
  function Cartao(parent, o) {
    this.o = o;
    this.el = M.div('cartao', parent, {
      position: 'absolute', left: o.x + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px',
      borderRadius: (o.raio || 40) + 'px', overflow: 'hidden', background: 'var(--profundo)',
    });
    this.img = document.createElement('img');
    this.img.src = o.src;
    Object.assign(this.img.style, {
      position: 'absolute', left: '-6%', top: '-6%', width: '112%', height: '112%',
      objectFit: 'cover', objectPosition: o.foco || '50% 50%',
    });
    this.el.appendChild(this.img);
  }
  // dx: deslocamento da câmera lateral (px), usado para a paralaxe da foto dentro do cartão
  Cartao.prototype.set = function (t, dx) {
    const o = this.o, k = M.K, h = o.h;
    const p = S.seg(t, o.in, o.dur || 1.0, 'expo.inOut');
    const X1 = p * (o.w + k * h + 10);
    this.el.style.clipPath = `polygon(0 0, ${X1.toFixed(1)}px 0, ${(X1 - k * h).toFixed(1)}px 100%, 0 100%)`;
    this.el.style.visibility = p > 0 ? 'visible' : 'hidden';
    // aproximação lenta (1,1 → 1,0) e a foto corre um pouco mais devagar que o cartão
    const z = S.mix(1.16, 1.0, S.seg(t, o.in, o.vida || 4.2, 'sine.inOut'));
    this.img.style.transform = `translateX(${(-(dx || 0) * 0.12).toFixed(1)}px) scale(${z.toFixed(4)})`;
  };

  window.Vitrine = { Cartao };
})();
