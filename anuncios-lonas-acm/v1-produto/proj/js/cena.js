// Anúncio 1 — "Sua marca em 3 x 1,5 m": a lona com ilhós é a protagonista.
// Tempos presos às falas da locução (assets/falas/tempos.json). Um relógio só.
(function () {
  const S = STUDIO;
  const root = document.getElementById('root');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const div = (parent, css, html) => { const e = document.createElement('div'); Object.assign(e.style, { position: 'absolute' }, css || {}); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  const L = LOGO;
  const NS = 'http://www.w3.org/2000/svg';
  const C = { gancho: 0, produto: 7.0, usos: 11.7, prazo: 16.3, instala: 20.0, chamada: 23.6, fim: 28.6 };

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
  const pop = (el, t, tin, tout, extra) => {
    const p = Math.max(0, seg(t, tin, 0.6, 'back.out(1.8)') - (tout != null ? seg(t, tout, 0.3, 'power3.in') : 0));
    vis(el, t >= tin && (tout == null || t < tout + 0.3));
    el.style.transform = `translateY(${((1 - p) * 60).toFixed(1)}px) scale(${S.mix(0.8, 1, p).toFixed(3)}) ${extra || ''}`;
    el.style.opacity = Math.min(1, p * 2).toFixed(2);
    return p;
  };

  // ---------- arte da lona (900 x 450 = 3 x 1,5 m) com ilhós ----------
  const ILHOS = [];
  for (let x = 30; x <= 870; x += 105) { ILHOS.push([x, 24]); ILHOS.push([x, 426]); }
  for (let y = 129; y <= 321; y += 96) { ILHOS.push([30, y]); ILHOS.push([870, y]); }
  ILHOS.sort((a, b) => Math.atan2(a[1] - 225, a[0] - 450) - Math.atan2(b[1] - 225, b[0] - 450));
  const ARTE = `<div style="position:absolute;inset:0;background:linear-gradient(120deg,#F4B740,#EE7F45)">
      <div style="position:absolute;left:600px;top:-120px;width:460px;height:460px;border-radius:50%;background:#FBD36B;opacity:.85"></div>
      <div style="position:absolute;left:-60px;top:300px;width:420px;height:260px;border-radius:50%;background:#07583F;opacity:.9"></div>
      <div style="position:absolute;left:70px;top:70px;font:700 34px/1 'Instrument Sans';color:#1F2A44;letter-spacing:.2em">GRANDE</div>
      <div style="position:absolute;left:64px;top:112px;font:700 104px/1 'Instrument Sans';color:#1F2A44;letter-spacing:-.03em">INAUGURAÇÃO</div>
      <div style="position:absolute;left:70px;top:238px;width:380px;height:22px;border-radius:11px;background:#FFF3D6;opacity:.85"></div>
      <div style="position:absolute;left:70px;top:276px;width:300px;height:22px;border-radius:11px;background:#FFF3D6;opacity:.85"></div>
      <div style="position:absolute;left:560px;top:290px;padding:18px 34px;border-radius:999px;background:#1F2A44;font:700 40px/1 'Instrument Sans';color:#FBD36B">SÁBADO · 9h</div>
    </div>`;
  const ilhoHTML = (x, y) => `<div style="position:absolute;left:${x - 13}px;top:${y - 13}px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle,#2A2A2A 0 6px,#D9D9D9 7px 11px,#9A9A9A 12px)"></div>`;
  const lonaMini = (parent, esc, css) => {
    const w = div(parent, Object.assign({ width: 900 * esc + 'px', height: 450 * esc + 'px', overflow: 'hidden', borderRadius: '4px', boxShadow: '0 10px 22px rgba(2,38,28,0.35)' }, css || {}));
    div(w, { left: '0', top: '0', width: '900px', height: '450px', transformOrigin: '0 0', transform: `scale(${esc})` }, ARTE + ILHOS.map(([x, y]) => ilhoHTML(x, y)).join(''));
    return w;
  };

  // ---------- fundo ----------
  const f1 = div(root, { left: '-200px', top: '-300px', width: '700px', height: '1500px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const f2 = div(root, { left: '760px', top: '1100px', width: '600px', height: '1300px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const topo = div(root, { left: '390px', top: '96px', width: '300px' }, svgLogo('lockup', '#F3EFE3', 300));

  // ---------- 1-2. a lona grande ----------
  const LX = 90, LY = 520;
  const lonaWrap = div(root, { left: LX + 'px', top: LY + 'px', width: '900px', height: '450px' });
  const lona = div(lonaWrap, { left: '0', top: '0', width: '900px', height: '450px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(2,38,28,0.45)' }, ARTE);
  const ilhos = ILHOS.map(([x, y]) => div(lona, { left: (x - 13) + 'px', top: (y - 13) + 'px', width: '26px', height: '26px', borderRadius: '50%', background: 'radial-gradient(circle,#2A2A2A 0 6px,#D9D9D9 7px 11px,#9A9A9A 12px)' }));
  const rolo = div(lonaWrap, { left: '-14px', width: '928px', height: '56px', borderRadius: '28px', background: 'linear-gradient(180deg,#B9662C,#F2A25A 40%,#C7743A)', boxShadow: '0 10px 20px rgba(2,38,28,0.35)' });
  // cotas
  const cotas = document.createElementNS(NS, 'svg');
  cotas.setAttribute('width', '1080'); cotas.setAttribute('height', '1920');
  Object.assign(cotas.style, { position: 'absolute', left: 0, top: 0 });
  root.appendChild(cotas);
  cotas.innerHTML = `<g stroke="#DCEBE3" stroke-width="4" stroke-linecap="round" fill="none">
    <path id="cH" d="M90,470 H990 M90,455 V485 M990,455 V485" pathLength="1" stroke-dasharray="1 1"/>
    <path id="cV" d="M1030,520 V970 M1015,520 H1045 M1015,970 H1045" pathLength="1" stroke-dasharray="1 1"/></g>`;
  const cH = cotas.querySelector('#cH'), cV = cotas.querySelector('#cV');
  const lH = div(root, Object.assign({ left: '440px', top: '400px', width: '200px', textAlign: 'center' }, fonte(700, 46, '#DCEBE3')), '3 m');
  const lV = div(root, Object.assign({ left: '965px', top: '720px', width: '130px', textAlign: 'center', transform: 'rotate(90deg)' }, fonte(700, 40, '#DCEBE3')), '1,5 m');

  // ---------- 1. gancho ----------
  const g1 = T('LONA 3 x 1,5 m COM ILHÓS', Object.assign({ top: '1060px' }, centro, fonte(700, 56, '#F3EFE3'), { letterSpacing: '0.02em' }));
  const g0 = T('por apenas', Object.assign({ top: '1150px' }, centro, fonte(500, 48, '#F3EFE3')));
  const g2 = T('R$ 349,90', Object.assign({ top: '1210px' }, centro, fonte(800, 200, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const selo = div(root, Object.assign({ top: '1480px' }, centro));
  const seloIn = div(selo, { position: 'relative', display: 'inline-block', padding: '22px 46px 24px', borderRadius: '999px', background: '#DCEBE3' }, `<span style="font:800 64px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">ARTE GRÁTIS</span>`);

  // ---------- 2. produto ----------
  const p1 = T('Com ilhós', Object.assign({ top: '1080px' }, centro, fonte(800, 96)));
  const p2 = T('prontinha pra pendurar', Object.assign({ top: '1200px' }, centro, fonte(500, 56, '#DCEBE3')));
  const LUG = ['na fachada', 'no muro', 'na placa'];
  const lug = div(root, Object.assign({ top: '1340px' }, centro));
  const lugs = LUG.map((n) => div(lug, { position: 'relative', display: 'inline-block', margin: '0 10px', padding: '20px 34px 22px', borderRadius: '999px', border: '4px solid #DCEBE3', font: "700 44px/1 'Instrument Sans'" }, n));
  const LUGT = [9.55, 10.25, 10.85];

  // ---------- 3. usos ----------
  const u1 = T('Perfeita pra', Object.assign({ top: '260px' }, centro, fonte(600, 60)));
  const CARDS = [
    { n: 'Inauguração', t: 12.4 }, { n: 'Promoção', t: 13.3 }, { n: 'Sua marca vista de longe', t: 14.4 },
  ];
  const cards = CARDS.map((c, i) => {
    const el = div(root, { left: '90px', top: (370 + i * 400) + 'px', width: '900px', height: '360px', borderRadius: '30px', background: '#043D2D', overflow: 'hidden' });
    if (i === 0) { // fachada de loja
      div(el, { left: '220px', top: '120px', width: '460px', height: '260px', background: '#F3EFE3' });
      div(el, { left: '400px', top: '220px', width: '100px', height: '160px', background: '#1F6E52' });
      div(el, { left: '250px', top: '230px', width: '120px', height: '90px', background: '#DCEBE3' });
      div(el, { left: '530px', top: '230px', width: '120px', height: '90px', background: '#DCEBE3' });
      lonaMini(el, 0.42, { left: '261px', top: '20px' });
    } else if (i === 1) { // muro
      div(el, { left: '0', top: '150px', width: '900px', height: '210px', background: 'repeating-linear-gradient(0deg,#B5694A 0 34px,#8E4E36 34px 38px)' });
      lonaMini(el, 0.42, { left: '261px', top: '110px', transform: 'rotate(-1deg)' });
    } else { // placa de rua
      div(el, { left: '0', top: '300px', width: '900px', height: '60px', background: '#1F6E52' });
      div(el, { left: '330px', top: '150px', width: '16px', height: '170px', background: '#9A9A9A' });
      div(el, { left: '554px', top: '150px', width: '16px', height: '170px', background: '#9A9A9A' });
      lonaMini(el, 0.38, { left: '279px', top: '40px' });
    }
    const tag = div(el, { left: '30px', bottom: '24px', padding: '14px 26px 16px', borderRadius: '999px', background: '#DCEBE3', font: "700 40px/1 'Instrument Sans'", color: '#043D2D' }, c.n);
    return { el, tag, c, i };
  });

  // ---------- 4. prazo ----------
  const cal = div(root, { left: '340px', top: '420px', width: '400px', height: '400px', borderRadius: '44px', background: '#F3EFE3', overflow: 'hidden', boxShadow: '0 30px 60px rgba(2,38,28,0.45)' },
    `<div style="position:absolute;left:0;top:0;width:400px;height:96px;background:#1F6E52"></div>
     <div style="position:absolute;left:84px;top:-20px;width:26px;height:70px;border-radius:13px;background:#043D2D"></div>
     <div style="position:absolute;left:290px;top:-20px;width:26px;height:70px;border-radius:13px;background:#043D2D"></div>
     <div style="position:absolute;left:0;top:96px;width:400px;text-align:center;font:800 220px/1.15 'Instrument Sans';color:#043D2D">3</div>
     <div style="position:absolute;left:0;top:336px;width:400px;text-align:center;font:700 40px/1 'Instrument Sans';color:#1F6E52">dias úteis</div>`);
  const check = div(root, { left: '670px', top: '380px', width: '130px', height: '130px', borderRadius: '50%', background: '#DCEBE3', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    `<svg width="76" height="76" viewBox="0 0 76 76" fill="none" stroke="#043D2D" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path id="ck" d="M14 40 L30 56 L62 22" stroke-dasharray="80"/></svg>`);
  const ck = check.querySelector('#ck');
  const z1 = T('PRONTA EM', Object.assign({ top: '920px' }, centro, fonte(800, 90)));
  const z2 = T('3 DIAS ÚTEIS', Object.assign({ top: '1020px' }, centro, fonte(800, 140, '#DCEBE3'), { letterSpacing: '-0.02em' }));
  const z3 = T('depois que você aprova a arte', Object.assign({ top: '1210px' }, centro, fonte(500, 52)));

  // ---------- 5. instalação ----------
  const i1 = T('Precisa instalar?', Object.assign({ top: '300px' }, centro, fonte(800, 100)));
  const parede = div(root, { left: '90px', top: '520px', width: '900px', height: '620px', borderRadius: '30px', background: '#043D2D', overflow: 'hidden' });
  div(parede, { left: '0', top: '520px', width: '900px', height: '100px', background: '#1F6E52' });
  const lonaInst = lonaMini(parede, 0.6, { left: '180px', top: '80px' });
  const escada = div(parede, { left: '90px', top: '170px', width: '150px', height: '360px' },
    `<svg width="150" height="360" viewBox="0 0 150 360" fill="none" stroke="#DCEBE3" stroke-width="12" stroke-linecap="round"><path d="M30 10 L10 350 M120 10 L140 350 M24 80 H126 M20 160 H130 M16 240 H134 M12 320 H138"/></svg>`);
  const agenda = div(root, Object.assign({ top: '1200px' }, centro));
  const agendaIn = div(agenda, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '24px', padding: '26px 44px', borderRadius: '30px', background: '#DCEBE3' },
    `<svg width="76" height="76" viewBox="0 0 84 84" fill="none" stroke="#043D2D" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="68" height="62" rx="10"/><path d="M8 32 H76 M26 6 V20 M58 6 V20"/><path d="M42 44 V56 L50 62"/></svg>
     <span style="font:800 54px/1.1 'Instrument Sans';color:#043D2D;text-align:left">A gente agenda<br><span style="font-weight:500;font-size:40px">assim que ficar pronta</span></span>`);
  const i3 = T('Valor da lona sem instalação', Object.assign({ top: '1440px' }, centro, fonte(500, 40, '#DCEBE3')));

  // ---------- 6. chamada ----------
  const lockFim = div(root, { left: '170px', top: '440px', width: '740px' }, svgLogo('lockup', '#F3EFE3', 740));
  const k1 = T('Lona 3 x 1,5 m com ilhós', Object.assign({ top: '770px' }, centro, fonte(600, 56)));
  const k2 = T('R$ 349,90', Object.assign({ top: '850px' }, centro, fonte(800, 170, '#DCEBE3')));
  const k2b = T('+ arte grátis', Object.assign({ top: '1050px' }, centro, fonte(700, 50, '#F3EFE3')));
  const botao = div(root, Object.assign({ top: '1170px' }, centro));
  const botaoIn = div(botao, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '22px', padding: '34px 60px 36px', borderRadius: '999px', background: '#DCEBE3' },
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#043D2D" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 6 C17 6 6 16 6 29 c0 7 3 12 8 16 l-3 13 13-7 c3 1 5 1 8 1 15 0 26-10 26-23 S47 6 32 6 Z"/><path d="M22 28 h20 M22 37 h12"/></svg>
     <span style="font:800 58px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">CHAMA NO WHATSAPP</span>`);
  const nota = T('Pronta em 3 dias úteis após a aprovação da arte', Object.assign({ top: '1390px' }, centro, fonte(500, 34, '#DCEBE3')));
  const nota2 = T('Valor sem instalação · instalação agendada à parte', Object.assign({ top: '1438px' }, centro, fonte(500, 34, '#DCEBE3')));

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    f1.style.transform = `skewX(-29.5deg) translateY(${(t * 18).toFixed(1)}px)`;
    f2.style.transform = `skewX(-29.5deg) translateY(${(-t * 14).toFixed(1)}px)`;
    vis(topo, t < C.chamada - 0.2);
    topo.style.opacity = Math.min(1, t / 0.6).toFixed(2);

    // lona: desce enrolada, desenrola; sai para cima no fim do produto
    const on = t < C.usos;
    vis(lonaWrap, on);
    const desce = seg(t, 0.1, 0.7, 'power3.out');
    const abre = seg(t, 0.7, 1.3, 'power2.inOut');
    const sai = seg(t, C.usos - 0.45, 0.45, 'power3.in');
    const bal = 6 * Math.sin(t * 1.9) * seg(t, 2, 1);
    lonaWrap.style.transform = `translateY(${((1 - desce) * -700 - sai * 1200 + bal).toFixed(1)}px) rotate(${(0.6 * Math.sin(t * 1.3)).toFixed(2)}deg)`;
    const h = 450 * abre;
    lona.style.clipPath = `inset(0 0 ${(450 - h).toFixed(1)}px 0)`;
    rolo.style.top = (h - 28).toFixed(1) + 'px';
    rolo.style.opacity = (1 - seg(t, 1.95, 0.3)).toFixed(2);
    vis(rolo, t < 2.3);
    // ilhós: no gancho aparecem todos; no produto acendem um a um
    ilhos.forEach((el, i) => {
      const tin = 7.35 + i * 0.035;
      const p = t < C.produto ? 1 : seg(t, tin, 0.35, 'back.out(3)');
      const pulso = t >= C.produto ? 1 + 0.5 * Math.max(0, 1 - Math.abs(t - tin - 0.15) * 5) : 1;
      el.style.transform = `scale(${(p * pulso).toFixed(3)})`;
    });
    // cotas
    const pc = t >= C.produto && t < C.usos;
    vis(cotas, pc); vis(lH, pc); vis(lV, pc);
    cH.setAttribute('stroke-dashoffset', (1 - seg(t, C.produto + 0.2, 0.7, 'power2.out')).toFixed(3));
    cV.setAttribute('stroke-dashoffset', (1 - seg(t, C.produto + 0.45, 0.7, 'power2.out')).toFixed(3));
    const pl = seg(t, C.produto + 0.5, 0.5) * (1 - seg(t, C.usos - 0.45, 0.3));
    lH.style.opacity = pl.toFixed(2); lV.style.opacity = pl.toFixed(2);
    cotas.style.opacity = (1 - seg(t, C.usos - 0.45, 0.3)).toFixed(2);

    // gancho
    mostraT(g1, t, 0.9, C.produto - 0.35); mostraT(g0, t, 2.9, C.produto - 0.35);
    mostraT(g2, t, 3.2, C.produto - 0.35, 0.8);
    g2.i.style.transform += ` scale(${(1 + 0.04 * seg(t, 3.2, 3.5, 'sine.inOut')).toFixed(4)})`;
    pop(seloIn, t, 4.95, C.produto - 0.35, `rotate(${(-3 + Math.sin(t * 2.4)).toFixed(2)}deg)`);
    vis(selo, t >= 4.95 && t < C.produto);

    // produto
    mostraT(p1, t, C.produto + 0.25, C.usos - 0.35, 0.8);
    mostraT(p2, t, 8.3, C.usos - 0.35);
    lugs.forEach((el, i) => {
      const p = pop(el, t, LUGT[i], C.usos - 0.4);
      const ativo = t >= LUGT[i] && (i === 2 || t < LUGT[i + 1]);
      el.style.background = ativo ? '#DCEBE3' : 'transparent';
      el.style.color = ativo ? '#043D2D' : '#FFFFFF';
      void p;
    });
    vis(lug, t >= LUGT[0] && t < C.usos);

    // usos
    mostraT(u1, t, C.usos + 0.15, C.prazo - 0.35);
    cards.forEach(({ el, tag, c, i }) => {
      const p = Math.max(0, seg(t, c.t, 0.8, 'expo.out') - seg(t, C.prazo - 0.45 + i * 0.05, 0.4, 'power3.in'));
      vis(el, t >= c.t && t < C.prazo);
      el.style.transform = `translateX(${((1 - p) * (i % 2 ? -1100 : 1100)).toFixed(1)}px) rotate(${(0.8 * Math.sin(t * 1.4 + i)).toFixed(2)}deg)`;
      tag.style.transform = `scale(${(1 + 0.04 * Math.sin(t * 2.2 + i)).toFixed(3)})`;
    });

    // prazo
    const pcal = pop(cal, t, C.prazo + 0.2, C.instala - 0.35, `rotate(${(-3 + 2 * Math.sin(t * 1.6)).toFixed(2)}deg)`);
    void pcal;
    pop(check, t, 17.1, C.instala - 0.35);
    ck.setAttribute('stroke-dashoffset', (80 * (1 - seg(t, 17.3, 0.5, 'power2.out'))).toFixed(1));
    mostraT(z1, t, C.prazo + 0.35, C.instala - 0.35); mostraT(z2, t, 16.9, C.instala - 0.35, 0.8); mostraT(z3, t, 18.35, C.instala - 0.35);

    // instalação
    mostraT(i1, t, C.instala + 0.2, C.chamada - 0.35, 0.8);
    const ppar = Math.max(0, seg(t, C.instala + 0.3, 0.8) - seg(t, C.chamada - 0.4, 0.35, 'power3.in'));
    vis(parede, t >= C.instala && t < C.chamada);
    parede.style.transform = `translateY(${((1 - ppar) * 1300).toFixed(1)}px)`;
    const sobe = seg(t, 21.4, 1.2, 'back.out(1.2)');
    lonaInst.style.transform = `translateY(${((1 - sobe) * 260).toFixed(1)}px) rotate(${((1 - sobe) * -6 + 0.6 * Math.sin(t * 1.8)).toFixed(2)}deg)`;
    escada.style.transform = `translateY(${(4 * Math.sin(t * 2.4)).toFixed(1)}px)`;
    pop(agendaIn, t, 21.5, C.chamada - 0.35);
    vis(agenda, t >= 21.5 && t < C.chamada);
    mostraT(i3, t, 22.3, C.chamada - 0.35);

    // chamada
    const plk = seg(t, C.chamada + 0.05, 0.8, 'back.out(1.4)');
    vis(lockFim, t >= C.chamada);
    lockFim.style.transform = `translateY(${((1 - plk) * -120).toFixed(1)}px) scale(${S.mix(0.85, 1, plk).toFixed(3)})`;
    lockFim.style.opacity = Math.min(1, plk * 1.5).toFixed(2);
    mostraT(k1, t, C.chamada + 0.4); mostraT(k2, t, C.chamada + 0.55, null, 0.8); mostraT(k2b, t, C.chamada + 0.8);
    const pbt = seg(t, C.chamada + 0.9, 0.6, 'back.out(1.8)');
    vis(botao, t >= C.chamada + 0.9);
    const pulso = 1 + 0.03 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - C.chamada - 1.6) / 1.1));
    botaoIn.style.transform = `scale(${(S.mix(0.6, 1, pbt) * pulso).toFixed(4)})`;
    botaoIn.style.opacity = Math.min(1, pbt * 2).toFixed(2);
    mostraT(nota, t, C.chamada + 1.4); mostraT(nota2, t, C.chamada + 1.5);
  }, { loop: false });
})();
