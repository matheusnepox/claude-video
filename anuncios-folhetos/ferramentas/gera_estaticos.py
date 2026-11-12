#!/usr/bin/env python3
"""Gera estaticos/estaticos.html (folhetos) reaproveitando o CSS, a logo e o traço da ponte dos estáticos dos cartões.
uso (da pasta anuncios-folhetos): python3 ferramentas/gera_estaticos.py"""
import re
base = open('../anuncios-cartoes/estaticos/estaticos.html').read()
css = base[base.index('<style>') + 7:base.index('</style>')]
logo = re.search(r'<svg viewBox="18 18 1152 275" width="300".*?</svg>', base, re.S).group(0)
logo600 = logo.replace('width="300"', 'width="600"')
c6 = base[base.index('<section id="carrossel-6"'):]
ponte = re.search(r'<div style="position:absolute;left:0;bottom:0;width:100%"><svg viewBox="0 1100.*?</svg></div>', c6, re.S).group(0)
WA = re.search(r'<svg width="54" height="54" viewBox="0 0 64 64".*?</svg>', base, re.S).group(0)
cta = f'<div class="cta">{WA}<span>CHAMA NO WHATSAPP</span></div>'

barra = lambda x, y, w, h, c: f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{h/2}px;background:{c}"></div>'
FRENTE = f'''<div style="position:absolute;inset:0;background:#FBF7EE">
<div style="position:absolute;left:0;top:0;width:500px;height:330px;background:linear-gradient(160deg,#F4B740,#EE7F45)"></div>
<div style="position:absolute;left:250px;top:40px;width:300px;height:300px;border-radius:50%;background:#FBD36B;opacity:.9"></div>
<div style="position:absolute;left:40px;top:150px;width:0;height:0;border-left:110px solid transparent;border-right:110px solid transparent;border-bottom:180px solid #07583F"></div>
<div style="position:absolute;left:300px;top:230px;width:150px;height:150px;border-radius:50%;background:#1F2A44;display:flex;align-items:center;justify-content:center;font:700 50px/1 'Instrument Sans';color:#FBD36B">50%</div>
<div style="position:absolute;left:40px;top:375px;font:700 74px/1 'Instrument Sans';color:#1F2A44;letter-spacing:-.02em">PROMOÇÃO</div>
{barra(40,470,380,22,'#E2D9C6')}{barra(40,510,300,22,'#E2D9C6')}{barra(40,550,340,22,'#E2D9C6')}
<div style="position:absolute;left:0;top:610px;width:500px;height:90px;background:#1F2A44"></div>{barra(40,645,200,20,'#FBD36B')}{barra(300,645,160,20,'#5B6A8C')}</div>'''
VERSO = f'''<div style="position:absolute;inset:0;background:#1F2A44">
<div style="position:absolute;left:40px;top:50px;font:700 58px/1.05 'Instrument Sans';color:#FBD36B">Venha nos<br>visitar!</div>
{barra(40,200,400,22,'#5B6A8C')}{barra(40,240,330,22,'#5B6A8C')}{barra(40,280,370,22,'#5B6A8C')}
<div style="position:absolute;left:40px;top:350px;width:420px;height:200px;border-radius:24px;background:#EE7F45"></div>
<div style="position:absolute;left:330px;top:580px;width:110px;height:110px;border-radius:10px;background:repeating-linear-gradient(90deg,#FBF7EE 0 12px,#1F2A44 12px 20px)"></div>
{barra(40,600,240,20,'#FBD36B')}{barra(40,640,180,20,'#5B6A8C')}</div>'''
def folheto(arte, esc, css=''):
    return (f'<div style="position:absolute;width:{500*esc}px;height:{700*esc}px;overflow:hidden;border-radius:8px;'
            f'box-shadow:0 30px 60px rgba(2,38,28,.45),0 4px 10px rgba(2,38,28,.3);{css}">'
            f'<div style="position:absolute;left:0;top:0;width:500px;height:700px;transform:scale({esc});transform-origin:0 0">{arte}</div></div>')
def leque(top, esc, h):
    w = 500 * esc
    return (f'<div style="position:absolute;top:{top}px;left:0;width:100%;height:{h}px">'
            + folheto(VERSO, esc, f'left:{540 - w/2 - 250*esc*1.3}px;top:{40*esc}px;transform:rotate(-12deg)')
            + folheto(FRENTE, esc, f'left:{540 - w/2 + 250*esc*1.3}px;top:{40*esc}px;transform:rotate(11deg)')
            + folheto(FRENTE, esc, f'left:{540 - w/2}px;top:0;transform:rotate(-2deg)') + '</div>')

