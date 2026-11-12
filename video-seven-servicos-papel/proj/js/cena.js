// Reels "O que a SEVEN faz?" em papel recortado. Mesmos tempos da versão anterior (js/roteiro.js),
// para a locução encaixar. Tudo é desenhado num canvas como função pura do tempo.
(function () {
  const S = STUDIO, R = ROTEIRO, P = PAPEL, C = P.COR;
  const W = 1080, H = 1920;
  const tela = document.getElementById('tela'), ctx = tela.getContext('2d');
  // as fotos entram no documento (escondidas) para o carregamento esperar por elas
  const img = (src) => { const i = document.createElement('img'); i.src = src; i.style.display = 'none'; document.body.appendChild(i); return i; };
  const rngP = S.rng(4);
  const jit = () => (rngP() - 0.5);

  // ---------- peças da logo (contorno original, sem redesenho; só o acabamento de papel) ----------
  const bbDe = (b) => [b[0], b[1], b[0] + b[2], b[1] + b[3]];
  const pecaLogo = (parte, cor) => new P.Peca(new Path2D(parte.d), bbDe(parte.box), cor);
  const simCorpo = pecaLogo(LOGO.simbolo.corpo, C.creme), simTri = pecaLogo(LOGO.simbolo.triangulo, C.creme);
  const lk = LOGO.lockup;
  const lkCorpo = pecaLogo(lk.corpo, C.creme), lkTri = pecaLogo(lk.triangulo, C.creme);
  const lkLetras = lk.letras.map((l) => pecaLogo(l, C.creme));
  const lkAssin = new Path2D(lk.assinatura.map((a) => a.d).join(' '));

  // ---------- fundos de página e lascas que flutuam ----------
  function Pagina(cor, semente) {
    const topo = P.cut([[-40, 0], [W + 40, 0]], semente, 14, 1.4, 3, false);
    const pts = topo.concat([[W + 40, H + 80], [-40, H + 80]]);
    this.peca = new P.Peca(P.toPath(pts), P.bbox(pts), cor);
  }
  const LASCAS = Array.from({ length: 7 }, (_, i) => {
    const forma = i % 3 === 0 ? [[0, 0], [60, 0], [30, 52]] : i % 3 === 1 ? [[14, 0], [44, 0], [30, 70], [0, 70]] : P.circ(22, 30).map((q) => [q[0] + 22, q[1] + 22]);
    return { peca: P.Peca.daForma(forma, i % 2 ? C.claro : C.medio, 90 + i, 6, 0.8), x: rngP() * W, y: rngP() * H, v: 14 + rngP() * 22, r0: rngP() * 6, vr: (rngP() - 0.5) * 0.5, s: 0.7 + rngP() * 0.7 };
  });
  function lascas(t, alfa) {
    LASCAS.forEach((l, i) => {
      const y = ((l.y + t * l.v) % (H + 200)) - 100;
      l.peca.desenha(ctx, l.x + Math.sin(t * 0.6 + i) * 20, y, l.r0 + t * l.vr, l.s, 0.5, alfa * 0.9);
    });
  }

  // ---------- cenas ----------
  const G = R.gancho, PR = R.promessa, V = R.valor, F = R.final;
  // [início da cena (quando a página dela começa a subir), cor, função de desenho]
  const cenas = [];
  const tira = (txt, o) => new P.Tira(txt, o);

  // GANCHO
  {
    const t1 = tira(G.linhas[0], { tam: 92, peso: 500 }), t2 = tira(G.linhas[1], { tam: 230, peso: 700, cor: C.claro, ls: -0.03 }), t3 = tira(G.linhas[2], { tam: 96, peso: 600 });
    const deco1 = P.Peca.daForma([[0, 0], [300, 0], [150, 250]], C.verde, 7, 12), deco2 = P.Peca.daForma([[150, 0], [420, 0], [270, 700], [0, 700]], C.medio, 8, 12);
    cenas.push({ ini: -1, cor: C.profundo, desenha(t) {
      let a = P.pouso(t, 0.1, { dur: 0.55, dist: 900, curva: 'back.out(0.7)', rot: 0.12 }); deco2.desenha(ctx, 700, 1150 + a.dy, a.rot, 1, a.ar, a.alfa);
      a = P.pouso(t, 0.2, { dur: 0.5, dist: 700, rot: -0.2, deCima: true }); deco1.desenha(ctx, 720, 120 + a.dy, a.rot, 1, a.ar, a.alfa);
      const s = 380 / 844;
      a = P.pouso(t, G.simbolo, { dur: 0.55, dist: 700, curva: 'back.out(0.9)', rot: -0.03, deCima: true });
      simCorpo.desenha(ctx, 96 - 33 * s, 300 - 32 * s + a.dy, a.rot, s, a.ar, a.alfa);
      a = P.pouso(t, G.simbolo + 0.3, { dur: 0.45, dist: 500, rot: -0.03, deCima: true });
      simTri.desenha(ctx, 96 - 33 * s, 300 - 32 * s + a.dy, a.rot, s, a.ar, a.alfa);
      a = P.pouso(t, G.texto, { rot: -0.025 }); t1.desenha(ctx, 80, 930 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, G.texto + 0.18, { rot: 0.018, dist: 340 }); t2.desenha(ctx, 70, 1060 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, G.texto + 1.15, { rot: -0.04 }); t3.desenha(ctx, 90, 1380 + a.dy, a.rot, a.ar, a.alfa);
    } });
  }
  // PROMESSA
  {
    const t1 = tira(PR.linhas[0], { tam: 100, peso: 500 }), t2 = tira(PR.linhas[1], { tam: 230, peso: 700, cor: C.claro, ls: -0.03 }), t3 = tira(PR.linhas[2], { tam: 108, peso: 600 });
    // a lâmpada de papel (a ideia) que gruda na tira "ideias"
    // bulbo: círculo que afina num gargalo (forma de lâmpada), rosca em duas tiras e três raios
    const formaBulbo = [];
    for (let i = 0; i <= 40; i++) { const ang = Math.PI * (0.78 + 1.44 * i / 40); formaBulbo.push([64 + Math.cos(ang) * 64, 64 + Math.sin(ang) * 64]); }
    formaBulbo.push([86, 132], [42, 132]);
    const bulbo = P.Peca.daForma(formaBulbo, C.creme, 31, 7, 0.8);
    const rosca = [P.Peca.daForma(P.ret(50, 14).map((q) => [q[0] + 39, q[1] + 136]), C.medio, 32, 5, 0.5),
      P.Peca.daForma(P.ret(42, 14).map((q) => [q[0] + 43, q[1] + 153]), C.medio, 33, 5, 0.5)];
    const raios = [[-0.9, 0], [0, 1], [0.9, 2]].map(([ang, i]) => ({ ang, peca: P.Peca.daForma(P.ret(14, 44), C.claro, 34 + i, 5, 0.5) }));
    cenas.push({ ini: PR.cortina, cor: C.verde, desenha(t) {
      let a = P.pouso(t, PR.texto, { rot: 0.02 }); t1.desenha(ctx, 80, 640 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, PR.texto + 0.2, { rot: -0.022, dist: 340 }); t2.desenha(ctx, 70, 790 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, PR.texto + 0.45, { rot: 0.015 }); t3.desenha(ctx, 86, 1110 + a.dy, a.rot, a.ar, a.alfa);
      const tb = PR.texto + 0.85;
      a = P.pouso(t, tb, { dur: 0.45, curva: 'back.out(2.2)', dist: 420, deCima: true, rot: 0.25, giro: 0.4 });
      const bal = Math.sin((t - tb) * 3) * 0.05 * S.seg(t, tb + 0.4, 0.5);
      const bx = 896, by = 860 + a.dy;
      rosca.forEach((r) => r.desenha(ctx, bx, by, a.rot + bal, 1, a.ar, a.alfa));
      bulbo.desenha(ctx, bx, by, a.rot + bal, 1, a.ar, a.alfa);
      // os raios acendem depois que a lâmpada pousa
      raios.forEach((r, i) => {
        const pr = P.pouso(t, tb + 0.45 + i * 0.08, { dur: 0.35, dist: 0, curva: 'back.out(2.4)', rot: 0, giro: 0 });
        if (!pr.on) return;
        const k = S.seg(t, tb + 0.45 + i * 0.08, 0.35, 'back.out(2.4)');
        const ang = r.ang - Math.PI / 2, d = 96 + 10 * k;
        r.peca.desenha(ctx, bx + 64 + Math.cos(ang) * d - 7, by + 64 + Math.sin(ang) * d - 22, r.ang, Math.max(0.01, k), 0.2, pr.alfa);
      });
    } });
  }
  // SERVIÇOS
  const ICONES = {
    camadas: ['M50 16 L86 34 L50 52 L14 34 Z', 'M14 51 L50 69 L86 51', 'M14 68 L50 86 L86 68'],
    imagem: ['M16 22 H84 V78 H16 Z', 'M30 40 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0', 'M16 72 L40 50 L56 64 L66 55 L84 72'],
    lampada: ['M50 14 a24 24 0 0 1 15 42 V66 H35 V56 A24 24 0 0 1 50 14 Z', 'M39 75 H61 M43 84 H57', 'M50 2 V7 M15 24 L19 27 M85 24 L81 27'],
  };
  R.servicos.forEach((sv, k) => {
    const S0 = sv.ini;
    const disco = P.Peca.daForma(P.circ(92, 60).map((q) => [q[0] + 92, q[1] + 92]), C.creme, 40 + k, 8, 0.9);
    const discoI = P.Peca.daForma(P.circ(92, 60).map((q) => [q[0] + 92, q[1] + 92]), C.claro, 50 + k, 8, 0.9);
    const icone = ICONES[sv.icone].map((d) => new Path2D(d));
    const titulos = sv.titulo.map((tx, i) => tira(tx, { tam: sv.titulo.length > 1 ? 104 : 124, peso: 700, ls: -0.02, semente: 60 + k * 3 + i }));
    const yFoto = sv.titulo.length > 1 ? 720 : 640;
    const quadro = new ILUSTRA.Quadro({ camadas: 'grafica', imagem: 'fachada', lampada: 'publicidade' }[sv.icone], 900, 640, C.claro, 70 + k);
    const etiquetas = sv.itens.map((tx, i) => tira(tx, { tam: 48, peso: 600, cor: C.claro, semente: 100 + k * 10 + i, padX: 0.5, padY: 0.32 }));
    const rots = etiquetas.map(() => jit() * 0.09);
    cenas.push({ ini: S0 - 0.15, cor: sv.cor === 'var(--verde)' ? C.verde : C.profundo, desenha(t) {
      let a = P.pouso(t, S0 + 0.3, { curva: 'back.out(1.8)', rot: -0.06, dist: 380 });
      disco.desenha(ctx, 70, 120 + a.dy, a.rot, 1, a.ar, a.alfa, (c) => {
        c.font = "700 96px 'Instrument Sans'"; c.fillStyle = C.profundo; c.textAlign = 'center'; c.fillText(sv.num, 92, 126); c.textAlign = 'left';
      });
      a = P.pouso(t, S0 + 0.45, { curva: 'back.out(1.8)', rot: 0.07, dist: 380, deCima: true });
      const pi = S.seg(t, S0 + 0.65, 0.9, 'power2.inOut');
      discoI.desenha(ctx, 826, 120 + a.dy, a.rot, 1, a.ar, a.alfa, (c) => {
        c.save(); c.beginPath(); c.rect(0, 0, 184 * pi, 184); c.clip();
        c.translate(42, 42); c.lineWidth = 7; c.strokeStyle = C.profundo; c.lineCap = 'round'; c.lineJoin = 'round';
        icone.forEach((p) => c.stroke(p)); c.restore();
      });
      titulos.forEach((tt, i) => { a = P.pouso(t, S0 + 0.55 + i * 0.15, { rot: i ? 0.015 : -0.018 }); tt.desenha(ctx, 64, 400 + i * 136 + a.dy, a.rot, a.ar, a.alfa); });
      a = P.pouso(t, S0 + 0.85, { dur: 0.6, curva: 'back.out(0.8)', dist: 1100, rot: 0.025, giro: 0.12 });
      quadro.desenha(ctx, 70, yFoto + a.dy, a.rot, a.ar, a.alfa, t, S0 + 1.15);
      // etiquetas em fluxo, quebrando linha
      ctx.save(); let x = 64, y = yFoto + 720;
      etiquetas.forEach((e, i) => {
        e.prepara(ctx);
        if (x + e.w > W - 50) { x = 64; y += e.h + 22; }
        const b = P.pouso(t, S0 + 1.75 + i * 0.22, { rot: rots[i], dist: 300 });
        e.desenha(ctx, x, y + b.dy, b.rot, b.ar, b.alfa);
        x += e.w + 20;
      });
      ctx.restore();
    } });
  });
  // VALOR
  {
    const t1 = tira(V.linhas[0], { tam: 88, peso: 500 }), t2 = tira(V.linhas[1], { tam: 88, peso: 500 }), t3 = tira(V.linhas[2], { tam: 250, peso: 700, cor: C.claro, ls: -0.03 });
    const fotos = ['grafica', 'fachada', 'publicidade', 'caixa'].map((n, i) => new ILUSTRA.Quadro(n, 400, 330, i % 2 ? C.creme : C.claro, 80 + i));
    const pos = [[70, 1010, -0.06], [560, 990, 0.05], [90, 1430, 0.04], [570, 1410, -0.05]];
    cenas.push({ ini: V.cortina, cor: C.verde, desenha(t) {
      let a = P.pouso(t, V.texto, { rot: -0.02 }); t1.desenha(ctx, 70, 330 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, V.texto + 0.15, { rot: 0.016 }); t2.desenha(ctx, 70, 470 + a.dy, a.rot, a.ar, a.alfa);
      a = P.pouso(t, V.texto + 0.5, { rot: -0.03, dist: 360, curva: 'back.out(1.8)' }); t3.desenha(ctx, 56, 610 + a.dy, a.rot, a.ar, a.alfa);
      fotos.forEach((f, i) => { const b = P.pouso(t, V.texto + 0.75 + i * 0.16, { dur: 0.5, dist: 900, rot: pos[i][2], giro: 0.2 }); f.desenha(ctx, pos[i][0], pos[i][1] + b.dy, b.rot, b.ar, b.alfa, t, V.texto + 0.9 + i * 0.16); });
    } });
  }
  // ASSINATURA
  {
    const etiqueta = tira(F.textoCta + '  →', { tam: 56, peso: 700, cor: C.claro, ls: 0.03, padX: 0.6, padY: 0.42, semente: 141 });
    cenas.push({ ini: F.cortina, cor: C.profundo, desenha(t) {
      const s = 880 / 1152 * S.mix(1.02, 1, S.seg(t, F.logo, 4, 'power2.out'));
      const x0 = 540 - 594 * s, y0 = 800 - 155 * s;
      let a = P.pouso(t, F.logo, { dur: 0.55, dist: 700, deCima: true, curva: 'back.out(1.0)', rot: 0 });
      lkCorpo.desenha(ctx, x0 + lk.corpo.box[0] * s - lk.corpo.box[0] * s, y0 + a.dy, a.rot, s, a.ar, a.alfa);
      a = P.pouso(t, F.logo + 0.2, { dur: 0.45, dist: 500, deCima: true, rot: 0 });
      lkTri.desenha(ctx, x0, y0 + a.dy, a.rot, s, a.ar, a.alfa);
      lkLetras.forEach((l, i) => { const b = P.pouso(t, F.logo + 0.6 + i * 0.08, { dur: 0.42, dist: 420, deCima: true, rot: 0, giro: 0.05 }); l.desenha(ctx, x0, y0 + b.dy, b.rot, s, b.ar, b.alfa); });
      // assinatura impressa (tinta clara sobre o papel de fundo)
      const pa = S.seg(t, F.logo + 1.4, 0.6, 'power2.out');
      if (pa > 0) { ctx.save(); ctx.globalAlpha = pa; ctx.translate(x0, y0 + (1 - pa) * 12); ctx.scale(s, s); ctx.fillStyle = C.claro; ctx.fill(lkAssin, 'evenodd'); ctx.restore(); }
      // etiqueta do convite, balançando de leve
      etiqueta.prepara(ctx);
      a = P.pouso(t, F.cta, { dur: 0.5, dist: 500, curva: 'back.out(1.8)', rot: -0.03 });
      const bal = Math.sin((t - F.cta) * 2.6) * 0.025 * S.seg(t, F.cta + 0.5, 0.6);
      etiqueta.desenha(ctx, 540 - etiqueta.w / 2, 1130 + a.dy, a.rot + bal, a.ar, a.alfa);
    } });
  }
  const paginas = cenas.map((c, i) => new Pagina(c.cor, 300 + i * 7));

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // qual cena está por cima: a última cuja página já começou a subir
    let k = 0;
    cenas.forEach((c, i) => { if (t >= c.ini) k = i; });
    const subida = (i) => S.seg(t, cenas[i].ini, 0.75, 'power3.inOut');
    // desenha a cena de baixo inteira se a de cima ainda está subindo
    const desenhaCena = (i, dy, ar) => {
      ctx.save(); ctx.translate(0, dy);
      if (i === 0 && cenas[0].ini < 0) { ctx.fillStyle = cenas[0].cor; ctx.fillRect(0, -10, W, H + 20); }
      else paginas[i].peca.desenha(ctx, 0, 0, 0, 1, ar, 1);
      // leve aproximação de câmera na cena
      const z = 1 + 0.025 * S.seg(t, Math.max(0, cenas[i].ini), 6, 'sine.inOut');
      ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
      lascas(t, 0.6);
      // a cena seguinte começa em cenas[i + 1].ini: as peças desta caem 0,8 s antes
      P.saida = cenas[i + 1] ? { t0: cenas[i + 1].ini - 0.8, n: 0 } : null;
      cenas[i].desenha(t);
      P.saida = null;
      ctx.restore();
    };
    const pk = k > 0 ? subida(k) : 1;
    if (pk < 1) desenhaCena(k - 1, 0, 0);
    desenhaCena(k, (1 - pk) * (H + 120), (1 - pk) * 0.6);
  }, { loop: false });
})();
