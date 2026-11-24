// O Reels como um jogo: título, 4 fases e a tela final com a logo.
// Um relógio só: render(t) redesenha a tela inteira a partir de t.
(function () {
  const S = STUDIO, P = PIX, R = ROTEIRO, L = LOGO;
  const W = P.W, H = P.H, Q = 4; // 1 pixel do jogo = 4 px do vídeo
  const tela = new P.Tela(document.getElementById('tela'));
  const ui = document.getElementById('ui');
  const rng = S.rng(7);
  const q = (t, fps) => Math.floor(t * fps) / fps; // tempo em degraus (animação de jogo)
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));

  function el(cls, css, txt) {
    const e = document.createElement('div');
    e.className = cls; Object.assign(e.style, css || {});
    if (txt != null) e.textContent = txt;
    ui.appendChild(e);
    return e;
  }
  const mostra = (e, on) => { e.style.visibility = on ? 'visible' : 'hidden'; };
  const em = (e, x, y) => { e.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`; };

  // ---------- material pré-calculado ----------
  const estrelas = Array.from({ length: 46 }, () => ({ x: Math.floor(rng() * W), y: Math.floor(rng() * 300), f: Math.floor(rng() * 5), c: rng() > 0.7 ? 'w' : 'g' }));
  const simbolo = (n) => P.rasterizar([L.simbolo.corpo.d, L.simbolo.triangulo.d], [30, 28, 852, 768], n, n);
  const sim10 = simbolo(10), sim12 = simbolo(12), sim24 = simbolo(24);
  const lockPaths = [L.lockup.corpo.d, L.lockup.triangulo.d].concat(L.lockup.letras.map((p) => p.d), L.lockup.assinatura.map((p) => p.d));
  const VB = [0, 0, 1190, 310];
  const LX = 15, LY = 144, LW = 240; // lockup na tela do jogo
  const lock = { 8: P.rasterizar(lockPaths, VB, LW / 8), 4: P.rasterizar(lockPaths, VB, LW / 4), 2: P.rasterizar(lockPaths, VB, LW / 2) };
  const placa = P.rasterizar(lockPaths, VB, 92);
  // blocos que voam para montar a logo (grade de 8)
  const g8 = lock[8];
  const voo = [];
  for (let j = 0; j < g8.h; j++) for (let i = 0; i < g8.w; i++) if (g8.d[j * g8.w + i]) voo.push({ i, j });
  voo.sort((a, b) => a.i - b.i || a.j - b.j);
  voo.forEach((b, n) => {
    b.de = [Math.floor(rng() * W), rng() > 0.5 ? -24 - rng() * 60 : 360 + rng() * 60];
    b.t0 = R.blocos + n * (1.5 / voo.length);
  });

  // a loja (fase 3) desenhada uma vez numa tela pequena: 128 × 96, construída de baixo para cima
  const loja = document.createElement('canvas');
  loja.width = 128; loja.height = 96;
  (function () {
    const t = new P.Tela(loja);
    t.ret(0, 0, 128, 96, 'k');
    t.ret(2, 26, 124, 68, 'v');                     // parede
    for (let i = 0; i < 16; i++) t.ret(i * 8, 22, 8, 12, i % 2 ? 'l' : 'm'); // toldo listrado
    t.ret(0, 34, 128, 2, 'k');
    t.ret(4, 0, 120, 22, 'p'); t.ret(4, 0, 120, 1, 'm'); // placa
    t.grade(placa, 18, -1, 1, 'w');
    [[12, 44], [86, 44]].forEach(([x, y]) => { t.ret(x, y, 30, 26, 'k'); t.ret(x + 2, y + 2, 26, 22, 'l'); t.ret(x + 2, y + 2, 8, 22, 'w'); t.ret(x + 14, y + 2, 2, 22, 'k'); });
    t.ret(54, 48, 22, 46, 'k'); t.ret(56, 50, 18, 44, 'p'); t.ret(70, 72, 2, 3, 'g');  // porta
    t.ret(0, 94, 128, 2, 'k');
  })();

  // ---------- desenhos ----------
  function chao(cam, y, cor) {
    const c = cor || 'v';
    tela.ret(0, y, W, H - y, c);
    const off = Math.floor(cam) % 16;
    for (let x = -off; x < W; x += 16) {
      tela.ret(x, y, 16, 3, 'm'); tela.ret(x, y + 3, 16, 1, 'g');
      tela.ret(x + 3, y + 9, 2, 2, 'p'); tela.ret(x + 11, y + 15, 2, 2, 'p'); tela.ret(x + 6, y + 22, 2, 2, 'p');
      tela.ret(x + 15, y + 4, 1, 40, 'p');
    }
  }
  function morros(cam, base, cor, amp, per, fase) {
    tela.x.fillStyle = P.PAL[cor];
    for (let x = 0; x < W; x += 2) {
      const h = Math.round((amp * (0.6 + 0.4 * Math.sin((x + cam + fase) / per)) * (0.7 + 0.3 * Math.sin((x + cam) / (per * 0.37)))) / 2) * 2;
      tela.x.fillRect(x, base - h, 2, h);
    }
  }
  function ceu(t, apagar) {
    const f = Math.floor(t * 4);
    estrelas.forEach((s, i) => {
      if (apagar && P.bayer(s.x, s.y) < apagar) return;
      if ((f + s.f) % 5 === 0) return;
      tela.ret(s.x, s.y, 1, 1, s.c);
      if (s.c === 'w' && (f + i) % 7 === 0) { tela.ret(s.x - 1, s.y, 3, 1, 'g'); tela.ret(s.x, s.y - 1, 1, 3, 'g'); tela.ret(s.x, s.y, 1, 1, 'w'); }
    });
  }
  // a lâmpada (personagem): x, chão, quadro de perna, acesa?
  function lampada(x, chaoY, perna, acesa, pulo, esc) {
    esc = esc || 2;
    const y = chaoY - 17 * esc - (pulo || 0);
    const troca = acesa ? null : { w: 'm', l: 'g' };
    tela.spr(P.LAMPADA, x, y, esc, troca);
    tela.spr(P.PERNAS[perna % 3], x, y + 15 * esc, esc);
  }
  function escala(x, y, s, fn) { const c = tela.x; c.save(); c.translate(Math.round(x), Math.round(y)); c.scale(s, s); fn(); c.restore(); }
  function seta(x, y, cor) { // seta de "aperte" em pixel
    for (let j = 0; j < 7; j++) { const w = 4 - Math.abs(3 - j); tela.ret(x, y + j, w, 1, cor || 'l'); }
  }
  function brilho(x, y, f) { // estrelinha de pixel que pisca
    if (f % 2) { tela.ret(x - 2, y, 5, 1, 'w'); tela.ret(x, y - 2, 1, 5, 'w'); } else tela.ret(x, y, 1, 1, 'l');
  }
  function bloco7(x, y, usado, esc) { if (esc && esc !== 1) return escala(x, y, esc, () => bloco7(0, 0, usado)); 
    tela.ret(x, y, 16, 16, 'k');
    tela.ret(x + 1, y + 1, 14, 14, usado ? 'p' : 'v');
    if (!usado) { tela.ret(x + 1, y + 1, 14, 1, 'g'); tela.ret(x + 1, y + 1, 1, 14, 'g'); tela.grade(sim10, x + 3, y + 3, 1, 'w'); }
    else { tela.ret(x + 3, y + 3, 1, 1, 'k'); tela.ret(x + 12, y + 3, 1, 1, 'k'); tela.ret(x + 3, y + 12, 1, 1, 'k'); tela.ret(x + 12, y + 12, 1, 1, 'k'); }
  }
  function icone(nome, x, y, esc) { if (esc && esc !== 1) return escala(x, y, esc, () => icone(nome, 0, 0)); 
    if (P.ICONES[nome]) tela.spr(P.ICONES[nome], x, y);
    else { tela.ret(x, y, 12, 12, 'k'); tela.ret(x + 1, y + 1, 10, 10, 'v'); tela.grade(sim12, x, y, 1, 'w'); }
  }
  function caixaDialogo(t) {
    const sobe = Math.round((1 - S.seg(q(t, 15), 0.2, 0.4, 'power2.out')) * 140 / 2) * 2;
    const y = 376 + sobe;
    tela.ret(4, y + 4, 262, 98, 'k');        // sombra dura
    tela.ret(2, y, 262, 98, 'k');
    tela.ret(4, y + 2, 258, 94, 'l');
    tela.ret(6, y + 4, 254, 90, 'p');
    tela.ret(10, y - 9, 56, 16, 'k'); tela.ret(12, y - 7, 52, 12, 'v'); // etiqueta do nome
    return y;
  }

  // ---------- interface (texto com fontes pixel) ----------
  const hudE = el('hud', { left: '48px', top: '72px' });
  const hudD = el('hud', { right: '48px', top: '72px', textAlign: 'right' });
  const titulo = [];
  R.titulo.forEach((pal, li) => pal.split('').forEach((ch, i) => {
    const e = el('grande', { left: (540 - pal.length * 48 + i * 96) + 'px', top: (li ? 470 : 340) + 'px' }, ch);
    titulo.push({ e, t0: 0.35 + titulo.length * 0.11 });
  }));
  const start = el('medio', { left: '0', width: '1080px', textAlign: 'center', top: '880px' }, 'PRESS START');
  const rotulos = R.itens.map((n) => el('rotulo', {}, '+' + n));
  const levelUp = el('grande', { left: '0', width: '1080px', textAlign: 'center', top: '300px', fontSize: '72px' }, 'LEVEL UP!');
  const criados = [el('grande', { left: '0', width: '1080px', textAlign: 'center', top: '230px', fontSize: '64px' }, ''),
    el('grande', { left: '0', width: '1080px', textAlign: 'center', top: '340px', fontSize: '64px' }, '')];
  const cta = el('medio', { left: '0', width: '1080px', textAlign: 'center', top: '1130px', fontSize: '40px' }, 'CHAMA NO DIRECT');
  const nome = el('nome', {}, 'SEVEN');
  const fala = el('fala', {});
  const falaV = document.createElement('span'), falaI = document.createElement('span');
  falaI.style.visibility = 'hidden';
  fala.appendChild(falaV); fala.appendChild(falaI);
  const crisp = document.getElementById('crisp');
  const flash = document.getElementById('flash');

  function falaAtual(t) {
    for (const f of R.falas) if (t >= f.ini && t < f.fim) return f;
    return null;
  }

  // ---------- fases ----------
  function fase0(t) { // título
    tela.ret(0, 0, W, H, 'p');
    ceu(t);
    morros(0, 300, 'v', 26, 34, 10);
    chao(0, 300);
    const bob = [0, 1, 2, 1][Math.floor(t * 6) % 4];
    lampada(117, 300, 0, true, bob * 2, 3);
    // aperte start
    const piscando = t < R.start ? Math.floor(t * 2.5) % 2 === 0 : Math.floor(t * 12) % 2 === 0;
    const on = t >= 2.4 && t < R.start + 0.35 && piscando;
    mostra(start, on);
    if (on) seta(72, 221, 'l');
    titulo.forEach((l) => {
      const p = S.seg(q(t, 15), l.t0, 0.7, 'bounce.out');
      mostra(l.e, t >= l.t0);
      em(l.e, 0, -Math.round((1 - p) * 500 / 8) * 8);
    });
    if (t >= R.start && t < R.start + 0.08) tela.pontilha(0.5, 'l');
  }

  function fase1(t) { // escuro: a ideia precisa ser vista
    tela.ret(0, 0, W, H, 'p');
    ceu(t);
    morros(20, 300, 'v', 30, 28, 0);
    chao(0, 300);
    const pessoas = [168, 200, 232];
    pessoas.forEach((x, i) => tela.spr(P.PESSOA, x, 276, 2, null, i === 1));
    const anda = S.seg(t, 5.0, 3.2, 'power1.inOut');
    const x = Math.round(16 + 92 * anda);
    const andando = t > 5.0 && t < 8.2;
    const tremula = t >= R.luzAcende - 0.25 && t < R.luzAcende && Math.floor(t * 15) % 2 === 0;
    const acesa = t >= R.luzAcende || tremula;
    lampada(x, 300, andando ? 1 + (Math.floor(t * 8) % 2) : 0, acesa, 0);
    // escuridão em volta da lâmpada
    const raio = Math.round(S.mix(acesa ? 28 : 20, 330, S.seg(t, R.luzAcende, 0.9, 'power2.in')) / 3) * 3;
    const cx = x + 12, cy = 282, ctx = tela.x;
    ctx.fillStyle = P.PAL.k;
    for (let y = 0; y < 376; y += 3) for (let xx = 0; xx < W; xx += 3) {
      const d = Math.hypot(xx - cx, y - cy);
      if (d > raio + 12 || (d > raio && P.bayer(xx / 3, y / 3) < (d - raio) / 12)) ctx.fillRect(xx, y, 3, 3);
    }
    pessoas.forEach((px, i) => { if (t >= 9.05 + i * 0.12) tela.spr(P.EXCLAMA, px + 3, 252 - 2 * (Math.floor(t * 6 + i) % 2), 2); });
  }

  function fase2(t) { // corrida: coleta os materiais
    const cam = (t - R.trocas[1]) * 60;
    tela.ret(0, 0, W, H, 'p');
    ceu(t);
    morros(cam * 0.3, 300, 'v', 34, 30, 40);
    chao(cam, 300);
    let pulo = 0, coletados = 0;
    R.batidas.forEach((hb, i) => {
      const bx = 70 + 60 * (hb - R.trocas[1]) - 4 - cam;
      const bate = t >= hb;
      if (bate) coletados++;
      const bump = bate && t < hb + 0.1 ? -3 : 0;
      if (bx > -36 && bx < W + 4) bloco7(Math.round(bx), 184 + bump, bate, 2);
      const dt = t - hb;
      if (Math.abs(dt) < 0.32) pulo = Math.max(pulo, Math.round(50 * (1 - (dt / 0.32) ** 2)));
      // o item sai do bloco, sobe e some piscando
      const r = rotulos[i];
      const vivo = bate && dt < 1.25 && !(dt > 0.95 && Math.floor(t * 15) % 2);
      mostra(r, vivo);
      if (vivo) {
        const sobe = Math.round(S.seg(q(t, 20), hb, 0.35, 'back.out(2)') * 30 + Math.max(0, dt - 0.35) * 12);
        icone(R.itens[i], Math.round(bx) + 4, 184 - 26 - sobe, 2);
        em(r, cl((Math.round(bx) + 16) * Q - r.offsetWidth / 2, 24, 1056 - r.offsetWidth), (184 - 44 - sobe) * Q);
      }
    });
    lampada(70, 300, 1 + (Math.floor(t * 12) % 2), true, pulo);
    // inventário no topo
    for (let i = 0; i < 6; i++) {
      const x = 39 + i * 33;
      tela.ret(x, 40, 16, 16, 'k'); tela.ret(x + 1, 41, 14, 14, i < coletados ? 'v' : 'p');
      if (i < coletados) icone(R.itens[i], x + 2, 42);
    }
    hudD.textContent = 'ITENS ' + coletados + '/6';
  }

  function fase3(t) { // construção: a marca cresce
    tela.ret(0, 0, W, H, 'p');
    ceu(t);
    morros(60, 300, 'v', 28, 32, 80);
    chao(0, 300);
    // a loja sobe de baixo para cima, uma fileira de 8 px por vez
    const filas = 12;
    let prontas = 0;
    for (let r = 0; r < filas; r++) {
      const t0 = R.obraIni + r * 0.17;
      if (t < t0) continue;
      const cai = Math.round((1 - S.seg(q(t, 20), t0, 0.22, 'power2.in')) * 24 / 2) * 2;
      if (cai === 0) prontas++;
      const sy = 96 - (r + 1) * 8;
      tela.x.drawImage(loja, 0, sy, 128, 8, 71, 204 + sy - cai, 128, 8);
    }
    // planta cresce ao lado
    const est = Math.floor(cl((t - 23.0) / 0.45, -1, 4));
    if (est >= 0) { const pl = P.PLANTA[est]; tela.spr(pl, 214, 300 - pl.length * 4, 4); }
    lampada(28, 300, 0, true, 2 * [0, 1, 2, 1][Math.floor(t * 6) % 4]);
    // barra de XP da marca
    const xp = cl(prontas / filas * 0.8 + (est + 1) / 5 * 0.2, 0, 1);
    tela.ret(80, 38, 170, 14, 'k'); tela.ret(82, 40, 166, 10, 'p');
    tela.ret(82, 40, Math.round(166 * xp / 2) * 2, 10, t >= R.levelUp ? 'w' : 'l');
    for (let i = 1; i < 10; i++) tela.ret(82 + i * 16.6, 40, 1, 10, 'k');
    const lu = t >= R.levelUp && (t > R.levelUp + 0.6 || Math.floor(t * 10) % 2 === 0);
    mostra(levelUp, lu);
    if (t >= R.levelUp) [[60, 200], [212, 190], [56, 250], [226, 238], [135, 186]].forEach(([x, y], i) => brilho(x, y, Math.floor(t * 6) + i));
  }

  function fase4(t) { // amanhecer: criados para criar
    const ctx = tela.x;
    // céu em faixas pontilhadas (sem degradê): sombra → profundo → verde
    for (let y = 0; y < 376; y += 3) {
      const a = y / 376;
      const base = a < 0.45 ? 'k' : a < 0.75 ? 'p' : 'v';
      const prox = a < 0.45 ? 'p' : 'v';
      const frac = a < 0.45 ? a / 0.45 : a < 0.75 ? (a - 0.45) / 0.3 : 0;
      for (let x = 0; x < W; x += 3) { ctx.fillStyle = P.PAL[P.bayer(x / 3, y / 3) < frac * frac ? prox : base]; ctx.fillRect(x, y, 3, 3); }
    }
    ceu(t, S.seg(t, R.sol, 3, 'none'));
    // sol de pixel nascendo
    const sy = Math.round(S.mix(330, 236, S.seg(t, R.sol, 3.2, 'power2.out')) / 2) * 2;
    for (let j = -24; j <= 24; j += 2) for (let i = -24; i <= 24; i += 2) {
      const d = Math.hypot(i, j);
      if (d <= 24) tela.ret(135 + i, sy + j, 2, 2, d < 15 ? 'w' : 'l');
    }
    // raios do sol piscando em dois padrões, como num jogo (começam quando ele termina de nascer)
    if (t > R.sol + 2.8) {
      const fase = Math.floor(t * 4) % 2;
      for (let k = 0; k < 8; k++) {
        const ang = (k + fase * 0.5) * Math.PI / 4;
        for (let r = 30; r < 44; r += 2) tela.ret(135 + Math.round(Math.cos(ang) * r / 2) * 2, sy + Math.round(Math.sin(ang) * r / 2) * 2, 2, 2, k % 2 ? 'g' : 'l');
      }
    }
    morros(0, 320, 'm', 30, 26, 200);
    morros(0, 330, 'v', 22, 18, 30);
    chao(0, 330, 'p');
    const est = Math.floor(cl((t - R.brotoCresce) / 0.4, -1, 4));
    if (est >= 0) { const pl = P.PLANTA[est]; tela.spr(pl, 128, 330 - pl.length * 6 + 1, 6); }
    lampada(74, 330, 0, true, 2 * [0, 1, 2, 1][Math.floor(t * 5) % 4]);
    const linhas = ['CRIADOS', 'PARA CRIAR.'];
    let n = Math.floor((t - R.criadosTexto) * 14);
    linhas.forEach((tx, i) => { criados[i].textContent = tx.slice(0, cl(n, 0, tx.length)); n -= tx.length + 4; });
  }

  function fase5(t) { // final: os blocos montam a logo e ela fica nítida
    tela.ret(0, 0, W, H, 'v');
    for (let y = 4; y < 376; y += 8) for (let x = 4; x < W; x += 8) tela.ret(x, y, 1, 1, 'm');
    const n = R.nitidez;
    if (t < n[0]) {
      voo.forEach((b) => {
        const p = S.seg(q(t, 20), b.t0, 0.55, 'expo.out');
        if (t < b.t0) return;
        const x = Math.round(S.mix(b.de[0], LX + b.i * 8, p) / 2) * 2, y = Math.round(S.mix(b.de[1], LY + b.j * 8, p) / 2) * 2;
        tela.ret(x, y, 8, 8, p >= 1 ? 'w' : 'l');
        if (p < 1) tela.ret(x, y + 8, 8, 1, 'k');
      });
    } else if (t < n[1]) tela.grade(lock[4], LX, LY, 4, 'w');
    else if (t < n[2]) tela.grade(lock[2], LX, LY, 2, 'w');
    mostra(crisp, t >= n[2]);
    if (t >= n[2]) [[20, 120], [250, 128], [40, 228], [238, 222], [135, 112]].forEach(([x, y], i) => brilho(x, y, Math.floor(t * 4) + i));
    const on = t >= R.cta && (Math.floor((t - R.cta) * 2.4) % 3 !== 2);
    mostra(cta, on);
    if (on) seta(34, 284, 'w');
    flash.style.opacity = t >= n[2] && t < n[2] + 0.1 ? '0.85' : '0';
  }

  const FASES = [fase0, fase1, fase2, fase3, fase4, fase5];
  const NOMES = [null, 'FASE 1', 'FASE 2', 'FASE 3', 'FASE 4', null];
  const SUB = [null, 'SER VISTA', 'CRIAR', 'CRESCER', 'PROPÓSITO', null];

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    let fi = 0;
    R.trocas.forEach((b) => { if (t >= b) fi++; });
    // esconde a interface específica de cada fase; cada fase liga o que usa
    [start, levelUp, cta, crisp].concat(rotulos, criados, titulo.map((l) => l.e)).forEach((e) => mostra(e, false));
    hudD.textContent = '';
    FASES[fi](t);
    if (fi !== 4) criados.forEach((e) => { e.textContent = ''; });
    else criados.forEach((e) => mostra(e, true));
    if (fi !== 0) titulo.forEach((l) => mostra(l.e, false));
    hudE.textContent = NOMES[fi] ? NOMES[fi] + ' · ' + SUB[fi] : '';
    // transição pontilhada em cada troca de fase
    R.trocas.forEach((b) => {
      const c = S.seg(t, b - 0.35, 0.35, 'none'), d = S.seg(t, b, 0.35, 'none');
      if (t >= b - 0.35 && t < b + 0.35) tela.pontilha(Math.round((t < b ? c : 1 - d) * 8) / 8, 'k', 0, 376);
    });
    if (fi !== 0 && fi !== 5 && t - R.trocas[fi - 1] < 0.35) mostra(hudE, false); else mostra(hudE, true);
    // caixa de diálogo com a fala sendo digitada
    const y = caixaDialogo(t);
    const f = falaAtual(t);
    nome.style.top = (y - 7) * Q + 'px';
    fala.style.top = (y + 10) * Q + 'px';
    mostra(nome, t >= 0.5);
    if (f) {
      const n = cl(Math.floor((t - f.ini) * R.cps), 0, f.txt.length);
      falaV.textContent = f.txt.slice(0, n);
      falaI.textContent = f.txt.slice(n);
      if (n >= f.txt.length && Math.floor(t * 3) % 2 === 0) {
        tela.ret(250, y + 82, 7, 1, 'l'); tela.ret(251, y + 83, 5, 1, 'l'); tela.ret(252, y + 84, 3, 1, 'l'); tela.ret(253, y + 85, 1, 1, 'l');
      }
    } else { falaV.textContent = ''; falaI.textContent = ''; }
  }, { loop: false });
})();