extra_css = '''
.tab3{margin:30px 0 26px;display:flex;flex-direction:column;gap:14px}
.tab3 .r{display:grid;grid-template-columns:1.1fr 1fr 1fr;align-items:center;background:rgba(220,235,227,.10);border-radius:24px;padding:0 34px;height:104px}
.tab3 .r.h{background:none;height:auto;padding-bottom:0} .tab3 .r.h span{font-size:34px;color:#DCEBE3;font-weight:600}
.tab3 .r b{font-size:52px;text-align:left} .tab3 .r em{font-style:normal;font-weight:700;font-size:52px;white-space:nowrap}
.tab3 .r.ativa{background:#DCEBE3;color:#043D2D}
section[id="carrossel-3"] .bloco.meio .linha,section[id="carrossel-4"] .bloco.meio .linha{height:168px!important}
section[id="carrossel-3"] .bloco.meio,section[id="carrossel-4"] .bloco.meio{top:54%!important}
.moeda{display:inline-flex;width:230px;height:230px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F6DB8B,#C99A2E 70%);box-shadow:inset 0 0 0 14px rgba(255,255,255,.25),0 18px 30px rgba(2,38,28,.4);align-items:center;justify-content:center;font:700 92px/1 'Instrument Sans';color:#7A5A12}
'''
NOTA = '*Cariacica, Vila Velha, Vitória e alguns bairros da Serra'
TAB = [('1.250', 'R$ 150,00', 'R$ 229,90'), ('2.500', 'R$ 219,05', 'R$ 276,00'), ('5.000', 'R$ 269,90', 'R$ 329,80'), ('10.000', 'R$ 499,90', 'R$ 599,90')]
tab3 = '<div class="tab3"><div class="r h"><span style="text-align:left">Quantidade</span><span>4x0 · só frente</span><span>4x4 · frente e verso</span></div>' + ''.join(
    f'<div class="r{" ativa" if i == 0 else ""}"><b>{q}</b><em>{a}</em><em>{b}</em></div>' for i, (q, a, b) in enumerate(TAB)) + '</div>'
def linhas(col):
    return '<div class="tabela">' + ''.join(
        f'<div class="linha{" ativa" if i == 0 else ""}" style="height:118px"><div><b>{q} un.</b><span>10 x 14 cm · couchê 90 g</span></div><em>{t[col]}</em></div>'
        for i, t in enumerate(TAB) for q in [t[0]]) + '</div>'

S = []
def sec(id_, h, corpo):
    S.append(f'<section id="{id_}" style="width:1080px;height:{h}px;background:#07583F"><div class="topo">{logo}</div><div class="faixas"></div>{corpo}</section>')
for fmt, h, fan, blo, esc in [('feed', 1350, 170, 690, 0.62), ('stories', 1920, 290, 960, 0.72)]:
    sec(f'estatico-a-{fmt}', h, leque(fan, esc, 500) + f'''<div class="bloco" style="top:{blo}px">
<div class="sub">1.250 folhetos coloridos por</div><div class="preco">R$ 150</div>
<div class="pilulas"><span class="pil">ARTE GRÁTIS</span><span class="pil">ENTREGA GRÁTIS*</span></div>{cta}
<div class="nota">{NOTA} · Pronto em até 7 dias úteis</div></div>''')
for fmt, h, top in [('feed', 1350, 190), ('stories', 1920, 330)]:
    sec(f'estatico-b-{fmt}', h, f'''<div class="bloco" style="top:{top}px">
<div class="tit">Folhetos 10 x 14 cm</div><div class="sub">Couchê 90 g · <b style="color:#DCEBE3">arte grátis</b></div>{tab3}
<div class="extras"><span>⏱ Pronto em até <b>7 dias úteis</b></span></div>
<div class="pilulas"><span class="pil">ENTREGA GRÁTIS*</span></div>{cta}<div class="nota">{NOTA}</div></div>''')
# carrossel
sec('carrossel-1', 1350, leque(170, 0.62, 500) + '<div class="bloco" style="top:700px"><div class="sub">1.250 folhetos coloridos por</div><div class="preco">R$ 150</div><div class="pilulas"><span class="pil">+ ARTE GRÁTIS</span></div><div class="seta">arraste →</div></div>')
sec('carrossel-2', 1350, folheto(FRENTE, 0.82, 'left:110px;top:200px;transform:rotate(-4deg)') + folheto(VERSO, 0.82, 'left:560px;top:230px;transform:rotate(4deg)')
    + '<div class="bloco" style="top:860px"><div class="tit" style="font-size:88px">10 x 14 cm</div><div class="sub">Papel couchê 90 g<br>Só frente (4x0) ou frente e verso (4x4)</div></div>')
sec('carrossel-3', 1350, f'<div class="bloco meio"><div class="tit" style="font-size:84px!important">Colorido só na frente</div><div class="sub">Folhetos 4x0 · 10 x 14 cm</div>{linhas(1)}</div>')
sec('carrossel-4', 1350, f'<div class="bloco meio"><div class="tit" style="font-size:84px!important">Frente e verso</div><div class="sub">Folhetos 4x4 · 10 x 14 cm</div>{linhas(2)}</div>')
sec('carrossel-5', 1350, '<div class="bloco" style="top:210px"><div class="sub">10.000 folhetos por R$ 499,90</div><div class="tit" style="font-size:96px;margin-top:30px">MENOS DE</div><div class="preco" style="font-size:150px;margin:0 0 10px;white-space:nowrap">5 CENTAVOS</div><div class="tit" style="font-size:96px">CADA</div></div>'
    + folheto(FRENTE, 0.36, 'left:320px;top:1000px;transform:rotate(-6deg)') + '<div style="position:absolute;left:570px;top:1030px"><div class="moeda">5¢</div></div>')
sec('carrossel-6', 1350, f'<div class="bloco" style="top:210px"><div class="tit" style="font-size:90px">ENTREGA GRÁTIS*</div><div class="sub">e pronto em até 7 dias úteis</div><div class="nota" style="font-size:34px">{NOTA}</div>'
    f'<div class="tit" style="font-size:68px;margin-top:36px">100% capixaba</div><div class="sub">comprometida com o crescimento da sua empresa.</div><div style="margin-top:26px">{cta}</div></div>{ponte}')
S[-1] = S[-1].replace('<div class="topo">', '<div class="topo" style="top:60px">')
html = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap">\n<style>'
        + css + extra_css + '</style></head><body>\n' + '\n'.join(S) + '\n</body></html>')
open('estaticos/estaticos.html', 'w').write(html)
print('estaticos/estaticos.html', len(S), 'peças')
