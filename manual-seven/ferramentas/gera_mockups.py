#!/usr/bin/env python3
"""Gera ferramentas/mockups.html: 6 cenas de aplicação da marca (1920 x 1280), fotografadas depois por render_html.js.
Tudo desenhado em HTML/CSS/SVG com a logo original (logo/svg). uso: python3 ferramentas/gera_mockups.py"""
import re

def logo(nome, cor):
    s = open(f'logo/svg/seven-{nome}-{cor}.svg').read()
    return re.sub(r'<svg ', '<svg style="display:block;width:100%;height:auto" ', s, count=1)

def graf(nome):
    return open(f'grafismos/svg/seven-grafismo-{nome}.svg').read().replace('<svg ', '<svg style="display:block;width:100%;height:auto" ', 1)

V, P, C, CR = '#07583F', '#043D2D', '#DCEBE3', '#F3EFE3'
pat_creme = open('pattern/svg/seven-pattern-simbolo-creme.svg').read()
pat_verde = open('pattern/svg/seven-pattern-simbolo-verde.svg').read()
import base64
def data(svg):
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()

CSS = f"""
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-Regular.ttf); font-weight: 400; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-Medium.ttf); font-weight: 500; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-SemiBold.ttf); font-weight: 600; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-Bold.ttf); font-weight: 700; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ background: #222; font-family: 'IS', sans-serif; }}
section {{ position: relative; width: 1920px; height: 1280px; overflow: hidden; margin-bottom: 20px; }}
.abs {{ position: absolute; }}
.sombra {{ box-shadow: 0 40px 80px rgba(0,0,0,0.35), 0 8px 18px rgba(0,0,0,0.25); }}
.luz::after {{ content: ''; position: absolute; inset: 0; background: linear-gradient(125deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%, rgba(0,0,0,0.12)); pointer-events: none; }}
.grao::before {{ content: ''; position: absolute; inset: 0; opacity: .05; background-image: radial-gradient(#000 1px, transparent 1px); background-size: 3px 3px; pointer-events:none; }}
.txt {{ color: {P}; }}
"""

secoes = []

# 1. cartões de visita
secoes.append(f"""<section id="mockup-01-cartoes" class="grao" style="background: radial-gradient(circle at 30% 20%, #E9E4D6, #CFC8B6 70%, #B9B19E)">
  <div class="abs sombra luz" style="left:300px;top:250px;width:900px;height:500px;border-radius:14px;background:{V};transform:perspective(2600px) rotateX(38deg) rotateZ(-18deg);overflow:hidden">
    <div class="abs" style="left:-60px;top:-40px;width:330px;opacity:.12">{graf('diagonal')}</div>
    <div class="abs" style="right:-40px;bottom:-60px;width:300px;opacity:.12">{graf('diagonal')}</div>
    <div class="abs" style="left:345px;top:130px;width:210px">{logo('simbolo','branco')}</div>
  </div>
  <div class="abs sombra luz" style="left:820px;top:520px;width:900px;height:500px;border-radius:14px;background:{CR};transform:perspective(2600px) rotateX(38deg) rotateZ(-8deg);overflow:hidden">
    <div class="abs" style="left:70px;top:70px;width:330px">{logo('horizontal','verde')}</div>
    <div class="abs txt" style="left:70px;top:250px;font:700 44px/1.1 IS">Seu Nome</div>
    <div class="abs" style="left:70px;top:306px;font:500 26px/1 IS;color:{V};letter-spacing:.18em">DIREÇÃO DE ARTE</div>
    <div class="abs txt" style="left:70px;top:370px;font:500 26px/1.6 IS">(27) 9 0000-0000<br>@seven.publicidade</div>
    <div class="abs" style="right:-30px;top:-20px;width:260px;opacity:.9">{graf('diagonal').replace(C, V)}</div>
  </div>
</section>""")

