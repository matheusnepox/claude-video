#!/usr/bin/env python3
"""Gera estaticos/estaticos.html (lona e fachada em ACM) reaproveitando o CSS, a logo e o traço da ponte dos estáticos dos cartões.
uso (da pasta anuncios-lonas-acm): python3 ferramentas/gera_estaticos.py"""
import re
base = open('../anuncios-cartoes/estaticos/estaticos.html').read()
css = base[base.index('<style>') + 7:base.index('</style>')]
logo = re.search(r'<svg viewBox="18 18 1152 275" width="300".*?</svg>', base, re.S).group(0)
c6 = base[base.index('<section id="carrossel-6"'):]
ponte = re.search(r'<div style="position:absolute;left:0;bottom:0;width:100%"><svg viewBox="0 1100.*?</svg></div>', c6, re.S).group(0)
WA = re.search(r'<svg width="54" height="54" viewBox="0 0 64 64".*?</svg>', base, re.S).group(0)
cta = lambda txt='CHAMA NO WHATSAPP': f'<div class="cta">{WA}<span>{txt}</span></div>'

ILHOS = [(x, 24) for x in range(30, 871, 105)] + [(x, 426) for x in range(30, 871, 105)] + [(30, y) for y in (129, 225, 321)] + [(870, y) for y in (129, 225, 321)]
ARTE = ('''<div style="position:absolute;inset:0;background:linear-gradient(120deg,#F4B740,#EE7F45)">
<div style="position:absolute;left:600px;top:-120px;width:460px;height:460px;border-radius:50%;background:#FBD36B;opacity:.85"></div>
<div style="position:absolute;left:-60px;top:300px;width:420px;height:260px;border-radius:50%;background:#07583F;opacity:.9"></div>
<div style="position:absolute;left:70px;top:70px;font:700 34px/1 'Instrument Sans';color:#1F2A44;letter-spacing:.2em">GRANDE</div>
<div style="position:absolute;left:64px;top:112px;font:700 104px/1 'Instrument Sans';color:#1F2A44;letter-spacing:-.03em">INAUGURAÇÃO</div>
<div style="position:absolute;left:70px;top:238px;width:380px;height:22px;border-radius:11px;background:#FFF3D6;opacity:.85"></div>
<div style="position:absolute;left:70px;top:276px;width:300px;height:22px;border-radius:11px;background:#FFF3D6;opacity:.85"></div>
<div style="position:absolute;left:560px;top:290px;padding:18px 34px;border-radius:999px;background:#1F2A44;font:700 40px/1 'Instrument Sans';color:#FBD36B">SÁBADO · 9h</div></div>'''
        + ''.join(f'<div style="position:absolute;left:{x-13}px;top:{y-13}px;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle,#2A2A2A 0 6px,#D9D9D9 7px 11px,#9A9A9A 12px)"></div>' for x, y in ILHOS))
def lona(esc, css=''):
    return (f'<div style="position:absolute;width:{900*esc}px;height:{450*esc}px;overflow:hidden;border-radius:4px;box-shadow:0 30px 60px rgba(2,38,28,.45);{css}">'
            f'<div style="position:absolute;left:0;top:0;width:900px;height:450px;transform:scale({esc});transform-origin:0 0">{ARTE}</div></div>')
def loja(esc, acm, css=''):
    # loja 640 x 560: corpo, porta, janela; com ACM ganha faixa verde com "SUA MARCA" e colunas
    corpo = '#F3EFE3' if acm else '#BDB8AA'
    topo = ('<div style="position:absolute;left:0;top:0;width:640px;height:150px;background:#07583F;border-bottom:14px solid #DCEBE3;display:flex;align-items:center;justify-content:center;font:700 82px/1 \'Instrument Sans\';color:#DCEBE3;text-shadow:0 0 24px rgba(220,235,227,.7)">SUA MARCA</div>'
            '<div style="position:absolute;left:0;top:150px;width:40px;height:410px;background:#07583F"></div><div style="position:absolute;left:600px;top:150px;width:40px;height:410px;background:#07583F"></div>') if acm else \
           '<div style="position:absolute;left:20px;top:20px;width:600px;height:120px;background:#8F8A7E"></div>'
    return (f'<div style="position:absolute;width:{640*esc}px;height:{560*esc}px;{css}"><div style="position:absolute;left:0;top:0;width:640px;height:560px;transform:scale({esc});transform-origin:0 0">'
            f'<div style="position:absolute;left:40px;top:150px;width:560px;height:410px;background:{corpo}"></div>'
            '<div style="position:absolute;left:400px;top:300px;width:140px;height:260px;background:#1F6E52"></div>'
            '<div style="position:absolute;left:90px;top:260px;width:240px;height:170px;background:#DCEBE3"></div>' + topo + '</div></div>')

