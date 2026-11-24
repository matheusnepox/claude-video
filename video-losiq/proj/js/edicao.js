// Edição antes/depois da fachada da Ótica Losiq. Um relógio só: render(t) monta o quadro inteiro.
// Os tempos de cada tomada vêm do próprio HTML (data-start / data-duration dos vídeos).
(function () {
  const S = STUDIO, M = MARCA;
  const ui = document.getElementById('ui');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const K = M.K; // inclinação da diagonal do 7 (a assinatura discreta nas transições)

  // ---------- tomadas ----------
  const tomadas = Array.from(document.querySelectorAll('.tomada')).map((el) => {
    const v = el.querySelector('video');
    // enquadramento extra (para tirar da imagem o que não deve aparecer)
    if (el.dataset.origem) v.style.transformOrigin = el.dataset.origem;
    return { el, v, ini: +v.dataset.start, fim: +v.dataset.start + +v.dataset.duration, zoom: +(el.dataset.zoom || 1) };
  });
  // transições com cortina diagonal e fio branco (as demais são cortes secos na batida)
  const CORTINAS = { t3: 5.85, t10: 28.6 };
  const DUR_CORTINA = 0.7;

  const fio = M.svgEl('svg', { width: 1080, height: 1920 });
  Object.assign(fio.style, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' });
  ui.appendChild(fio);
  const linhaFio = M.svgEl('line', { stroke: '#fff', 'stroke-width': 4 }, fio);

  // ---------- textos (sobem de dentro de uma máscara) ----------
  function Texto(txt, css, cls, tin, tout, centro) {
    const m = document.createElement('div');
    m.className = cls || 'rotulo';
    Object.assign(m.style, { position: 'absolute', overflow: 'hidden', padding: '0.12em 0.1em 0.18em', margin: '-0.12em -0.1em 0' }, css);
    if (centro) Object.assign(m.style, { left: '0', width: '1080px', textAlign: 'center' });
    const i = document.createElement('div');
    i.textContent = txt; i.style.display = 'inline-block';
    m.appendChild(i); ui.appendChild(m);
    this.set = (t) => {
      const p = S.seg(t, tin, 0.9, 'expo.out') - S.seg(t, tout, 0.45, 'power3.in');
      vis(m, t >= tin && t < tout + 0.45);
      i.style.transform = `translateY(${((1 - p) * 115).toFixed(2)}%)`;
    };
  }
  const serifa = (px) => ({ fontSize: px + 'px', lineHeight: 1, color: '#fff' });
  const textos = [
    new Texto('ANTES', { left: '80px', top: '1690px' }, 'rotulo', 0.6, 5.3),
    new Texto('DEPOIS', { left: '80px', top: '1690px' }, 'rotulo', 6.35, 9.45),
    new Texto('ANTES', { left: '64px', top: '64px' }, 'rotulo', 10.35, 14.0),
    new Texto('DEPOIS', { left: '64px', top: '1024px' }, 'rotulo', 10.5, 14.0),
    new Texto('Ótica Losiq', Object.assign({ left: '76px', top: '1500px' }, serifa(118)), 'serifa', 14.85, 17.25),
    new Texto('INAUGURAÇÃO', { left: '82px', top: '1660px', fontSize: '30px' }, 'rotulo', 15.1, 17.3),
    new Texto('Uma nova fachada.', Object.assign({ left: '76px', top: '1420px' }, serifa(100)), 'serifa', 29.2, 31.25),
    new Texto('Um novo começo.', Object.assign({ left: '76px', top: '1540px' }, serifa(100)), 'serifa', 29.45, 31.3),
    new Texto('COBERTURA DA INAUGURAÇÃO', { top: '1075px', fontSize: '27px' }, 'rotulo', 33.25, 99, true),
  ];
  // traço fino sob os rótulos ANTES / DEPOIS da primeira parte
  const tracinho = M.div('', ui, { position: 'absolute', left: '80px', top: '1752px', height: '3px', background: '#fff', width: '0px' });
  // linha que divide o comparativo
  const divisa = M.div('', ui, { position: 'absolute', left: '0', top: '958px', height: '4px', background: '#fff', width: '1080px', transformOrigin: '50% 50%' });

  // véu escuro do fecho (cor sólida, sem degradê) e a assinatura
  const veu = M.div('', ui, { position: 'absolute', inset: '0', background: '#050A08', opacity: 0 });
  ui.insertBefore(veu, ui.firstChild);
  const lockup = new LogoReveal(ui, LOGO.lockup, 89);
  const preto = M.div('', ui, { position: 'absolute', inset: '0', background: '#000' });

  const cimaM = document.getElementById('cimaM'), baixoM = document.getElementById('baixoM');

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    let fioOn = false;
    tomadas.forEach((tm) => {
      const on = t >= tm.ini && t < tm.fim;
      vis(tm.el, on);
      if (!on) return;
      // aproximação lenta em cada tomada (1,0 → 1,045)
      const z = S.mix(1.0, 1.045, S.seg(t, tm.ini, tm.fim - tm.ini, 'sine.inOut'));
      if (tm.el.id !== 't4') tm.v.style.transform = `scale(${(z * tm.zoom).toFixed(4)})`;
      const tc = CORTINAS[tm.el.id];
      if (tc != null) {
        const p = S.seg(t, tc - DUR_CORTINA / 2, DUR_CORTINA, 'power3.inOut');
        const xs = S.mix(-700, 1800, p);
        tm.el.style.clipPath = p >= 1 ? 'none' : `polygon(-20px -20px, ${(xs + 980 * K).toFixed(1)}px -20px, ${(xs - 980 * K).toFixed(1)}px 1940px, -20px 1940px)`;
        if (p > 0 && p < 1) {
          fioOn = true;
          linhaFio.setAttribute('x1', (xs + 980 * K).toFixed(1)); linhaFio.setAttribute('y1', -20);
          linhaFio.setAttribute('x2', (xs - 980 * K).toFixed(1)); linhaFio.setAttribute('y2', 1940);
        }
      }
    });
    vis(fio, fioOn);
    // comparativo: as metades entram pelos lados opostos
    const pc = S.seg(t, 9.75, 0.9, 'expo.out');
    cimaM.style.transform = `translateY(${(-(1 - pc) * 960).toFixed(1)}px)`;
    baixoM.style.transform = `translateY(${((1 - pc) * 960).toFixed(1)}px)`;
    [cimaM, baixoM].forEach((h) => { h.querySelector('video').style.transform = `scale(${S.mix(1.04, 1.0, S.seg(t, 9.75, 4.55, 'sine.out')).toFixed(4)})`; });
    const pd = S.seg(t, 10.05, 0.8, 'expo.inOut');
    divisa.style.transform = `scaleX(${pd.toFixed(4)})`;
    vis(divisa, t >= 10.05 && t < 14.3);
    // traço dos rótulos
    const pt = S.seg(t, 0.75, 0.9, 'expo.out') - S.seg(t, 5.2, 0.4, 'power3.in') + S.seg(t, 6.5, 0.9, 'expo.out') - S.seg(t, 9.35, 0.4, 'power3.in');
    tracinho.style.width = (Math.max(0, pt) * 120).toFixed(1) + 'px';
    textos.forEach((x) => x.set(t));
    // fecho
    veu.style.opacity = (0.58 * S.seg(t, 31.35, 1.1, 'power2.inOut')).toFixed(3);
    const s = 540 / 1152;
    lockup.pos(540 - 594 * s, 905 - 155 * s, s);
    lockup.set(t, { barra: 31.8, dBarra: 0.55, haste: 31.95, dHaste: 0.6, tri: 32.25, letras: 32.6, assin: 33.35 });
    vis(lockup.svg, t >= 31.8);
    preto.style.opacity = (1 - S.seg(t, 0, 0.7, 'power2.out') + S.seg(t, 34.35, 0.55, 'power2.in')).toFixed(3);
  }, { loop: false });
})();