# 2. papelaria: papel timbrado, envelope e cartão sobre mesa verde
secoes.append(f"""<section id="mockup-02-papelaria" class="grao" style="background: radial-gradient(circle at 60% 30%, #1E6B52, {P} 75%)">
  <div class="abs sombra" style="left:260px;top:110px;width:760px;height:1075px;background:#FFFFFF;transform:rotate(-6deg);overflow:hidden">
    <div class="abs" style="left:70px;top:70px;width:260px">{logo('horizontal','verde')}</div>
    <div class="abs" style="right:-60px;top:-60px;width:240px;opacity:.9">{graf('diagonal').replace(C, C)}</div>
    {''.join(f'<div class="abs" style="left:70px;top:{260 + i * 38}px;width:{[600,560,610,520,590,300][i % 6]}px;height:10px;border-radius:5px;background:#E4E8E5"></div>' for i in range(14))}
    <div class="abs" style="left:0;bottom:0;width:760px;height:80px;background:{V}"></div>
    <div class="abs" style="left:70px;bottom:28px;font:500 18px/1 IS;color:{C};letter-spacing:.14em">COMUNICAÇÃO COM PROPÓSITO · @SEVEN.PUBLICIDADE</div>
  </div>
  <div class="abs sombra luz" style="left:930px;top:300px;width:880px;height:440px;background:{V};transform:rotate(8deg);overflow:hidden">
    <div class="abs" style="left:60px;top:60px;width:300px">{logo('horizontal','branco')}</div>
    <div class="abs" style="right:-50px;bottom:-80px;width:330px;opacity:.14">{graf('diagonal')}</div>
    <div class="abs" style="left:0;top:0;width:880px;height:440px;background:linear-gradient(160deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.12) 50.2%)"></div>
  </div>
  <div class="abs sombra luz" style="left:1080px;top:820px;width:540px;height:300px;border-radius:10px;background:{CR};transform:rotate(-12deg);overflow:hidden">
    <div class="abs" style="left:50px;top:50px;width:220px">{logo('horizontal','verde')}</div>
    <div class="abs txt" style="left:50px;top:170px;font:700 28px/1 IS">Seu Nome</div>
    <div class="abs" style="left:50px;top:212px;font:500 18px/1.5 IS;color:{V}">(27) 9 0000-0000 · @seven.publicidade</div>
  </div>
</section>""")

# 3. fachada em ACM com letra-caixa iluminada
secoes.append(f"""<section id="mockup-03-fachada" style="background: linear-gradient(180deg, #8FA39B 0%, #B7C3BC 45%, #9AA59F 100%)">
  <div class="abs" style="left:0;top:0;width:1920px;height:1280px;background:linear-gradient(180deg, #5E6B66, #7C8984)"></div>
  <div class="abs" style="left:160px;top:160px;width:1600px;height:900px;background:#2F3633"></div>
  <div class="abs luz" style="left:160px;top:160px;width:1600px;height:300px;background:{P};overflow:hidden;box-shadow: 0 20px 40px rgba(0,0,0,.4)">
    <div class="abs" style="left:-80px;top:-40px;width:260px;opacity:.16">{graf('diagonal')}</div>
    <div class="abs" style="right:-60px;top:-20px;width:240px;opacity:.16">{graf('diagonal')}</div>
    <div class="abs" style="left:430px;top:62px;width:740px;filter:drop-shadow(0 0 18px rgba(220,235,227,.55)) drop-shadow(0 6px 0 rgba(0,0,0,.35))">{logo('horizontal','branco')}</div>
  </div>
  <div class="abs" style="left:200px;top:500px;width:1520px;height:560px;background:linear-gradient(180deg, #E8DCC0, #C9B992);opacity:.9"></div>
  {''.join(f'<div class="abs" style="left:{200 + i * 380}px;top:500px;width:12px;height:560px;background:#1C211F"></div>' for i in range(5))}
  <div class="abs" style="left:200px;top:500px;width:1520px;height:560px;background:linear-gradient(115deg, rgba(255,255,255,.35), rgba(255,255,255,0) 30%, rgba(255,255,255,.12) 55%, rgba(255,255,255,0) 70%)"></div>
  <div class="abs" style="left:300px;top:640px;width:180px;opacity:.95">{graf('diagonal').replace(C, V)}</div>
  <div class="abs" style="left:420px;top:640px;width:180px;opacity:.55">{graf('diagonal').replace(C, V)}</div>
  <div class="abs" style="left:1395px;top:690px;width:300px;font:600 40px/1.15 IS;color:{P}">Ideias que<br>ganham forma.</div>
  <div class="abs" style="left:0;top:1060px;width:1920px;height:220px;background:linear-gradient(180deg, #8C8C86, #6E6E69)"></div>
  {''.join(f'<div class="abs" style="left:{i * 160}px;top:1060px;width:2px;height:220px;background:rgba(0,0,0,.12)"></div>' for i in range(13))}
</section>""")

