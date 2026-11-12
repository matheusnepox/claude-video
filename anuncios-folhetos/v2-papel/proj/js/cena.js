// Anúncio 2 — "Divulgação que chega longe" (folhetos), em papel recortado. Tempos presos às falas (assets/falas/tempos.json).
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
  const T = { gancho: 0, capixaba: 7.05, opcoes: 12.0, centavos: 18.05, entrega: 21.9, chamada: 29.05, fim: 33.4 };

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

  // folheto de papel (10 x 14): arte desenhada por cima da peça
  const folhetoArte = (c, w, h) => {
    const k = w / 300;
    c.save(); c.scale(k, k);
    c.fillStyle = '#EE9A45'; c.fillRect(0, 0, 300, 190);
    c.fillStyle = '#F7C95F'; c.beginPath(); c.arc(220, 70, 70, 0, 6.29); c.fill();
    c.fillStyle = C.verde; c.beginPath(); c.moveTo(30, 190); c.lineTo(100, 80); c.lineTo(170, 190); c.fill();
    c.fillStyle = '#1F2A44'; c.font = "700 46px 'Instrument Sans'"; c.fillText('PROMOÇÃO', 22, 252);
    c.fillStyle = '#D9CFBB'; [[22, 280, 230], [22, 308, 180], [22, 336, 210]].forEach(([x, y, l]) => c.fillRect(x, y, l, 12));
    c.fillStyle = '#1F2A44'; c.fillRect(0, 370, 300, 50);
    c.restore();
  };
  const folhetoVerso = (c, w, h) => {
    const k = w / 300; c.save(); c.scale(k, k);
    c.fillStyle = '#1F2A44'; c.fillRect(0, 0, 300, 420);
    c.fillStyle = '#F7C95F'; c.font = "700 40px 'Instrument Sans'"; c.fillText('Venha nos', 22, 70); c.fillText('visitar!', 22, 114);
    c.fillStyle = '#EE9A45'; c.fillRect(22, 160, 256, 140);
    c.fillStyle = '#5B6A8C'; [[22, 330, 200], [22, 360, 150]].forEach(([x, y, l]) => c.fillRect(x, y, l, 12));
    c.restore();
  };

  // ---------- cenas ----------
  const cenas = [];
  // 1. GANCHO: a lojinha abre e os folhetos voam
  {
    const t1 = tira('Quer divulgar', { tam: 84, peso: 500 }), t2 = tira('o seu negócio?', { tam: 112, peso: 700, cor: C.claro, ls: -0.02 });
    const loja = forma(R(640, 420), C.creme, 520, 10);
    const porta = forma(R(150, 250), C.medio, 521, 7);
    const vitrine = forma(R(300, 170), C.claro, 522, 7);
    const toldo = Array.from({ length: 8 }, (_, i) => forma([[0, 0], [86, 0], [86, 90], [43, 120], [0, 90]], i % 2 ? C.creme : C.claro, 530 + i, 6));
    const fols = Array.from({ length: 6 }, (_, i) => forma(R(300, 420), C.creme, 540 + i, 9));
    const FAN = [[60, 560, -0.22], [250, 520, -0.1], [440, 500, 0.02], [630, 520, 0.12], [800, 560, 0.24], [430, 560, -0.04]];
    const preco = tira('R$ 150', { tam: 200, peso: 700, cor: C.claro, ls: -0.03 });
    const unid = tira('1.250 folhetos · 10 x 14 cm', { tam: 50, peso: 600 });
    const selo = forma(circ(140, 60, 140, 140), C.claro, 550, 8);
    cenas.push({ ini: -1, cor: C.profundo, desenha(t) {
      let a = P.pouso(t, 0.25, { rot: -0.03 }); t1.desenha(ctx, 80, 200 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 0.5, { rot: 0.02, dist: 320 }); t2.desenha(ctx, 70, 320 + a.dy, a.rot, a.ar, a.alfa);
      // lojinha embaixo
      a = P.pouso(t, 0.6, { dur: 0.55, dist: 700, curva: 'back.out(0.9)', rot: 0, giro: 0 });
      loja.desenha(ctx, 220, 1500 + a.dy, 0, 1, a.ar, a.alfa);
      const b = P.pouso(t, 0.8, { dur: 0.5, dist: 600, rot: 0, giro: 0 });
      vitrine.desenha(ctx, 270, 1600 + b.dy, 0, 1, b.ar, b.alfa, (c) => { c.fillStyle = C.verde; c.font = "700 44px 'Instrument Sans'"; c.fillText('ABERTO', 70, 102); });
      porta.desenha(ctx, 650, 1640 + b.dy, 0, 1, b.ar, b.alfa);
      toldo.forEach((tt, i) => { const c2 = P.pouso(t, 1.0 + i * 0.05, { dur: 0.4, dist: 500, deCima: true, rot: 0, giro: 0.1 }); tt.desenha(ctx, 196 + i * 86, 1440 + c2.dy + Math.sin(t * 3 + i) * 2, c2.rot, 1, c2.ar, c2.alfa); });
      // os folhetos saem da porta e abrem em leque
      fols.forEach((f, i) => {
        const t0 = 1.9 + i * 0.14;
        const p = seg(t, t0, 0.9, 'back.out(1.3)');
        if (t < t0) return;
        const sai = P.saida ? seg(t, P.saida.t0 + i * 0.04, 0.55, 'power2.in') : 0;
        const [fx, fy, fr] = FAN[i];
        const x = S.mix(650, fx + 20, p), y = S.mix(1680, fy + 140, p) + Math.sin(t * 1.8 + i) * 8 + sai * 1500;
        const sc = S.mix(0.3, 0.62, p);
        f.desenha(ctx, x, y, S.mix(0.8, fr, p), sc, Math.max(0.6 * (1 - p), sai * 0.8), 1, (c) => folhetoArte(c, 300, 420));
      });
      a = P.pouso(t, 3.0, { rot: -0.03, dist: 380, curva: 'back.out(1.8)' }); preco.desenha(ctx, 200, 960 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 3.3, { rot: 0.02 }); unid.desenha(ctx, 190, 1250 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 5.2, { dur: 0.5, curva: 'back.out(2.4)', dist: 500, deCima: true, rot: 0.25, giro: 0.8 });
      selo.desenha(ctx, 790, 400 + a.dy, a.rot, 1, a.ar, a.alfa, (cc) => {
        cc.fillStyle = C.profundo; cc.textAlign = 'center'; cc.font = "700 58px 'Instrument Sans'";
        cc.fillText('ARTE', 140, 130); cc.fillText('GRÁTIS', 140, 192); cc.textAlign = 'left';
      });
    } });
  }
  // 2. CAPIXABA
  {
    const ponte = new Ponte(250, 1100, 700, 1450, 230, 210, 700);
    const m = morro(710, C.medio), m2 = morro(711, C.verde);
    const mares = [mar(1500, C.medio, 1), mar(1560, C.verde, 2), mar(1630, C.claro, 3)];
    const t1 = tira('100% CAPIXABA', { tam: 118, peso: 700, cor: C.claro, ls: -0.02 });
    const t2 = tira('comprometida com o crescimento', { tam: 52, peso: 500 }), t3 = tira('da sua empresa.', { tam: 52, peso: 700 });
    cenas.push({ ini: T.capixaba - 0.2, cor: C.profundo, desenha(t) {
      const t0 = T.capixaba;
      let a = P.pouso(t, t0 + 0.2, { dur: 0.5, dist: 400, deCima: true, rot: 0, giro: 0 }); sol.desenha(ctx, 820, 760 + a.dy, 0, 1, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.35, { dur: 0.55, dist: 800, curva: 'back.out(0.8)', rot: 0, giro: 0 }); m2.desenha(ctx, 120, 1110 + a.dy, 0, 1.15, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.5, { dur: 0.55, dist: 800, curva: 'back.out(0.8)', rot: 0, giro: 0 }); m.desenha(ctx, -40, 1140 + a.dy, 0, 1, a.ar, a.alfa);
      ponte.desenha(ctx, t, t0 + 0.75);
      mares.forEach((mm, i) => { const b = P.pouso(t, t0 + 1.2 + i * 0.12, { dur: 0.55, dist: 600, rot: 0, giro: 0 }); mm.desenha(ctx, 0, b.dy + Math.sin(t * 1.5 + i) * 6, 0, 1, b.ar, b.alfa); });
      a = P.pouso(t, t0 + 0.3, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 90, 250 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.4, { rot: 0.015 }); t2.desenha(ctx, 90, 430 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.6, { rot: -0.015 }); t3.desenha(ctx, 90, 520 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  // 3. OPÇÕES: dois folhetos no varal e as quantidades
  {
    const OP = [
      { nome: 'Só frente (4x0)', preco: 'a partir de R$ 150', t: 12.5, verso: false },
      { nome: 'Frente e verso (4x4)', preco: 'a partir de R$ 229,90', t: 13.6, verso: true },
    ];
    const fols = OP.map((o, i) => forma(R(300, 420), C.creme, 800 + i, 9));
    const rots = OP.map((o, i) => tira(o.nome, { tam: 44, peso: 700, semente: 810 + i }));
    const prc = OP.map((o, i) => tira(o.preco, { tam: 38, peso: 600, cor: C.claro, semente: 815 + i }));
    const prendedor = forma(R(22, 56), C.medio, 820, 5);
    const titulo = tira('Escolha o seu', { tam: 70, peso: 700 });
    const QT = [['1.250', 15.0], ['2.500', 15.45], ['5.000', 15.95], ['10.000', 16.6]];
    const qts = QT.map(([n], i) => tira(n, { tam: 62, peso: 700, cor: i === 3 ? C.claro : C.creme, semente: 830 + i }));
    const qtTxt = tira('unidades', { tam: 44, peso: 500, cor: C.claro, semente: 840 });
    const ponte = new Ponte(-40, 1120, 540, 1660, 150, 190, 850);
    const mares = [mar(1700, C.medio, 4), mar(1760, C.claro, 5)];
    cenas.push({ ini: T.opcoes - 0.2, cor: C.verde, desenha(t) {
      const t0 = T.opcoes;
      ponte.desenha(ctx, t, t0 + 0.15);
      mares.forEach((mm, i) => { const b = P.pouso(t, t0 + 0.35 + i * 0.1, { dur: 0.5, dist: 400, rot: 0, giro: 0 }); mm.desenha(ctx, 0, b.dy + Math.sin(t * 1.5 + i) * 6, 0, 1, b.ar, b.alfa); });
      let a = P.pouso(t, t0 + 0.2, { rot: -0.015 }); titulo.desenha(ctx, 110, 220 + a.dy, a.rot, a.ar, a.alfa);
      const pc = seg(t, t0 + 0.3, 0.6, 'power2.out');
      const sai = P.saida ? seg(t, P.saida.t0, 0.5, 'power2.in') : 0;
      const corda = (x) => 420 + 60 * Math.sin(Math.PI * (x + 20) / 1120);
      if (pc > 0 && sai < 1) {
        ctx.save(); ctx.globalAlpha = 1 - sai; ctx.strokeStyle = C.creme; ctx.lineWidth = 5; ctx.beginPath();
        for (let x = -20; x <= -20 + 1120 * pc; x += 20) { const y = corda(x) + sai * 900; x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.restore();
      }
      OP.forEach((o, i) => {
        const px = 300 + i * 480, py = corda(px);
        const b = P.pouso(t, o.t, { dur: 0.45, dist: 500, deCima: true, rot: 0, giro: 0 });
        if (!b.on) return;
        const bal = 0.2 * Math.exp(-(t - o.t) * 1.6) * Math.sin((t - o.t) * 7) + 0.03 * Math.sin(t * 1.7 + i);
        // o folheto da direita gira e mostra o verso colorido
        const vira = o.verso ? Math.cos(Math.PI * seg(t, o.t + 0.7, 0.6, 'power2.inOut') + Math.PI * seg(t, o.t + 2.0, 0.6, 'power2.inOut')) : 1;
        ctx.save(); ctx.translate(px, py + b.dy); ctx.rotate(bal); ctx.scale(Math.max(0.02, Math.abs(vira)), 1);
        fols[i].desenha(ctx, -150, 8, 0, 1, b.ar, b.alfa, (c) => (vira < 0 ? folhetoVerso(c, 300, 420) : (o.verso || t < 0 ? folhetoArte(c, 300, 420) : folhetoArte(c, 300, 420))));
        prendedor.desenha(ctx, -11, -18, 0, 1, b.ar, b.alfa);
        ctx.restore();
        rots[i].prepara(ctx); prc[i].prepara(ctx);
        const c2 = P.pouso(t, o.t + 0.3, { rot: i ? 0.02 : -0.02 });
        rots[i].desenha(ctx, px - rots[i].w / 2, 900 + c2.dy, c2.rot, c2.ar, c2.alfa);
        const c3 = P.pouso(t, o.t + 0.45, { rot: i ? -0.015 : 0.015 });
        prc[i].desenha(ctx, px - prc[i].w / 2, 990 + c3.dy, c3.rot, c3.ar, c3.alfa);
      });
      qts.forEach((q, i) => {
        q.prepara(ctx);
        const b = P.pouso(t, QT[i][1], { rot: [-0.04, 0.03, -0.02, 0.04][i], curva: 'back.out(2)' });
        const x = 70 + i * 245 + (i === 3 ? -20 : 0);
        q.desenha(ctx, x, 1150 + b.dy + Math.sin(t * 2 + i) * 4, b.rot, b.ar, b.alfa);
      });
      a = P.pouso(t, 16.9, { rot: 0.01 }); qtTxt.prepara(ctx); qtTxt.desenha(ctx, 540 - qtTxt.w / 2, 1290 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  // 4. MENOS DE 5 CENTAVOS
  {
    const t1 = tira('10.000 folhetos', { tam: 70, peso: 700 });
    const t2 = tira('saem por menos de', { tam: 56, peso: 500 });
    const t3 = tira('5 CENTAVOS', { tam: 150, peso: 700, cor: C.claro, ls: -0.03 });
    const t4 = tira('CADA', { tam: 90, peso: 700 });
    const t5 = tira('10.000 por R$ 499,90', { tam: 44, peso: 600, cor: C.claro, semente: 960 });
    const fol = forma(R(300, 420), C.creme, 950, 9);
    const moeda = forma(circ(110, 50, 110, 110), '#E3B64C', 951, 7);
    cenas.push({ ini: T.centavos - 0.2, cor: C.profundo, desenha(t) {
      const t0 = T.centavos;
      let a = P.pouso(t, t0 + 0.15, { rot: -0.02 }); t1.desenha(ctx, 90, 230 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.6, { rot: 0.015 }); t2.desenha(ctx, 90, 360 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.2, { rot: -0.025, dist: 380, curva: 'back.out(1.8)' }); t3.desenha(ctx, 60, 470 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.5, { rot: 0.03, curva: 'back.out(2)' }); t4.desenha(ctx, 600, 690 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.4, { dur: 0.55, dist: 900, curva: 'back.out(0.9)', rot: -0.08, giro: 0.15 });
      fol.desenha(ctx, 170, 960 + a.dy + Math.sin(t * 1.6) * 6, a.rot + 0.02 * Math.sin(t * 1.3), 1.05, a.ar, a.alfa, (c) => folhetoArte(c, 300, 420));
      a = P.pouso(t, t0 + 1.7, { dur: 0.55, curva: 'back.out(2.2)', dist: 900, deCima: true, rot: 0.15, giro: 1.2 });
      moeda.desenha(ctx, 600, 1160 + a.dy, a.rot + 0.1 * Math.sin(t * 2.5), 1, a.ar, a.alfa, (c) => {
        c.strokeStyle = '#C99A2E'; c.lineWidth = 8; c.beginPath(); c.arc(110, 110, 86, 0, 6.29); c.stroke();
        c.fillStyle = '#7A5A12'; c.textAlign = 'center'; c.font = "700 88px 'Instrument Sans'"; c.fillText('5¢', 110, 140); c.textAlign = 'left';
      });
      a = P.pouso(t, t0 + 2.0, { rot: 0.01 }); t5.prepara(ctx); t5.desenha(ctx, 540 - t5.w / 2, 1520 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  // 5. ENTREGA (van atravessa a ponte)
  {
    const ponte = new Ponte(-40, 1120, 560, 1420, 260, 230, 1000);
    const mares = [mar(1470, C.medio, 6), mar(1540, C.verde, 7), mar(1610, C.claro, 8)];
    const t1 = tira('ENTREGA GRÁTIS', { tam: 100, peso: 700, cor: C.claro, ls: -0.02 });
    const CID = [{ n: 'Cariacica', t: 25.45 }, { n: 'Vila Velha', t: 26.05 }, { n: 'Vitória', t: 26.65 }, { n: 'Serra', sub: 'alguns bairros', t: 28.1 }];
    const prazo = tira('Pronto em até 7 dias úteis', { tam: 58, peso: 700, semente: 1030 });
    const calp = forma(R(150, 150), C.creme, 1031, 7);
    const placas = CID.map((c, i) => tira(c.n + (c.sub ? '*' : ''), { tam: 60, peso: 700, semente: 1010 + i }));
    const nota = tira('*alguns bairros da Serra', { tam: 38, peso: 500, cor: C.claro });
    const van = forma([[0, 40], [30, 0], [200, 0], [200, 120], [0, 120]], C.creme, 1020, 7);
    const roda = forma(circ(26, 24, 26, 26), C.profundo, 1021, 4);
    cenas.push({ ini: T.entrega - 0.2, cor: C.verde, desenha(t) {
      const t0 = T.entrega;
      ponte.desenha(ctx, t, t0 + 0.2);
      mares.forEach((mm, i) => { const b = P.pouso(t, t0 + 0.4 + i * 0.1, { dur: 0.5, dist: 500, rot: 0, giro: 0 }); mm.desenha(ctx, 0, b.dy + Math.sin(t * 1.5 + i) * 6, 0, 1, b.ar, b.alfa); });
      let a = P.pouso(t, t0 + 0.3, { dur: 0.5, curva: 'back.out(2)', dist: 500, deCima: true, rot: 0.06, giro: 0.4 });
      calp.desenha(ctx, 80, 210 + a.dy + Math.sin(t * 2.2) * 6, a.rot, 1, a.ar, a.alfa, (c) => {
        c.fillStyle = C.medio; c.fillRect(0, 0, 150, 40);
        c.fillStyle = C.profundo; c.textAlign = 'center'; c.font = "700 86px 'Instrument Sans'"; c.fillText('7', 75, 128); c.textAlign = 'left';
        c.fillStyle = C.creme; c.beginPath(); c.arc(40, 20, 7, 0, 6.29); c.arc(110, 20, 7, 0, 6.29); c.fill(); });
      a = P.pouso(t, t0 + 0.45, { rot: -0.015 }); prazo.desenha(ctx, 250, 240 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 24.3, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 80, 420 + a.dy, a.rot, a.ar, a.alfa);
      CID.forEach((c, i) => { const b = P.pouso(t, c.t, { rot: [-0.04, 0.03, -0.02, 0.04][i], curva: 'back.out(2)' }); placas[i].desenha(ctx, i % 2 ? 560 : 90, 600 + Math.floor(i / 2) * 150 + b.dy, b.rot, b.ar, b.alfa); });
      a = P.pouso(t, 28.4, { rot: 0 }); nota.desenha(ctx, 300, 910 + a.dy, a.rot, a.ar, a.alfa);
      // a van percorre o tabuleiro da ponte
      const pv = seg(t, t0 + 0.8, 6.0, 'sine.inOut');
      if (pv > 0) {
        const x = S.mix(-260, 1100, pv), dx = 4, ang = Math.atan2(ponte.deck(x + 100 + dx) - ponte.deck(x + 100 - dx), 2 * dx);
        const y = ponte.deck(x + 100) - 150 + Math.sin(t * 18) * 1.5;
        ctx.save(); ctx.translate(x + 100, y + 75); ctx.rotate(ang); ctx.translate(-100, -75);
        van.desenha(ctx, 0, 0, 0, 1, 0.25, 1, (c) => {
          c.fillStyle = C.verde; c.fillRect(0, 70, 200, 16);
          c.fillStyle = C.claro; c.fillRect(10, 14, 34, 34);
          logoPlano(c, 'simbolo', 90, 20, 50, C.verde);
        });
        roda.desenha(ctx, 18, 100, t * 6, 1, 0.1, 1); roda.desenha(ctx, 130, 100, t * 6, 1, 0.1, 1);
        ctx.restore();
      }
    } });
  }
  // 6. CHAMADA
  {
    const t1 = tira('Folhetos a partir de', { tam: 60, peso: 500 }), t2 = tira('R$ 150', { tam: 170, peso: 700, cor: C.claro, ls: -0.03 });
    const botao = tira('CHAMA NO WHATSAPP  →', { tam: 58, peso: 700, cor: C.claro, ls: 0.03, padX: 0.6, padY: 0.42, semente: 1141 });
    const n1 = tira('Arte grátis · Pronto em até 7 dias úteis', { tam: 34, peso: 500, cor: C.creme, semente: 1150 });
    const n2 = tira('Entrega grátis em Cariacica, Vila Velha,', { tam: 34, peso: 500, cor: C.creme, semente: 1151 });
    const n3 = tira('Vitória e alguns bairros da Serra', { tam: 34, peso: 500, cor: C.creme, semente: 1152 });
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
