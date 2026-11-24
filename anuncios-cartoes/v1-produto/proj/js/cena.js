// Anúncio 1 — "O cartão em destaque": o cartão de visita em 3D é o protagonista.
// Tempos presos às falas da locução (assets/falas/tempos.json). Um relógio só.
(function () {
  const S = STUDIO, M = MARCA;
  const root = document.getElementById('root');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const div = (parent, css, html) => { const e = document.createElement('div'); Object.assign(e.style, { position: 'absolute' }, css || {}); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  const L = LOGO;
  // cenas (s): presas ao início de cada fala
  const C = { gancho: 0, pacotes: 5.0, detalhes: 11.45, capixaba: 15.87, entrega: 20.15, chamada: 25.0, fim: 29.0 };

  // ---------- logo em SVG (contorno original) ----------
  function svgLogo(qual, cor, larg) {
    const lock = qual === 'lockup';
    const vb = lock ? '18 18 1152 275' : '33 32 844 759';
    const partes = lock ? [L.lockup.corpo, L.lockup.triangulo].concat(L.lockup.letras, L.lockup.assinatura) : [L.simbolo.corpo, L.simbolo.triangulo];
    return `<svg viewBox="${vb}" width="${larg}" style="display:block" fill="${cor}">${partes.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')}</svg>`;
  }

  // ---------- fundo: duas formas da marca que derivam ----------
  const fundo = div(root, { inset: '0' });
  const f1 = div(fundo, { left: '-200px', top: '-300px', width: '700px', height: '1500px', background: 'var(--claro)', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const f2 = div(fundo, { left: '760px', top: '1100px', width: '600px', height: '1300px', background: 'var(--claro)', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  // marca no topo durante o anúncio
  const topo = div(root, { left: '390px', top: '96px', width: '300px' }, svgLogo('lockup', '#F3EFE3', 300));

  // ---------- o cartão 3D ----------
  const palco = div(root, { left: '0', top: '0', width: '1080px', height: '1920px', perspective: '2600px' });
  const sombra = div(palco, { left: '200px', width: '680px', height: '60px', borderRadius: '50%', background: '#02261C', filter: 'blur(26px)', opacity: 0.45 });
  const cartao = div(palco, { left: '160px', top: '0', width: '760px', height: '422px', transformStyle: 'preserve-3d', transformOrigin: '50% 50%' });
  const face = (css) => div(cartao, Object.assign({ inset: '0', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden', borderRadius: '10px', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }, css));
  const frente = face({ background: '#F7F5EF' });
  div(frente, { left: '120px', top: '150px', width: '520px' }, svgLogo('lockup', '#07583F', 520));
  const verso = face({ transform: 'rotateY(180deg)', background: '#FFFFFF' });
  // quatro versos possíveis (um por pacote)
  const linhas = (cor) => [180, 140, 160].map((w, i) => `<div style="position:absolute;left:330px;top:${150 + i * 44}px;width:${w}px;height:16px;border-radius:8px;background:${cor}"></div>`).join('');
  const versos = {
    v4x0: div(verso, { inset: '0', background: '#FFFFFF' }),
    v4x1: div(verso, { inset: '0', background: '#FFFFFF' }, `<div style="position:absolute;left:90px;top:96px">${svgLogo('simbolo', '#2B2B2B', 190)}</div>${linhas('#9A9A9A')}`),
    v4x4: div(verso, { inset: '0', background: '#043D2D' }, `<div style="position:absolute;left:90px;top:96px">${svgLogo('simbolo', '#DCEBE3', 190)}</div>${linhas('#2F7A5C')}`),
    verniz: div(verso, { inset: '0', background: '#043D2D' }, `<div style="position:absolute;left:90px;top:96px">${svgLogo('simbolo', '#DCEBE3', 190)}</div>${linhas('#2F7A5C')}`),
  };
  // brilho do verniz: faixa clara passando só por dentro do símbolo
  const brilhoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  brilhoSvg.setAttribute('viewBox', '33 32 844 759'); brilhoSvg.setAttribute('width', '190');
  Object.assign(brilhoSvg.style, { position: 'absolute', left: '90px', top: '96px' });
  brilhoSvg.innerHTML = `<defs><clipPath id="clipSim">${[L.simbolo.corpo, L.simbolo.triangulo].map((p) => `<path d="${p.d}"/>`).join('')}</clipPath></defs>
    <g clip-path="url(#clipSim)"><rect id="faixaBrilho" x="-400" y="-100" width="170" height="1100" fill="#FFFFFF" opacity="0.75" transform="skewX(-25)"/></g>`;
  versos.verniz.appendChild(brilhoSvg);
  const faixaBrilho = brilhoSvg.querySelector('#faixaBrilho');

  // ---------- textos ----------
  const T = (txt, css) => { const m = div(root, Object.assign({ overflow: 'hidden', whiteSpace: 'nowrap', padding: '0.12em 0.05em 0.14em', margin: '-0.12em -0.05em 0' }, css)); const i = div(m, { position: 'relative', display: 'inline-block' }, txt); return { m, i }; };
  const mostraT = (o, t, tin, tout, dur) => {
    const p = seg(t, tin, dur || 0.7) - (tout != null ? seg(t, tout, 0.35, 'power3.in') : 0);
    vis(o.m, t >= tin && (tout == null || t < tout + 0.35));
    o.i.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%)`;
  };
  const centro = { left: '0', width: '1080px', textAlign: 'center' };
  const fonte = (peso, tam, cor) => ({ font: `${peso} ${tam}px/1 'Instrument Sans'`, color: cor || '#FFFFFF' });
  // gancho
  const g1 = T('Seus cartões de visita por apenas', Object.assign({ top: '1180px' }, centro, fonte(500, 50, '#F3EFE3')));
  const g2 = T('R$ 99,90', Object.assign({ top: '1250px' }, centro, fonte(800, 210, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const g3 = T('1.000 unidades · 9 x 5 cm', Object.assign({ top: '1500px' }, centro, fonte(500, 46, '#F3EFE3')));
  const selo = div(root, Object.assign({ top: '1590px' }, centro));
  const seloIn = div(selo, { position: 'relative', display: 'inline-block', padding: '22px 46px 24px', borderRadius: '999px', background: '#DCEBE3' }, `<span style="font:800 64px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">ARTE GRÁTIS</span>`);
  // pacotes
  const PAC = [
    { k: 'v4x0', nome: '4x0', desc: 'Colorido só na frente', preco: 'R$ 99,90', t: 6.25 },
    { k: 'v4x1', nome: '4x1', desc: 'Frente colorida, verso P&B', preco: 'R$ 119,90', t: 7.45 },
    { k: 'v4x4', nome: '4x4', desc: 'Colorido frente e verso', preco: 'R$ 129,90', t: 8.05 },
    { k: 'verniz', nome: 'Verniz local', desc: '4x4 + brilho localizado', preco: 'R$ 189,90', t: 9.1 },
  ];
  const titPac = T('1.000 unidades · escolha o seu', Object.assign({ top: '920px' }, centro, fonte(600, 50, '#F3EFE3')));
  const linhasPac = PAC.map((p, i) => {
    const r = div(root, { left: '70px', top: (1010 + i * 150) + 'px', width: '940px', height: '128px', borderRadius: '28px', background: 'rgba(220,235,227,0.10)' });
    div(r, Object.assign({ left: '36px', top: '22px' }, fonte(800, 50)), p.nome);
    div(r, Object.assign({ left: '36px', top: '80px' }, fonte(500, 32, '#DCEBE3')), p.desc);
    div(r, Object.assign({ right: '36px', top: '34px' }, fonte(800, 62)), p.preco);
    return r;
  });
  // detalhes
  const d1 = T('Cantos arredondados', Object.assign({ top: '1130px' }, centro, fonte(700, 76)));
  const d2 = T('+ R$ 10,00', Object.assign({ top: '1230px' }, centro, fonte(800, 120, '#DCEBE3')));
  const cal = div(root, Object.assign({ top: '1430px' }, centro));
  const calIn = div(cal, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '26px', padding: '26px 44px', borderRadius: '30px', background: '#043D2D' },
    `<svg width="84" height="84" viewBox="0 0 84 84" fill="none" stroke="#DCEBE3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="68" height="62" rx="10"/><path d="M8 32 H76 M26 6 V20 M58 6 V20"/><path id="checkCal" d="M28 54 L38 64 L58 44"/></svg>
     <span style="font:700 54px/1.1 'Instrument Sans';color:#FFFFFF;text-align:left">Entrega em até<br><b style="color:#DCEBE3">7 dias úteis</b></span>`);
  const checkCal = calIn.querySelector('#checkCal'); checkCal.setAttribute('stroke-dasharray', '50');
  // capixaba
  const c1 = T('100% CAPIXABA', Object.assign({ top: '330px' }, centro, fonte(800, 124, '#DCEBE3'), { letterSpacing: '-0.02em' }));
  const c2 = T('Comprometida com o crescimento', Object.assign({ top: '500px' }, centro, fonte(500, 54)));
  const c3 = T('da sua empresa.', Object.assign({ top: '570px' }, centro, fonte(700, 54)));
  const NS = 'http://www.w3.org/2000/svg';
  const desenho = document.createElementNS(NS, 'svg');
  desenho.setAttribute('width', '1080'); desenho.setAttribute('height', '1920');
  Object.assign(desenho.style, { position: 'absolute', left: 0, top: 0 });
  root.appendChild(desenho);
  // Morro do Moreno (à esquerda) e Terceira Ponte (arco alto no vão central), em traço
  // ponte de x 300 a 1060, rampa reta nas pontas e corcova alta no vão central (como a Terceira Ponte)
  const deck = (x) => { const u = (x - 700) / 230; return 1350 - 200 * Math.exp(-u * u) ; };
  const curva = (dy) => { let d = ''; for (let x = 300; x <= 1060; x += 10) d += (x === 300 ? 'M' : 'L') + x + ',' + (deck(x) + dy).toFixed(1); return d; };
  const pilares = [];
  for (let x = 360; x <= 1040; x += 68) pilares.push(`M${x},${(deck(x) + 24).toFixed(1)} V1440`);
  const DESENHO = [
    ['M10,1450 C60,1380 100,1300 150,1240 C175,1210 195,1205 210,1180 C225,1158 250,1160 262,1185 C276,1212 300,1230 320,1270 C350,1330 380,1400 420,1450', 6],  // morro do moreno
    ['M168,1238 L190,1222 M232,1176 L246,1196', 4],                                                                                                          // pedras no topo
    [curva(0), 7],                                                                                                                                         // tabuleiro
    [curva(22), 4],                                                                                                                                        // borda de baixo
    [pilares.join(' '), 6],                                                                                                                                // pilares
    ['M0,1470 Q60,1450 120,1470 T240,1470 T360,1470 T480,1470 T600,1470 T720,1470 T840,1470 T960,1470 T1080,1470', 4],                                    // mar
    ['M40,1530 Q100,1510 160,1530 T280,1530 T400,1530 T520,1530 T640,1530 T760,1530 T880,1530 T1000,1530', 3],
    ['M900,960 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0', 5],                                                                                         // sol
  ].map(([d, w], i) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', i === 7 ? '#F3EFE3' : '#DCEBE3');
    p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    p.setAttribute('pathLength', '1'); p.setAttribute('stroke-dasharray', '1 1');
    desenho.appendChild(p); return p;
  });
  // entrega: mapa esquemático com pinos
  const e1 = T('ENTREGA GRÁTIS', Object.assign({ top: '300px' }, centro, fonte(800, 124, '#DCEBE3'), { letterSpacing: '-0.02em' }));
  const mapa = document.createElementNS(NS, 'svg');
  mapa.setAttribute('width', '1080'); mapa.setAttribute('height', '1920');
  Object.assign(mapa.style, { position: 'absolute', left: 0, top: 0 });
  root.appendChild(mapa);
  const CID = [ // ordem da fala; posições esquemáticas (norte em cima, mar à direita)
    { n: 'Cariacica', x: 300, y: 1040, t: 21.55 },
    { n: 'Vila Velha', x: 690, y: 1360, t: 22.2 },
    { n: 'Vitória', x: 690, y: 1010, t: 22.85 },
    { n: 'Serra', sub: 'alguns bairros', x: 610, y: 690, t: 23.5 },
  ];
  const costa = document.createElementNS(NS, 'path');
  costa.setAttribute('d', 'M900,560 C860,700 840,800 860,900 C880,980 820,1010 770,1060 C730,1100 780,1160 840,1200 C900,1240 880,1330 860,1420 C850,1480 870,1560 900,1620');
  Object.assign(costa.style, { fill: 'none', stroke: '#DCEBE3', strokeWidth: 5, opacity: 0.55 });
  costa.setAttribute('pathLength', '1'); costa.setAttribute('stroke-dasharray', '1 1');
  mapa.appendChild(costa);
  const rota = document.createElementNS(NS, 'path');
  rota.setAttribute('d', CID.map((c, i) => (i ? 'L' : 'M') + c.x + ',' + c.y).join(' '));
  Object.assign(rota.style, { fill: 'none', stroke: '#F3EFE3', strokeWidth: 5, strokeDasharray: '4 18', strokeLinecap: 'round' });
  mapa.appendChild(rota);
  const pinos = CID.map((c) => {
    const g = document.createElementNS(NS, 'g');
    g.innerHTML = `<path d="M0,0 C-34,-40 -44,-62 -44,-82 a44,44 0 1,1 88,0 C44,-62 34,-40 0,0 Z" fill="#DCEBE3"/><circle cx="0" cy="-82" r="16" fill="#043D2D"/>`;
    mapa.appendChild(g);
    const rot = div(root, Object.assign({ left: (c.x + 56) + 'px', top: (c.y - 112) + 'px' }, fonte(700, 50)), c.n + (c.sub ? `<br><span style="font-weight:500;font-size:34px;color:#DCEBE3">${c.sub}</span>` : ''));
    return { g, rot, c };
  });
  // chamada
  const lockFim = div(root, { left: '170px', top: '560px', width: '740px' }, svgLogo('lockup', '#F3EFE3', 740));
  const k1 = T('Cartões de visita a partir de', Object.assign({ top: '860px' }, centro, fonte(500, 52)));
  const k2 = T('R$ 99,90', Object.assign({ top: '930px' }, centro, fonte(800, 150, '#DCEBE3')));
  const botao = div(root, Object.assign({ top: '1180px' }, centro));
  const botaoIn = div(botao, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '22px', padding: '34px 60px 36px', borderRadius: '999px', background: '#DCEBE3' },
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#043D2D" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 6 C17 6 6 16 6 29 c0 7 3 12 8 16 l-3 13 13-7 c3 1 5 1 8 1 15 0 26-10 26-23 S47 6 32 6 Z"/><path d="M22 28 h20 M22 37 h12"/></svg>
     <span style="font:800 58px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">CHAMA NO WHATSAPP</span>`);
  const nota = T('Arte grátis · Entrega grátis em Cariacica, Vila Velha,', Object.assign({ top: '1400px' }, centro, fonte(500, 36, '#DCEBE3')));
  const nota2 = T('Vitória e alguns bairros da Serra', Object.assign({ top: '1448px' }, centro, fonte(500, 36, '#DCEBE3')));

  // estado do cartão por tempo: posição (y do centro), escala, rotações
  function estadoCartao(t) {
    let y = 760, s = 1, ry = 0, rx = 8, rz = -3, alfa = 1, raio = 10;
    // entrada girando
    const pe = seg(t, 0.1, 1.3, 'power3.out');
    y = S.mix(1500, 760, pe); ry = S.mix(-540, 0, pe); rx = S.mix(40, 8, pe); s = S.mix(0.6, 1, pe);
    // respiração no gancho
    ry += 6 * Math.sin(t * 1.4) * seg(t, 1.4, 1, 'sine.inOut');
    // pacotes: sobe, encolhe, vira e gira a cada pacote
    const pp = seg(t, C.pacotes, 0.8, 'expo.inOut');
    y = S.mix(y, 560, pp); s = S.mix(s, 0.72, pp);
    let giro = 0;
    PAC.forEach((p, i) => { giro += 180 * (i === 0 ? 1 : 2) * seg(t, p.t - 0.25, 0.7, 'expo.inOut'); });
    ry += giro * (1 - seg(t, C.detalhes - 0.2, 0.01, 'none'));
    // detalhes: volta de frente, maior
    const pd = seg(t, C.detalhes - 0.1, 0.9, 'expo.inOut');
    if (t >= C.detalhes - 0.2) { ry = S.mix(giro, 7 * 360, pd) + 16 * Math.sin(t * 1.6); }
    y = S.mix(y, 720, pd); s = S.mix(s, 0.95, pd);
    raio = S.mix(10, 56, seg(t, 11.75, 0.9, 'back.out(1.6)'));
    // capixaba: o cartão sai voando para cima
    const pc = seg(t, C.capixaba - 0.1, 0.8, 'power3.in');
    y = S.mix(y, -500, pc); rx += 50 * pc; alfa = 1 - seg(t, C.capixaba + 0.4, 0.2);
    // balanço contínuo: o cartão nunca fica parado enquanto o texto está na tela
    const bal = seg(t, 1.4, 1, 'sine.inOut');
    ry += 10 * Math.sin(t * 1.9) * bal; rx += 6 * Math.sin(t * 1.3 + 1) * bal; y += 14 * Math.sin(t * 2.1) * bal;
    return { y, s, ry, rx, rz, alfa, raio };
  }
  function versoAtual(t) { let k = 'v4x0'; PAC.forEach((p) => { if (t >= p.t + 0.1) k = p.k; }); return k; }

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    f1.style.transform = `skewX(-29.5deg) translateY(${(t * 18).toFixed(1)}px)`;
    f2.style.transform = `skewX(-29.5deg) translateY(${(-t * 14).toFixed(1)}px)`;
    vis(topo, t < C.chamada - 0.2);
    topo.style.opacity = Math.min(1, t / 0.6).toFixed(2);
    // cartão
    const e = estadoCartao(t);
    vis(palco, e.alfa > 0);
    cartao.style.top = (e.y - 211) + 'px';
    cartao.style.transform = `rotateX(${e.rx.toFixed(2)}deg) rotateY(${e.ry.toFixed(2)}deg) rotateZ(${e.rz}deg) scale(${e.s.toFixed(4)})`;
    [frente, verso].forEach((f) => { f.style.borderRadius = e.raio.toFixed(1) + 'px'; });
    sombra.style.top = (e.y + 211 * e.s + 40) + 'px';
    sombra.style.transform = `scaleX(${(e.s * (0.6 + 0.4 * Math.abs(Math.cos(e.ry * Math.PI / 180)))).toFixed(3)})`;
    sombra.style.opacity = (0.45 * e.alfa).toFixed(2);
    const vk = versoAtual(t);
    Object.entries(versos).forEach(([k, el]) => vis(el, k === vk));
    const pb = seg(t, 9.6, 1.0, 'power2.inOut');
    faixaBrilho.setAttribute('transform', `translate(${(pb * 1500).toFixed(1)} 0) skewX(-25)`);
    // gancho
    mostraT(g1, t, 0.9, C.pacotes - 0.35); mostraT(g2, t, 1.45, C.pacotes - 0.35, 0.8); mostraT(g3, t, 2.0, C.pacotes - 0.35);
    const ps = seg(t, 3.35, 0.6, 'back.out(2)') - seg(t, C.pacotes - 0.35, 0.3, 'power3.in');
    vis(selo, t >= 3.35 && t < C.pacotes);
    seloIn.style.transform = `scale(${Math.max(0, ps).toFixed(3)}) rotate(${(-3 * ps).toFixed(2)}deg)`;
    // pacotes
    mostraT(titPac, t, C.pacotes + 0.2, C.detalhes - 0.4);
    linhasPac.forEach((r, i) => {
      const p = seg(t, C.pacotes + 0.35 + i * 0.12, 0.7) - seg(t, C.detalhes - 0.45 + i * 0.05, 0.35, 'power3.in');
      vis(r, p > 0.001);
      r.style.transform = `translateX(${((1 - p) * 1100).toFixed(1)}px)`;
      const ativo = t >= PAC[i].t && (i === 3 || t < PAC[i + 1].t);
      r.style.background = ativo ? '#DCEBE3' : 'rgba(220,235,227,0.10)';
      r.style.color = ativo ? '#043D2D' : '';
      [...r.children].forEach((c) => { c.style.color = ativo ? '#043D2D' : ''; });
    });
    // detalhes
    mostraT(d1, t, 11.8, C.capixaba - 0.3); mostraT(d2, t, 12.4, C.capixaba - 0.3, 0.8);
    const pcal = seg(t, 13.6, 0.6, 'back.out(1.8)') - seg(t, C.capixaba - 0.3, 0.3, 'power3.in');
    vis(cal, t >= 13.6 && t < C.capixaba);
    calIn.style.transform = `translateY(${((1 - Math.max(0, pcal)) * 60).toFixed(1)}px) scale(${S.mix(0.85, 1, Math.max(0, pcal)).toFixed(3)})`;
    calIn.style.opacity = Math.max(0, pcal).toFixed(2);
    checkCal.setAttribute('stroke-dashoffset', (50 * (1 - seg(t, 14.2, 0.5, 'power2.out'))).toFixed(1));
    // capixaba
    mostraT(c1, t, C.capixaba + 0.15, C.entrega - 0.35); mostraT(c2, t, C.capixaba + 0.9, C.entrega - 0.35); mostraT(c3, t, C.capixaba + 1.05, C.entrega - 0.35);
    const dsai = seg(t, C.entrega - 0.4, 0.4, 'power2.in');
    vis(desenho, t >= C.capixaba && t < C.entrega);
    DESENHO.forEach((p, i) => { p.setAttribute('stroke-dashoffset', (1 - seg(t, C.capixaba + 0.1 + i * 0.22, 1.4, 'power2.inOut')).toFixed(4)); });
    desenho.style.opacity = (1 - dsai).toFixed(2);
    desenho.style.transform = `translateY(${(-20 * S.seg(t, C.capixaba, 4, 'sine.inOut')).toFixed(1)}px)`;
    // entrega
    mostraT(e1, t, C.entrega + 0.15, C.chamada - 0.35);
    vis(mapa, t >= C.entrega && t < C.chamada);
    costa.setAttribute('stroke-dashoffset', (1 - seg(t, C.entrega + 0.2, 1.4, 'power2.inOut')).toFixed(4));
    const nRota = CID.filter((c) => t >= c.t).length;
    rota.style.opacity = nRota > 1 ? 1 : 0;
    rota.setAttribute('d', CID.slice(0, Math.max(1, nRota)).map((c, i) => (i ? 'L' : 'M') + c.x + ',' + c.y).join(' '));
    pinos.forEach(({ g, rot, c }) => {
      const p = seg(t, c.t, 0.55, 'back.out(2)') - seg(t, C.chamada - 0.4, 0.3, 'power3.in');
      const k = Math.max(0, p);
      g.setAttribute('transform', `translate(${c.x} ${(c.y - (1 - k) * 80).toFixed(1)}) scale(${k.toFixed(3)})`);
      vis(rot, k > 0.05); rot.style.opacity = k.toFixed(2);
    });
    mapa.style.opacity = (1 - seg(t, C.chamada - 0.35, 0.35, 'power2.in')).toFixed(2);
    // chamada
    const pl = seg(t, C.chamada + 0.05, 0.8, 'back.out(1.4)');
    vis(lockFim, t >= C.chamada);
    lockFim.style.transform = `translateY(${((1 - pl) * -120).toFixed(1)}px) scale(${S.mix(0.85, 1, pl).toFixed(3)})`;
    lockFim.style.opacity = Math.min(1, pl * 1.5).toFixed(2);
    mostraT(k1, t, C.chamada + 0.4); mostraT(k2, t, C.chamada + 0.55, null, 0.8);
    const pbt = seg(t, C.chamada + 0.9, 0.6, 'back.out(1.8)');
    vis(botao, t >= C.chamada + 0.9);
    const pulso = 1 + 0.03 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - C.chamada - 1.6) / 1.1));
    botaoIn.style.transform = `scale(${(S.mix(0.6, 1, pbt) * pulso).toFixed(4)})`;
    botaoIn.style.opacity = Math.min(1, pbt * 2).toFixed(2);
    mostraT(nota, t, C.chamada + 1.4); mostraT(nota2, t, C.chamada + 1.5);
  }, { loop: false });
})();