# 4. redes sociais: feed e stories
post = f"""<div class="abs" style="inset:0;background:{V};overflow:hidden">
    <div class="abs" style="left:0;top:0;width:100%;height:100%;background:url({data(open('pattern/svg/seven-fundo-composicao-verde.svg').read())}) center/cover"></div>
    <div class="abs" style="left:46px;top:50px;width:70px">{logo('simbolo','branco')}</div>
    <div class="abs" style="left:46px;top:300px;font:700 74px/1.05 IS;color:#fff">Esperança<br>é a nossa cor.</div>
    <div class="abs" style="left:46px;top:490px;width:430px;font:400 26px/1.45 IS;color:{C}">O verde representa crescimento, renovação e novos começos.</div>
  </div>"""
story = f"""<div class="abs" style="inset:0;background:{P};overflow:hidden">
    <div class="abs" style="left:-60px;top:-30px;width:300px;opacity:.14">{graf('diagonal')}</div>
    <div class="abs" style="right:-70px;bottom:120px;width:300px;opacity:.14">{graf('diagonal')}</div>
    <div class="abs" style="left:110px;top:150px;width:300px">{logo('horizontal','branco')}</div>
    <div class="abs" style="left:0;width:100%;top:420px;text-align:center;font:500 34px/1.3 IS;color:{C}">Não mudamos apenas<br>a nossa aparência.</div>
    <div class="abs" style="left:0;width:100%;top:540px;text-align:center;font:500 84px/1 IS;color:#fff">EVOLUÍMOS</div>
    <div class="abs" style="left:110px;top:780px;width:300px;height:80px;border-radius:40px;background:{C};text-align:center;font:700 30px/80px IS;color:{P}">CONHEÇA</div>
  </div>"""
def celular(x, y, w, h, tela, rot):
    return f"""<div class="abs sombra" style="left:{x}px;top:{y}px;width:{w + 36}px;height:{h + 36}px;border-radius:64px;background:#101412;transform:rotate({rot}deg)">
    <div class="abs" style="left:18px;top:18px;width:{w}px;height:{h}px;border-radius:48px;overflow:hidden">{tela}
      <div class="abs" style="left:{w / 2 - 70}px;top:16px;width:140px;height:34px;border-radius:17px;background:#101412"></div></div></div>"""
secoes.append(f"""<section id="mockup-04-redes-sociais" class="grao" style="background: radial-gradient(circle at 50% 40%, {CR}, #D9D2C1)">
  <div class="abs" style="left:-120px;top:-200px;width:700px;opacity:.5">{graf('diagonal').replace(C, '#E4DECF')}</div>
  {celular(380, 120, 520, 1040, '<div class="abs" style="left:0;top:0;width:520px;height:150px;background:#fff"><div class="abs" style="left:24px;top:84px;width:44px;height:44px;border-radius:50%;background:' + V + '"></div><div class="abs" style="left:80px;top:92px;font:700 24px/1 IS">seven.publicidade</div></div><div class="abs" style="left:0;top:150px;width:520px;height:650px">' + post.replace('inset:0', 'left:0;top:0;width:520px;height:650px') + '</div><div class="abs" style="left:0;top:800px;width:520px;height:240px;background:#fff"></div>', -6)}
  {celular(1000, 120, 520, 1040, story, 5)}
</section>""")

