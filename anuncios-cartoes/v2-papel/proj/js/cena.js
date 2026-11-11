// Anúncio 2 — "Feito aqui no ES", em papel recortado. Tempos presos às falas (assets/falas/tempos.json).
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
  const T = { gancho: 0, capixaba: 6.05, pacotes: 10.7, detalhes: 15.27, entrega: 19.46, chamada: 24.23, fim: 28.0 };

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

  // ---------- cenas ----------
  const cenas = [];
  // 1. GANCHO
  {
    const t1 = tira('Precisando de', { tam: 84, peso: 500 }), t2 = tira('cartão de visita?', { tam: 112, peso: 700, cor: C.claro, ls: -0.02 });
    const cartoes = [0, 1, 2, 3, 4].map((i) => forma(R(460, 256), i === 4 ? C.creme : (i % 2 ? C.claro : C.creme), 600 + i, 10));
    const rots = [-0.12, 0.08, -0.05, 0.1, -0.03];
    const preco = tira('R$ 99,90', { tam: 190, peso: 700, cor: C.claro, ls: -0.03 });
    const unid = tira('1.000 unidades · 9 x 5 cm', { tam: 50, peso: 600 });
    const selo = forma(circ(150, 60, 150, 150), C.claro, 610, 8);
    cenas.push({ ini: -1, cor: C.profundo, desenha(t) {
      let a = P.pouso(t, 0.35, { rot: -0.03 }); t1.desenha(ctx, 80, 230 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 0.6, { rot: 0.02, dist: 320 }); t2.desenha(ctx, 70, 360 + a.dy, a.rot, a.ar, a.alfa);
      cartoes.forEach((c, i) => {
        const b = P.pouso(t, 2.0 + i * 0.12, { dur: 0.45, dist: 900, deCima: true, rot: rots[i], giro: 0.3 });
        c.desenha(ctx, 310 + i * 6, 640 - i * 10 + b.dy, b.rot, 1, b.ar, b.alfa, i === 4 ? (cc) => logoPlano(cc, 'lockup', 70, 96, 320, C.verde) : null);
      });
      a = P.pouso(t, 2.75, { rot: -0.03, dist: 380, curva: 'back.out(1.8)' }); preco.desenha(ctx, 150, 1010 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 3.05, { rot: 0.02 }); unid.desenha(ctx, 230, 1310 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, 4.35, { dur: 0.5, curva: 'back.out(2.4)', dist: 500, deCima: true, rot: 0.25, giro: 0.8 });
      selo.desenha(ctx, 690, 520 + a.dy, a.rot, 1, a.ar, a.alfa, (cc) => {
        cc.fillStyle = C.profundo; cc.textAlign = 'center';
        cc.font = "700 62px 'Instrument Sans'"; cc.fillText('ARTE', 150, 140);
        cc.font = "700 62px 'Instrument Sans'"; cc.fillText('GRÁTIS', 150, 205); cc.textAlign = 'left';
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
  // 3. PACOTES (varal)
  {
    const PAC = [
      { nome: '4x0', d1: 'Colorido só', d2: 'na frente', preco: 'R$ 99,90', t: 11.25 },
      { nome: '4x1', d1: 'Frente colorida,', d2: 'verso P&B', preco: 'R$ 119,90', t: 12.15 },
      { nome: '4x4', d1: 'Colorido frente', d2: 'e verso', preco: 'R$ 129,90', t: 12.65 },
      { nome: 'Verniz', d1: '4x4 + verniz', d2: 'localizado', preco: 'R$ 189,90', t: 13.5 },
    ];
    const tags = PAC.map((p, i) => forma(R(232, 340), i === 3 ? C.claro : C.creme, 800 + i, 9));
    const prendedor = forma(R(22, 56), C.medio, 820, 5);
    const titulo = tira('1.000 unidades · escolha o seu', { tam: 56, peso: 600 });
    const ponte = new Ponte(-40, 1120, 540, 1660, 150, 190, 830);
    const mares = [mar(1700, C.medio, 4), mar(1760, C.claro, 5)];
    cenas.push({ ini: T.pacotes - 0.2, cor: C.verde, desenha(t) {
      const t0 = T.pacotes;
      ponte.desenha(ctx, t, t0 + 0.15);
      mares.forEach((mm, i) => { const b = P.pouso(t, t0 + 0.35 + i * 0.1, { dur: 0.5, dist: 400, rot: 0, giro: 0 }); mm.desenha(ctx, 0, b.dy + Math.sin(t * 1.5 + i) * 6, 0, 1, b.ar, b.alfa); });
      let a = P.pouso(t, t0 + 0.2, { rot: -0.015 }); titulo.desenha(ctx, 110, 300 + a.dy, a.rot, a.ar, a.alfa);
      // o varal: corda que cai em curva entre as pontas
      const pc = seg(t, t0 + 0.3, 0.6, 'power2.out');
      const sai = P.saida ? seg(t, P.saida.t0, 0.5, 'power2.in') : 0;
      const corda = (x) => 640 + 70 * Math.sin(Math.PI * (x + 20) / 1120);
      if (pc > 0 && sai < 1) {
        ctx.save(); ctx.globalAlpha = 1 - sai; ctx.strokeStyle = C.creme; ctx.lineWidth = 5; ctx.beginPath();
        for (let x = -20; x <= -20 + 1120 * pc; x += 20) { const y = corda(x) + sai * 900; x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.restore();
      }
      PAC.forEach((p, i) => {
        const px = 140 + i * 268, py = corda(px);
        const b = P.pouso(t, p.t, { dur: 0.45, dist: 500, deCima: true, rot: 0, giro: 0 });
        if (!b.on) return;
        const bal = 0.22 * Math.exp(-(t - p.t) * 1.6) * Math.sin((t - p.t) * 7) + 0.03 * Math.sin(t * 1.7 + i);
        ctx.save(); ctx.translate(px, py + b.dy); ctx.rotate(bal);
        tags[i].desenha(ctx, -116, 6, 0, 1, b.ar, b.alfa, (c) => {
          c.fillStyle = C.profundo; c.textAlign = 'center';
          c.font = "700 54px 'Instrument Sans'"; c.fillText(p.nome, 116, 92);
          c.font = "500 27px 'Instrument Sans'"; c.fillText(p.d1, 116, 150); c.fillText(p.d2, 116, 184);
          c.fillStyle = C.verde; c.fillRect(30, 222, 172, 3);
          c.fillStyle = C.profundo; c.font = "700 44px 'Instrument Sans'"; c.fillText(p.preco, 116, 290); c.textAlign = 'left';
        });
        prendedor.desenha(ctx, -11, -18, 0, 1, b.ar, b.alfa);
        ctx.restore();
      });
    } });
  }
  // 4. DETALHES (tesoura + calendário)
  {
    const quina = (r) => { const pts = []; const cant = [[700 - r, r, -Math.PI / 2], [700 - r, 390 - r, 0], [r, 390 - r, Math.PI / 2], [r, r, Math.PI]];
      cant.forEach(([cx, cy, a0]) => { for (let k = 0; k <= 8; k++) { const a = a0 + (Math.PI / 2) * k / 8; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } }); return pts; };
    const cartaoReto = forma(R(700, 390), C.creme, 900, 11), cartaoRedondo = forma(quina(56), C.creme, 900, 11);
    const ponta = forma([[0, 0], [70, 0], [70, 70]], C.creme, 901, 5);
    const lamina = forma([[0, 0], [340, -26], [340, 26]], C.claro, 902, 6), lamina2 = forma([[0, 0], [340, -26], [340, 26]], C.creme, 903, 6);
    const argola = forma(circ(52, 36, 52, 52), C.claro, 904, 6);
    const t1 = tira('Canto arredondado', { tam: 76, peso: 700 }), t2 = tira('+ R$ 10,00', { tam: 120, peso: 700, cor: C.claro });
    const cal = forma(R(230, 230), C.creme, 905, 8);
    const t3 = tira('Entrega em até 7 dias úteis', { tam: 58, peso: 600 });
    cenas.push({ ini: T.detalhes - 0.2, cor: C.profundo, desenha(t) {
      const t0 = T.detalhes, corte = t0 + 1.25;
      let a = P.pouso(t, t0 + 0.2, { dur: 0.55, dist: 900, curva: 'back.out(0.9)', rot: -0.04, giro: 0.12 });
      const cortado = t >= corte;
      (cortado ? cartaoRedondo : cartaoReto).desenha(ctx, 190, 380 + a.dy, a.rot, 1, a.ar, a.alfa, (c) => logoPlano(c, 'lockup', 110, 140, 480, C.verde));
      // a ponta cortada cai girando
      if (cortado && P.pouso(t, corte, {}).on) {
        const q = t - corte;
        ponta.desenha(ctx, 820 + q * 140, 330 + q * q * 900, q * 3, 1, 0.8, Math.max(0, 1 - q / 1.2));
      }
      // tesoura: vem da direita, fecha no canto e sai
      const pe = seg(t, t0 + 0.6, 0.55, 'power3.out') - seg(t, corte + 0.35, 0.5, 'power3.in');
      if (pe > 0.001) {
        const fecha = seg(t, corte - 0.25, 0.25, 'power2.in') - seg(t, corte + 0.05, 0.3, 'power2.out');
        const ab = 0.38 * (1 - fecha);
        ctx.save(); ctx.translate(890 + (1 - pe) * 700, 380); ctx.rotate(-0.75);
        [[lamina, ab], [lamina2, -ab]].forEach(([l, ang]) => { ctx.save(); ctx.rotate(ang); l.desenha(ctx, -340, 0, 0, 1, 0.3, 1); ctx.restore(); });
        [[ab, 1], [-ab, -1]].forEach(([ang, s]) => { ctx.save(); ctx.rotate(ang); argola.desenha(ctx, 4, -52 + s * 52, 0, 1, 0.3, 1, (c) => { c.fillStyle = C.profundo; c.beginPath(); c.arc(52, 52, 28, 0, 6.29); c.fill(); }); ctx.restore(); });
        ctx.restore();
      }
      a = P.pouso(t, corte + 0.1, { rot: -0.02 }); t1.desenha(ctx, 160, 880 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, corte + 0.3, { rot: 0.02, dist: 340, curva: 'back.out(1.8)' }); t2.desenha(ctx, 250, 1010 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 2.35, { dur: 0.5, curva: 'back.out(2)', dist: 500, deCima: true, rot: 0.08, giro: 0.4 });
      cal.desenha(ctx, 425, 1290 + a.dy, a.rot, 1, a.ar, a.alfa, (c) => {
        c.fillStyle = C.medio; c.fillRect(0, 0, 230, 60);
        c.fillStyle = C.profundo; c.textAlign = 'center'; c.font = "700 130px 'Instrument Sans'"; c.fillText('7', 115, 190); c.textAlign = 'left';
        c.fillStyle = C.creme; c.beginPath(); c.arc(60, 30, 10, 0, 6.29); c.arc(170, 30, 10, 0, 6.29); c.fill();
      });
      a = P.pouso(t, t0 + 2.6, { rot: -0.015 }); t3.desenha(ctx, 120, 1570 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  // 5. ENTREGA (van atravessa a ponte)
  {
    const ponte = new Ponte(-40, 1120, 560, 1420, 260, 230, 1000);
    const mares = [mar(1470, C.medio, 6), mar(1540, C.verde, 7), mar(1610, C.claro, 8)];
    const t1 = tira('ENTREGA GRÁTIS', { tam: 100, peso: 700, cor: C.claro, ls: -0.02 });
    const CID = [{ n: 'Cariacica', t: 20.15 }, { n: 'Vila Velha', t: 20.8 }, { n: 'Vitória', t: 21.45 }, { n: 'Serra', sub: 'alguns bairros', t: 22.1 }];
    const placas = CID.map((c, i) => tira(c.n + (c.sub ? '*' : ''), { tam: 60, peso: 700, semente: 1010 + i }));
    const nota = tira('*alguns bairros da Serra', { tam: 38, peso: 500, cor: C.claro });
    const van = forma([[0, 40], [30, 0], [200, 0], [200, 120], [0, 120]], C.creme, 1020, 7);
    const roda = forma(circ(26, 24, 26, 26), C.profundo, 1021, 4);
    cenas.push({ ini: T.entrega - 0.2, cor: C.verde, desenha(t) {
      const t0 = T.entrega;
      ponte.desenha(ctx, t, t0 + 0.2);
      mares.forEach((mm, i) => { const b = P.pouso(t, t0 + 0.4 + i * 0.1, { dur: 0.5, dist: 500, rot: 0, giro: 0 }); mm.desenha(ctx, 0, b.dy + Math.sin(t * 1.5 + i) * 6, 0, 1, b.ar, b.alfa); });
      let a = P.pouso(t, t0 + 0.2, { rot: -0.02, dist: 340 }); t1.desenha(ctx, 80, 250 + a.dy, a.rot, a.ar, a.alfa);
      CID.forEach((c, i) => { const b = P.pouso(t, c.t, { rot: [-0.04, 0.03, -0.02, 0.04][i], curva: 'back.out(2)' }); placas[i].desenha(ctx, i % 2 ? 560 : 90, 450 + Math.floor(i / 2) * 150 + b.dy, b.rot, b.ar, b.alfa); });
      a = P.pouso(t, 22.5, { rot: 0 }); nota.desenha(ctx, 300, 770 + a.dy, a.rot, a.ar, a.alfa);
      // a van percorre o tabuleiro da ponte
      const pv = seg(t, t0 + 0.6, 3.8, 'sine.inOut');
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
    const t1 = tira('Cartões a partir de', { tam: 60, peso: 500 }), t2 = tira('R$ 99,90', { tam: 150, peso: 700, cor: C.claro, ls: -0.03 });
    const botao = tira('CHAMA NO WHATSAPP  →', { tam: 58, peso: 700, cor: C.claro, ls: 0.03, padX: 0.6, padY: 0.42, semente: 1141 });
    const n1 = tira('Arte grátis · Entrega grátis em Cariacica,', { tam: 34, peso: 500, cor: C.creme, semente: 1150 });
    const n2 = tira('Vila Velha, Vitória e alguns bairros da Serra', { tam: 34, peso: 500, cor: C.creme, semente: 1151 });
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
      t1.prepara(ctx); t2.prepara(ctx); botao.prepara(ctx); n1.prepara(ctx); n2.prepara(ctx);
      a = P.pouso(t, t0 + 0.6, { rot: -0.015 }); t1.desenha(ctx, 540 - t1.w / 2, 820 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 0.75, { rot: 0.02, curva: 'back.out(1.8)' }); t2.desenha(ctx, 540 - t2.w / 2, 930 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.1, { dur: 0.5, dist: 500, curva: 'back.out(1.8)', rot: -0.02 });
      const bal = Math.sin((t - t0) * 2.6) * 0.025 * seg(t, t0 + 1.6, 0.6);
      botao.desenha(ctx, 540 - botao.w / 2, 1230 + a.dy, a.rot + bal, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.5, { rot: 0.01 }); n1.desenha(ctx, 540 - n1.w / 2, 1440 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, t0 + 1.6, { rot: -0.01 }); n2.desenha(ctx, 540 - n2.w / 2, 1520 + a.dy, a.rot, a.ar, a.alfa);
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
