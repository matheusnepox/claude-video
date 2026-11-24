// Reels "O que a SEVEN faz?": gancho, promessa, três serviços, valor e assinatura. Um relógio só.
(function () {
  const S = STUDIO, M = MARCA, R = ROTEIRO;
  const root = document.getElementById('root');
  const camada = (z) => M.div('', root, { position: 'absolute', inset: '0', zIndex: z, overflow: 'hidden' });
  const linhas = (parent, txts, specs) => new TIPO.Bloco(parent, txts.map((tx, i) => Object.assign({ texto: tx }, specs[i])));
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const svgTela = (parent) => { const s = M.svgEl('svg', { width: 1080, height: 1920 }); s.style.position = 'absolute'; parent.appendChild(s); return s; };
  const ICONES = {
    camadas: ['M50 16 L86 34 L50 52 L14 34 Z', 'M14 51 L50 69 L86 51', 'M14 68 L50 86 L86 68'],
    imagem: ['M16 22 H84 V78 H16 Z', 'M30 40 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0', 'M16 72 L40 50 L56 64 L66 55 L84 72'],
    lampada: ['M50 14 a24 24 0 0 1 15 42 V66 H35 V56 A24 24 0 0 1 50 14 Z', 'M39 75 H61 M43 84 H57', 'M50 2 V7 M15 24 L19 27 M85 24 L81 27'],
  };
  const camadas = [];

  // formas da marca que derivam no fundo (verde-claro bem transparente)
  function fundo(L, semente) {
    const s = svgTela(L);
    const rng = S.rng(semente);
    const f = [0, 1].map((i) => {
      const e = M.svgEl('polygon', { points: M.pts(M.paralelogramo(0, 0, 360, 1100)), fill: '#DCEBE3', opacity: 0.06 }, s);
      return { e, x: i ? 1060 : 20, y: i ? 1700 : 200, v: 18 + rng() * 14 };
    });
    return (t, t0) => f.forEach((q, i) => {
      const d = (t - t0) * q.v * (i ? -1 : 1);
      q.e.setAttribute('transform', `translate(${(q.x + M.K * -d).toFixed(1)} ${(q.y + d).toFixed(1)})`);
    });
  }

  // ---------- GANCHO ----------
  const G = R.gancho;
  const L1 = camada(1);
  const f1 = fundo(L1, 1);
  const simb = new LogoReveal(L1, LOGO.simbolo, 229);
  const tG = linhas(L1, G.linhas, [
    { x: 96, y: 960, size: 100, weight: 500, in: G.texto, out: G.sai },
    { x: 86, y: 1070, size: 250, weight: 700, ls: -0.035, color: 'var(--claro)', in: G.texto + 0.18, out: G.sai + 0.05, expand: 1.1 },
    { x: 96, y: 1340, size: 100, weight: 500, in: G.texto + 1.15, out: G.sai + 0.1 },
  ]);
  camadas.push({ L: L1, de: 0, ate: R.promessa.cortina + 0.8, set(t) {
    f1(t, 0);
    const s = 380 / 844 * S.mix(1, 1.04, S.seg(t, 0.5, 2.5, 'sine.inOut'));
    simb.pos(96 - 33 * s, 300 - 32 * s, s);
    simb.set(t, { barra: G.simbolo, dBarra: 0.5, haste: G.simbolo + 0.12, dHaste: 0.55, tri: G.simbolo + 0.35 });
    tG.set(t);
  } });

  // ---------- PROMESSA ----------
  const P = R.promessa;
  const c2 = new GEO.Cortina(root, 'var(--verde)', P.cortina, 0.8, 2);
  const L2 = camada(3);
  const f2 = fundo(L2, 2);
  const tP = linhas(L2, P.linhas, [
    { x: 96, y: 700, size: 104, weight: 500, in: P.texto, out: P.sai },
    { x: 86, y: 820, size: 230, weight: 700, ls: -0.035, color: 'var(--claro)', in: P.texto + 0.2, out: P.sai + 0.05, expand: 1.1 },
    { x: 96, y: 1070, size: 112, weight: 600, in: P.texto + 0.45, out: P.sai + 0.1 },
  ]);
  // marca-texto que passa por trás de "ideias" e inverte a cor da palavra
  const lnI = tP.l[1];
  // cópia da linha por cima: fundo claro e letras verdes, revelada da esquerda para a direita
  const marca = lnI.mask.cloneNode(true);
  marca.style.background = 'var(--claro)';
  marca.style.color = 'var(--verde)';
  L2.appendChild(marca);
  const marcaIn = marca.lastChild;
  const linhaP = new GEO.Traco(svgTela(L2), 96, 1260, 984, 1260, { in: P.texto + 0.7, dur: 1.0, op: 0.45, out: P.sai, outDur: 0.4 });
  camadas.push({ c: c2, L: L2, de: P.cortina, ate: R.servicos[0].ini + 0.7, set(t) {
    f2(t, P.cortina); tP.set(t); linhaP.set(t);
    const pm = S.seg(t, P.texto + 0.85, 0.6, 'expo.inOut') - S.seg(t, P.sai - 0.1, 0.35, 'power3.in');
    const k = Math.max(0, pm);
    marcaIn.style.transform = lnI.inner.style.transform;
    marcaIn.style.letterSpacing = lnI.inner.style.letterSpacing;
    marcaIn.style.transformOrigin = lnI.inner.style.transformOrigin;
    marca.style.clipPath = `inset(52px ${((1 - k) * 100).toFixed(2)}% 18px 0)`;
    vis(marca, k > 0.001 && lnI.mask.style.visibility !== 'hidden');
  } });

  // ---------- SERVIÇOS ----------
  R.servicos.forEach((sv, k) => {
    const S0 = sv.ini, fimS = (R.servicos[k + 1] ? R.servicos[k + 1].ini : R.valor.cortina + 0.15);
    const c = new GEO.Cortina(root, sv.cor, S0 - 0.15, 0.8, 4 + k * 2);
    const L = camada(5 + k * 2);
    const fx = fundo(L, 10 + k);
    // número vazado
    const num = M.div('', L, { position: 'absolute', left: '76px', top: '150px', font: "700 230px/1 'Instrument Sans'", letterSpacing: '-0.04em',
      color: 'transparent', WebkitTextStroke: '3px #DCEBE3', overflow: 'hidden', padding: '0 6px 10px' });
    const numIn = M.div('', num, { display: 'inline-block' }); numIn.textContent = sv.num;
    // ícone desenhado dentro de um círculo
    const ic = M.svgEl('svg', { width: 180, height: 180, viewBox: '-40 -40 180 180' });
    Object.assign(ic.style, { position: 'absolute', left: '830px', top: '170px', overflow: 'visible' });
    L.appendChild(ic);
    const circ = M.svgEl('circle', { cx: 50, cy: 50, r: 82, fill: '#DCEBE3' }, ic);
    const tracos = ICONES[sv.icone].map((d) => M.svgEl('path', { d, fill: 'none', stroke: '#043D2D', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, ic));
    // título
    const tT = linhas(L, sv.titulo, sv.titulo.map((_, i) => ({ x: 88, y: 430 + i * 118, size: sv.titulo.length > 1 ? 112 : 132, weight: 700, ls: -0.03, in: S0 + 0.5 + i * 0.12, out: fimS - 0.55 })));
    // foto do mockup
    const yFoto = sv.titulo.length > 1 ? 700 : 620;
    const foto = new Vitrine.Cartao(L, { x: 72, y: yFoto, w: 936, h: 720, src: sv.foto, in: S0 + 0.8, dur: 1.0, foco: sv.foco, vida: 5.5 });
    // itens em pílulas
    const lista = M.div('', L, { position: 'absolute', left: '72px', top: (yFoto + 770) + 'px', width: '940px', display: 'flex', flexWrap: 'wrap', gap: '20px 18px' });
    const chips = sv.itens.map((tx) => {
      const c0 = M.div('', lista, { border: '3px solid #DCEBE3', borderRadius: '999px', padding: '18px 34px 20px', font: "600 46px/1 'Instrument Sans'", color: '#fff', whiteSpace: 'nowrap' });
      c0.textContent = tx;
      return c0;
    });
    camadas.push({ c, L, de: S0 - 0.15, ate: fimS + 0.7, set(t) {
      fx(t, S0);
      const pn = S.seg(t, S0 + 0.3, 0.9, 'expo.out') - S.seg(t, fimS - 0.6, 0.4, 'power3.in');
      numIn.style.transform = `translateY(${((1 - pn) * 105).toFixed(1)}%)`;
      const pc = S.seg(t, S0 + 0.35, 0.7, 'back.out(1.6)') * (1 - S.seg(t, fimS - 0.55, 0.35, 'power3.in'));
      circ.setAttribute('r', (82 * S.mix(0.75, 1, pc)).toFixed(2));
      ic.style.opacity = Math.min(1, pc * 3).toFixed(3);
      tracos.forEach((p, i) => p.setAttribute('stroke-dashoffset', (1 - S.seg(t, S0 + 0.6 + i * 0.22, 0.8, 'expo.inOut')).toFixed(4)));
      tT.set(t);
      foto.set(t, 0);
      chips.forEach((ch, i) => {
        const t0 = S0 + 1.7 + i * 0.22;
        const p = S.seg(t, t0, 0.6, 'expo.out') * (1 - S.seg(t, fimS - 0.5 + i * 0.03, 0.35, 'power3.in'));
        vis(ch, t >= t0 && p > 0.001);
        ch.style.transform = `translateY(${((1 - p) * 40).toFixed(1)}px) scale(${S.mix(0.86, 1, p).toFixed(4)})`;
        ch.style.opacity = Math.min(1, p * 1.6).toFixed(3);
        // a pílula "acende" (fundo claro) uma de cada vez, como uma lista sendo marcada
        const aceso = t >= t0 + 0.4 && t < t0 + 0.4 + 0.55;
        ch.style.background = aceso ? '#DCEBE3' : 'transparent';
        ch.style.color = aceso ? '#043D2D' : '#fff';
      });
    } });
  });

  // ---------- VALOR ----------
  const V = R.valor;
  const cV = new GEO.Cortina(root, 'var(--verde)', V.cortina, 0.8, 10);
  const LV = camada(11);
  const fV = fundo(LV, 30);
  const tV = linhas(LV, V.linhas, [
    { x: 96, y: 420, size: 92, weight: 500, in: V.texto, out: V.sai },
    { x: 96, y: 530, size: 92, weight: 500, in: V.texto + 0.15, out: V.sai + 0.04 },
    { x: 84, y: 650, size: 250, weight: 700, ls: -0.035, color: 'var(--claro)', in: V.texto + 0.5, out: V.sai + 0.08, expand: 1.2 },
  ]);
  const mosaico = V.fotos.map((src, i) => new Vitrine.Cartao(LV, { x: 72 + (i % 2) * 478, y: 990 + Math.floor(i / 2) * 400, w: 458, h: 380, src, in: V.texto + 0.6 + i * 0.15, dur: 0.9, raio: 30, vida: 4 }));
  camadas.push({ c: cV, L: LV, de: V.cortina, ate: R.final.cortina + 0.8, set(t) {
    fV(t, V.cortina); tV.set(t);
    const sai = S.seg(t, V.sai - 0.2, 0.5, 'power3.in');
    mosaico.forEach((m, i) => { m.set(t, 0); m.el.style.transform = `translateY(${(sai * (i < 2 ? 1 : 1.3) * 120).toFixed(1)}px)`; m.el.style.opacity = (1 - sai).toFixed(3); });
  } });

  // ---------- ASSINATURA ----------
  const F = R.final;
  const cF = new GEO.Cortina(root, 'var(--profundo)', F.cortina, 0.8, 12);
  const LF = camada(13);
  const fF = fundo(LF, 40);
  const lockup = new LogoReveal(LF, LOGO.lockup, 89);
  const cta = M.div('', LF, { position: 'absolute', left: '0', width: '1080px', top: '1160px', display: 'flex', justifyContent: 'center' });
  const btn = M.div('', cta, { display: 'flex', alignItems: 'center', gap: '22px', background: '#DCEBE3', color: '#043D2D', borderRadius: '999px', padding: '30px 54px 32px', font: "700 50px/1 'Instrument Sans'", letterSpacing: '0.04em' });
  M.div('', btn, {}).textContent = F.textoCta;
  const seta = M.svgEl('svg', { width: 46, height: 46, viewBox: '0 0 46 46' });
  M.svgEl('path', { d: 'M6 23 H38 M25 10 L38 23 L25 36', fill: 'none', stroke: '#043D2D', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, seta);
  btn.appendChild(seta);
  camadas.push({ c: cF, L: LF, de: F.cortina, ate: 99, set(t) {
    fF(t, F.cortina);
    const s = 880 / 1152 * S.mix(1.03, 1, S.seg(t, F.logo, 4, 'power2.out'));
    lockup.pos(540 - 594 * s, 820 - 155 * s, s);
    lockup.set(t, { barra: F.logo, dBarra: 0.55, haste: F.logo + 0.15, dHaste: 0.6, tri: F.logo + 0.45, letras: F.logo + 0.8, assin: F.logo + 1.6 });
    vis(lockup.svg, t >= F.logo);
    const p = S.seg(t, F.cta, 0.8, 'back.out(1.4)');
    vis(cta, t >= F.cta);
    const pulso = 1 + 0.025 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - F.cta - 1) / 1.2));
    btn.style.transform = `translateY(${((1 - p) * 60).toFixed(1)}px) scale(${(S.mix(0.9, 1, p) * pulso).toFixed(4)})`;
    btn.style.opacity = Math.min(1, p * 1.5).toFixed(3);
    seta.style.transform = `translateX(${(8 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - F.cta - 1) / 1.2))).toFixed(1)}px)`;
  } });

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    camadas.forEach((c) => {
      if (c.c) c.c.set(t);
      const on = t >= c.de && t < c.ate;
      vis(c.L, on);
      if (on) c.set(t);
    });
  }, { loop: false });
})();
