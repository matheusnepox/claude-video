// Fotografa cada <section id="..."> de um HTML em PNG (uma por vez, isolada) e, opcionalmente, gera um PDF.
// uso: node ferramentas/render_html.js <arquivo.html> <pasta_png> [arquivo.pdf]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const [, , arq, pasta, pdf] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(arq));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  fs.mkdirSync(pasta, { recursive: true });
  const ids = await p.$$eval('section', (s) => s.map((x) => x.id));
  for (const id of ids) {
    const r = await p.evaluate((id) => { document.querySelectorAll('section').forEach((s) => s.style.display = s.id === id ? '' : 'none'); const e = document.getElementById(id); return { w: e.offsetWidth, h: e.offsetHeight }; }, id);
    await p.setViewportSize({ width: r.w, height: r.h });
    await p.screenshot({ path: path.join(pasta, id + '.png'), clip: { x: 0, y: 0, width: r.w, height: r.h } });
  }
  if (pdf) {
    await p.evaluate(() => document.querySelectorAll('section').forEach((s) => { s.style.display = ''; s.style.marginBottom = '0'; }));
    const r = await p.$eval('section', (e) => ({ w: e.offsetWidth, h: e.offsetHeight }));
    await p.emulateMedia({ media: 'print' });
    await p.pdf({ path: pdf, width: r.w + 'px', height: r.h + 'px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  }
  console.log(ids.length, 'páginas');
  await b.close();
})();
