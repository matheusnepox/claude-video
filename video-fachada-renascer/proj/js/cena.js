// Apresentação do projeto de fachada da Floricultura Renascer, feita pela SEVEN.
// Um relógio só: render(t) desenha o quadro inteiro.
(function () {
  const S = STUDIO, M = MARCA, R = ROTEIRO, T = R.marcos, X = R.textos, PJ = PROJETO, D = PJ.D;
  const root = document.getElementById('root');
  const camada = (z) => M.div('', root, { position: 'absolute', inset: '0', zIndex: z, overflow: 'hidden' });
  const linhas = (parent, txts, specs) => new TIPO.Bloco(parent, txts.map((tx, i) => Object.assign({ texto: tx }, specs[i])));
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const foto = (parent, src) => {
    const i = document.createElement('img'); i.src = src;
    Object.assign(i.style, { position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px', objectFit: 'cover', transformOrigin: '0 0' });
    parent.appendChild(i); return i;
  };
  // cartão sólido com título e subtítulo (sobe de dentro da máscara)
  function Cartao(parent, tit, sub, x, y, tin, tout) {
    const m = M.div('', parent, { position: 'absolute', left: x + 'px', top: y + 'px', overflow: 'hidden', borderRadius: '28px' });
    const c = M.div('', m, { background: 'var(--profundo)', borderRadius: '28px', padding: '30px 40px 32px', willChange: 'transform' });
    M.div('', c, { font: "700 64px/1 'Instrument Sans'", letterSpacing: '0.02em', color: 'var(--branco)' }).textContent = tit;
    M.div('', c, { font: "500 38px/1.2 'Instrument Sans'", color: 'var(--claro)', marginTop: '12px' }).textContent = sub;
    this.set = (t) => {
      const p = S.seg(t, tin, 0.8, 'expo.out') - (tout != null ? S.seg(t, tout, 0.4, 'power3.in') : 0);
      vis(m, t >= tin && (tout == null || t < tout + 0.4));
      c.style.transform = `translateY(${((1 - p) * 105).toFixed(2)}%)`;
    };
  }

  // ---------- 1. ABERTURA ----------
  const L1 = camada(1);
  const simb = new LogoReveal(L1, LOGO.simbolo, 229);
  const tAbre = linhas(L1, X.abertura, [
    { x: 96, y: 700, size: 40, weight: 600, ls: 0.22, color: 'var(--claro)', in: T.titulo, out: T.aberturaSai },
    { x: 92, y: 790, size: 120, weight: 500, ls: -0.03, in: T.titulo + 0.15, out: T.aberturaSai + 0.04 },
    { x: 88, y: 920, size: 186, weight: 700, ls: -0.035, color: 'var(--claro)', in: T.titulo + 0.3, out: T.aberturaSai + 0.08, expand: 1.2 },
  ]);
  const aberturaLinha = new GEO.Traco((() => { const s = M.svgEl('svg', { width: 1080, height: 1920 }); s.style.position = 'absolute'; L1.appendChild(s); return s; })(),
    96, 1205, 984, 1205, { in: T.medidas - 0.3, dur: 1.1, op: 0.5, out: T.aberturaSai, outDur: 0.4 });
  const tMed = linhas(L1, [X.medidas], [{ x: 96, y: 1240, size: 56, weight: 500, in: T.medidas, out: T.aberturaSai + 0.1 }]);

  // ---------- 2. ANTES ----------
  const cAntes = new GEO.Cortina(root, 'var(--profundo)', T.cortinaAntes, 0.9, 2);
  const imgAntes = foto(cAntes.cor, 'media/antes.jpg');
  const L2 = camada(3);
  const kAntes = new Cartao(L2, X.antes[0], X.antes[1], 56, 1580, T.cartaoAntes, T.antesSai);

  // ---------- 3. O PROJETO ----------
  const cProj = new GEO.Cortina(root, 'var(--profundo)', T.cortinaProjeto, 0.9, 4);
  const grade = M.svgEl('svg', { width: 1080, height: 1920 });
  grade.style.position = 'absolute';
  cProj.cor.appendChild(grade);
  for (let x = 36; x < 1080; x += 72) M.svgEl('line', { x1: x, y1: 0, x2: x, y2: 1920, stroke: '#DCEBE3', 'stroke-width': 1, opacity: 0.07 }, grade);
  for (let y = 24; y < 1920; y += 72) M.svgEl('line', { x1: 0, y1: y, x2: 1080, y2: y, stroke: '#DCEBE3', 'stroke-width': 1, opacity: 0.07 }, grade);
  const L3 = camada(5);
  const tProj = linhas(L3, X.projeto, [
    { x: 92, y: 210, size: 120, weight: 700, ls: -0.03, in: T.tituloProjeto, out: T.projetoSai },
    { x: 96, y: 360, size: 48, weight: 500, color: 'var(--claro)', in: T.tituloProjeto + 0.2, out: T.projetoSai + 0.05 },
  ]);
  // legenda das áreas de adesivo
  const leg = M.div('', L3, { position: 'absolute', left: '96px', top: '1560px', display: 'flex', alignItems: 'center', gap: '22px', overflow: 'hidden', padding: '6px 0' });
  const legIn = M.div('', leg, { display: 'flex', alignItems: 'center', gap: '22px' });
  M.div('', legIn, { width: '44px', height: '44px', borderRadius: '6px', background: 'var(--claro)' });
  M.div('', legIn, { font: "500 46px 'Instrument Sans'", color: 'var(--branco)' }).textContent = X.legenda;

  // a foto "depois", recortada pela silhueta do traço
  const Lfoto = camada(6);
  const imgDepois = foto(Lfoto, 'media/depois.jpg');

  // o desenho (SVG nas coordenadas do desenho original, levado à tela por homografia)
  const L4 = camada(7);
  const des = M.svgEl('svg', { width: D.largura, height: D.altura, viewBox: `0 0 ${D.largura} ${D.altura}`, overflow: 'visible' });
  Object.assign(des.style, { position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', overflow: 'visible' });
  L4.appendChild(des);
  const traco = (tag, attrs, w) => {
    const e = M.svgEl(tag, Object.assign({ fill: 'none', stroke: '#fff', 'stroke-width': w || 3, 'vector-effect': 'non-scaling-stroke', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-linejoin': 'round' }, attrs), des);
    return e;
  };
  const adesivosFill = D.adesivos.map(([x, y, w, h]) => M.svgEl('rect', { x, y, width: w, height: h, fill: '#DCEBE3', opacity: 0 }, des));
  const contorno = [traco('path', { d: D.contorno }, 4), traco('path', { d: D.divisas }, 3)];
  const adesivos = D.adesivos.map(([x, y, w, h]) => traco('rect', { x, y, width: w, height: h }, 3));
  const frisos = D.frisos.map(([x, y, w, h]) => traco('rect', { x, y, width: w, height: h }, 2));
  const cL = D.cotaL, cA = D.cotaA;
  const cotas = [
    traco('path', { d: `M${cL.x0},${cL.y} H${cL.x1} M${cL.x0},${cL.y - 6} V${cL.y + 6} M${cL.x1},${cL.y - 6} V${cL.y + 6}` }, 2),
    traco('path', { d: `M${cA.x},${cA.y0} V${cA.y1} M${cA.x - 6},${cA.y0} H${cA.x + 6} M${cA.x - 6},${cA.y1} H${cA.x + 6}` }, 2),
  ];
  cotas.forEach((c) => c.setAttribute('stroke', '#DCEBE3'));
  // os números das cotas ficam em HTML (nítidos), posicionados pela homografia
  const numL = M.div('', L4, { position: 'absolute', left: 0, top: 0, font: "600 44px 'Instrument Sans'", color: 'var(--claro)', whiteSpace: 'nowrap' });
  const numA = M.div('', L4, { position: 'absolute', left: 0, top: 0, font: "600 44px 'Instrument Sans'", color: 'var(--claro)', whiteSpace: 'nowrap' });
  const L4b = camada(8);
  const kDepois = new Cartao(L4b, X.depois[0], X.depois[1], 56, 1580, T.cartaoDepois, T.depoisSai);

  // ---------- 5. ANTES × DEPOIS ----------
  const L5 = camada(9);
  const cmpAntes = foto(L5, 'media/antes.jpg');
  const cmpDepWrap = M.div('', L5, { position: 'absolute', inset: '0' });
  foto(cmpDepWrap, 'media/depois.jpg');
  const div5 = M.svgEl('svg', { width: 1080, height: 1920 });
  div5.style.position = 'absolute';
  L5.appendChild(div5);
  const barra = M.svgEl('rect', { x: -3, y: 0, width: 6, height: 1920, fill: '#fff' }, div5);
  const alca = M.svgEl('g', {}, div5);
  M.svgEl('circle', { cx: 0, cy: 960, r: 46, fill: '#fff' }, alca);
  M.svgEl('path', { d: 'M-12,942 L-26,960 L-12,978 M12,942 L26,960 L12,978', stroke: '#07583F', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, alca);
  const etiqueta = (txt, lado) => {
    const m = M.div('', L5, { position: 'absolute', top: '120px', overflow: 'hidden', borderRadius: '22px' });
    m.style[lado] = '48px';
    const c = M.div('', m, { background: 'var(--profundo)', padding: '18px 30px', font: "700 46px/1 'Instrument Sans'", letterSpacing: '0.04em', color: 'var(--branco)' });
    c.textContent = txt;
    return { m, c };
  };
  const eA = etiqueta('ANTES', 'left'), eD = etiqueta('DEPOIS', 'right');

  // ---------- 6. DETALHES ----------
  const cDet1 = new GEO.Cortina(root, 'var(--verde)', T.detalhe1, 0.85, 10);
  const det1 = foto(cDet1.cor, 'media/depois.jpg');
  const cDet2 = new GEO.Cortina(root, 'var(--verde)', T.detalhe2, 0.85, 11);
  const det2 = foto(cDet2.cor, 'media/depois.jpg');
  const L6 = camada(12);
  const kD1 = new Cartao(L6, X.detalhe1[0], X.detalhe1[1], 56, 1580, T.detalhe1 + 0.6, T.detalhe2 - 0.15);
  const kD2 = new Cartao(L6, X.detalhe2[0], X.detalhe2[1], 56, 1580, T.detalhe2 + 0.6, T.cortinaFim - 0.15);

  // ---------- 7. ASSINATURA ----------
  const cFim = new GEO.Cortina(root, 'var(--verde)', T.cortinaFim, 0.9, 13);
  const L7 = camada(14);
  const tFim = linhas(L7, X.fim, [
    { x: 92, y: 560, size: 96, weight: 700, ls: -0.03, in: T.fimTexto },
    { x: 96, y: 690, size: 52, weight: 500, color: 'var(--claro)', in: T.fimTexto + 0.2 },
    { x: 96, y: 1010, size: 38, weight: 600, ls: 0.2, color: 'var(--claro)', in: T.lockup - 0.3 },
  ]);
  const fimLinha = new GEO.Traco((() => { const s = M.svgEl('svg', { width: 1080, height: 1920 }); s.style.position = 'absolute'; L7.appendChild(s); return s; })(),
    96, 900, 984, 900, { in: T.fimTexto + 0.5, dur: 1.0, op: 0.45 });
  const lockup = new LogoReveal(L7, LOGO.lockup, 89);

  // zoom de detalhe sem deixar borda: escala s em torno de um ponto, preso dentro do quadro
  function zoom(img, s, px, py, cx, cy) {
    const tx = Math.min(0, Math.max(1080 - 1080 * s, cx - px * s));
    const ty = Math.min(0, Math.max(1920 - 1920 * s, cy - py * s));
    img.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
  }
  const mixPts = (a, b, p) => a.map((q, i) => [S.mix(q[0], b[i][0], p), S.mix(q[1], b[i][1], p)]);

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    // 1
    const on1 = t < T.cortinaAntes + 0.9;
    vis(L1, on1);
    if (on1) {
      const s = 120 / 844;
      simb.pos(96 - 33 * s, 160 - 32 * s, s);
      simb.set(t, { barra: T.simbolo, dBarra: 0.5, haste: T.simbolo + 0.12, dHaste: 0.55, tri: T.simbolo + 0.35 });
      tAbre.set(t); aberturaLinha.set(t); tMed.set(t);
    }
    // 2
    cAntes.set(t);
    const on2 = t >= T.cortinaAntes && t < T.cortinaProjeto + 0.9;
    vis(L2, on2);
    imgAntes.style.transform = `scale(${S.mix(1.0, 1.07, S.seg(t, T.cortinaAntes, 4.5, 'sine.inOut')).toFixed(4)})`;
    imgAntes.style.transformOrigin = '50% 40%';
    if (on2) kAntes.set(t);
    // 3 e 4
    cProj.set(t);
    const on3 = t >= T.cortinaProjeto && t < T.comparar;
    vis(L3, on3); vis(L4, on3); vis(L4b, on3); vis(Lfoto, on3 && t >= T.preenche);
    if (on3) {
      tProj.set(t);
      const pl = S.seg(t, T.legenda, 0.8, 'expo.out') - S.seg(t, T.projetoSai, 0.4, 'power3.in');
      vis(leg, t >= T.legenda && t < T.projetoSai + 0.4);
      legIn.style.transform = `translateY(${((1 - pl) * 110).toFixed(1)}%)`;
      // encaixe: o desenho viaja da prancheta até a fachada na foto
      const pe = S.seg(t, T.encaixe, 1.6, 'expo.inOut');
      const resp = 1 + 0.02 * S.seg(t, T.contorno, T.encaixe - T.contorno, 'sine.inOut') * (1 - pe);
      const base = R.desenhoNaTela.map(([x, y]) => [540 + (x - 540) * resp, 1000 + (y - 1000) * resp]);
      const H = PJ.homografia(D.cantos, mixPts(base, R.fachadaNaFoto, pe));
      des.style.transform = PJ.matrix3d(H);
      const desenha = (els, ini, dur, passo) => els.forEach((e, i) => e.setAttribute('stroke-dashoffset', (1 - S.seg(t, ini + i * (passo || 0), dur, 'expo.inOut')).toFixed(4)));
      desenha(contorno, T.contorno, 1.3, 0.25);
      desenha(adesivos, T.contorno + 0.6, 0.9, 0.12);
      desenha(frisos, T.frisos, 0.7, 0.04);
      desenha(cotas, T.cotas, 0.9, 0.15);
      // áreas de adesivo acendem uma a uma
      adesivosFill.forEach((e, i) => {
        const p = S.seg(t, T.adesivos + i * 0.14, 0.5, 'expo.out');
        const pulso = 0.5 + 0.5 * Math.cos(Math.PI * 2 * Math.max(0, t - T.adesivos - 0.8) / 1.6);
        e.setAttribute('opacity', (p * (0.45 + 0.2 * pulso) * (1 - S.seg(t, T.encaixe, 0.6, 'power2.in'))).toFixed(3));
      });
      // números das cotas
      const pc = S.seg(t, T.cotas, 1.2, 'expo.out');
      const fadeCotas = 1 - S.seg(t, T.encaixe - 0.1, 0.4, 'power2.in');
      const [lx, ly] = PJ.aplica(H, [(cL.x0 + cL.x1) / 2, cL.y]);
      const [ax, ay] = PJ.aplica(H, [cA.x, (cA.y0 + cA.y1) / 2]);
      numL.textContent = cL.texto(pc); numA.textContent = cA.texto(pc);
      numL.style.transform = `translate(${(lx - numL.offsetWidth / 2).toFixed(1)}px, ${(ly - 70).toFixed(1)}px)`;
      numA.style.transform = `translate(${(ax - numA.offsetWidth / 2 - 50).toFixed(1)}px, ${(ay - 22).toFixed(1)}px) rotate(-90deg)`;
      numL.style.opacity = numA.style.opacity = (S.seg(t, T.cotas + 0.2, 0.4, 'power2.out') * fadeCotas).toFixed(3);
      // os traços somem quando a foto ocupa a tela
      des.style.opacity = (1 - S.seg(t, T.expande + 0.3, 0.7, 'power2.inOut')).toFixed(3);
      vis(des, t < T.expande + 1.0);
      // a foto entra dentro da silhueta do traço e depois toma a tela inteira
      if (t >= T.preenche) {
        const sil = D.silhueta.map((q) => PJ.aplica(H, q));
        const tela = [[0, 0], [1080, 0], [1080, 1920], [1080, 1920], [1080, 1920], [0, 1920], [0, 1920], [0, 1920]];
        const px = S.seg(t, T.expande, 1.1, 'expo.inOut');
        const pts = mixPts(sil, tela, px);
        // revelação diagonal dentro da silhueta antes de expandir
        const pr = S.seg(t, T.preenche, 0.9, 'expo.out');
        Lfoto.style.clipPath = 'polygon(' + pts.map((q) => q[0].toFixed(1) + 'px ' + q[1].toFixed(1) + 'px').join(',') + ')';
        imgDepois.style.opacity = pr.toFixed(3);
        imgDepois.style.transform = `scale(${S.mix(1.0, 1.05, S.seg(t, T.expande, 4.5, 'sine.inOut')).toFixed(4)})`;
        imgDepois.style.transformOrigin = '50% 40%';
      }
      kDepois.set(t);
    }
    // 5
    const on5 = t >= T.comparar && t < T.detalhe1 + 0.85;
    vis(L5, on5);
    if (on5) {
      const dx = S.mix(0, 900, S.seg(t, T.divisor[0], 1.4, 'expo.inOut')) + S.mix(0, -360, S.seg(t, T.divisor[1], 1.1, 'expo.inOut'));
      const respiro = 18 * Math.sin(Math.PI * 2 * Math.max(0, t - T.divisor[1] - 1.1) / 2.4) * S.seg(t, T.divisor[1] + 1.1, 0.6, 'power1.inOut');
      const x = dx + respiro;
      cmpDepWrap.style.clipPath = `inset(0 0 0 ${x.toFixed(1)}px)`;
      cmpAntes.style.transform = cmpDepWrap.firstChild.style.transform = 'scale(1.05)';
      cmpAntes.style.transformOrigin = cmpDepWrap.firstChild.style.transformOrigin = '50% 40%';
      barra.setAttribute('x', (x - 3).toFixed(1));
      alca.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
      vis(div5, t >= T.divisor[0] - 0.1);
      [eA, eD].forEach((e, i) => {
        const p = S.seg(t, T.divisor[0] + 0.3 + i * 0.12, 0.7, 'expo.out');
        e.c.style.transform = `translateY(${((1 - p) * 105).toFixed(1)}%)`;
        vis(e.m, t >= T.divisor[0] + 0.3);
      });
    }
    // 6
    cDet1.set(t); cDet2.set(t);
    zoom(det1, S.mix(1.45, 1.6, S.seg(t, T.detalhe1, 2.6, 'sine.out')), 612, 498, 540, 760);
    zoom(det2, S.mix(1.6, 1.75, S.seg(t, T.detalhe2, 2.6, 'sine.out')), 186, 560, 540, 760);
    const on6 = t >= T.detalhe1 && t < T.cortinaFim + 0.9;
    vis(L6, on6);
    if (on6) { kD1.set(t); kD2.set(t); }
    // 7
    cFim.set(t);
    const on7 = t >= T.cortinaFim;
    vis(L7, on7);
    if (on7) {
      tFim.set(t); fimLinha.set(t);
      const s = 820 / 1152 * S.mix(1.03, 1, S.seg(t, T.lockup, 3.5, 'power2.out'));
      lockup.pos(540 - 594 * s, 1300 - 155 * s, s);
      lockup.set(t, { barra: T.lockup, dBarra: 0.55, haste: T.lockup + 0.15, dHaste: 0.6, tri: T.lockup + 0.45, letras: T.lockup + 0.8, assin: T.lockup + 1.6 });
      vis(lockup.svg, t >= T.lockup);
    }
  }, { loop: false });
})();
