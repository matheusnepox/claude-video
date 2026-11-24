// O filme: cinco atos, um relógio só. render(t) desenha o quadro inteiro a partir de t.
(function () {
  const S = STUDIO, M = MARCA, R = ROTEIRO, T = R.marcos, X = R.textos;
  const root = document.getElementById('root');
  const camada = (z) => M.div('camada', root, { position: 'absolute', inset: '0', zIndex: z, overflow: 'hidden' });
  const svgTela = (parent) => {
    const s = M.svgEl('svg', { width: 1080, height: 1920, viewBox: '0 0 1080 1920' });
    Object.assign(s.style, { position: 'absolute', left: 0, top: 0 });
    parent.appendChild(s);
    return s;
  };
  const linhas = (parent, txts, specs) => new TIPO.Bloco(parent, txts.map((tx, i) => Object.assign({ texto: tx }, specs[i])));
  const dir = [Math.cos(M.ANG), -Math.sin(M.ANG)]; // direção da diagonal do 7 (para cima e à direita)

  // ---------- ATO 1: ORIGEM ----------
  const L1 = camada(1);
  const s1 = svgTela(L1);
  const g1 = M.svgEl('g', {}, s1);
  const P = [540, 700];
  const tracos = [
    new GEO.Traco(g1, P[0] - 640, P[1], P[0] + 640, P[1], { in: 1.0, dur: 1.4, centro: true, op: 0.42, out: 4.9, outDur: 0.7 }),
    new GEO.Traco(g1, P[0] - dir[0] * 760, P[1] - dir[1] * 760, P[0] + dir[0] * 760, P[1] + dir[1] * 760, { in: 1.35, dur: 1.5, centro: true, op: 0.42, out: 4.9, outDur: 0.7 }),
    new GEO.Traco(g1, P[0] - 260 - dir[0] * 900, P[1] - dir[1] * 900, P[0] - 260 + dir[0] * 900, P[1] + dir[1] * 900, { in: 2.3, dur: 1.7, centro: true, op: 0.16, out: 4.9, outDur: 0.7 }),
    new GEO.Traco(g1, P[0] + 260 - dir[0] * 900, P[1] - dir[1] * 900, P[0] + 260 + dir[0] * 900, P[1] + dir[1] * 900, { in: 2.5, dur: 1.7, centro: true, op: 0.16, out: 4.9, outDur: 0.7 }),
  ];
  const arco = M.svgEl('circle', { cx: P[0], cy: P[1], r: 190, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, g1);
  const arcoLen = 2 * Math.PI * 190;
  arco.setAttribute('stroke-dasharray', arcoLen + ' ' + arcoLen);
  arco.setAttribute('transform', `rotate(-90 ${P[0]} ${P[1]})`);
  const ponto = M.svgEl('circle', { cx: P[0], cy: P[1], r: 7, fill: '#fff' }, g1);
  const tIdeia = linhas(L1, X.ideia, [
    { x: 96, y: 1120, size: 80, weight: 500, in: T.ideiaTexto, out: T.ideiaSai },
    { x: 96, y: 1215, size: 80, weight: 500, in: T.ideiaTexto + 0.15, out: T.ideiaSai + 0.05 },
    { x: 92, y: 1320, size: 250, weight: 700, color: 'var(--claro)', ls: -0.035, in: T.ideia, expand: 1.3, out: T.ideiaSai + 0.1 },
  ]);

  // ---------- ATO 2: INSPIRAÇÃO ----------
  const L2 = camada(2);
  const tunel = new GEO.Tunel(svgTela(L2), 11);
  const tCriados = linhas(L2, X.criados, [
    { x: 96, y: 1150, size: 100, weight: 600, in: T.criados, out: T.criadosSai },
    { x: 96, y: 1265, size: 100, weight: 600, in: T.criados + 0.18, out: T.criadosSai + 0.05 },
  ]);
  const tCriar = linhas(L2, X.criar, [
    { x: 100, y: 1075, size: 78, weight: 400, in: T.para, out: T.criarSai },
    { x: 88, y: 1165, size: 224, weight: 700, color: 'var(--claro)', ls: -0.03, in: T.criar, expand: 1.5, out: T.criarSai + 0.05 },
  ]);

  // ---------- ATO 3: IDENTIDADE ----------
  const cortina1 = new GEO.Cortina(root, 'var(--verde)', T.cortina1, 0.9, 3);
  const L3 = camada(4);
  // janela do broto: paralelogramo na inclinação do 7
  const jan = M.div('', L3, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px' });
  const janPts = [[881, 330], [1321, 330], [840, 1180], [400, 1180]];
  jan.style.clipPath = 'polygon(' + janPts.map((p) => p[0] + 'px ' + p[1] + 'px').join(',') + ')';
  const broto = document.createElement('img');
  broto.src = 'media/broto.jpg';
  Object.assign(broto.style, { position: 'absolute', left: '380px', top: '330px', width: '720px', height: '850px', objectFit: 'cover', objectPosition: '45% 50%' });
  jan.appendChild(broto);
  const pilula = M.div('', L3, { position: 'absolute', left: '640px', top: '160px', width: '620px', height: '170px', borderRadius: '85px', background: 'var(--claro)' });
  const simbolo = new LogoReveal(L3, LOGO.simbolo, 229).comGuias([
    [-300, 32, 1200, 32],
    [787 + 226 * 1.4, 300 - 400 * 1.4, 561 - 226 * 0.9, 700 + 400 * 0.9],
    [33, -300, 33, 1100],
  ]);
  const tSete = linhas(L3, X.sete, [
    { x: 90, y: 1205, size: 190, weight: 700, ls: -0.03, in: T.sete, out: T.seteSai },
    { x: 96, y: 1430, size: 74, weight: 500, in: T.sete + 0.45, out: T.seteSai + 0.05 },
    { x: 96, y: 1520, size: 74, weight: 600, color: 'var(--claro)', in: T.sete + 0.6, out: T.seteSai + 0.1 },
  ]);
  const tEsp = linhas(L3, X.esperanca, [
    { x: 92, y: 1290, size: 136, weight: 700, color: 'var(--claro)', ls: -0.03, in: T.esperanca, out: T.atoTresSai },
    { x: 96, y: 1440, size: 64, weight: 500, in: T.esperanca + 0.15, out: T.atoTresSai + 0.04 },
    { x: 92, y: 1560, size: 106, weight: 700, ls: -0.03, in: T.criatividade, out: T.atoTresSai + 0.08 },
    { x: 96, y: 1695, size: 64, weight: 500, in: T.criatividade + 0.15, out: T.atoTresSai + 0.12 },
  ]);

  // ---------- ATO 4: EXPRESSÃO ----------
  const cortina2 = new GEO.Cortina(root, 'var(--profundo)', T.cortina2, 0.85, 5);
  const L4 = camada(6);
  const mundo = M.div('', L4, { position: 'absolute', left: 0, top: 0, width: '3240px', height: '1920px' });
  const fundo4 = M.svgEl('svg', { width: 4000, height: 1920 });
  Object.assign(fundo4.style, { position: 'absolute', left: 0, top: 0 });
  L4.insertBefore(fundo4, mundo);
  [[700, 1500, 340, 1300], [1900, 500, 300, 1100], [3000, 1450, 360, 1300]].forEach(([x, y, w, h]) =>
    M.svgEl('polygon', { points: M.pts(M.paralelogramo(x, y, w, h)), fill: '#DCEBE3', opacity: 0.05 }, fundo4));
  const beats = X.vitrine.map((v, i) => {
    const g = M.div('', mundo, { position: 'absolute', left: i * 1080 + 'px', top: 0, width: '1080px', height: '1920px' });
    const t0 = T.vitrine[i];
    const a = new Vitrine.Cartao(g, { x: 72, y: 190, w: 936, h: 880, src: v.fotos[0], in: t0, dur: 1.05 });
    const secG = M.div('', g, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px' });
    const b = new Vitrine.Cartao(secG, { x: 590, y: 880, w: 418, h: 520, src: v.fotos[1], in: t0 + 0.4, dur: 0.95, raio: 32 });
    b.el.style.outline = '12px solid var(--profundo)';
    const fim = i === 2 ? T.vitrineSai : null;
    const tx = linhas(g, v.linhas, [
      { x: 96, y: 1500, size: 78, weight: 500, in: t0 + 0.55, out: fim },
      { x: 92, y: 1600, size: 104, weight: 700, ls: -0.03, color: 'var(--claro)', in: t0 + 0.7, out: fim != null ? fim + 0.05 : null },
    ]);
    return { a, b, secG, tx, i };
  });

  // ---------- ATO 5: REVELAÇÃO ----------
  const cortina3 = new GEO.Cortina(root, 'var(--verde)', T.cortina3, 0.85, 7);
  const L5 = camada(8);
  const s5 = svgTela(L5);
  const deco = [
    { pts: M.paralelogramo(0, 0, 420, 1300), de: [-420, -260], ate: [-60, 120] },
    { pts: M.paralelogramo(0, 0, 420, 1300), de: [1500, 2200], ate: [1120, 1820] },
  ].map((d) => Object.assign(d, { e: M.svgEl('polygon', { points: M.pts(d.pts), fill: '#DCEBE3', opacity: 0 }, s5) }));
  // as peças do 7 (barra, haste, triângulo) chegam soltas e se juntam no lugar exato do símbolo do lockup
  const conv = [
    { e: M.svgEl('rect', { x: -350, y: -95, width: 700, height: 190, rx: 95 }, s5), de: [860, 330], ate: [199, 819], sf: 0.35, rot: 14 },
    { e: M.svgEl('polygon', { points: M.pts(M.paralelogramo(0, 0, 300, 900)) }, s5), de: [880, 1480], ate: [238, 930], sf: 0.24, rot: -12 },
    { e: M.svgEl('polygon', { points: '-190,-140 190,-140 0,190' }, s5), de: [-40, 560], ate: [135, 906], sf: 0.22, rot: -25 },
    { e: M.svgEl('polygon', { points: M.pts(M.paralelogramo(0, 0, 220, 640)) }, s5), de: [120, 1560], ate: [238, 930], sf: 0.3, rot: 10 },
  ];
  conv.forEach((c) => { c.e.setAttribute('fill', '#DCEBE3'); c.e.setAttribute('stroke-linejoin', 'round'); });
  const lockup = new LogoReveal(L5, LOGO.lockup, 89);
  const tFrase = linhas(L5, X.frase, [
    { align: 'center', y: 1010, size: 54, weight: 500, ls: 0.06, color: 'var(--claro)', in: T.frase, out: T.fraseSai },
    { align: 'center', y: 1095, size: 92, weight: 700, ls: -0.025, in: T.frase + 0.7, out: T.fraseSai + 0.05 },
    { align: 'center', y: 1200, size: 92, weight: 700, ls: -0.025, in: T.frase + 0.85, out: T.fraseSai + 0.1 },
  ]);

  // grão discreto por cima de tudo (textura de papel/filme; muda a cada quadro, sem aleatório)
  const grao = M.div('', root, { position: 'absolute', inset: '0', zIndex: 20, backgroundImage: 'url(assets/grao.png)',
    opacity: 0.055, mixBlendMode: 'overlay', pointerEvents: 'none' });

  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    // ATO 1
    const on1 = t < T.cortina1 + 0.9;
    vis(L1, on1);
    if (on1) {
      const push = 1 + 0.07 * S.seg(t, 0, 5.6, 'sine.inOut');
      g1.setAttribute('transform', `translate(${P[0]} ${P[1]}) scale(${push.toFixed(4)}) translate(${-P[0]} ${-P[1]})`);
      tracos.forEach((x) => x.set(t));
      const pa = S.seg(t, 1.9, 1.6, 'expo.inOut'), pao = S.seg(t, 4.9, 0.7, 'power2.in');
      arco.setAttribute('stroke-dashoffset', (arcoLen * (1 - pa)).toFixed(1));
      arco.setAttribute('opacity', (0.3 * (1 - pao)).toFixed(3));
      const pp = S.seg(t, T.ponto, 0.7, 'expo.out'), ppo = S.seg(t, 4.95, 0.6, 'power2.in');
      ponto.setAttribute('r', (S.mix(4.2, 7, pp) * (1 - 0.4 * ppo)).toFixed(2));
      ponto.setAttribute('opacity', (pp * (1 - ppo)).toFixed(3));
      tIdeia.set(t);
    }
    // ATO 2
    const on2 = t >= T.tunel && t < T.cortina1 + 0.9;
    vis(L2, on2);
    if (on2) {
      const cz = S.mix(-1.2, 9.6, S.seg(t, T.tunel, 6.5, 'power2.inOut'));
      tunel.set(cz, 540, 820, S.seg(t, T.tunel, 0.9, 'power2.out') * (1 - S.seg(t, T.criarSai, 0.5, 'power2.in')));
      tCriados.set(t); tCriar.set(t);
    }
    // ATO 3
    cortina1.set(t);
    const on3 = t >= T.cortina1 && t < T.cortina2 + 0.85;
    vis(L3, on3);
    if (on3) {
      const pm = S.seg(t, T.simboloSobe, 1.0, 'expo.inOut');
      const s0 = 640 / 844 * (1 + 0.06 * S.seg(t, T.sete - 0.3, T.simboloSobe - T.sete + 0.3, 'sine.inOut')), s1v = 170 / 844;
      const sc = S.mix(s0, s1v, pm);
      const x0 = 540 - 455 * s0, y0 = 720 - 411 * s0, x1 = 96 - 33 * s1v, y1 = 170 - 32 * s1v;
      simbolo.pos(S.mix(x0, x1, pm), S.mix(y0, y1, pm), sc);
      simbolo.set(t, { guias: T.guias, barra: T.barra, haste: T.haste, tri: T.tri });
      tSete.set(t);
      const pj = S.seg(t, T.broto, 1.15, 'expo.out');
      const D = (1 - pj) * 1150;
      jan.style.transform = `translate(${(dir[0] * D).toFixed(1)}px, ${(dir[1] * D).toFixed(1)}px)`;
      vis(jan, pj > 0);
      broto.style.transform = `scale(${S.mix(1.16, 1.0, S.seg(t, T.broto, 3.2, 'power2.out')).toFixed(4)})`;
      const pl = S.seg(t, T.broto + 0.3, 1.0, 'expo.out');
      pilula.style.transform = `translateX(${((1 - pl) * 640).toFixed(1)}px)`;
      vis(pilula, pl > 0);
      tEsp.set(t);
    }
    // ATO 4
    cortina2.set(t);
    const on4 = t >= T.cortina2 && t < T.cortina3 + 0.85;
    vis(L4, on4);
    if (on4) {
      const cam = 1080 * (S.seg(t, T.panoramica[0], 0.95, 'expo.inOut') + S.seg(t, T.panoramica[1], 0.95, 'expo.inOut'));
      mundo.style.transform = `translateX(${(-cam).toFixed(1)}px)`;
      fundo4.style.transform = `translateX(${(-cam * 0.55).toFixed(1)}px)`;
      beats.forEach((b) => {
        const rel = cam - b.i * 1080;
        b.a.set(t, rel); b.b.set(t, rel);
        b.secG.style.transform = `translateX(${(-rel * 0.14).toFixed(1)}px)`;
        b.tx.set(t);
      });
    }
    // ATO 5
    cortina3.set(t);
    const on5 = t >= T.cortina3;
    vis(L5, on5);
    if (on5) {
      // entram rápido, flutuam e então se juntam acelerando até o impacto
      const pc = 0.35 * S.seg(t, T.cortina3 + 0.2, 1.2, 'expo.out') + 0.65 * S.seg(t, T.convergem + 0.6, T.impacto - T.convergem - 0.6, 'expo.in');
      const pin = S.seg(t, T.cortina3 + 0.3, 0.8, 'expo.out');
      const sumir = S.seg(t, T.impacto - 0.08, 0.22, 'power2.out');
      conv.forEach((c) => {
        const x = S.mix(c.de[0], c.ate[0], pc), y = S.mix(c.de[1], c.ate[1], pc);
        const s = S.mix(0.62, c.sf, pc);
        c.e.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(c.rot * (1 - pc)).toFixed(2)}) scale(${s.toFixed(4)})`);
        c.e.setAttribute('opacity', ((0.24 * pin + 0.5 * pc) * (1 - sumir)).toFixed(3));
      });
      const pd = S.seg(t, T.impacto, 1.6, 'expo.out');
      const deriva = S.seg(t, T.impacto, 11, 'sine.inOut') * 40;
      deco.forEach((d) => {
        const x = S.mix(d.de[0], d.ate[0], pd) + dir[0] * deriva, y = S.mix(d.de[1], d.ate[1], pd) + dir[1] * deriva;
        d.e.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        d.e.setAttribute('opacity', (0.07 * pd).toFixed(3));
      });
      const s = 900 / 1152 * S.mix(1.035, 1, S.seg(t, T.impacto, 5, 'power2.out'));
      const cy = S.mix(900, 760, S.seg(t, T.sobe, 0.9, 'expo.inOut') - S.seg(t, T.volta, 0.9, 'expo.inOut'));
      lockup.pos(540 - 594 * s, cy - 155 * s, s);
      lockup.set(t, { barra: T.impacto, dBarra: 0.55, haste: T.impacto + 0.15, dHaste: 0.6, tri: T.impacto + 0.45, letras: T.letras, assin: T.assinatura });
      vis(lockup.svg, t >= T.impacto);
      tFrase.set(t);
    }
    const f = Math.floor(t * 30);
    grao.style.backgroundPosition = `${(f * 137) % 512}px ${(f * 251) % 512}px`;
  }, { loop: false });
})();
