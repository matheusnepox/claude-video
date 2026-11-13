// personagens.js v2: personagens de blocos com cantos arredondados (estilo escala-em-blocos). three.js r149, global THREE.
// Pés em y = 0, olhando para +z. Altura ~5 unidades. Tudo posado a partir do tempo com PERSONAGENS.pose(b, opções).
(function () {
  const COR = {
    // Desbravador
    bone: 0x24463a, faixaBone: 0xd8b13a, emblemaVermelho: 0xc83228, emblemaBranco: 0xfaf8f8,
    pele: 0xf0cfb2, cabelo: 0x3a2618, olho: 0x1a1414, brilho: 0xffffff, bochecha: 0xf2a493,
    boca: 0x7a2a28, dente: 0xfaf8f6, camisa: 0xc9ad80, camisaEscura: 0xb0976d,
    lenco: 0xf2c12a, anel: 0xb48c3c, calca: 0x24463a, fivela: 0xd8b13a, sapato: 0x241f1f,
    patchAzul: 0x3c78a0, patchVerde: 0x5aa04a,
    // Jesus
    cabeloJ: 0x8a5634, barbaJ: 0x7a4a2c, peleJ: 0xe9c7a8, tunica: 0xefe7dc, faixaJ: 0xcc4a3c, sandalia: 0x9c6941,
  };
  const mats = {};
  function mat(cor) {
    if (!mats[cor]) mats[cor] = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.78, metalness: 0 });
    return mats[cor];
  }
  // caixa com cantos arredondados (adaptada do RoundedBoxGeometry do three.js, MIT), com cache por medida
  const geos = {};
  function geoArred(w, h, d, r) {
    r = Math.min(r, w / 2, h / 2, d / 2);
    const k = [w, h, d, r].map((x) => x.toFixed(3)).join(',');
    if (geos[k]) return geos[k];
    if (r < 0.005) return (geos[k] = new THREE.BoxGeometry(w, h, d));
    const seg = 5, g0 = new THREE.BoxGeometry(1, 1, 1, seg, seg, seg).toNonIndexed();
    const pos = g0.attributes.position.array, nor = g0.attributes.normal.array;
    const caixa = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r), p = new THREE.Vector3(), n = new THREE.Vector3(), meio = 0.5 / seg;
    for (let i = 0; i < pos.length; i += 3) {
      p.fromArray(pos, i); n.copy(p);
      n.x -= Math.sign(n.x) * meio; n.y -= Math.sign(n.y) * meio; n.z -= Math.sign(n.z) * meio; n.normalize();
      pos[i] = caixa.x * Math.sign(p.x) + n.x * r; pos[i + 1] = caixa.y * Math.sign(p.y) + n.y * r; pos[i + 2] = caixa.z * Math.sign(p.z) + n.z * r;
      nor[i] = n.x; nor[i + 1] = n.y; nor[i + 2] = n.z;
    }
    g0.attributes.position.needsUpdate = true;
    return (geos[k] = g0);
  }
  const RAIO = 0.09;
  function caixa(pai, cor, w, h, d, x, y, z, op) {
    op = op || {};
    const m = new THREE.Mesh(geoArred(w, h, d, op.r != null ? op.r : RAIO), mat(cor));
    m.position.set(x, y, z);
    m.castShadow = op.sombra !== false;
    m.receiveShadow = false;
    pai.add(m);
    return m;
  }
  function bloco(pai, cor, x0, x1, y0, y1, z0, z1, op) {
    return caixa(pai, cor, x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, op);
  }
  // detalhe chapado do rosto (quase sem relevo)
  function chapa(pai, cor, w, h, x, y, z) { return caixa(pai, cor, w, h, 0.05, x, y, z + 0.025, { sombra: false, r: 0.015 }); }
  function triangulo(pai, cor, lado, x, y, z) {
    const s = new THREE.Shape(), r = lado / Math.sqrt(3);
    s.moveTo(0, -r); s.lineTo(lado / 2, r / 2); s.lineTo(-lado / 2, r / 2); s.closePath();
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s), mat(cor));
    m.position.set(x, y, z); pai.add(m); return m;
  }
  // braço com cotovelo: devolve { ombro, cotovelo } (gire o ombro e o cotovelo em x/z)
  function braco(pai, x, yOmbro, manga, pele, larg, comp, mangaComprida) {
    const ombro = new THREE.Group(); ombro.position.set(x, yOmbro, 0); pai.add(ombro);
    const sup = comp * 0.5;
    bloco(ombro, manga, -larg / 2, larg / 2, -sup, 0.02, -larg / 2 - 0.02, larg / 2 + 0.02);
    const cot = new THREE.Group(); cot.position.set(0, -sup, 0); ombro.add(cot);
    if (mangaComprida) {
      bloco(cot, manga, -larg / 2, larg / 2, -comp * 0.32, 0.05, -larg / 2 - 0.02, larg / 2 + 0.02);
      bloco(cot, pele, -larg / 2 + 0.04, larg / 2 - 0.04, -comp * 0.5, -comp * 0.3, -larg / 2 + 0.02, larg / 2 - 0.02);
    } else {
      bloco(cot, pele, -larg / 2 + 0.03, larg / 2 - 0.03, -comp * 0.5, 0.05, -larg / 2 + 0.01, larg / 2 - 0.01);
    }
    return { ombro, cot };
  }
  function olhos(g, cab, F, y, sep, cor, tam) {
    const o = [];
    for (const lado of [-1, 1]) {
      const e = new THREE.Group(); e.position.set(lado * sep, y, F); cab.add(e);
      chapa(e, cor || COR.olho, tam[0], tam[1], 0, 0, 0);
      chapa(e, COR.brilho, tam[0] * 0.36, tam[0] * 0.36, -tam[0] * 0.18 * lado, tam[1] * 0.22, 0.03);
      o.push(e);
    }
    g.userData.olhos = o;
  }
  function sobrancelhas(g, cab, F, y, sep, cor, w) {
    const s = new THREE.Group(); s.position.set(0, y, F); cab.add(s);
    for (const lado of [-1, 1]) chapa(s, cor, w, 0.09, lado * sep, 0, 0.005);
    g.userData.sobr = s;
  }
  function boca(g, cab, F, y, w, h, comDente) {
    const b = new THREE.Group(); b.position.set(0, y, F); cab.add(b);
    chapa(b, COR.boca, w, h, 0, 0, 0);
    if (comDente) chapa(b, COR.dente, w * 0.72, h * 0.36, 0, h * 0.26, 0.012);
    g.userData.boca = b;
  }

  function desbravador() {
    const g = new THREE.Group(), corpo = new THREE.Group(); g.add(corpo); g.userData.corpo = corpo;
    const pE = new THREE.Group(), pD = new THREE.Group(); pE.position.set(-0.37, 0.95, 0); pD.position.set(0.37, 0.95, 0); g.add(pE, pD);
    for (const p of [pE, pD]) { bloco(p, COR.calca, -0.31, 0.31, -0.84, 0.05, -0.31, 0.31); bloco(p, COR.sapato, -0.34, 0.34, -0.95, -0.76, -0.33, 0.42, { r: 0.07 }); }
    g.userData.pernas = [pE, pD];
    bloco(corpo, COR.calca, -0.93, 0.93, 0.82, 1.17, -0.56, 0.56);
    bloco(corpo, COR.fivela, -0.16, 0.16, 0.9, 1.1, 0.53, 0.62, { r: 0.03 });
    bloco(corpo, COR.calca, -0.08, 0.08, 0.95, 1.05, 0.58, 0.64, { r: 0.02 });
    bloco(corpo, COR.camisa, -0.93, 0.93, 1.12, 2.58, -0.56, 0.56, { r: 0.14 });
    bloco(corpo, COR.camisaEscura, -0.62, 0.62, 1.55, 1.86, 0.5, 0.585, { r: 0.03, sombra: false });
    bloco(corpo, COR.camisaEscura, -0.03, 0.03, 1.15, 2.4, 0.5, 0.59, { r: 0.01, sombra: false });
    // lenço em V com anel
    bloco(corpo, COR.lenco, -0.86, 0.86, 2.42, 2.62, -0.6, 0.6, { r: 0.08 });
    const vE = caixa(corpo, COR.lenco, 0.2, 0.78, 0.07, -0.33, 2.24, 0.585, { r: 0.03, sombra: false }); vE.rotation.z = 0.95;
    const vD = caixa(corpo, COR.lenco, 0.2, 0.78, 0.07, 0.33, 2.24, 0.585, { r: 0.03, sombra: false }); vD.rotation.z = -0.95;
    caixa(corpo, COR.anel, 0.3, 0.24, 0.12, 0, 2.0, 0.6, { r: 0.05 });
    caixa(corpo, COR.lenco, 0.12, 0.55, 0.06, -0.1, 1.68, 0.6, { r: 0.02, sombra: false }).rotation.z = -0.2;
    caixa(corpo, COR.lenco, 0.12, 0.55, 0.06, 0.1, 1.68, 0.6, { r: 0.02, sombra: false }).rotation.z = 0.2;
    const bE = braco(corpo, -1.15, 2.5, COR.camisa, COR.pele, 0.44, 1.4, false), bD = braco(corpo, 1.15, 2.5, COR.camisa, COR.pele, 0.44, 1.4, false);
    bloco(bE.ombro, COR.patchAzul, -0.25, -0.22, -0.45, -0.15, -0.14, 0.14, { r: 0.01, sombra: false });
    triangulo(bD.ombro, COR.emblemaVermelho, 0.26, 0.235, -0.3, 0.0).rotation.y = Math.PI / 2;
    g.userData.bracos = [bE, bD];
    const cab = new THREE.Group(); cab.position.set(0, 2.58, 0); corpo.add(cab); g.userData.cabeca = cab;
    const F = 1.02;
    bloco(cab, COR.pele, -1.1, 1.1, 0, 1.78, -1.0, F, { r: 0.16 });
    bloco(cab, COR.cabelo, -1.14, -0.86, 0.8, 1.8, -1.04, F - 0.12, { r: 0.06 });
    bloco(cab, COR.cabelo, 0.86, 1.14, 0.8, 1.8, -1.04, F - 0.12, { r: 0.06 });
    bloco(cab, COR.cabelo, -1.14, 1.14, 0.5, 1.8, -1.06, -0.5, { r: 0.1 });
    olhos(g, cab, F, 1.0, 0.43, COR.olho, [0.27, 0.36]);
    sobrancelhas(g, cab, F, 1.38, 0.43, COR.cabelo, 0.38);
    for (const l of [-1, 1]) chapa(cab, COR.bochecha, 0.26, 0.12, l * 0.8, 0.66, F);
    boca(g, cab, F, 0.58, 0.42, 0.17, true);
    // boné
    bloco(cab, COR.bone, -1.18, 1.18, 1.8, 2.45, -1.1, 1.12, { r: 0.14 });
    bloco(cab, COR.faixaBone, -1.2, 1.2, 1.72, 1.86, -1.12, 1.14, { r: 0.04 });
    bloco(cab, COR.bone, -1.05, 1.05, 1.82, 1.94, 1.0, 1.32, { r: 0.05 });
    triangulo(cab, COR.emblemaVermelho, 0.48, 0, 2.17, 1.125);
    triangulo(cab, COR.emblemaBranco, 0.33, 0, 2.15, 1.13);
    triangulo(cab, COR.emblemaVermelho, 0.14, 0, 2.12, 1.135);
    return g;
  }

  // pessoa de túnica (Jesus e os personagens da história). op: tunica, faixa (null sem), cabelo, barba (null sem), pele,
  // cinto, cabeloEstilo: 'longo' | 'curto' | 'trancas' | 'feminino', vestidoLongo, olhosCor
  function pessoa(op) {
    op = op || {};
    const C = {
      tunica: op.tunica || COR.tunica, faixa: op.faixa === undefined ? COR.faixaJ : op.faixa, cabelo: op.cabelo || COR.cabeloJ,
      barba: op.barba === undefined ? COR.barbaJ : op.barba, pele: op.pele || COR.peleJ, cinto: op.cinto || null, sand: op.sandalia || COR.sandalia,
    };
    const estilo = op.cabeloEstilo || 'longo';
    const g = new THREE.Group(), corpo = new THREE.Group(); g.add(corpo); g.userData.corpo = corpo;
    const pE = new THREE.Group(), pD = new THREE.Group(); pE.position.set(-0.45, 0.32, 0); pD.position.set(0.45, 0.32, 0); g.add(pE, pD);
    for (const p of [pE, pD]) bloco(p, C.sand, -0.32, 0.32, -0.32, 0.02, -0.3, 0.44, { r: 0.08 });
    g.userData.pernas = [pE, pD];
    bloco(corpo, C.tunica, -1.13, 1.13, 0.28, 1.45, -0.74, 0.74, { r: 0.16 });
    bloco(corpo, C.tunica, -1.05, 1.05, 1.35, 2.88, -0.68, 0.68, { r: 0.18 });
    if (C.faixa != null) {
      const f1 = caixa(corpo, C.faixa, 0.36, 2.95, 0.1, -0.05, 1.78, 0.7, { r: 0.04 }); f1.rotation.z = -0.72;
      const f2 = caixa(corpo, C.faixa, 0.36, 2.95, 0.1, -0.05, 1.78, -0.7, { r: 0.04 }); f2.rotation.z = -0.72;
    }
    if (C.cinto) bloco(corpo, C.cinto, -1.08, 1.08, 1.32, 1.56, -0.72, 0.72, { r: 0.06 });
    const bE = braco(corpo, -1.34, 2.82, C.tunica, C.pele, 0.56, 1.8, true), bD = braco(corpo, 1.34, 2.82, C.tunica, C.pele, 0.56, 1.8, true);
    g.userData.bracos = [bE, bD];
    const cab = new THREE.Group(); cab.position.set(0, 2.88, 0); corpo.add(cab); g.userData.cabeca = cab;
    const F = 0.98;
    bloco(cab, C.pele, -0.98, 0.98, 0.05, 2.15, -0.95, F, { r: 0.14 });
    const yCab = (estilo === 'curto' || estilo === 'trancas') ? 0.95 : -0.35;
    bloco(cab, C.cabelo, -1.26, 1.26, yCab, 2.42, -1.15, -0.4, { r: 0.18 });
    bloco(cab, C.cabelo, -1.26, -0.94, yCab, 2.42, -1.12, F + 0.06, { r: 0.12 });
    bloco(cab, C.cabelo, 0.94, 1.26, yCab, 2.42, -1.12, F + 0.06, { r: 0.12 });
    bloco(cab, C.cabelo, -1.26, 1.26, 2.0, 2.44, -1.15, F + 0.08, { r: 0.14 });
    if (estilo === 'feminino') { bloco(cab, C.cabelo, -0.98, 0.98, 1.85, 2.1, 0.5, F + 0.08, { r: 0.08 }); }
    else { bloco(cab, C.cabelo, -0.98, -0.07, 1.74, 2.04, 0.55, F + 0.08, { r: 0.08 }); bloco(cab, C.cabelo, 0.07, 0.98, 1.74, 2.04, 0.55, F + 0.08, { r: 0.08 }); }
    const trancas = [];
    if (estilo === 'trancas') { // sete tranças de nazireu, caindo nas costas e nos ombros
      for (let i = 0; i < 7; i++) {
        const t = new THREE.Group(); const a = -1.0 + i * (2.0 / 6);
        t.position.set(a * 1.1, 0.4, -0.6 - 0.35 * (1 - Math.abs(a)));
        for (let k = 0; k < 4; k++) caixa(t, k % 2 ? C.cabelo : 0x2a1a10, 0.26, 0.34, 0.26, 0, -k * 0.32, 0, { r: 0.08 });
        cab.add(t); trancas.push(t);
      }
    }
    g.userData.trancas = trancas;
    g.userData.cabeloMeshes = cab.children.filter((m) => m.material && m.material.color && m.material.color.getHex() === new THREE.Color(C.cabelo).getHex()).concat(trancas);
    if (C.barba != null) {
      bloco(cab, C.barba, -0.98, 0.98, 0.04, 0.6, 0.45, F + 0.1, { r: 0.1 });
      bloco(cab, C.barba, -0.98, -0.62, 0.55, 1.18, 0.45, F + 0.1, { r: 0.07 });
      bloco(cab, C.barba, 0.62, 0.98, 0.55, 1.18, 0.45, F + 0.1, { r: 0.07 });
      bloco(cab, C.barba, -0.52, 0.52, 0.66, 0.82, 0.45, F + 0.1, { r: 0.05 });
      boca(g, cab, F + 0.1, 0.48, 0.5, 0.17, true);
    } else {
      boca(g, cab, F, 0.62, estilo === 'feminino' ? 0.32 : 0.4, 0.14, true);
      if (estilo === 'feminino') for (const l of [-1, 1]) chapa(cab, COR.bochecha, 0.22, 0.1, l * 0.66, 0.78, F);
    }
    olhos(g, cab, F, 1.32, 0.42, op.olhosCor, [0.24, 0.3]);
    sobrancelhas(g, cab, F, 1.64, 0.42, C.barba != null ? C.barba : C.cabelo, 0.36);
    if (op.vestidoLongo) bloco(corpo, C.tunica, -1.18, 1.18, 0.05, 0.6, -0.78, 0.78, { r: 0.12 });
    return g;
  }
  function jesus() { return pessoa({}); }

  // leão de blocos (juba, focinho, mandíbula que abre)
  function leao() {
    const g = new THREE.Group(), corpo = new THREE.Group(); g.add(corpo); g.userData.corpo = corpo;
    const pelo = 0xd8a24e, juba = 0xa4552a, claro = 0xf0d39a;
    bloco(corpo, pelo, -1.1, 1.1, 1.2, 2.6, -2.2, 1.0, { r: 0.3 });
    const pernas = [];
    for (const [x, z] of [[-0.65, 0.55], [0.65, 0.55], [-0.65, -1.7], [0.65, -1.7]]) {
      const p = new THREE.Group(); p.position.set(x, 1.4, z); g.add(p);
      bloco(p, pelo, -0.32, 0.32, -1.4, 0, -0.34, 0.34, { r: 0.12 }); pernas.push(p);
    }
    g.userData.pernas = pernas;
    const rabo = new THREE.Group(); rabo.position.set(0, 2.3, -2.2); corpo.add(rabo);
    caixa(rabo, pelo, 0.2, 0.2, 1.4, 0, 0, -0.6, { r: 0.08 }).rotation.x = -0.6; caixa(rabo, juba, 0.35, 0.35, 0.4, 0, 0.45, -1.15, { r: 0.12 });
    g.userData.rabo = rabo;
    const cab = new THREE.Group(); cab.position.set(0, 2.6, 1.0); corpo.add(cab); g.userData.cabeca = cab;
    bloco(cab, juba, -1.45, 1.45, -1.2, 1.4, -0.9, 0.3, { r: 0.35 });
    bloco(cab, pelo, -0.95, 0.95, -0.85, 0.95, -0.2, 0.95, { r: 0.22 });
    bloco(cab, claro, -0.55, 0.55, -0.55, 0.05, 0.85, 1.35, { r: 0.14 });
    bloco(cab, 0x3a2418, -0.18, 0.18, -0.05, 0.12, 1.3, 1.4, { r: 0.04 });
    const mand = new THREE.Group(); mand.position.set(0, -0.55, 0.9); cab.add(mand);
    bloco(mand, claro, -0.45, 0.45, -0.32, 0, -0.1, 0.42, { r: 0.1 }); bloco(mand, 0x7a2a28, -0.3, 0.3, -0.06, 0.02, 0.0, 0.38, { r: 0.01 });
    g.userData.mandibula = mand;
    for (const l of [-1, 1]) { chapa(cab, 0x1a1414, 0.2, 0.24, l * 0.42, 0.45, 0.95); chapa(cab, 0xffffff, 0.07, 0.07, l * 0.42 - 0.04, 0.52, 0.98); bloco(cab, juba, l * 0.75 - 0.2, l * 0.75 + 0.2, 0.9, 1.3, -0.3, 0.0, { r: 0.08 }); }
    g.userData.olhos = [];
    return g;
  }

  // pose a partir de números. bE / bD: { x, z, cx, cz } (ombro e cotovelo); falar 0..1; balanco -1..1 (cabeça);
  // andar: fase do passo; piscar 0..1; olhar (y), baixar (x), inclinar (z); sobr: sobrancelha levantada 0..1
  function pose(b, o) {
    o = o || {};
    const u = b.userData;
    u.corpo.position.y = 0.025 * (o.respirar || 0);
    u.corpo.rotation.z = 0.02 * (o.balancar || 0);
    const passo = o.andar != null ? Math.sin(o.andar * Math.PI * 2) : 0;
    if (u.pernas) u.pernas.forEach((p, i) => { p.rotation.x = o.andar != null ? (i % 2 ? -1 : 1) * 0.42 * passo : 0; });
    if (o.andar != null) u.corpo.position.y += 0.06 * Math.abs(Math.cos(o.andar * Math.PI * 2));
    const def = (i) => ({ x: o.andar != null ? (i ? 0.4 : -0.4) * passo : 0, z: 0, cx: o.andar != null ? -0.25 : -0.08, cz: 0 });
    if (u.bracos) u.bracos.forEach((br, i) => {
      const a = Object.assign(def(i), i ? o.bD : o.bE);
      br.ombro.rotation.set(a.x, 0, i ? a.z : -a.z);
      br.cot.rotation.set(a.cx, 0, i ? a.cz : -a.cz);
    });
    if (u.cabeca) {
      u.cabeca.rotation.y = o.olhar || 0;
      u.cabeca.rotation.x = (o.baixar || 0) + 0.035 * (o.falar || 0) * Math.sin((o.fase || 0) * 9);
      u.cabeca.rotation.z = o.inclinar || 0;
    }
    if (u.boca) u.boca.scale.y = 1 + 1.7 * (o.falar || 0);
    if (u.mandibula) u.mandibula.rotation.x = 0.7 * (o.rugir || 0);
    const fecha = Math.max(0.1, 1 - (o.piscar || 0));
    if (u.olhos) u.olhos.forEach((e) => { e.scale.y = fecha * (1 + 0.25 * (o.arregalar || 0)); e.scale.x = 1 + 0.15 * (o.arregalar || 0); });
    if (u.sobr) u.sobr.position.y = (u.sobr.userData.y0 != null ? u.sobr.userData.y0 : (u.sobr.userData.y0 = u.sobr.position.y)) + 0.14 * (o.sobr || 0);
    if (u.rabo) u.rabo.rotation.y = 0.3 * Math.sin((o.fase || 0) * 2);
  }

  window.PERSONAGENS = { COR, desbravador, jesus, pessoa, leao, pose, caixa, bloco, geoArred, mat };
})();
