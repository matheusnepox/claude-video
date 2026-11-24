// Exporta cada SVG de logo/grafismo/pattern para PNG transparente (logos e grafismos) ou opaco (patterns).
// uso (da pasta manual-seven): node ferramentas/exporta_png.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ALVOS = [
  ['logo/svg', 'logo/png', 2400],
  ['grafismos/svg', 'grafismos/png', 1600],
  ['pattern/svg', 'pattern/png', 0],
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [dir, out, larg] of ALVOS) {
    fs.mkdirSync(out, { recursive: true });
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg'))) {
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      const vb = src.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
      const ehPattern = dir.startsWith('pattern');
      const ehModulo = ehPattern && !f.includes('composicao');
      let W, H, html;
      if (ehModulo) { // módulo repetido numa área grande de 2400 x 2400
        W = 2400; H = 2400;
        const data = 'data:image/svg+xml;base64,' + Buffer.from(src).toString('base64');
        html = `<div style="width:${W}px;height:${H}px;background:url(${data});background-size:${vb[2]}px ${vb[3]}px"></div>`;
      } else {
        W = larg || 2160; H = Math.round(W * vb[3] / vb[2]);
        html = src.replace('<svg ', `<svg width="${W}" height="${H}" `);
      }
      await p.setViewportSize({ width: W, height: H });
      await p.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
      await p.screenshot({ path: path.join(out, f.replace('.svg', '.png')), omitBackground: !ehPattern, clip: { x: 0, y: 0, width: W, height: H } });
    }
    console.log(out, 'ok');
  }
  await b.close();
})();
