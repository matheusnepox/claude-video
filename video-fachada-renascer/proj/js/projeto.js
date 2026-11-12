// O desenho técnico da fachada, refeito em vetor a partir do arquivo enviado (coordenadas em px do desenho, 596 × 572).
// Escala do desenho: 449 px = 3,95 m (113,7 px por metro). Também guarda a homografia que leva o traço para a foto.
(function () {
  const D = {
    largura: 596, altura: 572,
    // contorno: faixa superior + os dois pilares
    contorno: 'M102,64 H551 V553 H501 V235 H163 V553 H102 Z',
    divisas: 'M102,235 H163 M501,235 H551',
    // áreas de adesivo (retângulos internos)
    adesivos: [[120, 93, 57, 114], [212, 93, 228, 113], [474, 93, 56, 114], [118, 275, 28, 113], [510, 275, 28, 113]],
    // frisos (rasgos finos)
    frisos: [
      [105, 73, 115, 2], [269, 73, 115, 2], [428, 73, 115, 2],
      [105, 226, 115, 2], [269, 226, 115, 2], [428, 226, 115, 2],
      [110, 93, 2, 114], [539, 93, 2, 114],
      [104, 241, 58, 3], [505, 241, 41, 3], [104, 544, 58, 2], [505, 546, 41, 2],
      [108, 259, 2, 114], [153, 259, 3, 114], [108, 422, 2, 115], [153, 422, 3, 115],
      [504, 259, 2, 114], [545, 259, 3, 114], [504, 422, 2, 115], [545, 422, 3, 115],
    ],
    // cotas
    cotaL: { y: 49, x0: 102, x1: 551, texto: (p) => (3.95 * p).toFixed(2).replace('.', ',') + ' m' },
    cotaA: { x: 86, y0: 64, y1: 553, texto: (p) => (4.3 * p).toFixed(1).replace('.', ',') + ' m' },
    // os 4 cantos do contorno (para a homografia)
    cantos: [[102, 64], [551, 64], [551, 553], [102, 553]],
    // silhueta do contorno (para recortar a foto dentro do traço)
    silhueta: [[102, 64], [551, 64], [551, 553], [501, 553], [501, 235], [163, 235], [163, 553], [102, 553]],
  };

  // homografia: resolve H (3×3) que leva os 4 pontos src para os 4 pontos dst
  function homografia(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = src[i], [u, v] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    // eliminação de Gauss
    const n = 8;
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = A[r][c] / A[c][c];
        for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
        b[r] -= f * b[c];
      }
    }
    const h = b.map((v, i) => v / A[i][i]);
    return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
  }
  const aplica = (H, [x, y]) => {
    const w = H[6] * x + H[7] * y + H[8];
    return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
  };
  const matrix3d = (H) => `matrix3d(${H[0]},${H[3]},0,${H[6]},${H[1]},${H[4]},0,${H[7]},0,0,1,0,${H[2]},${H[5]},0,${H[8]})`;

  window.PROJETO = { D, homografia, aplica, matrix3d };
})();
