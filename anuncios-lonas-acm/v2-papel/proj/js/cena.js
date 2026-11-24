// Anúncio 2 — "Fachada que vende" (fachada em ACM), em papel recortado. Tempos presos às falas (assets/falas/tempos.json).
// Tudo desenhado num canvas como função pura do tempo (motor em js/papel.js).
(function () {
  const S = STUDIO, P = PAPEL, C = P.COR;
  const W = 1080, H = 1920;
  const tela = document.getElementById('tela'), ctx = tela.getContext('2d');
  const rngP = S.rng(11);
  const tira = (txt, o) => new P.Tira(txt, o);
  const forma = (pts, cor, seed, passo) => P.Peca.daForma(pts, cor, seed, passo || 9, 0.9);
  const R = P.ret;
  const circ = (r, n, cx, cy) => P.circ(r, n || 48).map((q) => [q[0] + (cx || 0), q[1] + (cy || 0)]);
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  // cenas (s): presas ao início de cada fala
  const T = { gancho: 0, acm: 4.8, visita: 10.4, assessoria: 14.8, previa: 18.25, chamada: 23.1, fim: 28.0 };

  // ---------- logo (contorno original, acabamento de papel) ----------
  const bbDe = (b) => [b[0], b[1], b[0] + b[2], b[1] + b[3]];
  const pecaLogo = (parte, cor) => new P.Peca(new Path2D(parte.d), bbDe(parte.box), cor);
  const lk = LOGO.lockup;
  const lkCorpo = pecaLogo(lk.corpo, C.creme), lkTri = pecaLogo(lk.triangulo, C.creme);
  const lkLetras = lk.letras.map((l) => pecaLogo(l, C.creme));
  const lkAssin = new Path2D(lk.assinatura.map((a) => a.d).join(' '));
  const simPaths = [LOGO.simbolo.corpo.d, LOGO.simbolo.triangulo.d].map((d) => new Path2D(d));
  const lockPaths = [lk.corpo.d, lk.triangulo.d].concat(lk.letras.map((x) => x.d), lk.assinatura.map((x) => x.d)).map((d) => new Path2D(d));
  function logoPlano(c, qual, x, y, larg, cor) { // impressão chapada (sem relevo)
    const box = qual === 'lockup' ? [18, 18, 1152, 275] : [33, 32, 844, 759];
    const s = larg / box[2];
    c.save(); c.translate(x - box[0] * s, y - box[1] * s); c.scale(s, s); c.fillStyle = cor;
    (qual === 'lockup' ? lockPaths : simPaths).forEach((p) => c.fill(p, 'evenodd')); c.restore();
  }

  // ---------- páginas e lascas ----------
  function Pagina(cor, semente) {
    const topo = P.cut([[-40, 0], [W + 40, 0]], semente, 14, 1.4, 3, false);
    const pts = topo.concat([[W + 40, H + 80], [-40, H + 80]]);
    this.peca = new P.Peca(P.toPath(pts), P.bbox(pts), cor);
  }
  const LASCAS = Array.from({ length: 6 }, (_, i) => {
    const f = i % 3 === 0 ? [[0, 0], [60, 0], [30, 52]] : i % 3 === 1 ? [[14, 0], [44, 0], [30, 70], [0, 70]] : circ(22, 30, 22, 22);
    return { peca: forma(f, i % 2 ? C.claro : C.medio, 90 + i, 6), x: rngP() * W, y: rngP() * H, v: 14 + rngP() * 22, r0: rngP() * 6, vr: (rngP() - 0.5) * 0.5, s: 0.7 + rngP() * 0.6 };
  });
  const lascas = (t) => LASCAS.forEach((l, i) => l.peca.desenha(ctx, l.x + Math.sin(t * 0.6 + i) * 20, ((l.y + t * l.v) % (H + 200)) - 100, l.r0 + t * l.vr, l.s, 0.5, 0.55));

  // ---------- a Terceira Ponte e o Morro do Moreno em papel ----------
  function Ponte(x0, x1, cx, base, alt, larg, seed) {
    const deck = (x) => base - alt * Math.exp(-(((x - cx) / larg) ** 2));
    const topo = [], baixo = [];
    for (let x = x0; x <= x1; x += 12) { topo.push([x, deck(x)]); baixo.unshift([x, deck(x) + 26]); }
    this.deck = deck;
    this.tabuleiro = forma(topo.concat(baixo), C.creme, seed, 10);
    this.pilares = [];
    for (let x = x0 + 50; x <= x1 - 20; x += 74) this.pilares.push({ x, p: forma(R(18, base + 70 - deck(x)), C.claro, seed + x, 8), y: deck(x) + 20 });
  }
  Ponte.prototype.desenha = function (c, t, t0, dy) {
    this.pilares.forEach((pl, i) => { const a = P.pouso(t, t0 + i * 0.03, { dur: 0.45, dist: 500, rot: 0, giro: 0 }); pl.p.desenha(c, pl.x - 9, pl.y + a.dy + (dy || 0), 0, 1, a.ar, a.alfa); });
    const a = P.pouso(t, t0 + 0.25, { dur: 0.55, dist: 700, curva: 'back.out(0.9)', rot: 0, giro: 0.02 });
    this.tabuleiro.desenha(c, 0, a.dy + (dy || 0), a.rot, 1, a.ar, a.alfa);
  };
  const morro = (seed, cor) => forma([[0, 360], [70, 230], [130, 120], [175, 60], [210, 20], [240, 6], [262, 30], [290, 70], [330, 150], [380, 250], [440, 360]], cor, seed, 11);
  const mar = (y, cor, seed) => { const pts = []; for (let x = -40; x <= W + 40; x += 30) pts.push([x, y + Math.sin(x / 70 + seed) * 10]); return forma(pts.concat([[W + 40, H + 60], [-40, H + 60]]), cor, seed, 14); };
  const sol = forma(circ(80, 50, 80, 80), C.creme, 501, 7);

  // ---------- a rua de papel e a loja ----------
  const G = { x: 280, base: 1600 };
  const loja = {
    corpoCinza: forma(R(520, 430), '#BDB8AA', 1200, 10), corpo: forma(R(520, 430), C.creme, 1201, 10),
    placaCinza: forma(R(560, 130), '#8F8A7E', 1202, 9),
    porta: forma(R(130, 250), C.medio, 1203, 7), janela: forma(R(230, 160), C.claro, 1204, 7),
    acm: forma(R(620, 170), C.verde, 1205, 6), filete: forma(R(620, 18), C.claro, 1206, 5),
    colE: forma(R(46, 430), C.verde, 1207, 6), colD: forma(R(46, 430), C.verde, 1208, 6),
  };
  const vizE = forma(R(300, 640), C.medio, 1210, 10), vizD = forma(R(300, 540), C.claro, 1211, 10);
  const chao = forma(R(1180, 340), C.tinta, 1212, 12);
  const janelinhas = (c, w, h, cor) => { c.fillStyle = cor; for (let y = 50; y < h - 120; y += 120) for (let x = 40; x < w - 60; x += 110) c.fillRect(x, y, 60, 80); };
  function rua(t, t0, comACM, tACM, z) {
    let a = P.pouso(t, t0, { dur: 0.5, dist: 400, rot: 0, giro: 0 }); chao.desenha(ctx, -50, G.base + a.dy, 0, 1, a.ar, a.alfa);
    a = P.pouso(t, t0 + 0.1, { dur: 0.55, dist: 900, curva: 'back.out(0.8)', rot: 0, giro: 0 });
    vizE.desenha(ctx, -60, G.base - 640 + a.dy, 0, 1, a.ar, a.alfa, (c) => janelinhas(c, 300, 640, C.claro));
    a = P.pouso(t, t0 + 0.18, { dur: 0.55, dist: 900, curva: 'back.out(0.8)', rot: 0, giro: 0 });
    vizD.desenha(ctx, 840, G.base - 540 + a.dy, 0, 1, a.ar, a.alfa, (c) => janelinhas(c, 300, 540, C.medio));
    a = P.pouso(t, t0 + 0.25, { dur: 0.55, dist: 900, curva: 'back.out(0.8)', rot: 0, giro: 0 });
    (comACM ? loja.corpo : loja.corpoCinza).desenha(ctx, G.x, G.base - 430 + a.dy, 0, 1, a.ar, a.alfa);
    const b = P.pouso(t, t0 + 0.35, { dur: 0.5, dist: 700, rot: 0, giro: 0 });
    loja.porta.desenha(ctx, G.x + 330, G.base - 250 + b.dy, 0, 1, b.ar, b.alfa);
    loja.janela.desenha(ctx, G.x + 50, G.base - 300 + b.dy, 0, 1, b.ar, b.alfa);
    if (!comACM) {
      const c2 = P.pouso(t, t0 + 0.45, { dur: 0.5, dist: 600, rot: 0.03, giro: 0.1 });
      loja.placaCinza.desenha(ctx, G.x - 20, G.base - 560 + c2.dy, c2.rot, 1, c2.ar, c2.alfa);
      return;
    }
    // a fachada em ACM chega peça por peça
    const pe = [[loja.colE, G.x - 40, G.base - 430, 0], [loja.colD, G.x + 514, G.base - 430, 0.12], [loja.acm, G.x - 50, G.base - 600, 0.3], [loja.filete, G.x - 50, G.base - 448, 0.45]];
    pe.forEach(([pc, x, y, d]) => { const q = P.pouso(t, tACM + d, { dur: 0.45, dist: 700, deCima: true, rot: 0, giro: 0.04 }); pc.desenha(ctx, x, y + q.dy, q.rot, 1, q.ar, q.alfa); });
    // letras da marca acendem
    const acende = seg(t, tACM + 0.8, 0.6, 'power2.out');
    if (acende > 0) {
      ctx.save(); ctx.globalAlpha = acende * (P.saida ? 1 - seg(t, P.saida.t0, 0.4) : 1);
      ctx.shadowColor = 'rgba(220,235,227,0.9)'; ctx.shadowBlur = 30 * acende;
      ctx.fillStyle = C.claro; ctx.textAlign = 'center'; ctx.font = "700 92px 'Instrument Sans'";
      ctx.fillText('SUA MARCA', G.x + 260, G.base - 482); ctx.textAlign = 'left'; ctx.restore();
    }
  }

  // ---------- cenas ----------
  const cenas = [];
  // 1. GANCHO
  {
    const t1 = tira('A sua fachada está', { tam: 64, peso: 500 });
    const t2 = tira('ajudando ou', { tam: 104, peso: 700, cor: C.claro, ls: -0.02 });
    const t3 = tira('atrapalhando', { tam: 104, peso: 700, cor: C.claro, ls: -0.02 });
    const t4 = tira('as suas vendas?', { tam: 76, peso: 700 });
    const q = forma(circ(70, 40, 70, 70), C.claro, 1220, 7);
    cenas.push({ ini: -1, cor: C.profundo, desenha(t) {
      rua(t, 0.2, false);
      let a = P.pouso(t, 0.35, { rot: -0.02 }); t1.desenha(ctx, 80, 210 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 0.9, { rot: 0.02, dist: 320 }); t2.desenha(ctx, 70, 320 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 2.5, { rot: -0.025, dist: 320, curva: 'back.out(1.8)' }); t3.desenha(ctx, 70, 470 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 3.2, { rot: 0.015 }); t4.desenha(ctx, 80, 620 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 3.6, { dur: 0.5, curva: 'back.out(2.4)', dist: 500, deCima: true, rot: 0.2, giro: 0.8 });
      q.desenha(ctx, 470, 990 + a.dy + Math.sin(t * 3) * 8, a.rot + 0.1 * Math.sin(t * 2), 1, a.ar, a.alfa, (c) => {
        c.fillStyle = C.profundo; c.textAlign = 'center'; c.font = "700 100px 'Instrument Sans'"; c.fillText('?', 70, 106); c.textAlign = 'left'; });
    } });
  }
  // 2. FACHADA EM ACM
  {
    const t1 = tira('FACHADA EM ACM', { tam: 104, peso: 700, cor: C.claro, ls: -0.02 });
    const CH = [['moderna', 8.05], ['profissional', 8.95], ['fácil de encontrar', 9.5]];
    const chips = CH.map(([n], i) => tira(n, { tam: 50, peso: 700, semente: 1230 + i }));
    cenas.push({ ini: T.acm - 0.2, cor: C.verde, desenha(t) {
      const t0 = T.acm;
      rua(t, t0, true, t0 + 0.9);
      let a = P.pouso(t, t0 + 0.4, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 60, 230 + a.dy, a.rot, a.ar, a.alfa);
      CH.forEach(([, tt], i) => { const b = P.pouso(t, tt, { rot: [-0.03, 0.025, -0.015][i], curva: 'back.out(2)' }); chips[i].desenha(ctx, [80, 420, 150][i], [420, 420, 530][i] + b.dy + Math.sin(t * 2 + i) * 4, b.rot, b.ar, b.alfa); });
    } });
  }
  // número do passo (círculo de papel)
  const passo = (n, seed) => { const pc = forma(circ(80, 44, 80, 80), C.claro, seed, 7); return (t, t0, x, y) => {
    const a = P.pouso(t, t0, { dur: 0.5, curva: 'back.out(2.4)', dist: 500, deCima: true, rot: -0.1, giro: 0.6 });
    pc.desenha(ctx, x, y + a.dy, a.rot, 1, a.ar, a.alfa, (c) => { c.fillStyle = C.profundo; c.textAlign = 'center'; c.font = "700 100px 'Instrument Sans'"; c.fillText(n, 80, 116); c.textAlign = 'left'; }); }; };
  // 3. VISITA TÉCNICA
  {
    const n1 = passo('1', 1300);
    const t1 = tira('VISITA TÉCNICA', { tam: 86, peso: 700, cor: C.claro, ls: -0.02 });
    const t2 = tira('a gente conhece a sua', { tam: 54, peso: 500 }), t3 = tira('empresa de perto', { tam: 54, peso: 700 });
    const van = forma([[0, 70], [60, 0], [380, 0], [380, 230], [0, 230]], C.creme, 1310, 8);
    const roda = forma(circ(46, 30, 46, 46), C.profundo, 1311, 5);
    const prancheta = forma(R(300, 400), C.creme, 1312, 8), clip = forma(R(120, 40), C.medio, 1313, 5);
    const chao = forma(R(1180, 300), C.tinta, 1314, 12);
    cenas.push({ ini: T.visita - 0.2, cor: C.profundo, desenha(t) {
      const t0 = T.visita;
      n1(t, t0 + 0.2, 80, 220);
      let a = P.pouso(t, t0 + 0.35, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 270, 240 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 12.3, { rot: 0.015 }); t2.desenha(ctx, 80, 430 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 12.6, { rot: -0.015 }); t3.desenha(ctx, 80, 520 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.1, { dur: 0.5, dist: 400, rot: 0, giro: 0 }); chao.desenha(ctx, -50, 1640 + a.dy, 0, 1, a.ar, a.alfa);
      // a van chega e estaciona
      const pv = seg(t, t0 + 0.3, 1.6, 'power3.out');
      const sai = P.saida ? seg(t, P.saida.t0, 0.5, 'power2.in') : 0;
      const vx = S.mix(-500, 80, pv) - sai * 1400, vy = 1400 + Math.sin(t * 16) * 2 * (1 - pv);
      van.desenha(ctx, vx, vy, 0, 1, 0.2, 1, (c) => { c.fillStyle = C.claro; c.fillRect(20, 30, 70, 60); c.fillStyle = C.verde; c.fillRect(0, 150, 380, 26); logoPlano(c, 'lockup', 140, 70, 200, C.verde); });
      roda.desenha(ctx, vx + 40, vy + 190, t * 8 * (1 - pv), 1, 0.1, 1); roda.desenha(ctx, vx + 260, vy + 190, t * 8 * (1 - pv), 1, 0.1, 1);
      // prancheta com checklist
      a = P.pouso(t, t0 + 1.4, { dur: 0.55, dist: 900, curva: 'back.out(1.2)', rot: 0.08, giro: 0.2 });
      prancheta.desenha(ctx, 640, 900 + a.dy + Math.sin(t * 1.8) * 6, a.rot + 0.02 * Math.sin(t * 1.3), 1, a.ar, a.alfa, (c) => {
        for (let k = 0; k < 4; k++) {
          const ok = t > t0 + 2.0 + k * 0.45;
          c.strokeStyle = C.medio; c.lineWidth = 5; c.strokeRect(30, 80 + k * 76, 38, 38);
          if (ok) { c.strokeStyle = C.verde; c.lineWidth = 8; c.beginPath(); c.moveTo(36, 98 + k * 76); c.lineTo(48, 110 + k * 76); c.lineTo(66, 86 + k * 76); c.stroke(); }
          c.fillStyle = '#D9CFBB'; c.fillRect(90, 92 + k * 76, 170, 14);
        }
      });
      clip.desenha(ctx, 730, 880 + a.dy + Math.sin(t * 1.8) * 6, a.rot, 1, a.ar, a.alfa);
    } });
  }
  // 4. ASSESSORIA
  {
    const n2 = passo('2', 1400);
    const t1 = tira('ASSESSORIA', { tam: 90, peso: 700, cor: C.claro, ls: -0.02 });
    const t2 = tira('de comunicação visual', { tam: 60, peso: 600 });
    const bal = [0, 1, 2].map((i) => forma([[0, 0], [300, 0], [300, 220], [120, 220], [60, 290], [70, 220], [0, 220]], i === 1 ? C.claro : C.creme, 1410 + i, 8));
    const POS = [[90, 760, -0.05], [430, 980, 0.04], [680, 720, -0.03]];
    cenas.push({ ini: T.assessoria - 0.2, cor: C.verde, desenha(t) {
      const t0 = T.assessoria;
      n2(t, t0 + 0.2, 80, 220);
      let a = P.pouso(t, t0 + 0.35, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 270, 240 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.2, { rot: 0.015 }); t2.desenha(ctx, 80, 430 + a.dy, a.rot, a.ar, a.alfa);
      bal.forEach((b, i) => {
        const [x, y, r] = POS[i];
        const q = P.pouso(t, t0 + 1.0 + i * 0.35, { dur: 0.5, curva: 'back.out(2)', dist: 600, rot: r, giro: 0.4 });
        b.desenha(ctx, x, y + q.dy + Math.sin(t * 2 + i) * 8, q.rot, 1, q.ar, q.alfa, (c) => {
          c.save(); c.fillStyle = C.medio; c.textAlign = 'center'; c.font = "600 36px 'Instrument Sans'"; c.fillText(['cores', 'letras', 'iluminação'][i], 150, 198); c.restore();
          if (i === 0) { ['#EE9A45', C.verde, '#F7C95F', '#1F2A44'].forEach((cor, k) => { c.fillStyle = cor; c.beginPath(); c.arc(60 + k * 60, 90, 26, 0, 6.29); c.fill(); }); }
          else if (i === 1) { c.fillStyle = C.profundo; c.textAlign = 'center'; c.font = "700 96px 'Instrument Sans'"; c.fillText('Aa', 150, 126); c.textAlign = 'left'; }
          else { c.translate(0, -18); c.scale(1, 0.85); c.fillStyle = '#F7C95F'; c.beginPath(); c.arc(150, 95, 50, 0, 6.29); c.fill(); c.fillStyle = C.medio; c.fillRect(126, 145, 48, 34);
            c.strokeStyle = '#F7C95F'; c.lineWidth = 6; [[-1, -1], [1, -1], [-1.3, 0.2], [1.3, 0.2]].forEach(([dx, dy]) => { c.beginPath(); c.moveTo(150 + dx * 70, 95 + dy * 50); c.lineTo(150 + dx * 92, 95 + dy * 66); c.stroke(); }); }
        });
      });

    } });
  }
  // 5. ORÇAMENTO COM PRÉVIA
  {
    const n3 = passo('3', 1500);
    const t1 = tira('ORÇAMENTO', { tam: 90, peso: 700, cor: C.claro, ls: -0.02 });
    const t2 = tira('com prévia do projeto', { tam: 60, peso: 600 });
    const t3 = tira('você vê antes de fazer', { tam: 56, peso: 700, cor: C.claro });
    const planta = forma(R(820, 640), '#CFE0EA', 1510, 9);
    const mini = { corpo: forma(R(400, 300), C.creme, 1520, 8), acm: forma(R(470, 120), C.verde, 1521, 6), porta: forma(R(100, 180), C.medio, 1522, 6), jan: forma(R(170, 110), C.claro, 1523, 6) };
    cenas.push({ ini: T.previa - 0.2, cor: C.profundo, desenha(t) {
      const t0 = T.previa;
      n3(t, t0 + 0.2, 80, 220);
      let a = P.pouso(t, t0 + 0.35, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 270, 240 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.8, { rot: 0.015 }); t2.desenha(ctx, 80, 430 + a.dy, a.rot, a.ar, a.alfa);
      // folha de projeto: desenho em linha que vira fachada pronta
      a = P.pouso(t, t0 + 0.5, { dur: 0.55, dist: 900, curva: 'back.out(1.1)', rot: -0.03, giro: 0.15 });
      const traco = seg(t, t0 + 0.9, 1.6, 'power2.inOut');
      planta.desenha(ctx, 130, 620 + a.dy, a.rot + 0.01 * Math.sin(t * 1.2), 1, a.ar, a.alfa, (c) => {
        c.strokeStyle = 'rgba(31,110,82,0.18)'; c.lineWidth = 2;
        for (let x = 40; x < 820; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 640); c.stroke(); }
        for (let y = 40; y < 640; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(820, y); c.stroke(); }
        c.save(); c.beginPath(); c.rect(0, 0, 820 * traco, 640); c.clip(); c.strokeStyle = C.profundo; c.lineWidth = 5;
        c.strokeRect(210, 250, 400, 300); c.strokeRect(175, 130, 470, 120); c.strokeRect(470, 370, 100, 180); c.strokeRect(250, 330, 170, 110);
        c.font = "600 26px 'Instrument Sans'"; c.fillStyle = C.medio; c.fillText('4,70 m', 380, 115); c.fillText('2,40 m', 625, 410); c.restore();
        c.fillStyle = C.profundo; c.font = "600 30px 'Instrument Sans'"; c.globalAlpha = traco; c.fillText('PRÉVIA · FACHADA EM ACM', 40, 600); c.globalAlpha = 1;
      });
      // as peças de verdade pousam por cima do desenho
      const dyp = a.dy;
      [[mini.corpo, 340, 870], [mini.jan, 380, 950], [mini.porta, 600, 990], [mini.acm, 305, 750]].forEach(([pc, x, y], i) => {
        const q = P.pouso(t, 20.5 + i * 0.18, { dur: 0.45, dist: 600, deCima: true, rot: 0, giro: 0.05 });
        pc.desenha(ctx, x, y + q.dy + dyp, q.rot, 1, q.ar, q.alfa, i === 3 ? (c) => { c.fillStyle = C.claro; c.textAlign = 'center'; c.font = "700 58px 'Instrument Sans'"; c.fillText('SUA MARCA', 235, 82); c.textAlign = 'left'; } : null);
      });
      a = P.pouso(t, 21.9, { rot: -0.02, curva: 'back.out(1.8)' }); t3.desenha(ctx, 150, 1360 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  // 6. CHAMADA
  {
    const t1 = tira('AGENDE SUA', { tam: 70, peso: 700 }), t2 = tira('VISITA TÉCNICA', { tam: 104, peso: 700, cor: C.claro, ls: -0.02 });
    const botao = tira('CHAMA NO WHATSAPP  →', { tam: 58, peso: 700, cor: C.claro, ls: 0.03, padX: 0.6, padY: 0.42, semente: 1141 });
    const n1 = tira('Visita técnica · Assessoria de comunicação visual', { tam: 34, peso: 500, cor: C.creme, semente: 1150 });
    const n2 = tira('Orçamento com prévia do projeto', { tam: 34, peso: 500, cor: C.creme, semente: 1151 });
    const n3 = tira('Seven · empresa 100% capixaba', { tam: 34, peso: 500, cor: C.creme, semente: 1152 });
    cenas.push({ ini: T.chamada - 0.2, cor: C.profundo, desenha(t) {
      const t0 = T.chamada;
      const s = 860 / 1152 * S.mix(1.02, 1, seg(t, t0, 3, 'power2.out'));
      const x0 = 540 - 594 * s, y0 = 560 - 155 * s;
      let a = P.pouso(t, t0 + 0.1, { dur: 0.5, dist: 700, deCima: true, rot: 0, giro: 0 });
      lkCorpo.desenha(ctx, x0, y0 + a.dy, 0, s, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.25, { dur: 0.45, dist: 500, deCima: true, rot: 0, giro: 0 }); lkTri.desenha(ctx, x0, y0 + a.dy, 0, s, a.ar, a.alfa);
      lkLetras.forEach((l, i) => { const b = P.pouso(t, t0 + 0.45 + i * 0.07, { dur: 0.4, dist: 420, deCima: true, rot: 0, giro: 0.05 }); l.desenha(ctx, x0, y0 + b.dy, b.rot, s, b.ar, b.alfa); });
      const pa = seg(t, t0 + 1.0, 0.5, 'power2.out');
      if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; ctx.translate(x0, y0); ctx.scale(s, s); ctx.fillStyle = C.claro; ctx.fill(lkAssin, 'evenodd'); ctx.restore(); }
      t1.prepara(ctx); t2.prepara(ctx); botao.prepara(ctx); n1.prepara(ctx); n2.prepara(ctx); n3.prepara(ctx);
      a = P.pouso(t, t0 + 0.6, { rot: -0.015 }); t1.desenha(ctx, 540 - t1.w / 2, 820 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.75, { rot: 0.02, curva: 'back.out(1.8)' }); t2.desenha(ctx, 540 - t2.w / 2, 930 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.1, { dur: 0.5, dist: 500, curva: 'back.out(1.8)', rot: -0.02 });
      const bal = Math.sin((t - t0) * 2.6) * 0.025 * seg(t, t0 + 1.6, 0.6);
      botao.desenha(ctx, 540 - botao.w / 2, 1230 + a.dy, a.rot + bal, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.5, { rot: 0.01 }); n1.desenha(ctx, 540 - n1.w / 2, 1440 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.6, { rot: -0.01 }); n2.desenha(ctx, 540 - n2.w / 2, 1520 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.7, { rot: 0.012 }); n3.desenha(ctx, 540 - n3.w / 2, 1600 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  const paginas = cenas.map((c, i) => new Pagina(c.cor, 300 + i * 7));

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    let k = 0;
    cenas.forEach((c, i) => { if (t >= c.ini) k = i; });
    const subida = (i) => S.seg(t, cenas[i].ini, 0.75, 'power3.inOut');
    const desenhaCena = (i, dy, ar) => {
      ctx.save(); ctx.translate(0, dy);
      if (i === 0 && cenas[0].ini < 0) { ctx.fillStyle = cenas[0].cor; ctx.fillRect(0, -10, W, H + 20); }
      else paginas[i].peca.desenha(ctx, 0, 0, 0, 1, ar, 1);
      const z = 1 + 0.025 * S.seg(t, Math.max(0, cenas[i].ini), 5, 'sine.inOut');
      ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
      lascas(t);
      P.saida = cenas[i + 1] ? { t0: cenas[i + 1].ini - 0.42, n: 0 } : null;
      cenas[i].desenha(t);
      P.saida = null;
      ctx.restore();
    };
    const pk = k > 0 ? subida(k) : 1;
    if (pk < 1) desenhaCena(k - 1, 0, 0);
    desenhaCena(k, (1 - pk) * (H + 120), (1 - pk) * 0.6);
  }, { loop: false });
})();
