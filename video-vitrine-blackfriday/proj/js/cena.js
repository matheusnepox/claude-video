// Bastidores: a Seven adesiva a vitrine de uma joalheria para a Black Friday.
// Abertura (1x) → timelapse 8x + detalhes (adesivo 50% OFF, faixa Black Friday) → vitrine pronta → detalhe → cartão Seven.
// Um relógio só: render(t) monta o quadro inteiro. Os vídeos já vêm cortados, melhorados e acelerados de media/.
(function () {
  const S = STUDIO, M = MARCA, L = LOGO;
  const ui = document.getElementById('ui');
  const vis = (el, on) => { el.style.visibility = on ? 'visible' : 'hidden'; };
  const div = (parent, css, html) => { const e = document.createElement('div'); Object.assign(e.style, { position: 'absolute' }, css || {}); if (html != null) e.innerHTML = html; parent.appendChild(e); return e; };
  const seg = (t, a, d, e) => S.seg(t, a, d, e || 'expo.out');
  const C = { antes: 0, lapse1: 2.4, close1: 8.5, lapse2: 13.0, close2: 19.6, depois: 23.6, close3: 26.7, compara: 29.1, cartao: 29.1, fim: 34.5 };

  function svgLogo(qual, cor, larg) {
    const lock = qual === 'lockup';
    const vb = lock ? '18 18 1152 275' : '33 32 844 759';
    const partes = lock ? [L.lockup.corpo, L.lockup.triangulo].concat(L.lockup.letras, L.lockup.assinatura) : [L.simbolo.corpo, L.simbolo.triangulo];
    return `<svg viewBox="${vb}" width="${larg}" style="display:block" fill="${cor}">${partes.map((p) => `<path fill-rule="evenodd" d="${p.d}"/>`).join('')}</svg>`;
  }
  const tomadas = {};
  ['tAntes', 'tLapse1', 'tClose1', 'tLapse2', 'tClose2', 'tDepois', 'tClose3'].forEach((id) => { const el = document.getElementById(id); tomadas[id] = { el, v: el.querySelector('video') }; });

  // ---------- camadas de interface ----------
  const sombraBaixo = div(ui, { left: 0, top: '1180px', width: '1080px', height: '740px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(2,20,14,0.55) 55%, rgba(2,20,14,0.8) 100%)' });
  const sombraCima = div(ui, { left: 0, top: 0, width: '1080px', height: '360px', background: 'linear-gradient(180deg, rgba(2,20,14,0.55), rgba(2,20,14,0))' });
  const topo = div(ui, { left: '390px', top: '70px', width: '300px', filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.5))' }, svgLogo('lockup', '#FFFFFF', 300));
  const centro = { left: '0', width: '1080px', textAlign: 'center' };
  const fonte = (peso, tam, cor) => ({ font: `${peso} ${tam}px/1 'Instrument Sans'`, color: cor || '#FFFFFF', textShadow: '0 3px 14px rgba(0,0,0,0.45)' });
  const T = (txt, css) => { const m = div(ui, Object.assign({ overflow: 'hidden', whiteSpace: 'nowrap', padding: '0.12em 0.05em 0.16em', margin: '-0.12em -0.05em 0' }, css)); const i = div(m, { position: 'relative', display: 'inline-block' }, txt); return { m, i }; };
  const mostraT = (o, t, tin, tout, dur) => {
    const p = seg(t, tin, dur || 0.7) - (tout != null ? seg(t, tout, 0.35, 'power3.in') : 0);
    vis(o.m, t >= tin && (tout == null || t < tout + 0.35));
    o.i.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%)`;
  };
  const pill = (txt, bg, cor, tam) => `<span style="display:inline-block;padding:${tam * 0.42}px ${tam * 0.8}px ${tam * 0.46}px;border-radius:999px;background:${bg};color:${cor};font:700 ${tam}px/1 'Instrument Sans';letter-spacing:0.06em;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,0.35)">${txt}</span>`;
  const pop = (el, t, tin, tout, extra) => {
    const p = Math.max(0, seg(t, tin, 0.55, 'back.out(1.8)') - (tout != null ? seg(t, tout, 0.3, 'power3.in') : 0));
    vis(el, t >= tin && (tout == null || t < tout + 0.3));
    el.style.transform = `translateY(${((1 - p) * 50).toFixed(1)}px) scale(${S.mix(0.8, 1, p).toFixed(3)}) ${extra || ''}`;
    el.style.opacity = Math.min(1, p * 2).toFixed(2);
  };

  // rótulos ANTES / DEPOIS (etiqueta no canto)
  const etqAntes = div(ui, { left: '60px', top: '300px' }, pill('ANTES', 'rgba(255,255,255,0.92)', '#043D2D', 40));
  const etqDepois = div(ui, { left: '60px', top: '300px' }, pill('RESULTADO', '#DCEBE3', '#043D2D', 40));
  const t1 = T('A Black Friday chegou', Object.assign({ top: '1480px' }, centro, fonte(500, 60)));
  const t2 = T('na vitrine.', Object.assign({ top: '1560px' }, centro, fonte(700, 96, '#DCEBE3')));
  // timelapse: selo de velocidade e etiquetas do que está sendo aplicado
  const vel = div(ui, { right: '60px', top: '300px' }, pill('▶▶ 8x', 'rgba(0,0,0,0.55)', '#FFFFFF', 34));
  const l1 = div(ui, Object.assign({ top: '1560px' }, centro), pill('ADESIVO · ATÉ 50% OFF', '#DCEBE3', '#043D2D', 44));
  const l1b = T('Recorte e aplicação no vidro', Object.assign({ top: '1480px' }, centro, fonte(500, 46)));
  const l2 = div(ui, Object.assign({ top: '1560px' }, centro), pill('FAIXA BLACK FRIDAY', '#DCEBE3', '#043D2D', 44));
  const l2b = T('Aplicação na parte alta da vitrine', Object.assign({ top: '1480px' }, centro, fonte(500, 46)));
  // close-ups
  const c1 = div(ui, Object.assign({ top: '1640px' }, centro), pill('DETALHE · ADESIVO', 'rgba(255,255,255,0.92)', '#043D2D', 40));
  const c1b = T('Transfer aplicado sem bolhas', Object.assign({ top: '1540px' }, centro, fonte(500, 48)));
  const c2 = div(ui, Object.assign({ top: '1640px' }, centro), pill('DETALHE · FAIXA', 'rgba(255,255,255,0.92)', '#043D2D', 40));
  const c2b = T('Alinhada e pressionada no vidro', Object.assign({ top: '1540px' }, centro, fonte(500, 48)));
  const c3 = div(ui, Object.assign({ top: '1640px' }, centro), pill('DETALHE · RESULTADO', '#DCEBE3', '#043D2D', 40));
  const c3b = T('Até 50% OFF, em destaque', Object.assign({ top: '1540px' }, centro, fonte(500, 48)));
  // depois
  const d1 = T('Vitrine pronta', Object.assign({ top: '1480px' }, centro, fonte(500, 60)));
  const d2 = T('pra Black Friday ✔', Object.assign({ top: '1560px' }, centro, fonte(700, 92, '#DCEBE3')));

  // ---------- comparação: cortina na diagonal da marca ----------
  const cmp = div(ui, { inset: 0 });
  const imgA = div(cmp, { inset: 0, background: 'url(media/pronta.jpg) center/cover' });
  const imgD = div(cmp, { inset: 0, background: 'url(media/pronta.jpg) center/cover' });
  const fio = div(cmp, { left: 0, top: 0, width: '10px', height: '2400px', background: '#DCEBE3', transformOrigin: '50% 0', boxShadow: '0 0 30px rgba(220,235,227,0.8)' });
  const cA = div(cmp, { right: '60px', top: '300px' }, pill('ANTES', 'rgba(255,255,255,0.92)', '#043D2D', 40));
  const cD = div(cmp, { left: '60px', top: '300px' }, pill('DEPOIS', '#DCEBE3', '#043D2D', 40));
  const K = M.K; // deslocamento horizontal por pixel de altura (60,5°)

  // ---------- cartão final ----------
  const cartao = div(ui, { inset: 0, background: '#07583F' });
  const f1 = div(cartao, { left: '-200px', top: '-300px', width: '700px', height: '1500px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const f2 = div(cartao, { left: '760px', top: '1100px', width: '600px', height: '1300px', background: '#DCEBE3', opacity: 0.06, transform: 'skewX(-29.5deg)' });
  const miniDepois = div(cartao, { left: '140px', top: '250px', width: '800px', height: '600px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(2,38,28,0.5)', background: 'url(media/pronta.jpg) center 40%/cover' });
  const lockFim = div(cartao, { left: '190px', top: '960px', width: '700px' }, svgLogo('lockup', '#F3EFE3', 700));
  const k1 = T('Adesivação · Vitrines · Fachadas', Object.assign({ top: '1230px' }, centro, fonte(600, 48, '#DCEBE3')));
  const k2 = T('Sua loja pronta pra vender mais.', Object.assign({ top: '1310px' }, centro, fonte(700, 60)));
  const botao = div(cartao, Object.assign({ top: '1450px' }, centro));
  const botaoIn = div(botao, { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '22px', padding: '32px 58px 34px', borderRadius: '999px', background: '#DCEBE3' },
    `<svg width="60" height="60" viewBox="0 0 64 64" fill="none" stroke="#043D2D" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"><path d="M32 6 C17 6 6 16 6 29 c0 7 3 12 8 16 l-3 13 13-7 c3 1 5 1 8 1 15 0 26-10 26-23 S47 6 32 6 Z"/><path d="M22 28 h20 M22 37 h12"/></svg>
     <span style="font:800 54px/1 'Instrument Sans';color:#043D2D;letter-spacing:0.02em">CHAMA NO WHATSAPP</span>`);
  const k3 = T('Comunicação com propósito', Object.assign({ top: '1640px' }, centro, fonte(500, 36, '#DCEBE3')));
  [k1, k2, k3].forEach((o) => { cartao.appendChild(o.m); o.m.style.textShadow = 'none'; o.i.style.textShadow = 'none'; });

  window.__timelines = window.__timelines || {};
  S.play(function render(t) {
    const emAntes = t < C.lapse1, emL1 = t >= C.lapse1 && t < C.close1, emC1 = t >= C.close1 && t < C.lapse2, emL2 = t >= C.lapse2 && t < C.close2, emC2 = t >= C.close2 && t < C.depois, emDepois = t >= C.depois && t < C.close3, emC3 = t >= C.close3 && t < C.compara;
    const emCmp = t >= C.compara && t < C.cartao, emCartao = t >= C.cartao;
    vis(tomadas.tAntes.el, emAntes); vis(tomadas.tLapse1.el, emL1); vis(tomadas.tClose1.el, emC1); vis(tomadas.tLapse2.el, emL2); vis(tomadas.tClose2.el, emC2); vis(tomadas.tDepois.el, emDepois); vis(tomadas.tClose3.el, emC3);
    tomadas.tClose1.v.style.transform = `scale(${S.mix(1.0, 1.06, seg(t, C.close1, 4.5, 'none')).toFixed(4)})`;
    tomadas.tClose2.v.style.transform = `scale(${S.mix(1.06, 1.0, seg(t, C.close2, 4.0, 'none')).toFixed(4)})`;
    tomadas.tClose3.v.style.transform = `scale(${S.mix(1.08, 1.0, seg(t, C.close3, 2.4, 'none')).toFixed(4)})`;
    // leve aproximação contínua nas tomadas em velocidade normal; no timelapse a câmera fica parada
    tomadas.tAntes.v.style.transform = `scale(${S.mix(1.0, 1.07, seg(t, 0, C.lapse1, 'none')).toFixed(4)})`;
    tomadas.tDepois.v.style.transform = `scale(${S.mix(1.0, 1.07, seg(t, C.depois, C.close3 - C.depois, 'none')).toFixed(4)})`;
    tomadas.tLapse1.v.style.transform = `scale(${S.mix(1.0, 1.03, seg(t, C.lapse1, 6, 'none')).toFixed(4)})`;
    tomadas.tLapse2.v.style.transform = `scale(${S.mix(1.03, 1.0, seg(t, C.lapse2, 6.5, 'none')).toFixed(4)})`;
    const comVideo = !emCmp && !emCartao;
    vis(sombraBaixo, comVideo); vis(sombraCima, comVideo); vis(topo, !emCartao);
    topo.style.opacity = Math.min(1, t / 0.5).toFixed(2);

    // antes
    vis(etqAntes, false);
    mostraT(t1, t, 0.5, C.lapse1 - 0.3); mostraT(t2, t, 0.7, C.lapse1 - 0.3, 0.8);
    // timelapse 1
    vis(vel, emL1 || emL2);
    vel.style.transform = `scale(${(1 + 0.06 * Math.max(0, Math.sin(t * 6))).toFixed(3)})`;
    pop(l1, t, C.lapse1 + 1.2, C.close1 - 0.3, `rotate(${(-1.5 + Math.sin(t * 2)).toFixed(2)}deg)`);
    mostraT(l1b, t, C.lapse1 + 0.4, C.close1 - 0.3);
    // timelapse 2
    pop(l2, t, C.lapse2 + 1.0, C.close2 - 0.3, `rotate(${(1.5 + Math.sin(t * 2)).toFixed(2)}deg)`);
    mostraT(l2b, t, C.lapse2 + 0.4, C.close2 - 0.3);
    // depois
    pop(etqDepois, t, C.depois + 0.15, C.close3 - 0.3);
    mostraT(d1, t, C.depois + 0.5, C.close3 - 0.3); mostraT(d2, t, C.depois + 0.7, C.close3 - 0.3, 0.8);
    // detalhes (close-ups): etiqueta embaixo, cobrindo a área do adesivo de link do vídeo original
    pop(c1, t, C.close1 + 0.2, C.lapse2 - 0.3); mostraT(c1b, t, C.close1 + 0.45, C.lapse2 - 0.3);
    pop(c2, t, C.close2 + 0.2, C.depois - 0.3); mostraT(c2b, t, C.close2 + 0.45, C.depois - 0.3);
    pop(c3, t, C.close3 + 0.2, C.compara - 0.3); mostraT(c3b, t, C.close3 + 0.45, C.compara - 0.3);

    // comparação: a cortina varre da esquerda para a direita na diagonal do 7
    vis(cmp, emCmp);
    if (emCmp) {
      const p = seg(t, C.compara + 0.3, 2.2, 'power3.inOut');
      const xTopo = S.mix(-200, 1400, p); // x da linha no topo; no pé fica deslocada por K*1920
      const xPe = xTopo - K * 1920;
      imgD.style.clipPath = `polygon(0 0, ${xTopo}px 0, ${xPe}px 1920px, 0 1920px)`;
      fio.style.transform = `translateX(${(xTopo - 5).toFixed(1)}px) rotate(${(Math.atan(K) * 180 / Math.PI).toFixed(2)}deg)`;
      vis(fio, p > 0.001 && p < 0.999);
      cA.style.opacity = (1 - seg(t, C.compara + 2.0, 0.4)).toFixed(2);
      cD.style.opacity = seg(t, C.compara + 0.9, 0.5).toFixed(2);
      imgA.style.transform = imgD.style.transform = `scale(${S.mix(1.0, 1.05, seg(t, C.compara, 3.5, 'none')).toFixed(4)})`;
    }

    // cartão final
    vis(cartao, emCartao);
    if (emCartao) {
      const t0 = C.cartao;
      f1.style.transform = `skewX(-29.5deg) translateY(${(t * 18).toFixed(1)}px)`;
      f2.style.transform = `skewX(-29.5deg) translateY(${(-t * 14).toFixed(1)}px)`;
      const pm = seg(t, t0, 0.9, 'expo.out');
      miniDepois.style.transform = `translateY(${((1 - pm) * -900).toFixed(1)}px) rotate(${(-1.5 + 0.8 * Math.sin(t * 1.5)).toFixed(2)}deg)`;
      const pl = seg(t, t0 + 0.3, 0.8, 'back.out(1.4)');
      lockFim.style.transform = `translateY(${((1 - pl) * 120).toFixed(1)}px) scale(${S.mix(0.85, 1, pl).toFixed(3)})`;
      lockFim.style.opacity = Math.min(1, pl * 1.5).toFixed(2);
      mostraT(k1, t, t0 + 0.7); mostraT(k2, t, t0 + 0.85, null, 0.8);
      const pb = seg(t, t0 + 1.2, 0.6, 'back.out(1.8)');
      vis(botao, t >= t0 + 1.2);
      const pulso = 1 + 0.03 * Math.max(0, Math.sin(Math.PI * 2 * Math.max(0, t - t0 - 1.9) / 1.1));
      botaoIn.style.transform = `scale(${(S.mix(0.6, 1, pb) * pulso).toFixed(4)})`;
      botaoIn.style.opacity = Math.min(1, pb * 2).toFixed(2);
      mostraT(k3, t, t0 + 1.6);
    }
  }, { loop: false });
})();