# 5. embalagem: sacola e caixa
secoes.append(f"""<section id="mockup-05-embalagem" class="grao" style="background: linear-gradient(180deg, #E7E2D5 0%, #D6CFBE 62%, #C8C0AD 62%, #BDB49F 100%)">
  <div class="abs" style="left:420px;top:140px;width:520px;height:300px;border:26px solid {P};border-bottom:none;border-radius:260px 260px 0 0"></div>
  <div class="abs sombra luz" style="left:300px;top:300px;width:760px;height:880px;background:{V};clip-path:polygon(0 0,100% 0,96% 100%,4% 100%);overflow:hidden">
    <div class="abs" style="left:-80px;top:-40px;width:360px;opacity:.12">{graf('diagonal')}</div>
    <div class="abs" style="right:-80px;bottom:-60px;width:360px;opacity:.12">{graf('diagonal')}</div>
    <div class="abs" style="left:250px;top:300px;width:260px">{logo('simbolo','branco')}</div>
    <div class="abs" style="left:0;width:100%;top:640px;text-align:center;font:500 26px/1 IS;color:{C};letter-spacing:.3em">COMUNICAÇÃO COM PROPÓSITO</div>
  </div>
  <div class="abs" style="left:1120px;top:560px;width:560px;height:560px;transform-style:preserve-3d;transform:perspective(2400px) rotateX(-22deg) rotateY(-32deg)">
    <div class="abs luz" style="left:0;top:0;width:560px;height:560px;background:url({data(pat_creme)}) 0 0/240px auto,{CR};transform:translateZ(280px)"><div class="abs" style="left:150px;top:220px;width:260px">{logo('horizontal','verde')}</div></div>
    <div class="abs" style="left:0;top:0;width:560px;height:560px;background:{P};transform:rotateY(90deg) translateZ(280px)"></div>
    <div class="abs" style="left:0;top:0;width:560px;height:560px;background:{V};transform:rotateX(90deg) translateZ(280px)"><div class="abs" style="left:210px;top:210px;width:140px">{logo('simbolo','verde-claro')}</div></div>
  </div>
</section>""")

# 6. uniforme: camiseta e crachá
camiseta = f"""<svg viewBox="0 0 1000 1000" style="display:block;width:100%;height:auto"><defs><linearGradient id="dobra" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>
  <path d="M330 80 Q500 150 670 80 L880 170 L960 400 L820 450 L790 360 L790 960 Q500 990 210 960 L210 360 L180 450 L40 400 L120 170 Z" fill="{V}"/>
  <path d="M330 80 Q500 150 670 80 L880 170 L960 400 L820 450 L790 360 L790 960 Q500 990 210 960 L210 360 L180 450 L40 400 L120 170 Z" fill="url(#dobra)"/>
  <path d="M370 92 Q500 170 630 92" fill="none" stroke="{P}" stroke-width="22"/></svg>"""
secoes.append(f"""<section id="mockup-06-uniforme" class="grao" style="background: radial-gradient(circle at 40% 30%, {C}, #B9CCC1 80%)">
  <div class="abs" style="left:240px;top:110px;width:1000px;filter:drop-shadow(0 40px 50px rgba(0,0,0,.3))">{camiseta}
    <div class="abs" style="left:575px;top:300px;width:120px">{logo('simbolo','branco')}</div></div>
  <div class="abs sombra luz" style="left:1300px;top:300px;width:380px;height:600px;border-radius:26px;background:{CR};transform:rotate(6deg);overflow:hidden">
    <div class="abs" style="left:0;top:0;width:380px;height:200px;background:{V}"></div>
    <div class="abs" style="left:150px;top:-40px;width:80px;height:70px;border-radius:12px;background:#ccc"></div>
    <div class="abs" style="left:60px;top:66px;width:260px">{logo('horizontal','branco')}</div>
    <div class="abs" style="left:110px;top:250px;width:160px;height:160px;border-radius:50%;background:#D5DDD8"></div>
    <div class="abs txt" style="left:0;width:100%;top:440px;text-align:center;font:700 38px/1 IS">Seu Nome</div>
    <div class="abs" style="left:0;width:100%;top:494px;text-align:center;font:600 20px/1 IS;color:{V};letter-spacing:.2em">EQUIPE SEVEN</div>
  </div>
</section>""")

open('ferramentas/mockups.html', 'w').write(f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>{CSS}</style></head><body>' + '\n'.join(secoes) + '</body></html>')
print('mockups.html', len(secoes), 'cenas')
