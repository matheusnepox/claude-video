"""Gera proj/js/logo-dados.js a partir dos SVGs vetorizados (simbolo.svg e lockup.svg)."""
import re, json
def ler(p):
    s = open(p).read()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    parts = [dict(box=[float(v) for v in b.split(',')], d=d) for b, d in re.findall(r'data-box="([^"]+)"[^>]*d="([^"]+)"', s)]
    return vb, parts
vb, sim = ler('proj/media/simbolo.svg')
corpo = max(sim, key=lambda p: p['box'][2] * p['box'][3]); tri = [p for p in sim if p is not corpo][0]
vb2, lk = ler('proj/media/lockup.svg')
simL = [p for p in lk if p['box'][0] < 340]
corpoL = max(simL, key=lambda p: p['box'][2]); triL = [p for p in simL if p is not corpoL][0]
letras = sorted([p for p in lk if p['box'][0] >= 340 and p['box'][3] > 100], key=lambda p: p['box'][0])
assin = sorted([p for p in lk if p['box'][0] >= 340 and p['box'][3] <= 100], key=lambda p: p['box'][0])
dados = dict(
  simbolo=dict(vb=vb, corpo=corpo, triangulo=tri),
  lockup=dict(vb=vb2, corpo=corpoL, triangulo=triL, letras=letras, assinatura=assin))
open('proj/js/logo-dados.js', 'w').write('// gerado por ferramentas/logo_para_js.py a partir da logo original vetorizada. Não edite à mão.\nwindow.LOGO = ' + json.dumps(dados) + ';\n')
print('letras', len(letras), 'assinatura', len(assin), [round(p['box'][0]) for p in letras])