extra_css = '''
.preco{white-space:nowrap;font-size:196px!important}
.passos{display:flex;flex-direction:column;gap:18px;margin:34px auto 36px;max-width:860px;text-align:left}
.passos div{display:flex;align-items:center;gap:26px;background:rgba(220,235,227,.10);border-radius:28px;padding:22px 30px}
.passos i{font-style:normal;display:inline-flex;width:76px;height:76px;flex:none;border-radius:50%;background:#DCEBE3;color:#043D2D;font-weight:700;font-size:46px;align-items:center;justify-content:center}
.passos b{font-size:44px;display:block} .passos span{font-size:32px;color:#DCEBE3}
.chips{display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin:30px 0}
.chips span{border:4px solid #DCEBE3;border-radius:999px;padding:16px 32px 18px;font-weight:700;font-size:44px}
.antes{position:absolute;font-weight:700;font-size:38px;background:#DCEBE3;color:#043D2D;border-radius:999px;padding:10px 26px 12px}
'''
PASSOS = ('<div class="passos"><div><i>1</i><p><b>Visita técnica</b><span>a gente conhece a sua empresa de perto</span></p></div>'
          '<div><i>2</i><p><b>Assessoria</b><span>de comunicação visual</span></p></div>'
          '<div><i>3</i><p><b>Orçamento com prévia</b><span>você vê como fica antes de fazer</span></p></div></div>')
NOTA_L = 'Valor sem instalação · prazo após a aprovação da arte · instalação agendada à parte'

S = []
def sec(id_, h, corpo, topo=''):
    S.append(f'<section id="{id_}" style="width:1080px;height:{h}px;background:#07583F"><div class="topo"{topo}>{logo}</div><div class="faixas"></div>{corpo}</section>')
for fmt, h, ly, blo in [('feed', 1350, 180, 650), ('stories', 1920, 330, 880)]:
    sec(f'estatico-a-{fmt}', h, lona(0.94, f'left:117px;top:{ly}px;transform:rotate(-2deg)') + f'''<div class="bloco" style="top:{blo}px">
<div class="sub">Lona 3 x 1,5 m com ilhós por</div><div class="preco">R$ 349,90</div>
<div class="pilulas"><span class="pil">ARTE GRÁTIS</span><span class="pil">PRONTA EM 3 DIAS ÚTEIS</span></div>{cta()}
<div class="nota">{NOTA_L}</div></div>''')
for fmt, h, ly, blo in [('feed', 1350, 170, 560), ('stories', 1920, 300, 830)]:
    sec(f'estatico-b-{fmt}', h, loja(0.62, True, f'left:342px;top:{ly}px') + f'''<div class="bloco" style="top:{blo}px">
<div class="tit" style="font-size:80px">Fachada em ACM</div><div class="sub">Agende sua <b style="color:#DCEBE3">visita técnica</b></div>{PASSOS}{cta()}
<div class="nota">Seven · empresa 100% capixaba, comprometida com o crescimento da sua empresa</div></div>''')
sec('carrossel-1', 1350, lona(0.94, 'left:117px;top:200px;transform:rotate(-2deg)') + '<div class="bloco" style="top:700px"><div class="sub">Lona 3 x 1,5 m com ilhós por</div><div class="preco">R$ 349,90</div><div class="pilulas"><span class="pil">+ ARTE GRÁTIS</span></div><div class="seta">arraste →</div></div>')
sec('carrossel-2', 1350, lona(0.8, 'left:180px;top:230px;transform:rotate(2deg)') + '<div class="bloco" style="top:700px"><div class="tit" style="font-size:96px">Com ilhós</div><div class="sub">prontinha pra pendurar</div><div class="chips"><span>Fachada</span><span>Muro</span><span>Placa</span><span>Evento</span></div></div>')
sec('carrossel-3', 1350, '''<div class="bloco" style="top:250px"><div style="display:inline-block;width:300px;height:300px;border-radius:40px;background:#F3EFE3;overflow:hidden;position:relative;box-shadow:0 30px 60px rgba(2,38,28,.45)">
<div style="height:70px;background:#1F6E52"></div><div style="font:700 170px/1 'Instrument Sans';color:#043D2D;margin-top:8px">3</div><div style="font:700 32px/1 'Instrument Sans';color:#1F6E52">dias úteis</div></div>
<div class="tit" style="font-size:84px;margin-top:50px">Pronta em 3 dias úteis</div><div class="sub">depois que você aprova a arte</div>
<div class="extras" style="margin-top:40px"><span>Precisa instalar? <b>A gente agenda</b></span><span style="font-size:34px;color:#DCEBE3">assim que a lona ficar pronta (valor à parte)</span></div></div>''')
sec('carrossel-4', 1350, loja(0.62, False, 'left:110px;top:430px') + loja(0.62, True, 'left:574px;top:430px')
    + '<span class="antes" style="left:220px;top:810px">antes</span><span class="antes" style="left:670px;top:810px">com ACM</span>'
    + '<div class="bloco" style="top:200px"><div class="tit" style="font-size:80px">Sua fachada está<br>vendendo por você?</div></div>'
    + '<div class="bloco" style="top:920px"><div class="sub">Fachada em ACM: moderna, profissional<br>e fácil de encontrar.</div></div>')
sec('carrossel-5', 1350, f'<div class="bloco meio"><div class="tit" style="font-size:80px">Como funciona</div>{PASSOS}</div>')
sec('carrossel-6', 1350, f'<div class="bloco" style="top:250px"><div class="tit" style="font-size:84px">Agende sua<br>visita técnica</div><div class="sub">Seven: 100% capixaba, comprometida<br>com o crescimento da sua empresa.</div><div style="margin-top:40px">{cta()}</div></div>{ponte}', ' style="top:70px"')
html = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap">\n<style>'
        + css + extra_css + '</style></head><body>\n' + '\n'.join(S) + '\n</body></html>')
open('estaticos/estaticos.html', 'w').write(html)
print('estaticos/estaticos.html', len(S), 'peças')
