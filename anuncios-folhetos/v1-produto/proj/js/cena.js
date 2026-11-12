// Anúncio 1 — "Chuva de folhetos": o folheto 10 x 14 é o protagonista.
// Tempos presos às falas da locução (assets/falas/tempos.json). Um relógio só.
(function () {
  const S = STUDIO;
  const root = document.getElementById('root');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const div = (parent, css, html) => { const e = document.createElement('div'); Object.assign(e.style, { position: 'absolute' }, css || {}); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  const L = LOGO;
  const NS = 'http://www.w3.org/2000/svg';
  // cenas (s): presas ao início de cada fala
  const C = { gancho: 0, produto: 6.9, qtd: 12.25, centavos: 18.8, capixaba: 21.45, entrega: 26.05, chamada: 33.1, fim: 38.0 };

  function svgLogo(qual, cor, larg) {
    const lock = qual === 'lockup';
    const vb = lock ? '18 18 1152 275' : '33 32 844 759';
    const partes = lock ? [L.lockup.corpo, L.lockup.triangulo].concat(L.lockup.letras, L.lockup.assinatura) : [L.simbolo.corpo, L.simbolo.triangulo];
    return `<svg viewBox="${vb}" width="${larg}" style="display:block" fill="${cor}">${partes.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')}</svg>`;
  }
  const centro = { left: '0', width: '1080px', textAlign: 'center' };
  const fonte = (peso, tam, cor) => ({ font: `${peso} ${tam}px/1 'Instrument Sans'`, color: cor || '#FFFFFF' });
  const T = (txt, css) => { const m = div(root, Object.assign({ overflow: 'hidden', whiteSpace: 'nowrap', padding: '0.12em 0.05em 0.16em', margin: '-0.12em -0.05em 0' }, css)); const i = div(m, { position: 'relative', display: 'inline-block' }, txt); return { m, i }; };
  const mostraT = (o, t, tin, tout, dur) => {
    const p = seg(t, tin, dur || 0.7) - (tout != null ? seg(t, tout, 0.35, 'power3.in') : 0);
    vis(o.m, t >= tin && (tout == null || t < tout + 0.35));
    o.i.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%)`;
  };

  // ---------- arte do folheto (500 x 700 = 10 x 14) ----------
  const barra = (x, y, w, h, cor) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;background:${cor}"></div>`;
  const FRENTE = `<div style="position:absolute;inset:0;background:#FBF7EE">
      <div style="position:absolute;left:0;top:0;width:500px;height:330px;background:linear-gradient(160deg,#F4B740,#EE7F45)"></div>
      <div style="position:absolute;left:250px;top:40px;width:300px;height:300px;border-radius:50%;background:#FBD36B;opacity:0.9"></div>
      <div style="position:absolute;left:40px;top:150px;width:0;height:0;border-left:110px solid transparent;border-right:110px solid transparent;border-bottom:180px solid #07583F"></div>
      <div style="position:absolute;left:300px;top:230px;width:150px;height:150px;border-radius:50%;background:#1F2A44;display:flex;align-items:center;justify-content:center;font:800 50px/1 'Instrument Sans';color:#FBD36B">50%</div>
      <div style="position:absolute;left:40px;top:375px;font:800 74px/1 'Instrument Sans';color:#1F2A44;letter-spacing:-0.02em">PROMOÇÃO</div>
      ${barra(40, 470, 380, 22, '#E2D9C6')}${barra(40, 510, 300, 22, '#E2D9C6')}${barra(40, 550, 340, 22, '#E2D9C6')}
      <div style="position:absolute;left:0;top:610px;width:500px;height:90px;background:#1F2A44"></div>
      ${barra(40, 645, 200, 20, '#FBD36B')}${barra(300, 645, 160, 20, '#5B6A8C')}
    </div>`;
  const VERSO44 = `<div style="position:absolute;inset:0;background:#1F2A44">
      <div style="position:absolute;left:40px;top:50px;font:800 58px/1.05 'Instrument Sans';color:#FBD36B">Venha nos<br>visitar!</div>
      ${barra(40, 200, 400, 22, '#5B6A8C')}${barra(40, 240, 330, 22, '#5B6A8C')}${barra(40, 280, 370, 22, '#5B6A8C')}
      <div style="position:absolute;left:40px;top:350px;width:420px;height:200px;border-radius:24px;background:#EE7F45"></div>
      <div style="position:absolute;left:330px;top:580px;width:110px;height:110px;border-radius:10px;background:repeating-linear-gradient(90deg,#FBF7EE 0 12px,#1F2A44 12px 20px)"></div>
      ${barra(40, 600, 240, 20, '#FBD36B')}${barra(40, 640, 180, 20, '#5B6A8C')}
    </div>`;
  const VERSO40 = `<div style="position:absolute;inset:0;background:#FBFAF6"></div>`;
  const miniFolheto = (parent) => {
    const w = div(parent, { left: '0', top: '0', width: '500px', height: '700px', transformOrigin: '50% 50%', boxShadow: '0 10px 24px rgba(2,38,28,0.35)', borderRadius: '6px', overflow: 'hidden' }, FRENTE);
    return w;
  };

  // ---------- fundo ----------
  const f1 = div(root, { left: '-200px', top: '-300px', width: '700px', height: '1500px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const f2 = div(root, { left: '760px', top: '1100px', width: '600px', height: '1300px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const topo = div(root, { left: '390px', top: '96px', width: '300px' }, svgLogo('lockup', '#F3EFE3', 300));

  // ---------- 1. chuva de folhetos que vira pilha ----------
  const chuva = div(root, { inset: '0' });
  const rng = S.rng(7);
  const GOTAS = Array.from({ length: 22 }, (_, i) => {
    const el = miniFolheto(chuva);
    return { el, x0: 80 + rng() * 920, r0: (rng() - 0.5) * 140, t0: 0.05 + i * 0.13 + rng() * 0.08,
      dx: (rng() - 0.5) * 34, dr: (rng() - 0.5) * 12, h: i };
  });
  const PILHA = { x: 540, y: 830, s: 0.62 };

  // ---------- 2. folheto 3D ----------
  const palco = div(root, { inset: '0', perspective: '2600px' });
  const sombra = div(palco, { left: '290px', width: '500px', height: '60px', borderRadius: '50%', background: '#02261C', filter: 'blur(26px)', opacity: 0.45 });
  const folheto = div(palco, { left: '290px', top: '0', width: '500px', height: '700px', transformStyle: 'preserve-3d' });
  const face = (css, html) => div(folheto, Object.assign({ inset: '0', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden', borderRadius: '6px' }, css), html);
  const fFrente = face({}, FRENTE);
  const brilho = div(fFrente, { left: '-300px', top: '-100px', width: '160px', height: '900px', background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.65),rgba(255,255,255,0))', transform: 'skewX(-20deg)' });
  const fVerso = face({ transform: 'rotateY(180deg)' });
  const v40 = div(fVerso, { inset: '0' }, VERSO40);
  const v44 = div(fVerso, { inset: '0' }, VERSO44);
  // régua: 10 cm embaixo, 14 cm ao lado
  const regua = document.createElementNS(NS, 'svg');
  regua.setAttribute('width', '1080'); regua.setAttribute('height', '1920');
  Object.assign(regua.style, { position: 'absolute', left: 0, top: 0 });
  root.appendChild(regua);
  regua.innerHTML = `<g stroke="#DCEBE3" stroke-width="4" stroke-linecap="round" fill="none">
      <path id="rH" d="M290,1010 H790 M290,995 V1025 M790,995 V1025" pathLength="1" stroke-dasharray="1 1"/>
      <path id="rV" d="M830,270 V970 M815,270 H845 M815,970 H845" pathLength="1" stroke-dasharray="1 1"/></g>`;
  const rH = regua.querySelector('#rH'), rV = regua.querySelector('#rV');
  const lH = div(root, Object.assign({ left: '440px', top: '1040px', width: '200px', textAlign: 'center' }, fonte(700, 44, '#DCEBE3')), '10 cm');
  const lV = div(root, Object.assign({ left: '862px', top: '596px' }, fonte(700, 44, '#DCEBE3')), '14 cm');
  const p1 = T('10 x 14 cm · Couchê 90 g', Object.assign({ top: '1150px' }, centro, fonte(800, 70)));
  const op = div(root, Object.assign({ top: '1290px' }, centro));
  const OPC = [['Só frente', '4x0'], ['Frente e verso', '4x4']].map(([a, b]) => div(op, { position: 'relative', display: 'inline-block', margin: '0 14px', padding: '24px 38px 26px', borderRadius: '30px', border: '4px solid #DCEBE3', textAlign: 'left' },
    `<div style="font:700 46px/1 'Instrument Sans'">${a}</div><div style="font:600 34px/1 'Instrument Sans';margin-top:10px;opacity:0.8">${b}</div>`));

  // ---------- 3. quantidades: pilhas que crescem ----------
  const q1 = T('Quanto mais, mais barato', Object.assign({ top: '300px' }, centro, fonte(800, 82)));
  const QTD = [
    { n: '1.250', a: 'R$ 150,00', b: 'R$ 229,90', h: 120 },
    { n: '2.500', a: 'R$ 219,05', b: 'R$ 276,00', h: 210 },
    { n: '5.000', a: 'R$ 269,90', b: 'R$ 329,80', h: 340 },
    { n: '10.000', a: 'R$ 499,90', b: 'R$ 599,90', h: 520 },
  ];
  const BASE = 1420;
  const colunas = QTD.map((q, i) => {
    const x = 40 + i * 255;
    const col = div(root, { left: x + 'px', top: '0', width: '235px', height: '1920px' });
    const pilha = div(col, { left: '40px', width: '155px', bottom: (1920 - BASE) + 'px', height: '0px', overflow: 'hidden', borderRadius: '6px 6px 0 0',
      background: 'repeating-linear-gradient(0deg,#FBF7EE 0 5px,#E6DECD 5px 7px)', boxShadow: '0 12px 24px rgba(2,38,28,0.3)' });
    const capa = div(col, { left: '40px', width: '155px', height: '217px', overflow: 'hidden', borderRadius: '4px' });
    const capaIn = div(capa, { left: '0', top: '0', width: '500px', height: '700px', transformOrigin: '0 0', transform: 'scale(0.31)' }, FRENTE);
    const rot = div(col, Object.assign({ left: '0', width: '235px', top: (BASE + 26) + 'px', textAlign: 'center' }, fonte(800, 50)), q.n);
    const etq = div(col, { left: '0', width: '235px', textAlign: 'center' },
      `<div style="font:600 26px/1 'Instrument Sans';color:#DCEBE3;letter-spacing:0.06em">4x0</div><div style="font:800 40px/1.1 'Instrument Sans'">${q.a}</div>
       <div style="font:600 26px/1 'Instrument Sans';color:#DCEBE3;letter-spacing:0.06em;margin-top:12px">4x4</div><div style="font:800 40px/1.1 'Instrument Sans'">${q.b}</div>`);
    return { col, pilha, capa, rot, etq, q, i };
  });
  const unid = T('unidades · 10 x 14 cm', Object.assign({ top: (BASE + 100) + 'px' }, centro, fonte(500, 40, '#DCEBE3')));

  // ---------- 4. menos de 5 centavos ----------
  const m1 = T('10.000 folhetos por R$ 499,90', Object.assign({ top: '520px' }, centro, fonte(600, 50, '#F3EFE3')));
  const m2 = T('MENOS DE', Object.assign({ top: '640px' }, centro, fonte(800, 90)));
  const m3 = T('5 CENTAVOS', Object.assign({ top: '740px' }, centro, fonte(800, 168, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const m4 = T('CADA', Object.assign({ top: '920px' }, centro, fonte(800, 90)));
  const moeda = div(root, { left: '590px', top: '1160px', width: '230px', height: '230px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#F6DB8B,#C99A2E 70%)', boxShadow: 'inset 0 0 0 14px rgba(255,255,255,0.25), 0 18px 30px rgba(2,38,28,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "800 92px/1 'Instrument Sans'", color: '#7A5A12' }, '5¢');
  const umFol = div(root, { left: '290px', top: '1110px', width: '250px', height: '350px', overflow: 'hidden', borderRadius: '6px', boxShadow: '0 18px 30px rgba(2,38,28,0.4)' });
  div(umFol, { left: '0', top: '0', width: '500px', height: '700px', transformOrigin: '0 0', transform: 'scale(0.5)' }, FRENTE);

  // ---------- 5. capixaba (traço da ponte e do morro) ----------
  const c1 = T('100% CAPIXABA', Object.assign({ top: '330px' }, centro, fonte(800, 124, '#DCEBE3'), { letterSpacing: '-0.02em' }));
  const c2 = T('Comprometida com o crescimento', Object.assign({ top: '500px' }, centro, fonte(500, 54)));
  const c3 = T('da sua empresa.', Object.assign({ top: '570px' }, centro, fonte(700, 54)));
  const desenho = document.createElementNS(NS, 'svg');
  desenho.setAttribute('width', '1080'); desenho.setAttribute('height', '1920');
  Object.assign(desenho.style, { position: 'absolute', left: 0, top: 0 });
  root.appendChild(desenho);
  const deck = (x) => { const u = (x - 700) / 230; return 1350 - 200 * Math.exp(-u * u); };
  const curva = (dy) => { let d = ''; for (let x = 300; x <= 1060; x += 10) d += (x === 300 ? 'M' : 'L') + x + ',' + (deck(x) + dy).toFixed(1); return d; };
  const pilares = [];
  for (let x = 360; x <= 1040; x += 68) pilares.push(`M${x},${(deck(x) + 24).toFixed(1)} V1440`);
  const DESENHO = [
    ['M10,1450 C60,1380 100,1300 150,1240 C175,1210 195,1205 210,1180 C225,1158 250,1160 262,1185 C276,1212 300,1230 320,1270 C350,1330 380,1400 420,1450', 6],
    ['M168,1238 L190,1222 M232,1176 L246,1196', 4],
    [curva(0), 7], [curva(22), 4], [pilares.join(' '), 6],
    ['M0,1470 Q60,1450 120,1470 T240,1470 T360,1470 T480,1470 T600,1470 T720,1470 T840,1470 T960,1470 T1080,1470', 4],
    ['M40,1530 Q100,1510 160,1530 T280,1530 T400,1530 T520,1530 T640,1530 T760,1530 T880,1530 T1000,1530', 3],
    ['M900,960 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0', 5],
  ].map(([d, w], i) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', i === 7 ? '#F3EFE3' : '#DCEBE3');
    p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    p.setAttribute('pathLength', '1'); p.setAttribute('stroke-dasharray', '1 1');
    desenho.appendChild(p); return p;
  });

  // ---------- 6. prazo + entrega grátis ----------
  const cal = div(root, Object.assign({ top: '300px' }, centro));
  const calIn = div(cal, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '26px', padding: '26px 44px', borderRadius: '30px', background: '#043D2D' },
    `<svg width="84" height="84" viewBox="0 0 84 84" fill="none" stroke="#DCEBE3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="68" height="62" rx="10"/><path d="M8 32 H76 M26 6 V20 M58 6 V20"/><path id="checkCal" d="M28 54 L38 64 L58 44"/></svg>
     <span style="font:700 54px/1.1 'Instrument Sans';color:#FFFFFF;text-align:left">Pronto em até<br><b style="color:#DCEBE3">7 dias úteis</b></span>`);
  const checkCal = calIn.querySelector('#checkCal'); checkCal.setAttribute('stroke-dasharray', '50');
  const e1 = T('ENTREGA GRÁTIS', Object.assign({ top: '560px' }, centro, fonte(800, 116, '#DCEBE3'), { letterSpacing: '-0.02em' }));
  const mapa = document.createElementNS(NS, 'svg');
  mapa.setAttribute('width', '1080'); mapa.setAttribute('height', '1920');
  Object.assign(mapa.style, { position: 'absolute', left: 0, top: 0 });
  root.appendChild(mapa);
  const CID = [
    { n: 'Cariacica', x: 300, y: 1180, t: 29.45 },
    { n: 'Vila Velha', x: 690, y: 1480, t: 30.1 },
    { n: 'Vitória', x: 690, y: 1150, t: 30.75 },
    { n: 'Serra', sub: 'alguns bairros', x: 610, y: 900, t: 32.0 },
  ];
  const costa = document.createElementNS(NS, 'path');
  costa.setAttribute('d', 'M900,760 C860,860 840,940 860,1040 C880,1120 820,1150 770,1200 C730,1240 780,1300 840,1340 C900,1380 880,1460 860,1540 C850,1600 870,1680 900,1740');
  Object.assign(costa.style, { fill: 'none', stroke: '#DCEBE3', strokeWidth: 5, opacity: 0.55 });
  costa.setAttribute('pathLength', '1'); costa.setAttribute('stroke-dasharray', '1 1');
  mapa.appendChild(costa);
  const rota = document.createElementNS(NS, 'path');
  Object.assign(rota.style, { fill: 'none', stroke: '#F3EFE3', strokeWidth: 5, strokeDasharray: '4 18', strokeLinecap: 'round' });
  mapa.appendChild(rota);
  const pinos = CID.map((c) => {
    const g = document.createElementNS(NS, 'g');
    g.innerHTML = `<path d="M0,0 C-34,-40 -44,-62 -44,-82 a44,44 0 1,1 88,0 C44,-62 34,-40 0,0 Z" fill="#DCEBE3"/><circle cx="0" cy="-82" r="16" fill="#043D2D"/>`;
    mapa.appendChild(g);
    const rot = div(root, Object.assign({ left: (c.x + 56) + 'px', top: (c.y - 112) + 'px' }, fonte(700, 50)), c.n + (c.sub ? `<br><span style="font-weight:500;font-size:34px;color:#DCEBE3">${c.sub}</span>` : ''));
    return { g, rot, c };
  });

  // ---------- 7. chamada ----------
  const lockFim = div(root, { left: '170px', top: '520px', width: '740px' }, svgLogo('lockup', '#F3EFE3', 740));
  const k1 = T('Folhetos a partir de', Object.assign({ top: '840px' }, centro, fonte(500, 52)));
  const k2 = T('R$ 150', Object.assign({ top: '910px' }, centro, fonte(800, 170, '#DCEBE3')));
  const k2b = T('1.250 unidades · arte grátis', Object.assign({ top: '1110px' }, centro, fonte(500, 42, '#F3EFE3')));
  const botao = div(root, Object.assign({ top: '1220px' }, centro));
  const botaoIn = div(botao, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '22px', padding: '34px 60px 36px', borderRadius: '999px', background: '#DCEBE3' },
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#043D2D" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 6 C17 6 6 16 6 29 c0 7 3 12 8 16 l-3 13 13-7 c3 1 5 1 8 1 15 0 26-10 26-23 S47 6 32 6 Z"/><path d="M22 28 h20 M22 37 h12"/></svg>
     <span style="font:800 58px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">CHAMA NO WHATSAPP</span>`);
  const nota = T('Pronto em até 7 dias úteis · Entrega grátis em Cariacica,', Object.assign({ top: '1440px' }, centro, fonte(500, 34, '#DCEBE3')));
  const nota2 = T('Vila Velha, Vitória e alguns bairros da Serra', Object.assign({ top: '1486px' }, centro, fonte(500, 34, '#DCEBE3')));

  // ---------- gancho: textos ----------
  const g1 = T('1.250 FOLHETOS COLORIDOS', Object.assign({ top: '1230px' }, centro, fonte(700, 56, '#F3EFE3'), { letterSpacing: '0.02em' }));
  const g0 = T('por apenas', Object.assign({ top: '1310px' }, centro, fonte(500, 46, '#F3EFE3')));
  const g2 = T('R$ 150', Object.assign({ top: '1370px' }, centro, fonte(800, 230, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const selo = div(root, Object.assign({ top: '1660px' }, centro));
  const seloIn = div(selo, { position: 'relative', display: 'inline-block', padding: '22px 46px 24px', borderRadius: '999px', background: '#DCEBE3' }, `<span style="font:800 64px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">ARTE GRÁTIS</span>`);

  // estado do folheto 3D
  function estadoFolheto(t) {
    let y = 620, s = 1, ry = 0, rx = 6, alfa = 0;
    if (t >= C.produto - 0.2 && t < C.qtd + 0.3) {
      alfa = 1;
      const pe = seg(t, C.produto - 0.1, 1.0, 'expo.out');
      y = S.mix(830, 620, pe); s = S.mix(0.62, 1, pe); ry = S.mix(-20, 0, pe);
      // "colorido só na frente" (verso branco) e "ou frente e verso" (verso colorido): duas viradas
      ry += 180 * seg(t, 9.75, 0.8, 'expo.inOut') + 180 * seg(t, 11.0, 0.8, 'expo.inOut');
      ry += 8 * Math.sin(t * 1.7); rx += 5 * Math.sin(t * 1.2 + 1); y += 10 * Math.sin(t * 2.0);
      const ps = seg(t, C.qtd - 0.35, 0.5, 'power3.in');
      y = S.mix(y, -600, ps); rx += 40 * ps;
    }
    return { y, s, ry, rx, alfa };
  }

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    f1.style.transform = `skewX(-29.5deg) translateY(${(t * 18).toFixed(1)}px)`;
    f2.style.transform = `skewX(-29.5deg) translateY(${(-t * 14).toFixed(1)}px)`;
    vis(topo, t < C.chamada - 0.2);
    topo.style.opacity = Math.min(1, t / 0.6).toFixed(2);

    // 1. chuva -> pilha
    vis(chuva, t < C.produto + 0.3);
    const respira = 6 * Math.sin(t * 1.8);
    GOTAS.forEach((g) => {
      const p = seg(t, g.t0, 1.1, 'power2.in');
      const pousou = t >= g.t0 + 1.1;
      const x = S.mix(g.x0, PILHA.x + g.dx, p), y = S.mix(-500, PILHA.y - g.h * 5 + respira, p);
      const r = S.mix(g.r0, g.dr, seg(t, g.t0, 1.1, 'power2.out'));
      const sx = S.mix(0.42, PILHA.s, p);
      // a pilha some para o folheto 3D (o de cima vira o protagonista)
      const sai = seg(t, C.produto - 0.4, 0.4, 'power2.in');
      vis(g.el, t >= g.t0 && t < C.produto + (g.h === GOTAS.length - 1 ? -0.1 : 0.05));
      g.el.style.transform = `translate(${(x - 250).toFixed(1)}px, ${(y - 350).toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${sx.toFixed(3)}) ${pousou ? '' : `rotateX(${((1 - p) * 40).toFixed(1)}deg)`}`;
      g.el.style.opacity = (1 - sai * (g.h === GOTAS.length - 1 ? 0 : 1)).toFixed(2);
    });
    mostraT(g1, t, 0.4, C.produto - 0.35); mostraT(g0, t, 2.6, C.produto - 0.35);
    mostraT(g2, t, 3.0, C.produto - 0.35, 0.8);
    g2.i.style.transform += ` scale(${(1 + 0.04 * seg(t, 3.0, 3, 'sine.inOut')).toFixed(4)})`;
    const ps = seg(t, 4.85, 0.6, 'back.out(2)') - seg(t, C.produto - 0.35, 0.3, 'power3.in');
    vis(selo, t >= 4.85 && t < C.produto);
    seloIn.style.transform = `scale(${Math.max(0, ps).toFixed(3)}) rotate(${(-3 * ps).toFixed(2)}deg)`;

    // 2. folheto 3D
    const e = estadoFolheto(t);
    vis(palco, e.alfa > 0);
    folheto.style.top = (e.y - 350) + 'px';
    folheto.style.transform = `rotateX(${e.rx.toFixed(2)}deg) rotateY(${e.ry.toFixed(2)}deg) scale(${e.s.toFixed(4)})`;
    sombra.style.top = (e.y + 350 * e.s + 30) + 'px';
    sombra.style.transform = `scaleX(${(e.s * (0.6 + 0.4 * Math.abs(Math.cos(e.ry * Math.PI / 180)))).toFixed(3)})`;
    vis(v40, t < 10.6); vis(v44, t >= 10.6);
    brilho.style.transform = `translateX(${(seg(t, 8.4, 1.1, 'power2.inOut') * 1000).toFixed(1)}px) skewX(-20deg)`;
    const naRegua = t >= C.produto + 0.4 && t < 9.6;
    vis(regua, naRegua || (t >= C.produto && t < 9.9));
    rH.setAttribute('stroke-dashoffset', (1 - seg(t, C.produto + 0.5, 0.7, 'power2.out')).toFixed(3));
    rV.setAttribute('stroke-dashoffset', (1 - seg(t, C.produto + 0.8, 0.7, 'power2.out')).toFixed(3));
    const pr = seg(t, C.produto + 0.7, 0.5) - seg(t, 9.45, 0.3, 'power3.in');
    [lH, lV].forEach((l) => { vis(l, t >= C.produto + 0.7 && t < 9.8); l.style.opacity = Math.max(0, pr).toFixed(2); });
    regua.style.opacity = Math.max(0, 1 - seg(t, 9.45, 0.3)).toFixed(2);
    mostraT(p1, t, 8.15, C.qtd - 0.35);
    OPC.forEach((o, i) => {
      const tin = i ? 11.0 : 9.6;
      const p = seg(t, tin, 0.6, 'back.out(1.6)') - seg(t, C.qtd - 0.4, 0.3, 'power3.in');
      vis(o, t >= tin && t < C.qtd);
      o.style.transform = `translateY(${((1 - Math.max(0, p)) * 50).toFixed(1)}px)`;
      o.style.opacity = Math.min(1, Math.max(0, p) * 2).toFixed(2);
      const ativo = i ? t >= 11.0 : t < 11.0;
      o.style.background = ativo ? '#DCEBE3' : 'transparent';
      o.style.color = ativo ? '#043D2D' : '#FFFFFF';
    });

    // 3. quantidades
    mostraT(q1, t, C.qtd + 0.2, C.centavos - 0.35);
    mostraT(unid, t, C.qtd + 1.6, C.centavos - 0.35);
    q1.i.style.transform += ` scale(${(1 + 0.05 * Math.sin(t * 1.9)).toFixed(4)})`;
    colunas.forEach((c) => {
      const t0 = C.qtd + 0.35 + c.i * 0.45;
      const p = seg(t, t0, 1.1, 'expo.out');
      const fora = seg(t, C.centavos - 0.4, 0.4, 'power3.in');
      vis(c.col, t >= t0 && t < C.centavos);
      const h = c.q.h * p;
      c.pilha.style.height = h.toFixed(1) + 'px';
      c.capa.style.top = (BASE - h - 217 * 0.0 - 6).toFixed(1) + 'px';
      c.capa.style.transform = `translateY(-100%) rotate(${(-2 + c.i).toFixed(1)}deg)`;
      c.etq.style.top = (BASE - h - 217 - 200).toFixed(1) + 'px';
      c.etq.style.opacity = seg(t, t0 + 0.5, 0.5).toFixed(2);
      const destaque = c.i === 3 ? seg(t, 15.1, 0.6, 'back.out(1.6)') : 0;
      c.col.style.transform = `translateY(${(fora * 1300 + 10 * Math.sin(t * 2.2 + c.i * 1.3) * seg(t, t0 + 1, 0.8)).toFixed(1)}px) scale(${(1 + 0.08 * destaque).toFixed(3)})`;
      c.col.style.transformOrigin = '50% 1420px';
      c.col.style.opacity = (c.i === 3 || t < 15.1) ? '1' : (1 - 0.55 * seg(t, 15.1, 0.5)).toFixed(2);
    });

    // 4. centavos
    mostraT(m1, t, C.centavos + 0.1, C.capixaba - 0.35);
    mostraT(m2, t, C.centavos + 0.25, C.capixaba - 0.35); mostraT(m3, t, C.centavos + 0.45, C.capixaba - 0.35, 0.8); mostraT(m4, t, C.centavos + 0.7, C.capixaba - 0.35);
    const pm = seg(t, C.centavos + 0.6, 0.8, 'back.out(1.6)') - seg(t, C.capixaba - 0.4, 0.35, 'power3.in');
    vis(moeda, t >= C.centavos + 0.6 && t < C.capixaba); vis(umFol, t >= C.centavos + 0.4 && t < C.capixaba);
    moeda.style.transform = `translateY(${((1 - Math.max(0, pm)) * -400).toFixed(1)}px) rotate(${(20 * Math.sin(t * 2)).toFixed(1)}deg) scaleX(${Math.cos(t * 2.4).toFixed(3)})`;
    moeda.style.opacity = Math.max(0, pm).toFixed(2);
    const pf = seg(t, C.centavos + 0.4, 0.7, 'back.out(1.4)') - seg(t, C.capixaba - 0.4, 0.35, 'power3.in');
    umFol.style.transform = `translateY(${((1 - Math.max(0, pf)) * 500).toFixed(1)}px) rotate(${(-6 + 2 * Math.sin(t * 1.5)).toFixed(2)}deg)`;

    // 5. capixaba
    mostraT(c1, t, C.capixaba + 0.15, C.entrega - 0.35); mostraT(c2, t, C.capixaba + 0.9, C.entrega - 0.35); mostraT(c3, t, C.capixaba + 1.05, C.entrega - 0.35);
    vis(desenho, t >= C.capixaba && t < C.entrega);
    DESENHO.forEach((p, i) => { p.setAttribute('stroke-dashoffset', (1 - seg(t, C.capixaba + 0.1 + i * 0.22, 1.4, 'power2.inOut')).toFixed(4)); });
    desenho.style.opacity = (1 - seg(t, C.entrega - 0.4, 0.4, 'power2.in')).toFixed(2);
    desenho.style.transform = `translateY(${(-70 * S.seg(t, C.capixaba, 4.6, 'none')).toFixed(1)}px)`;

    // 6. prazo + entrega
    const pcal = seg(t, C.entrega + 0.2, 0.6, 'back.out(1.8)') - seg(t, C.chamada - 0.35, 0.3, 'power3.in');
    vis(cal, t >= C.entrega + 0.2 && t < C.chamada);
    calIn.style.transform = `translateY(${((1 - Math.max(0, pcal)) * 60 + 10 * Math.sin(t * 2.4)).toFixed(1)}px) rotate(${(1.5 * Math.sin(t * 1.7)).toFixed(2)}deg) scale(${(S.mix(0.85, 1, Math.max(0, pcal)) * (1 + 0.06 * (seg(t, C.entrega + 0.5, 0.5) - seg(t, 28.2, 0.6)))).toFixed(3)})`;
    calIn.style.opacity = Math.max(0, pcal).toFixed(2);
    checkCal.setAttribute('stroke-dashoffset', (50 * (1 - seg(t, C.entrega + 1.2, 0.5, 'power2.out'))).toFixed(1));
    mostraT(e1, t, 28.3, C.chamada - 0.35);
    vis(mapa, t >= 28.3 && t < C.chamada);
    costa.setAttribute('stroke-dashoffset', (1 - seg(t, 28.4, 1.4, 'power2.inOut')).toFixed(4));
    const nRota = CID.filter((c) => t >= c.t).length;
    rota.style.opacity = nRota > 1 ? 1 : 0;
    rota.setAttribute('d', CID.slice(0, Math.max(1, nRota)).map((c, i) => (i ? 'L' : 'M') + c.x + ',' + c.y).join(' '));
    pinos.forEach(({ g, rot, c }) => {
      const k = Math.max(0, seg(t, c.t, 0.55, 'back.out(2)') - seg(t, C.chamada - 0.4, 0.3, 'power3.in'));
      g.setAttribute('transform', `translate(${c.x} ${(c.y - (1 - k) * 80 - 8 * Math.abs(Math.sin(t * 2.6 + c.x))).toFixed(1)}) scale(${k.toFixed(3)})`);
      vis(rot, k > 0.05); rot.style.opacity = k.toFixed(2);
    });
    mapa.style.opacity = (1 - seg(t, C.chamada - 0.35, 0.35, 'power2.in')).toFixed(2);
    mapa.style.transform = `translateY(${(-24 * S.seg(t, 28.3, 4.8, 'sine.inOut')).toFixed(1)}px)`;

    // 7. chamada
    const pl = seg(t, C.chamada + 0.05, 0.8, 'back.out(1.4)');
    vis(lockFim, t >= C.chamada);
    lockFim.style.transform = `translateY(${((1 - pl) * -120).toFixed(1)}px) scale(${S.mix(0.85, 1, pl).toFixed(3)})`;
    lockFim.style.opacity = Math.min(1, pl * 1.5).toFixed(2);
    mostraT(k1, t, C.chamada + 0.4); mostraT(k2, t, C.chamada + 0.55, null, 0.8); mostraT(k2b, t, C.chamada + 0.8);
    const pbt = seg(t, C.chamada + 0.9, 0.6, 'back.out(1.8)');
    vis(botao, t >= C.chamada + 0.9);
    const pulso = 1 + 0.03 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - C.chamada - 1.6) / 1.1));
    botaoIn.style.transform = `scale(${(S.mix(0.6, 1, pbt) * pulso).toFixed(4)})`;
    botaoIn.style.opacity = Math.min(1, pbt * 2).toFixed(2);
    mostraT(nota, t, C.chamada + 1.4); mostraT(nota2, t, C.chamada + 1.5);
  }, { loop: false });
})();
