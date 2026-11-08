// personagens.js: os personagens de blocos do estilo escala-em-blocos (three.js r149, global THREE).
// 1 unidade = 1/100 da altura de referência do Desbravador (5 unidades de altura).
// Cada personagem é um THREE.Group com os pés em y = 0, olhando para +z.
// Pose a partir do tempo (nada de relógio próprio): PERSONAGENS.pose(boneco, { andar, acenar, piscar, respirar }).
(function () {
  const COR = {
    // Desbravador (amostrado da imagem de referência)
    bone: 0x28483c, faixaBone: 0xd2af32, emblemaVermelho: 0xc83228, emblemaBranco: 0xfaf8f8,
    pele: 0xeeceb2, cabelo: 0x372316, olho: 0x161212, brilho: 0xffffff, bochecha: 0xf0aa96,
    boca: 0x7a2a28, dente: 0xfaf8f6, camisa: 0xc4aa80, camisaEscura: 0xae976f,
    lenco: 0xf0c428, anel: 0xb48c3c, calca: 0x26463a, fivela: 0xd2af32, sapato: 0x221e1e,
    patchAzul: 0x3c78a0, patchVerde: 0x5aa04a,
    // Jesus
    cabeloJ: 0x8d5c3c, barbaJ: 0x7a4c30, peleJ: 0xe6c6aa, tunica: 0xece4da, faixaJ: 0xc55446, sandalia: 0x9c6941,
  };

  const mats = {};
  function mat(cor) {
    if (!mats[cor]) mats[cor] = new THREE.MeshStandardMaterial({ color: cor, roughness: 0.92, metalness: 0 });
    return mats[cor];
  }
  // caixa com o centro em (x, y, z); w, h, d são as medidas
  function caixa(pai, cor, w, h, d, x, y, z, sombra) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(cor));
    m.position.set(x, y, z);
    m.castShadow = sombra !== false;
    m.receiveShadow = false; // brinquedo limpo: só o chão recebe sombra
    pai.add(m);
    return m;
  }
  // caixa por limites: x de x0 a x1, y de y0 a y1, z de z0 a z1
  function bloco(pai, cor, x0, x1, y0, y1, z0, z1, sombra) {
    return caixa(pai, cor, x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, sombra);
  }
  // detalhe chapado na frente de um rosto (z = frente da cabeça)
  function chapa(pai, cor, w, h, x, y, z) { return caixa(pai, cor, w, h, 0.04, x, y, z + 0.02, false); }
  function triangulo(pai, cor, lado, x, y, z) {
    const s = new THREE.Shape(), r = lado / Math.sqrt(3);
    // ponta para baixo
    s.moveTo(0, -r); s.lineTo(lado / 2, r / 2); s.lineTo(-lado / 2, r / 2); s.closePath();
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s), mat(cor));
    m.position.set(x, y, z);
    pai.add(m);
    return m;
  }
  // braço com o pivô no ombro: devolve o grupo (gire em x para balançar, em z para acenar)
  function braco(pai, x, yOmbro) {
    const g = new THREE.Group();
    g.position.set(x, yOmbro, 0);
    pai.add(g);
    return g;
  }

  function desbravador() {
    const g = new THREE.Group(), corpo = new THREE.Group();
    g.add(corpo);
    g.userData.corpo = corpo;
    // pernas e sapatos
    const pernaE = new THREE.Group(), pernaD = new THREE.Group();
    pernaE.position.set(-0.36, 0.95, 0); pernaD.position.set(0.36, 0.95, 0);
    g.add(pernaE, pernaD);
    for (const p of [pernaE, pernaD]) {
      bloco(p, COR.calca, -0.31, 0.31, -0.83, 0, -0.3, 0.3);
      bloco(p, COR.sapato, -0.33, 0.33, -0.95, -0.8, -0.32, 0.38);
    }
    g.userData.pernas = [pernaE, pernaD];
    // cinto com fivela
    bloco(corpo, COR.calca, -0.92, 0.92, 0.85, 1.15, -0.55, 0.55);
    bloco(corpo, COR.fivela, -0.15, 0.15, 0.92, 1.08, 0.55, 0.6);
    bloco(corpo, COR.calca, -0.08, 0.08, 0.96, 1.04, 0.58, 0.62);
    // tronco (camisa cáqui) e faixa do bolso
    bloco(corpo, COR.camisa, -0.92, 0.92, 1.15, 2.55, -0.55, 0.55);
    bloco(corpo, COR.camisaEscura, -0.6, 0.6, 1.55, 1.85, 0.55, 0.58, false);
    bloco(corpo, COR.camisaEscura, -0.03, 0.03, 1.15, 2.4, 0.55, 0.585, false);
    // lenço: gola atrás, duas pontas em V até o anel, e as duas caudas
    bloco(corpo, COR.lenco, -0.85, 0.85, 2.42, 2.6, -0.6, 0.58);
    const vE = caixa(corpo, COR.lenco, 0.2, 0.75, 0.06, -0.33, 2.25, 0.59, false); vE.rotation.z = 0.95;
    const vD = caixa(corpo, COR.lenco, 0.2, 0.75, 0.06, 0.33, 2.25, 0.59, false); vD.rotation.z = -0.95;
    bloco(corpo, COR.anel, -0.15, 0.15, 1.9, 2.12, 0.58, 0.66);
    const cE = caixa(corpo, COR.lenco, 0.12, 0.55, 0.05, -0.1, 1.68, 0.6, false); cE.rotation.z = -0.2;
    const cD = caixa(corpo, COR.lenco, 0.12, 0.55, 0.05, 0.1, 1.68, 0.6, false); cD.rotation.z = 0.2;
    // braços: manga cáqui + mão; distintivos nas mangas
    const bE = braco(corpo, -1.14, 2.52), bD = braco(corpo, 1.14, 2.52);
    for (const [b, lado] of [[bE, -1], [bD, 1]]) {
      bloco(b, COR.camisa, -0.22, 0.22, -0.62, 0, -0.27, 0.27);
      bloco(b, COR.pele, -0.2, 0.2, -1.32, -0.62, -0.24, 0.24);
      if (lado < 0) { // escudo azul e verde
        bloco(b, COR.patchAzul, -0.225 - 0.03, -0.225, -0.42, -0.14, -0.13, 0.13, false).position.x = -0.235;
        bloco(b, COR.patchAzul, -0.14, 0.14, -0.4, -0.14, 0.27, 0.3, false);
        bloco(b, COR.patchVerde, -0.09, 0.09, -0.33, -0.24, 0.29, 0.31, false);
      } else { // triângulo vermelho
        triangulo(b, COR.emblemaVermelho, 0.26, 0, -0.26, 0.28);
      }
    }
    g.userData.bracos = [bE, bD];
    // cabeça
    const cab = new THREE.Group();
    cab.position.set(0, 2.55, 0);
    corpo.add(cab);
    g.userData.cabeca = cab;
    const F = 1.0; // frente do rosto
    bloco(cab, COR.pele, -1.1, 1.1, 0, 1.75, -1.0, F);
    // cabelo: costeletas, nuca e o topo sob o boné
    bloco(cab, COR.cabelo, -1.12, -0.88, 0.85, 1.75, -1.02, F + 0.02);
    bloco(cab, COR.cabelo, 0.88, 1.12, 0.85, 1.75, -1.02, F + 0.02);
    bloco(cab, COR.cabelo, -1.12, 1.12, 0.6, 1.75, -1.02, -0.6);
    // olhos com brilho, sobrancelhas, bochechas e boca
    const olhos = [];
    for (const lado of [-1, 1]) {
      const o = new THREE.Group();
      o.position.set(lado * 0.42, 1.0, F);
      cab.add(o);
      chapa(o, COR.olho, 0.26, 0.34, 0, 0, 0);
      chapa(o, COR.brilho, 0.09, 0.09, -0.05, 0.08, 0.02);
      olhos.push(o);
      chapa(cab, COR.cabelo, 0.38, 0.08, lado * 0.42, 1.35, F);
      chapa(cab, COR.bochecha, 0.24, 0.11, lado * 0.8, 0.66, F);
    }
    g.userData.olhos = olhos;
    chapa(cab, COR.boca, 0.42, 0.16, 0, 0.6, F);
    chapa(cab, COR.dente, 0.3, 0.06, 0, 0.64, F + 0.01);
    // boné: copa verde, faixa amarela, emblema de triângulo na frente
    bloco(cab, COR.bone, -1.18, 1.18, 1.82, 2.45, -1.08, 1.12);
    bloco(cab, COR.faixaBone, -1.19, 1.19, 1.75, 1.86, -1.09, 1.13);
    bloco(cab, COR.bone, -1.05, 1.05, 1.86, 1.95, 1.12, 1.3); // pala curta
    triangulo(cab, COR.emblemaVermelho, 0.46, 0, 2.18, 1.135);
    triangulo(cab, COR.emblemaBranco, 0.32, 0, 2.16, 1.14);
    triangulo(cab, COR.emblemaVermelho, 0.14, 0, 2.13, 1.145);
    return g;
  }

  function jesus() {
    const g = new THREE.Group(), corpo = new THREE.Group();
    g.add(corpo);
    g.userData.corpo = corpo;
    // sandálias (pés) como pernas curtas
    const pE = new THREE.Group(), pD = new THREE.Group();
    pE.position.set(-0.45, 0.3, 0); pD.position.set(0.45, 0.3, 0);
    g.add(pE, pD);
    for (const p of [pE, pD]) bloco(p, COR.sandalia, -0.32, 0.32, -0.3, 0, -0.3, 0.42);
    g.userData.pernas = [pE, pD];
    // túnica: saia um pouco mais larga e tronco
    bloco(corpo, COR.tunica, -1.12, 1.12, 0.3, 1.4, -0.72, 0.72);
    bloco(corpo, COR.tunica, -1.05, 1.05, 1.4, 2.85, -0.68, 0.68);
    // faixa vermelha: do ombro direito ao quadril esquerdo, frente e costas
    const fF = caixa(corpo, COR.faixaJ, 0.36, 2.9, 0.08, -0.05, 1.75, 0.72); fF.rotation.z = -0.72;
    const fT = caixa(corpo, COR.faixaJ, 0.36, 2.9, 0.08, -0.05, 1.75, -0.72); fT.rotation.z = -0.72;
    // braços com manga larga
    const bE = braco(corpo, -1.33, 2.8), bD = braco(corpo, 1.33, 2.8);
    for (const b of [bE, bD]) {
      bloco(b, COR.tunica, -0.28, 0.28, -1.35, 0, -0.32, 0.32);
      bloco(b, COR.peleJ, -0.22, 0.22, -1.75, -1.35, -0.24, 0.24);
    }
    g.userData.bracos = [bE, bD];
    // cabeça: rosto, cabelo comprido até o ombro, barba
    const cab = new THREE.Group();
    cab.position.set(0, 2.85, 0);
    corpo.add(cab);
    g.userData.cabeca = cab;
    const F = 0.98;
    bloco(cab, COR.peleJ, -0.98, 0.98, 0.05, 2.15, -0.95, F);
    bloco(cab, COR.cabeloJ, -1.28, 1.28, -0.3, 2.4, -1.15, -0.45);          // nuca e cabelo comprido
    bloco(cab, COR.cabeloJ, -1.28, -0.95, -0.3, 2.4, -1.15, F + 0.06);     // lado esquerdo
    bloco(cab, COR.cabeloJ, 0.95, 1.28, -0.3, 2.4, -1.15, F + 0.06);       // lado direito
    bloco(cab, COR.cabeloJ, -1.28, 1.28, 2.0, 2.4, -1.15, F + 0.06);       // topo
    bloco(cab, COR.cabeloJ, -0.98, -0.08, 1.75, 2.0, 0.6, F + 0.06);       // franja com risca no meio
    bloco(cab, COR.cabeloJ, 0.08, 0.98, 1.75, 2.0, 0.6, F + 0.06);
    // barba: queixo, laterais e bigode, com a boca aberta no meio
    bloco(cab, COR.barbaJ, -0.98, 0.98, 0.05, 0.62, 0.5, F + 0.08);
    bloco(cab, COR.barbaJ, -0.98, -0.62, 0.62, 1.15, 0.5, F + 0.08);
    bloco(cab, COR.barbaJ, 0.62, 0.98, 0.62, 1.15, 0.5, F + 0.08);
    bloco(cab, COR.barbaJ, -0.5, 0.5, 0.62, 0.78, 0.5, F + 0.08);
    chapa(cab, COR.dente, 0.5, 0.13, 0, 0.5, F + 0.08);
    const olhos = [];
    for (const lado of [-1, 1]) {
      const o = new THREE.Group();
      o.position.set(lado * 0.42, 1.3, F);
      cab.add(o);
      chapa(o, COR.olho, 0.22, 0.28, 0, 0, 0);
      chapa(o, COR.brilho, 0.07, 0.07, 0.05, 0.08, 0.02);
      olhos.push(o);
      chapa(cab, COR.cabeloJ, 0.36, 0.08, lado * 0.42, 1.62, F);
    }
    g.userData.olhos = olhos;
    return g;
  }

  // pose a partir de números (o chamador calcula tudo a partir de t)
  // andar: fase do passo (0..1 por passo, contínuo) ou null parado; acenar: 0..1 (braço direito);
  // piscar: 0..1 (1 = olho fechado); respirar: -1..1
  function pose(b, o) {
    o = o || {};
    const u = b.userData;
    const resp = o.respirar || 0;
    u.corpo.position.y = 0.02 * resp;
    if (o.andar != null) {
      const s = Math.sin(o.andar * Math.PI * 2);
      u.pernas[0].rotation.x = 0.35 * s; u.pernas[1].rotation.x = -0.35 * s;
      u.bracos[0].rotation.x = -0.35 * s; u.bracos[1].rotation.x = 0.35 * s;
      u.corpo.position.y += 0.04 * Math.abs(Math.cos(o.andar * Math.PI * 2));
    } else {
      for (const p of u.pernas) p.rotation.x = 0;
      for (const a of u.bracos) a.rotation.x = 0;
    }
    const ac = o.acenar || 0;
    u.bracos[1].rotation.z = ac * 2.6 + ac * 0.25 * Math.sin((o.acenarFase || 0) * Math.PI * 2);
    const fecha = Math.max(0.12, 1 - (o.piscar || 0));
    for (const e of u.olhos) e.scale.y = fecha;
    if (o.olhar != null) u.cabeca.rotation.y = o.olhar;
  }

  window.PERSONAGENS = { COR, desbravador, jesus, pose };
})();
