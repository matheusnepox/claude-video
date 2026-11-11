// Anúncio do e-book "Tráfego Pago na Prática" (Seven). Preço no gancho e páginas reais do e-book na tela,
// para ninguém comprar no escuro. Um relógio só.
(function () {
  const S = STUDIO;
  const root = document.getElementById('root');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const div = (parent, css, html) => { const e = document.createElement('div'); Object.assign(e.style, { position: 'absolute' }, css || {}); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  const L = LOGO;
  const C = { gancho: 0, livro: 3.6, sumario: 7.4, destaques: 12.6, chamada: 21.0, fim: 26.0 };
  const svgLogo = (qual, cor, larg) => {
    const lock = qual === 'lockup';
    const partes = lock ? [L.lockup.corpo, L.lockup.triangulo].concat(L.lockup.letras, L.lockup.assinatura) : [L.simbolo.corpo, L.simbolo.triangulo];
    return `<svg viewBox="${lock ? '18 18 1152 275' : '33 32 844 759'}" width="${larg}" style="display:block" fill="${cor}">${partes.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')}</svg>`;
  };
  const fonte = (peso, tam, cor) => ({ font: `${peso} ${tam}px/1.02 'Instrument Sans'`, color: cor || '#FFFFFF' });
  const centro = { left: '0', width: '1080px', textAlign: 'center' };
  // texto que sobe de dentro de uma máscara
  const T = (txt, css) => { const m = div(root, Object.assign({ overflow: 'hidden', whiteSpace: 'nowrap', padding: '0.12em 0.05em 0.16em', margin: '-0.12em -0.05em 0' }, css)); const i = div(m, { position: 'relative', display: 'inline-block' }, txt); return { m, i }; };
  const mostra = (o, t, tin, tout, dur) => {
    const p = seg(t, tin, dur || 0.6) - (tout != null ? seg(t, tout, 0.3, 'power3.in') : 0);
    vis(o.m, t >= tin && (tout == null || t < tout + 0.3));
    o.i.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%)`;
  };

  // ---------- fundo ----------
  const f1 = div(root, { left: '-260px', top: '-300px', width: '640px', height: '1700px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const f2 = div(root, { left: '800px', top: '700px', width: '600px', height: '1700px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const topo = div(root, { left: '410px', top: '100px', width: '260px' }, svgLogo('lockup', '#F3EFE3', 260));

  // ---------- 1. gancho ----------
  const h1 = T('PARE DE ANUNCIAR', Object.assign({ top: '560px' }, centro, fonte(700, 96)));
  const h2 = T('NO ESCURO.', Object.assign({ top: '670px' }, centro, fonte(700, 168, '#DCEBE3'), { letterSpacing: '-0.03em' }));
  const p1 = T('E-BOOK COMPLETO POR APENAS', Object.assign({ top: '600px' }, centro, fonte(600, 46, '#F3EFE3'), { letterSpacing: '0.12em' }));
  const preco = div(root, Object.assign({ top: '690px' }, centro, fonte(700, 250, '#DCEBE3'), { letterSpacing: '-0.04em' }));
  const p2 = T('Tráfego Pago na Prática', Object.assign({ top: '990px' }, centro, fonte(700, 70)));
  const p3 = T('Instagram e Facebook · do zero à primeira campanha', Object.assign({ top: '1090px' }, centro, fonte(500, 40, '#DCEBE3')));

  // ---------- livro 3D (capa real) ----------
  const palco = div(root, { inset: '0', perspective: '2400px' });
  const livro = div(palco, { left: '290px', top: '0', width: '500px', height: '708px', transformStyle: 'preserve-3d' });
  const capa = div(livro, { inset: '0', backfaceVisibility: 'hidden', borderRadius: '4px 10px 10px 4px', overflow: 'hidden', boxShadow: 'inset 6px 0 10px rgba(0,0,0,0.25)' }, `<img src="media/p-01.jpg" style="width:100%;height:100%;display:block">`);
  div(livro, { left: '0', top: '0', width: '36px', height: '708px', background: '#043D2D', transformOrigin: '0 50%', transform: 'rotateY(90deg) translateX(-36px)' });
  div(livro, { right: '0', top: '6px', width: '34px', height: '696px', transformOrigin: '100% 50%', transform: 'rotateY(90deg)', background: 'repeating-linear-gradient(90deg,#F3EFE3 0 2px,#DAD3C3 2px 3px)' });
  const sombraLivro = div(palco, { left: '300px', width: '480px', height: '50px', borderRadius: '50%', background: '#02261C', filter: 'blur(24px)', opacity: 0.5 });
  const selo = div(root, { left: '690px', top: '0', width: '270px', height: '270px', borderRadius: '50%', background: '#DCEBE3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 30px rgba(2,38,28,0.35)' },
    `<div style="font:600 30px/1 'Instrument Sans';color:#07583F">por apenas</div><div style="font:700 54px/1.05 'Instrument Sans';color:#043D2D;white-space:nowrap;letter-spacing:-0.03em">R$ 34,39</div>`);
  const fichas = ['46 páginas', '8 capítulos', 'Guia prático 2026'].map((tx, i) => {
    const d = div(root, Object.assign({ top: (1300 + i * 0) + 'px' }, {}));
    d.innerHTML = `<span style="display:inline-block;padding:18px 34px 20px;border-radius:999px;background:rgba(220,235,227,0.14);border:3px solid #DCEBE3;font:600 42px/1 'Instrument Sans';color:#fff">${tx}</span>`;
    return d;
  });
  const fichasPos = [[70, 1310], [400, 1310], [235, 1420]];

  // ---------- 3. sumário (página real) ----------
  const tSum = T('Olha o que tem dentro', Object.assign({ top: '250px' }, centro, fonte(700, 84)));
  const sumario = div(root, { left: '140px', top: '400px', width: '800px', height: '1133px', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(2,38,28,0.45)', background: '#fff' }, `<img src="media/p-02.jpg" style="width:100%;display:block">`);
  // faixas das linhas do sumário (em px da página na escala de 800 de largura)
  const LIN = [189, 242, 297, 350, 403, 457, 510, 563].map((y) => y * (1133 / 827));
  const subSum = T('8 capítulos · do zero à primeira campanha lucrativa', Object.assign({ top: '1600px' }, centro, fonte(500, 40, '#DCEBE3')));
  const faixa = div(sumario, { left: '40px', width: '720px', height: '66px', borderRadius: '12px', background: 'rgba(7,88,63,0.16)', border: '3px solid #07583F' });

  // ---------- 4. destaques (páginas reais) ----------
  const DEST = [
    { img: 'p-09.jpg', cap: 'CAPÍTULO 01', tit: 'A conta de quanto investir', foco: 0.62 },
    { img: 'p-20.jpg', cap: 'CAPÍTULO 04', tit: 'Os 6 objetivos (e qual escolher)', foco: 0.3 },
    { img: 'p-23.jpg', cap: 'CAPÍTULO 04', tit: 'O criativo que faz parar de rolar', foco: 0.55 },
    { img: 'p-26.jpg', cap: 'CAPÍTULO 05', tit: 'As métricas que importam', foco: 0.3 },
    { img: 'p-38.jpg', cap: 'CAPÍTULO 07', tit: 'Campanha para o WhatsApp', foco: 0.35 },
    { img: 'p-43.jpg', cap: 'CAPÍTULO 08', tit: 'Checklist antes de ativar', foco: 0.2 },
  ];
  const D0 = C.destaques, DD = (C.chamada - C.destaques) / DEST.length;
  const cards = DEST.map((d, i) => {
    const el = div(root, { left: '120px', top: '520px', width: '840px', height: '1060px', borderRadius: '18px', overflow: 'hidden', background: '#fff', boxShadow: '0 30px 60px rgba(2,38,28,0.45)', transformOrigin: '50% 100%' });
    const im = div(el, { left: '0', top: '0', width: '840px' }, `<img src="media/${d.img}" style="width:100%;display:block">`);
    const tag = T(d.cap, Object.assign({ top: '240px' }, centro, fonte(600, 40, '#DCEBE3'), { letterSpacing: '0.14em' }));
    const tit = T(d.tit, Object.assign({ top: '310px' }, centro, fonte(700, 70)));
    return { el, im, tag, tit, t0: D0 + i * DD, d };
  });
  const contador = div(root, Object.assign({ top: '1620px' }, centro, fonte(600, 36, '#DCEBE3')));

  // ---------- 5. chamada ----------
  const k1 = T('Tudo isso por apenas', Object.assign({ top: '980px' }, centro, fonte(500, 56)));
  const k2 = T('R$ 34,39', Object.assign({ top: '1050px' }, centro, fonte(700, 190, '#DCEBE3'), { letterSpacing: '-0.035em' }));
  const k3 = T('Escrito pela equipe de tráfego da Seven', Object.assign({ top: '1270px' }, centro, fonte(500, 40, '#F3EFE3')));
  const botao = div(root, Object.assign({ top: '1360px' }, centro));
  const botaoIn = div(botao, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '20px', padding: '32px 66px 34px', borderRadius: '999px', background: '#DCEBE3' },
    `<span style="font:700 60px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">GARANTA O SEU</span><svg width="52" height="52" viewBox="0 0 46 46"><path d="M6 23 H38 M25 10 L38 23 L25 36" fill="none" stroke="#043D2D" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

  const k4 = T('toque no botão abaixo e comece hoje', Object.assign({ top: '1520px' }, centro, fonte(500, 38, '#DCEBE3')));
  const lockFim = div(root, { left: '390px', top: '1660px', width: '300px' }, svgLogo('lockup', '#F3EFE3', 300));
  function livroEstado(t) {
    // entra girando na cena do livro, sai pela esquerda; volta menor na chamada
    let x = 290, y = 520, ry = -28, rx = 6, s = 1, on = false;
    if (t >= C.livro - 0.1 && t < C.sumario + 0.4) {
      on = true;
      const pe = seg(t, C.livro, 1.0, 'expo.out');
      ry = S.mix(-120, -24, pe) + 8 * Math.sin((t - C.livro) * 1.6); y = S.mix(900, 470, pe) + 12 * Math.sin((t - C.livro) * 2.2);
      s = S.mix(0.7, 1, pe);
      const ps = seg(t, C.sumario - 0.3, 0.6, 'power3.in'); x = S.mix(290, -900, ps); ry -= 40 * ps;
    } else if (t >= C.chamada) {
      on = true;
      const pc = seg(t, C.chamada, 0.9, 'back.out(1.3)');
      y = S.mix(-800, 250, pc) + 10 * Math.sin((t - C.chamada) * 2); s = 0.92; ry = -22 + 6 * Math.sin((t - C.chamada) * 1.5);
    }
    return { x, y, ry, rx, s, on };
  }

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    f1.style.transform = `skewX(-29.5deg) translateY(${(t * 22).toFixed(1)}px)`;
    f2.style.transform = `skewX(-29.5deg) translateY(${(-t * 16).toFixed(1)}px)`;
    topo.style.opacity = Math.min(1, t / 0.5).toFixed(2);
    vis(topo, t < C.chamada);
    // 1. gancho: "pare de anunciar no escuro" e o preço
    mostra(h1, t, 0.1, 1.45); mostra(h2, t, 0.3, 1.5, 0.5);
    h2.i.style.transform += ` scale(${S.mix(1.25, 1, seg(t, 0.3, 0.5, 'back.out(2)')).toFixed(3)})`;
    mostra(p1, t, 1.7, C.livro - 0.3);
    const pp = seg(t, 1.85, 0.75, 'power2.out');
    const valor = (34.39 * pp).toFixed(2).replace('.', ',');
    preco.textContent = 'R$ ' + valor;
    const ppIn = seg(t, 1.85, 0.5, 'back.out(1.8)') - seg(t, C.livro - 0.3, 0.3, 'power3.in');
    vis(preco, t >= 1.85 && t < C.livro);
    preco.style.transform = `scale(${S.mix(0.6, 1, Math.max(0, ppIn)).toFixed(3)}) ${t > 2.6 ? `rotate(${(-2 * seg(t, 2.6, 0.3, 'back.out(3)')).toFixed(2)}deg)` : ''}`;
    preco.style.opacity = Math.min(1, Math.max(0, ppIn) * 2).toFixed(2);
    mostra(p2, t, 2.6, C.livro - 0.25); mostra(p3, t, 2.8, C.livro - 0.25);
    // 2 e 5. livro
    const lv = livroEstado(t);
    vis(palco, lv.on);
    livro.style.left = lv.x + 'px'; livro.style.top = lv.y + 'px';
    livro.style.transform = `rotateY(${lv.ry.toFixed(2)}deg) rotateX(${lv.rx}deg) scale(${lv.s})`;
    sombraLivro.style.left = (lv.x + 10) + 'px'; sombraLivro.style.top = (lv.y + 708 * lv.s + 30) + 'px';
    const ps = seg(t, C.livro + 0.7, 0.6, 'back.out(2)') - seg(t, C.sumario - 0.3, 0.25, 'power3.in');
    vis(selo, t >= C.livro + 0.7 && t < C.sumario);
    selo.style.top = (lv.y - 80) + 'px';
    selo.style.transform = `scale(${Math.max(0, ps).toFixed(3)}) rotate(${(12 * Math.max(0, ps)).toFixed(1)}deg)`;
    fichas.forEach((f, i) => {
      const p = seg(t, C.livro + 1.1 + i * 0.25, 0.6, 'back.out(1.8)') - seg(t, C.sumario - 0.3, 0.25, 'power3.in');
      vis(f, p > 0.01 && t < C.sumario);
      f.style.left = fichasPos[i][0] + 'px'; f.style.top = fichasPos[i][1] + 'px';
      f.style.transform = `translateY(${((1 - Math.max(0, p)) * 60).toFixed(1)}px) scale(${S.mix(0.7, 1, Math.max(0, p)).toFixed(3)})`;
      f.style.opacity = Math.min(1, Math.max(0, p) * 2).toFixed(2);
    });
    // 3. sumário real
    mostra(tSum, t, C.sumario + 0.1, C.destaques - 0.3);
    const psu = seg(t, C.sumario, 0.8, 'expo.out') - seg(t, C.destaques - 0.3, 0.3, 'power3.in');
    vis(sumario, t >= C.sumario && t < C.destaques);
    sumario.style.transform = `translateY(${((1 - Math.max(0, psu)) * 1300).toFixed(1)}px) rotate(${(-1.5 + Math.sin(t) * 0.6).toFixed(2)}deg)`;
    const k = Math.min(7, Math.max(0, (t - C.sumario - 1.0) / 0.5));
    const ki = Math.floor(k), kf = k - ki;
    const yF = S.mix(LIN[ki], LIN[Math.min(7, ki + 1)], S.ease('expo.inOut')(Math.min(1, kf * 2.2)));
    faixa.style.top = (yF - 26) + 'px';
    vis(faixa, t >= C.sumario + 0.9);
    // 4. destaques: as páginas entram uma sobre a outra
    cards.forEach((c, i) => {
      const p = seg(t, c.t0, 0.55, 'expo.out');
      const fora = t >= C.chamada - 0.35 ? seg(t, C.chamada - 0.35, 0.35, 'power3.in') : 0;
      const on = t >= c.t0 && t < C.chamada;
      vis(c.el, on);
      const atras = cards.filter((q) => t >= q.t0).length - 1 - i; // quantas já caíram por cima
      const rot = [-4, 3, -2, 4, -3, 2][i];
      c.el.style.zIndex = 10 + i;
      c.el.style.transform = `translate(${((1 - p) * 1100 - atras * 14).toFixed(1)}px, ${(atras * -18 + fora * 1600).toFixed(1)}px) rotate(${(rot * (1 - p) + rot * 0.4 - atras * 1.2).toFixed(2)}deg) scale(${(1 - atras * 0.03).toFixed(3)})`;
      // leve rolagem na página para mostrar o trecho mais importante
      const rol = S.mix(0, -(1189 - 1060) * c.d.foco * 2.2, seg(t, c.t0 + 0.2, DD + 0.4, 'sine.inOut'));
      c.im.style.transform = `translateY(${rol.toFixed(1)}px)`;
      const fim = i < cards.length - 1 ? cards[i + 1].t0 - 0.15 : C.chamada - 0.35;
      mostra(c.tag, t, c.t0 + 0.1, fim); mostra(c.tit, t, c.t0 + 0.18, fim);
    });
    const nAtivo = cards.filter((q) => t >= q.t0).length;
    vis(contador, t >= D0 && t < C.chamada - 0.3);
    contador.textContent = `página real do e-book · ${nAtivo} de ${cards.length} destaques`;
    // 5. chamada
    mostra(k1, t, C.chamada + 0.5); mostra(k2, t, C.chamada + 0.65, null, 0.7); mostra(k3, t, C.chamada + 1.0);
    const pb = seg(t, C.chamada + 1.3, 0.6, 'back.out(1.8)');
    vis(botao, t >= C.chamada + 1.3);
    const pulso = 1 + 0.03 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - C.chamada - 2) / 1.1));
    botaoIn.style.transform = `scale(${(S.mix(0.6, 1, pb) * pulso).toFixed(4)})`;
    botaoIn.style.opacity = Math.min(1, pb * 2).toFixed(2);
    mostra(k4, t, C.chamada + 1.7);
    const pl = seg(t, C.chamada + 1.9, 0.8);
    vis(lockFim, t >= C.chamada + 1.9); lockFim.style.opacity = pl.toFixed(2); lockFim.style.transform = `translateY(${((1 - pl) * 30).toFixed(1)}px)`;
    mostra(subSum, t, C.sumario + 0.5, C.destaques - 0.3);
  }, { loop: false });
})();
