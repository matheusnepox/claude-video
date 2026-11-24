// BrandColors + utilidades da marca SEVEN.
// Todas as cores do filme saem daqui. Para mudar a paleta, mude só este bloco.
(function () {
  const CORES = {
    verde: '#07583F',     // VERDE SEVEN (protagonista)
    profundo: '#043D2D',  // VERDE PROFUNDO (abertura e vitrine)
    branco: '#FFFFFF',    // BRANCO
    claro: '#DCEBE3',     // VERDE CLARO (o único destaque)
  };
  // Ângulo da diagonal do 7, medido na logo original: 60,5° em relação à horizontal.
  const ANG = 60.5 * Math.PI / 180;
  const K = 1 / Math.tan(ANG); // deslocamento horizontal por pixel de altura

  const root = document.documentElement.style;
  Object.entries(CORES).forEach(([k, v]) => root.setProperty('--' + k, v));

  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function div(cls, parent, css) {
    const e = document.createElement('div');
    if (cls) e.className = cls;
    if (css) Object.assign(e.style, css);
    (parent || document.getElementById('root')).appendChild(e);
    return e;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // paralelogramo na inclinação da marca: centro (x, y), largura horizontal w, altura h
  function paralelogramo(x, y, w, h) {
    const d = h * K / 2;
    return [[x - w / 2 + d, y - h / 2], [x + w / 2 + d, y - h / 2], [x + w / 2 - d, y + h / 2], [x - w / 2 - d, y + h / 2]];
  }
  const pts = (arr) => arr.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  window.MARCA = { CORES, ANG, K, svgEl, div, clamp, paralelogramo, pts, NS };
})();
