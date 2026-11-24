// Anúncio — "Serviços avulsos de tráfego pago" (Seven): pacote de criativos, vídeo avulso e configuração de campanha.
// Os celulares mostram criativos reais que a Seven fez para os próprios anúncios. Tempos presos às falas.
(function () {
  const S = STUDIO;
  const root = document.getElementById('root');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const div = (parent, css, html) => { const e = document.createElement('div'); Object.assign(e.style, { position: 'absolute' }, css || {}); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  const L = LOGO;
  const C = { gancho: 0, pacote: 5.6, avulso: 18.4, config: 24.2, pontual: 33.5, chamada: 40.8, fim: 45 };

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
  const pill = (txt, bg, cor, tam) => `<span style="display:inline-block;padding:${tam * 0.4}px ${tam * 0.8}px ${tam * 0.45}px;border-radius:999px;background:${bg};color:${cor};font:700 ${tam}px/1 'Instrument Sans';letter-spacing:0.02em;white-space:nowrap">${txt}</span>`;
  // celular: moldura escura com tela
  const celular = (x, y, w) => {
    const h = w * 16 / 9;
    const c = div(root, { left: x + 'px', top: y + 'px', width: (w + 24) + 'px', height: (h + 24) + 'px', borderRadius: '46px', background: '#0B1F18', boxShadow: '0 30px 60px rgba(2,38,28,0.5)' });
    const tela = div(c, { left: '12px', top: '12px', width: w + 'px', height: h + 'px', borderRadius: '36px', overflow: 'hidden', background: '#043D2D' });
    div(c, { left: ((w + 24) / 2 - 50) + 'px', top: '22px', width: '100px', height: '22px', borderRadius: '11px', background: '#0B1F18', zIndex: 2 });
    return { c, tela };
  };
  const quadro = (src, w, h, css) => div(root, Object.assign({ width: w + 'px', height: h + 'px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 18px 36px rgba(2,38,28,0.45)', background: `url(${src}) center/cover` }, css || {}));

  // ---------- fundo ----------
  const f1 = div(root, { left: '-200px', top: '-300px', width: '700px', height: '1500px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const f2 = div(root, { left: '760px', top: '1100px', width: '600px', height: '1300px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const topo = div(root, { left: '390px', top: '96px', width: '300px' }, svgLogo('lockup', '#F3EFE3', 300));

  // ---------- 1. gancho ----------
  const h0 = T('Quer anunciar?', Object.assign({ top: '250px' }, centro, fonte(700, 88)));
  const celVazio = celular(110, 470, 330);
  div(celVazio.tela, { left: '30px', top: '90px', width: '270px', height: '270px', borderRadius: '20px', border: '6px dashed #5F8C7A', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 140px/1 'Instrument Sans'", color: '#5F8C7A' }, '?');
  [400, 440, 480].forEach((y, i) => div(celVazio.tela, { left: '30px', top: y + 'px', width: [240, 180, 210][i] + 'px', height: '20px', borderRadius: '10px', background: '#1F6E52' }));
  const semCri = div(root, { left: '150px', top: '1020px' }, pill('SEM CRIATIVO', '#E8704A', '#FFFFFF', 34));
  const painel0 = div(root, { left: '520px', top: '560px', width: '460px', height: '480px', borderRadius: '30px', background: '#F3EFE3', boxShadow: '0 30px 60px rgba(2,38,28,0.45)', overflow: 'hidden' },
    `<div style="height:70px;background:#1F6E52;color:#DCEBE3;font:700 30px/70px 'Instrument Sans';padding-left:28px">Gerenciador de anúncios</div>
     ${['Campanha', 'Conjunto', 'Anúncio'].map((n, i) => `<div style="margin:22px 28px 0 ${28 + i * 24}px;height:62px;border-radius:14px;background:#E2DCCD;color:#8F8A7E;font:600 30px/62px 'Instrument Sans';padding-left:20px">${n}</div>`).join('')}
     <div style="position:absolute;left:28px;right:28px;bottom:28px;height:76px;border-radius:38px;background:#BDB8AA;color:#F3EFE3;font:700 34px/76px 'Instrument Sans';text-align:center">Publicar</div>`);
  const h1 = T('FALTA CRIATIVO?', Object.assign({ top: '1200px' }, centro, fonte(800, 100, '#DCEBE3'), { letterSpacing: '-0.02em' }));
  const h2 = T('ou falta colocar a campanha no ar?', Object.assign({ top: '1340px' }, centro, fonte(600, 54)));

  // ---------- 2. pacote de criativos + bônus ----------
  const p1 = T('PACOTE DE CRIATIVOS', Object.assign({ top: '230px' }, centro, fonte(800, 84), { letterSpacing: '-0.01em' }));
  const p2 = T('R$ 150', Object.assign({ top: '330px' }, centro, fonte(800, 170, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const celA = celular(170, 560, 300), celB = celular(590, 560, 300);
  celA.tela.appendChild(document.getElementById('vFolhetos'));
  celB.tela.appendChild(document.getElementById('vLona'));
  const p3 = T('2 vídeos com locução profissional', Object.assign({ top: '1170px' }, centro, fonte(700, 56)));
  const p4 = T('e edição', Object.assign({ top: '1240px' }, centro, fonte(700, 56)));
  const bonus = div(root, Object.assign({ top: '1080px' }, centro), pill('+ BÔNUS GRÁTIS', '#DCEBE3', '#043D2D', 52));
  const G = [ // grupos do bônus: posições finais
    { n: '2 artes feed 4:5', t: 15.0, x: 40, itens: [['media/folhetos-estatico-a-feed.jpg', 210, 262, 0, 0, -5], ['media/lonas-acm-estatico-a-feed.jpg', 210, 262, 60, 26, 4]] },
    { n: '2 stories 9:16', t: 15.9, x: 400, itens: [['media/folhetos-estatico-a-stories.jpg', 160, 284, 0, -10, -4], ['media/lonas-acm-estatico-b-stories.jpg', 160, 284, 90, 0, 5]] },
    { n: 'carrossel 6 imagens', t: 16.7, x: 730, itens: [['media/cartoes-carrossel-1.jpg', 210, 262, 0, 0, -6], ['media/folhetos-carrossel-5.jpg', 210, 262, 35, 14, 0], ['media/lonas-acm-carrossel-4.jpg', 210, 262, 70, 28, 6]] },
  ];
  const grupos = G.map((g) => ({ g, els: g.itens.map(([src, w, h]) => quadro(src, w, h)), rot: div(root, Object.assign({ left: (g.x - 10) + 'px', top: '1590px', width: '320px', textAlign: 'center' }, fonte(700, 38, '#DCEBE3')), g.n) }));

  // ---------- 3. vídeo avulso ----------
  const a0 = T('Precisa de um só?', Object.assign({ top: '230px' }, centro, fonte(600, 64)));
  const a1 = T('1 VÍDEO AVULSO', Object.assign({ top: '320px' }, centro, fonte(800, 92, '#DCEBE3')));
  const celC = celular(390, 470, 276);
  celC.tela.appendChild(document.getElementById('vAcm'));
  const a2 = T('R$ 80', Object.assign({ top: '1020px' }, centro, fonte(800, 190, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const a3 = div(root, Object.assign({ top: '1290px' }, centro), pill('Você manda a copy e o roteiro', 'rgba(220,235,227,0.16)', '#FFFFFF', 44));

  // ---------- 4. configuração de campanha ----------
  const c0 = T('Já tem a estratégia?', Object.assign({ top: '220px' }, centro, fonte(600, 60)));
  const c1 = T('CONFIGURAÇÃO DE CAMPANHA', Object.assign({ top: '305px' }, centro, fonte(800, 66, '#DCEBE3'), { letterSpacing: '-0.01em' }));
  const painel = div(root, { left: '110px', top: '430px', width: '860px', height: '880px', borderRadius: '36px', background: '#F3EFE3', boxShadow: '0 30px 60px rgba(2,38,28,0.45)', overflow: 'hidden' });
  div(painel, { left: '0', top: '0', width: '860px', height: '86px', background: '#1F6E52', font: "700 36px/86px 'Instrument Sans'", color: '#DCEBE3', paddingLeft: '36px' }, 'Gerenciador de anúncios');
  const LIN = [['Campanha', 0, 26.3], ['Conjuntos de anúncios', 1, 26.9], ['Público', 2, 27.6], ['Posicionamentos', 2, 28.25], ['Orçamento', 2, 29.0], ['Anúncios', 1, 29.7]];
  const linhas = LIN.map(([n, nivel, tc], i) => {
    const r = div(painel, { left: (36 + nivel * 40) + 'px', top: (116 + i * 100) + 'px', width: (788 - nivel * 40) + 'px', height: '80px', borderRadius: '18px', background: '#E6E0D2' });
    div(r, { left: '28px', top: '0', font: "700 36px/80px 'Instrument Sans'", color: '#043D2D' }, n);
    const ck = div(r, { right: '20px', top: '14px', width: '52px', height: '52px', borderRadius: '50%', background: '#07583F', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#DCEBE3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16 L12 23 L25 8"/></svg>`);
    return { r, ck, tc, i };
  });
  const publicar = div(painel, { left: '36px', top: '740px', width: '788px', height: '100px', borderRadius: '50px', font: "800 44px/100px 'Instrument Sans'", textAlign: 'center' });
  const c2 = T('R$ 150', Object.assign({ top: '1360px' }, centro, fonte(800, 170, '#DCEBE3'), { letterSpacing: '-0.03em' }));

  // ---------- 5. serviço pontual ----------
  const s1 = T('SERVIÇO PONTUAL', Object.assign({ top: '250px' }, centro, fonte(800, 92, '#DCEBE3')));
  const bul = [['Sem acompanhamento ou otimizações', 34.3], ['Mídia paga direto à plataforma', 35.4]].map(([n, tt]) => ({ el: div(root, Object.assign({ top: '0' }, centro), pill(n, 'rgba(220,235,227,0.14)', '#FFFFFF', 42)), tt }));
  const s2 = T('Pra resultados contínuos:', Object.assign({ top: '760px' }, centro, fonte(600, 58)));
  const gestao = div(root, Object.assign({ top: '860px' }, centro), pill('GESTÃO DE TRÁFEGO', '#DCEBE3', '#043D2D', 64));
  const grafico = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  grafico.setAttribute('width', '1080'); grafico.setAttribute('height', '1920');
  Object.assign(grafico.style, { position: 'absolute', left: 0, top: 0 });
  grafico.innerHTML = `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M160,1460 H920 M160,1460 V1060" stroke="#5F8C7A" stroke-width="5"/>
    <path id="linha" d="M180,1420 L300,1380 L420,1395 L540,1300 L660,1260 L780,1160 L900,1090" stroke="#DCEBE3" stroke-width="12" pathLength="1" stroke-dasharray="1 1"/>
    <path id="seta" d="M860,1080 L905,1088 L890,1132" stroke="#DCEBE3" stroke-width="12"/></g>`;
  root.appendChild(grafico);
  const linhaG = grafico.querySelector('#linha'), setaG = grafico.querySelector('#seta');

  // ---------- 6. chamada ----------
  const lockFim = div(root, { left: '170px', top: '400px', width: '740px' }, svgLogo('lockup', '#F3EFE3', 740));
  const card = (x, tit, sub, preco) => div(root, { left: x + 'px', top: '720px', width: '430px', height: '330px', borderRadius: '32px', background: '#043D2D', textAlign: 'center', paddingTop: '40px' },
    `<div style="font:700 40px/1.15 'Instrument Sans';color:#FFFFFF">${tit}</div><div style="font:500 30px/1.3 'Instrument Sans';color:#DCEBE3;margin-top:10px">${sub}</div><div style="font:800 96px/1 'Instrument Sans';color:#DCEBE3;margin-top:26px">${preco}</div>`);
  const k1 = card(90, 'Pacote de<br>criativos', '2 vídeos + 5 artes bônus', 'R$ 150');
  const k2 = card(560, 'Configuração<br>de campanha', 'pronta e publicada', 'R$ 150');
  const k3 = T('Vídeo avulso: R$ 80', Object.assign({ top: '1090px' }, centro, fonte(700, 48)));
  const botao = div(root, Object.assign({ top: '1200px' }, centro));
  const botaoIn = div(botao, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '22px', padding: '34px 60px 36px', borderRadius: '999px', background: '#DCEBE3' },
    `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#043D2D" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 6 C17 6 6 16 6 29 c0 7 3 12 8 16 l-3 13 13-7 c3 1 5 1 8 1 15 0 26-10 26-23 S47 6 32 6 Z"/><path d="M22 28 h20 M22 37 h12"/></svg>
     <span style="font:800 58px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">CHAMA NO WHATSAPP</span>`);
  const n1 = T('Copy e roteiro dos vídeos fornecidos pelo cliente', Object.assign({ top: '1420px' }, centro, fonte(500, 34, '#DCEBE3')));
  const n2 = T('Configuração sem gestão contínua · mídia não inclusa', Object.assign({ top: '1468px' }, centro, fonte(500, 34, '#DCEBE3')));

  const entra = (el, t, tin, tout, dx, dy, rot, s) => { // entrada deslizando + saída
    const p = Math.max(0, seg(t, tin, 0.8) - (tout != null ? seg(t, tout, 0.4, 'power3.in') : 0));
    vis(el, t >= tin && (tout == null || t < tout + 0.4));
    el.style.transform = `translate(${((1 - p) * dx).toFixed(1)}px, ${((1 - p) * dy).toFixed(1)}px) rotate(${(rot || 0).toFixed(2)}deg) scale(${(s || 1).toFixed(3)})`;
    el.style.opacity = Math.min(1, p * 2).toFixed(2);
    return p;
  };

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    f1.style.transform = `skewX(-29.5deg) translateY(${(t * 18).toFixed(1)}px)`;
    f2.style.transform = `skewX(-29.5deg) translateY(${(-t * 14).toFixed(1)}px)`;
    vis(topo, t < C.chamada - 0.2);
    topo.style.opacity = Math.min(1, t / 0.6).toFixed(2);

    // 1. gancho
    mostraT(h0, t, 0.25, C.pacote - 0.35, 0.8);
    entra(celVazio.c, t, 0.4, C.pacote - 0.4, -700, 0, -4 + 1.5 * Math.sin(t * 1.6));
    const pisca = Math.sin(t * 7) > 0 ? 1 : 0.55;
    pop(semCri, t, 1.7, C.pacote - 0.35, `rotate(-4deg)`); if (t > 2.2) semCri.style.opacity = (pisca * (1 - seg(t, C.pacote - 0.35, 0.3))).toFixed(2);
    entra(painel0, t, 0.6, C.pacote - 0.4, 700, 0, 3 + 1.5 * Math.sin(t * 1.4 + 1));
    mostraT(h1, t, 1.75, C.pacote - 0.35, 0.8); mostraT(h2, t, 3.1, C.pacote - 0.35);

    // 2. pacote + bônus
    mostraT(p1, t, C.pacote + 0.25, C.avulso - 0.4); mostraT(p2, t, 8.0, C.avulso - 0.4, 0.8);
    p2.i.style.transform += ` scale(${(1 + 0.04 * Math.sin(t * 2.4) * seg(t, 8.6, 0.5)).toFixed(4)})`;
    const encolhe = seg(t, 13.2, 0.9, 'expo.inOut');
    [celA, celB].forEach((cel, i) => {
      const p = entra(cel.c, t, C.pacote + 0.3 + i * 0.25, C.avulso - 0.45, 0, 1300, (i ? 4 : -4) + 1.2 * Math.sin(t * 1.5 + i));
      void p;
      cel.c.style.transform += ` translate(${(i ? -1 : 1) * 40 * encolhe}px, ${(-40 * encolhe).toFixed(1)}px) scale(${S.mix(1, 0.74, encolhe).toFixed(3)})`;
      cel.c.style.transformOrigin = '50% 0';
    });
    mostraT(p3, t, 9.9, 13.0); mostraT(p4, t, 10.9, 13.0);
    pop(bonus, t, 13.3, C.avulso - 0.4, `rotate(${(-2 + Math.sin(t * 2.2)).toFixed(2)}deg)`);
    vis(bonus, t >= 13.3 && t < C.avulso);
    grupos.forEach(({ g, els, rot }, gi) => {
      els.forEach((el, k) => {
        const [, w, h, ox, oy, r] = g.itens[k];
        el.style.left = (g.x + ox) + 'px'; el.style.top = (1230 + oy + (gi === 1 ? -20 : 0)) + 'px';
        entra(el, t, g.t + k * 0.12, C.avulso - 0.45 + gi * 0.05, 0, 900, r + 1.5 * Math.sin(t * 1.7 + k + gi));
        void w; void h;
      });
      const pr = Math.max(0, seg(t, g.t + 0.3, 0.5) - seg(t, C.avulso - 0.45, 0.3));
      vis(rot, pr > 0.01); rot.style.opacity = pr.toFixed(2);
    });

    // 3. avulso
    mostraT(a0, t, C.avulso + 0.2, C.config - 0.4); mostraT(a1, t, 19.9, C.config - 0.4, 0.8);
    entra(celC.c, t, C.avulso + 0.3, C.config - 0.45, 0, 1300, 2 * Math.sin(t * 1.4));
    mostraT(a2, t, 21.05, C.config - 0.4, 0.8);
    a2.i.style.transform += ` scale(${(1 + 0.04 * Math.sin(t * 2.6) * seg(t, 21.6, 0.5)).toFixed(4)})`;
    pop(a3, t, 21.9, C.config - 0.4);

    // 4. configuração
    mostraT(c0, t, C.config + 0.25, C.pontual - 0.4); mostraT(c1, t, 25.9, C.pontual - 0.4, 0.8);
    entra(painel, t, C.config + 0.5, C.pontual - 0.45, 0, 1300, 1.2 * Math.sin(t * 1.3));
    painel.style.transform += ` translateY(${(12 * Math.sin(t * 2.0)).toFixed(1)}px)`;
    c1.i.style.transform += ` scale(${(1 + 0.03 * Math.sin(t * 2.3)).toFixed(4)})`;
    linhas.forEach(({ r, ck, tc, i }) => {
      const p = seg(t, C.config + 0.9 + i * 0.12, 0.6);
      r.style.transform = `translateX(${((1 - p) * 900).toFixed(1)}px)`;
      const c = seg(t, tc, 0.5, 'back.out(2.5)');
      ck.style.transform = `scale(${c.toFixed(3)})`;
      r.style.background = t >= tc ? '#DCEBE3' : '#E6E0D2';
    });
    const pub = t >= 30.45;
    publicar.style.background = pub ? '#07583F' : '#BDB8AA';
    publicar.style.color = pub ? '#DCEBE3' : '#F3EFE3';
    publicar.textContent = pub ? 'Publicada ✓' : 'Publicar';
    publicar.style.transform = `scale(${(1 + 0.08 * Math.max(0, 1 - Math.abs(t - 30.6) * 3)).toFixed(3)})`;
    mostraT(c2, t, 31.5, C.pontual - 0.4, 0.8);

    // 5. pontual
    mostraT(s1, t, C.pontual + 0.25, C.chamada - 0.4, 0.8);
    bul.forEach(({ el, tt }, i) => { el.style.top = (420 + i * 120) + 'px'; pop(el, t, tt, C.chamada - 0.4, `translateX(${(12 * Math.sin(t * 2.2 + i * 1.7)).toFixed(1)}px)`); });
    s1.i.style.transform += ` scale(${(1 + 0.04 * Math.sin(t * 2.4)).toFixed(4)})`;
    mostraT(s2, t, 37.3, C.chamada - 0.4);
    pop(gestao, t, 38.6, C.chamada - 0.4, `scale(${(1 + 0.03 * Math.sin(t * 3)).toFixed(3)})`);
    vis(grafico, t >= 37.3 && t < C.chamada);
    linhaG.setAttribute('stroke-dashoffset', (1 - seg(t, 37.4, 2.2, 'power2.inOut')).toFixed(3));
    setaG.style.opacity = seg(t, 39.4, 0.3).toFixed(2);
    grafico.style.opacity = (1 - seg(t, C.chamada - 0.4, 0.35)).toFixed(2);

    // 6. chamada
    const plk = seg(t, C.chamada + 0.05, 0.8, 'back.out(1.4)');
    vis(lockFim, t >= C.chamada);
    lockFim.style.transform = `translateY(${((1 - plk) * -120).toFixed(1)}px) scale(${S.mix(0.85, 1, plk).toFixed(3)})`;
    lockFim.style.opacity = Math.min(1, plk * 1.5).toFixed(2);
    pop(k1, t, C.chamada + 0.35, null, `rotate(${(-1.5 + Math.sin(t * 1.6)).toFixed(2)}deg)`);
    pop(k2, t, C.chamada + 0.55, null, `rotate(${(1.5 + Math.sin(t * 1.6 + 1)).toFixed(2)}deg)`);
    mostraT(k3, t, C.chamada + 0.8);
    const pbt = seg(t, C.chamada + 0.9, 0.6, 'back.out(1.8)');
    vis(botao, t >= C.chamada + 0.9);
    const pulso = 1 + 0.03 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - C.chamada - 1.6) / 1.1));
    botaoIn.style.transform = `scale(${(S.mix(0.6, 1, pbt) * pulso).toFixed(4)})`;
    botaoIn.style.opacity = Math.min(1, pbt * 2).toFixed(2);
    mostraT(n1, t, C.chamada + 1.3); mostraT(n2, t, C.chamada + 1.4);
  }, { loop: false });
})();
