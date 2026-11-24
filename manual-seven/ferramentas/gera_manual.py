#!/usr/bin/env python3
"""Gera ferramentas/manual.html (páginas 1920 x 1080) do Manual da Marca SEVEN.
Depois: node ferramentas/render_html.js ferramentas/manual.html manual/paginas manual/Seven-Manual-da-Marca.pdf"""
import base64, math, re

V, P, C, CR, B = '#07583F', '#043D2D', '#DCEBE3', '#F3EFE3', '#FFFFFF'
K = 1 / math.tan(math.radians(60.5))

def svgf(caminho, extra=''):
    s = open(caminho).read()
    return s.replace('<svg ', f'<svg style="display:block;width:100%;height:auto{extra}" ', 1)
def logo(nome, cor): return svgf(f'logo/svg/seven-{nome}-{cor}.svg')
def graf(nome, cor=None):
    s = svgf(f'grafismos/svg/seven-grafismo-{nome}.svg')
    return s.replace(C, cor) if cor else s
def data(caminho, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(caminho, 'rb').read()).decode()
def foto(nome): return data(f'../video-seven/proj/media/{nome}.jpg', 'image/jpeg')
def pat(nome): return data(f'pattern/svg/{nome}.svg', 'image/svg+xml')

def cmyk(h):
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    k = 1 - max(r, g, b)
    if k >= 1: return (0, 0, 0, 100)
    return tuple(round(x * 100) for x in ((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k))
def rgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

CSS = f"""
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-Regular.ttf); font-weight: 400; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-Medium.ttf); font-weight: 500; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-SemiBold.ttf); font-weight: 600; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-Bold.ttf); font-weight: 700; }}
@font-face {{ font-family: 'IS'; src: url(../fontes/InstrumentSans-RegularItalic.ttf); font-weight: 400; font-style: italic; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
@page {{ size: 1920px 1080px; margin: 0; }}
body {{ background: #333; font-family: 'IS', sans-serif; color: {P}; }}
section {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; background: {CR}; page-break-after: always; break-after: page; margin-bottom: 0; }}
.abs {{ position: absolute; }}
.verde {{ background: {V}; color: #fff; }} .profundo {{ background: {P}; color: #fff; }} .branco {{ background: #fff; }}
.cap {{ position: absolute; left: 120px; top: 100px; font: 600 22px/1 IS; letter-spacing: .32em; text-transform: uppercase; color: {V}; }}
.verde .cap, .profundo .cap {{ color: {C}; }}
.tit {{ position: absolute; left: 120px; top: 150px; font: 700 76px/1.04 IS; letter-spacing: -.015em; }}
.txt {{ font: 400 27px/1.5 IS; }}
.pe {{ position: absolute; left: 120px; bottom: 56px; right: 120px; display: flex; justify-content: space-between; font: 500 18px/1 IS; letter-spacing: .2em; text-transform: uppercase; opacity: .55; }}
.rot {{ font: 600 18px/1 IS; letter-spacing: .22em; text-transform: uppercase; color: {V}; }}
.verde .rot, .profundo .rot {{ color: {C}; }}
.cartao {{ position: absolute; border-radius: 28px; overflow: hidden; }}
.x {{ position: absolute; right: 18px; top: 18px; width: 54px; height: 54px; border-radius: 50%; background: #C8102E; color: #fff; font: 700 34px/54px IS; text-align: center; }}
.ok {{ background: {V}; }}
"""

pags = []
n = [0]
def pagina(cls, corpo, secao=''):
    n[0] += 1
    pe = '' if n[0] == 1 else f'<div class="pe"><span>Seven · Manual da Marca</span><span>{secao}</span><span>{n[0]:02d}</span></div>'
    pags.append(f'<section id="pagina-{n[0]:02d}" class="{cls}">{corpo}{pe}</section>')

def diag(x, y, w, op, cor=C):
    return f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;opacity:{op}">{graf("diagonal", cor)}</div>'

# 01 capa
pagina('verde', f"""{diag(-160, -120, 620, .1)}{diag(1500, 560, 620, .1)}
 <div class="abs" style="left:1450px;top:120px;width:360px;height:130px;border-radius:65px;background:{C}"></div>
 <div class="abs" style="left:120px;top:330px;width:900px">{logo('horizontal', 'branco')}</div>
 <div class="abs" style="left:120px;top:690px;font:700 96px/1 IS;letter-spacing:-.02em">Manual da Marca</div>
 <div class="abs" style="left:120px;top:810px;font:500 30px/1 IS;color:{C};letter-spacing:.3em">IDENTIDADE VISUAL · 2026</div>""")

# 02 sumário
itens = [('01', 'Essência', 'Propósito, manifesto e o símbolo'), ('02', 'Logotipo', 'Versões, construção, proteção e redução'), ('03', 'Cores', 'Paleta oficial e proporção de uso'),
         ('04', 'Tipografia', 'Instrument Sans e hierarquia'), ('05', 'Grafismos e pattern', 'A diagonal do 7, a pílula e os padrões'), ('06', 'Imagem e voz', 'Fotografia e tom de comunicação'), ('07', 'Aplicações', 'Papelaria, fachada, digital, embalagem e uniforme')]
lista = ''.join(f'<div style="display:flex;gap:40px;align-items:baseline;padding:22px 0;border-bottom:2px solid rgba(4,61,45,.12)"><span style="font:700 34px/1 IS;color:{V};width:70px">{a}</span><span style="font:700 40px/1 IS;width:560px">{b}</span><span class="txt" style="opacity:.75">{c}</span></div>' for a, b, c in itens)
pagina('', f'<div class="cap">Sumário</div><div class="tit">O que está neste manual</div><div class="abs" style="left:120px;top:330px;width:1500px">{lista}</div>{diag(1640, -80, 380, .5, "#E2DCCB")}', 'Sumário')

# 03 essência
pagina('verde', f"""<div class="cap">01 · Essência</div><div class="tit" style="color:#fff">Transformamos ideias<br>em soluções.</div>
 <div class="abs txt" style="left:120px;top:440px;width:760px;color:{C}">A Seven é uma empresa capixaba de comunicação. Unimos gráfica, comunicação visual e publicidade criativa para ajudar negócios a crescer com materiais que comunicam melhor e geram valor.</div>
 <div class="abs" style="left:120px;top:700px;display:flex;gap:28px">
  {''.join(f'<div style="width:400px;padding:34px;border-radius:28px;background:rgba(220,235,227,.10)"><div style="font:700 34px/1.1 IS;color:#fff">{t}</div><div class="txt" style="font-size:22px;color:{C};margin-top:12px">{d}</div></div>' for t, d in [('Criatividade', 'Um presente que recebemos e colocamos a serviço de quem confia em nós.'), ('Esperança', 'O verde é crescimento, renovação e novos começos.'), ('Propósito', 'Mais do que produzir materiais, queremos gerar valor.')])}
 </div>
 <div class="abs" style="left:1060px;top:160px;width:740px;height:520px;border-radius:30px;overflow:hidden;background:url({foto('lampada')}) center/cover"></div>""", 'Essência')

# 04 manifesto
pagina('', f"""<div class="cap">01 · Manifesto</div>
 <div class="abs" style="left:120px;top:200px;width:1000px;font:700 66px/1.12 IS;letter-spacing:-.015em">Criados pelo Criador para criar.</div>
 <div class="abs txt" style="left:120px;top:400px;width:900px">Acreditamos que a criatividade é um presente. Nossa capacidade de imaginar, desenvolver e transformar ideias é parte daquilo que recebemos.<br><br>Não mudamos apenas a nossa aparência: evoluímos a maneira de expressar quem somos. Uma nova identidade, a mesma essência.</div>
 <div class="abs" style="left:120px;top:800px;font:700 40px/1.2 IS;color:{V}">Esperança é a nossa cor.</div>
 <div class="abs" style="left:1240px;top:0;width:680px;height:1080px;background:url({foto('broto')}) center/cover"></div>""", 'Essência')

# 05 o símbolo
pagina('profundo', f"""<div class="cap">01 · O símbolo</div><div class="tit" style="color:#fff">Sete. Uma identidade.<br>Um propósito.</div>
 <div class="abs txt" style="left:120px;top:420px;width:760px;color:{C}">O número sete carrega uma referência simbólica à criação e à plenitude. Nosso símbolo representa a inspiração que dá origem à nossa criatividade.<br><br>A diagonal do 7 tem <b style="color:#fff">60,5°</b>. Esse ângulo é a assinatura geométrica da marca: todos os grafismos, recortes e transições seguem a mesma inclinação.</div>
 <div class="abs" style="left:1080px;top:200px;width:640px">{logo('simbolo', 'branco')}</div>""", 'Essência')

# 06 logotipo principal
pagina('verde', f"""<div class="cap">02 · Logotipo</div>{diag(-160, 560, 520, .08)}{diag(1580, -120, 520, .08)}
 <div class="abs" style="left:360px;top:330px;width:1200px">{logo('horizontal', 'branco')}</div>
 <div class="abs txt" style="left:0;width:1920px;top:800px;text-align:center;color:{C}">Versão principal: símbolo, nome e assinatura “Comunicação com propósito”.</div>""", 'Logotipo')

# 07 versões
cel = lambda lbl, conteudo, txt, w: f'<div style="flex:1;background:#fff;border-radius:28px;padding:50px;display:flex;flex-direction:column;justify-content:space-between;height:640px"><div class="rot">{lbl}</div><div style="width:{w}px;margin:0 auto">{conteudo}</div><div class="txt" style="font-size:22px">{txt}</div></div>'
pagina('', f"""<div class="cap">02 · Versões</div><div class="tit">Três versões, um só desenho</div>
 <div class="abs" style="left:120px;top:300px;right:120px;display:flex;gap:30px">
  {cel('Horizontal (principal)', logo('horizontal', 'verde'), 'Uso preferencial: fachadas, papelaria, assinaturas e peças com espaço horizontal.', 460)}
  {cel('Vertical', logo('vertical', 'verde'), 'Para formatos quadrados ou estreitos: brindes, crachás, embalagens.', 300)}
  {cel('Símbolo', logo('simbolo', 'verde'), 'Quando a marca já está presente: avatar, favicon, selo, detalhes e padrões.', 220)}
 </div>""", 'Logotipo')

# 08 construção
# bordas da haste medidas na logo: x = -0,563·y + b (unidades do viewBox do símbolo); escala 640/855, origem (60, 60) no quadro
_s = 640 / 855
def _bx(yb, b0):
    yv = (yb - 60) / _s + 27
    return 60 + (-0.563 * yv + b0 - 28) * _s
linhas = ''.join(f'<line x1="{_bx(0, b0):.1f}" y1="0" x2="{_bx(840, b0):.1f}" y2="840" stroke="{C}" stroke-width="2" stroke-dasharray="10 10" opacity=".8"/>' for b0 in (675.6, 956.4))
_X, _Y = _bx(720, 956.4), 720
_ax, _ay = _X + 110 * math.cos(math.radians(60.5)), _Y - 110 * math.sin(math.radians(60.5))
linhas += f'<line x1="{_X - 40:.1f}" y1="{_Y}" x2="{_X + 200:.1f}" y2="{_Y}" stroke="#fff" stroke-width="2"/><path d="M {_X + 110:.1f} {_Y} A 110 110 0 0 0 {_ax:.1f} {_ay:.1f}" fill="none" stroke="#fff" stroke-width="3"/><text x="{_X + 130:.1f}" y="{_Y - 40}" fill="#fff" font-family="IS" font-weight="700" font-size="32">60,5°</text>'
pagina('profundo', f"""<div class="cap">02 · Construção</div><div class="tit" style="color:#fff">A diagonal de 60,5°</div>
 <div class="abs txt" style="left:120px;top:330px;width:640px;color:{C}">A haste do 7 define o ângulo de toda a identidade. O triângulo interno repete a mesma direção e cria o recorte que dá movimento ao símbolo.<br><br>O logotipo é um desenho fixo: use sempre os arquivos oficiais deste kit, nunca redesenhe ou digite o nome.</div>
 <div class="abs" style="left:1000px;top:120px;width:760px;height:840px">
  <div class="abs" style="left:60px;top:60px;width:640px">{logo('simbolo', 'verde-claro')}</div>
  <svg class="abs" style="left:0;top:0" width="760" height="840" viewBox="0 0 760 840">{linhas}
   {''.join(f'<line x1="0" y1="{y}" x2="760" y2="{y}" stroke="{C}" stroke-width="1" opacity=".18"/>' for y in range(0, 841, 60))}
   {''.join(f'<line x1="{x}" y1="0" x2="{x}" y2="840" stroke="{C}" stroke-width="1" opacity=".18"/>' for x in range(0, 761, 60))}
</svg>
 </div>""", 'Logotipo')

# 09 área de proteção
pagina('', f"""<div class="cap">02 · Área de proteção</div><div class="tit">Espaço para respirar</div>
 <div class="abs txt" style="left:120px;top:330px;width:560px">Mantenha ao redor do logotipo uma área livre igual a <b>X</b>, a altura do triângulo do símbolo. Nenhum texto, imagem ou borda deve entrar nesse espaço.</div>
 <div class="abs" style="left:800px;top:260px;width:1000px;height:520px;background:#fff;border-radius:28px"></div>
 <div class="abs" style="left:920px;top:380px;width:760px;height:280px;outline:3px dashed #C8102E;outline-offset:0"></div>
 <div class="abs" style="left:1000px;top:462px;width:600px">{logo('horizontal', 'verde')}</div>
 {''.join(f'<div class="abs" style="{s};font:700 26px/1 IS;color:#C8102E">X</div>' for s in ('left:952px;top:500px', 'left:1630px;top:500px', 'left:1290px;top:404px', 'left:1290px;top:620px'))}""", 'Logotipo')

# 10 redução mínima
red = lambda nome, w, txt: f'<div style="display:flex;flex-direction:column;gap:26px;align-items:flex-start"><div style="width:{w}px">{logo(nome, "verde")}</div><div class="txt" style="font-size:22px">{txt}</div></div>'
pagina('', f"""<div class="cap">02 · Redução mínima</div><div class="tit">Legível em qualquer tamanho</div>
 <div class="abs" style="left:120px;top:400px;display:flex;gap:140px;align-items:flex-end">
  {red('horizontal', 300, '<b>Horizontal</b><br>Impresso: 30 mm de largura<br>Digital: 140 px')}
  {red('vertical', 150, '<b>Vertical</b><br>Impresso: 18 mm de largura<br>Digital: 90 px')}
  {red('simbolo', 70, '<b>Símbolo</b><br>Impresso: 7 mm<br>Digital: 32 px')}
 </div>
 <div class="abs txt" style="left:120px;top:820px;width:1300px;font-size:22px;opacity:.75">Abaixo da redução mínima a assinatura “Comunicação com propósito” perde leitura. Em brindes muito pequenos, use apenas o símbolo.</div>""", 'Logotipo')

# 11 versões de cor
cor_cel = lambda bg, nome, cor, lbl, txtcor=P: f'<div style="background:{bg};border-radius:28px;padding:40px;display:flex;flex-direction:column;justify-content:space-between;height:330px"><div style="width:360px">{logo(nome, cor)}</div><div class="rot" style="color:{txtcor}">{lbl}</div></div>'
pagina('', f"""<div class="cap">02 · Versões de cor</div><div class="tit">Contraste sempre</div>
 <div class="abs" style="left:120px;top:300px;right:120px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px">
  {cor_cel(V, 'horizontal', 'branco', 'Preferencial · branco sobre verde', C)}
  {cor_cel('#fff', 'horizontal', 'verde', 'Positiva · verde sobre branco')}
  {cor_cel(CR, 'horizontal', 'verde', 'Positiva · verde sobre creme')}
  {cor_cel(P, 'horizontal', 'verde-claro', 'Verde-claro sobre verde profundo', C)}
  {cor_cel('#fff', 'horizontal', 'preto', 'Monocromática · preto')}
  {cor_cel('#111', 'horizontal', 'branco', 'Monocromática · branco', '#bbb')}
 </div>""", 'Logotipo')

# 12 usos incorretos
def errado(conteudo, lbl, bg='#fff'):
    return f'<div style="position:relative;background:{bg};border-radius:28px;height:330px;display:flex;flex-direction:column;justify-content:space-between;padding:40px;overflow:hidden">{conteudo}<div class="rot" style="color:#C8102E">{lbl}</div><div class="x">×</div></div>'
pagina('', f"""<div class="cap">02 · Usos incorretos</div><div class="tit">O que não fazer</div>
 <div class="abs" style="left:120px;top:300px;right:120px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px">
  {errado(f'<div style="width:360px;transform:scaleX(1.45);transform-origin:left">{logo("horizontal", "verde")}</div>', 'Não distorça')}
  {errado(f'<div style="width:330px;transform:rotate(-14deg)">{logo("horizontal", "verde")}</div>', 'Não gire')}
  {errado(f'<div style="width:360px">{logo("horizontal", "verde").replace(V, "#E0742E")}</div>', 'Não troque as cores')}
  {errado(f'<div style="width:360px;filter:drop-shadow(8px 10px 4px rgba(0,0,0,.6))">{logo("horizontal", "verde")}</div>', 'Não aplique sombras ou efeitos')}
  {errado(f'<div style="width:360px">{logo("horizontal", "branco")}</div>', 'Não use sem contraste', '#9FC4B4')}
  {errado(f'<div style="display:flex;align-items:center;gap:16px;width:360px"><div style="width:90px">{logo("simbolo", "verde")}</div><div style="font:700 70px/1 Georgia,serif;color:{V}">Seven</div></div>', 'Não digite o nome')}
 </div>""", 'Logotipo')

# 13 cores
CORES = [('Verde Seven', V, 'Cor principal. Fundos, logotipo, destaques.', '#fff'), ('Verde Profundo', P, 'Profundidade, fundos e contraste.', '#fff'), ('Verde Claro', C, 'O único destaque: palavras-chave, pílulas, grafismos.', P), ('Creme', CR, 'Fundo claro e papelaria.', P), ('Branco', B, 'Textos sobre verde e respiro.', P)]
def ccor(nome, h, uso, tc, alt):
    c_ = cmyk(h); r_ = rgb(h)
    return f'<div style="flex:1;background:{h};color:{tc};height:{alt}px;padding:36px;display:flex;flex-direction:column;justify-content:flex-end;border-radius:28px;{"border:2px solid #E2DCCB;" if h in (B, CR) else ""}"><div style="font:700 34px/1 IS">{nome}</div><div style="font:500 22px/1.6 IS;margin-top:14px">HEX {h}<br>RGB {r_[0]} {r_[1]} {r_[2]}<br>CMYK {c_[0]} {c_[1]} {c_[2]} {c_[3]}</div><div style="font:400 19px/1.4 IS;margin-top:14px;opacity:.8">{uso}</div></div>'
pagina('', f"""<div class="cap">03 · Cores</div><div class="tit">Paleta oficial</div>
 <div class="abs" style="left:120px;top:290px;right:120px;display:flex;gap:24px;align-items:flex-end">{''.join(ccor(a, b, c, d, [600, 560, 520, 480, 480][i]) for i, (a, b, c, d) in enumerate(CORES))}</div>
 <div class="abs" style="left:120px;top:925px;font:400 19px/1 IS;opacity:.7">Valores CMYK de referência, convertidos do RGB. Para impressão, confirme com prova de cor da gráfica.</div>""", 'Cores')

# 14 proporção
barra = ''.join(f'<div style="flex:{p};background:{h};height:200px;display:flex;align-items:flex-end;padding:24px;font:700 28px/1 IS;color:{tc};{"border:2px solid #E2DCCB;" if h in (B,) else ""}">{p}%</div>' for p, h, tc in [(55, V, '#fff'), (20, P, '#fff'), (10, C, P), (10, CR, P), (5, B, P)])
pagina('', f"""<div class="cap">03 · Proporção de uso</div><div class="tit">O verde conduz</div>
 <div class="abs" style="left:120px;top:330px;right:120px;display:flex;border-radius:28px;overflow:hidden">{barra}</div>
 <div class="abs txt" style="left:120px;top:600px;width:1500px">O Verde Seven ocupa a maior parte das peças. O Verde Profundo cria profundidade. O Verde Claro é usado com economia: só para o que precisa chamar atenção. Não use gradientes entre as cores nem cores fora da paleta em elementos de marca.</div>""", 'Cores')

# 15 tipografia
pesos = ''.join(f'<div style="font:{w} 44px/1.3 IS">{nome} — Comunicação com propósito</div>' for w, nome in [(400, 'Regular'), (500, 'Medium'), (600, 'SemiBold'), (700, 'Bold')])
pagina('verde', f"""<div class="cap">04 · Tipografia</div>
 <div class="abs" style="left:120px;top:150px;font:700 300px/1 IS;letter-spacing:-.04em">Aa</div>
 <div class="abs" style="left:120px;top:480px;font:700 64px/1 IS">Instrument Sans</div>
 <div class="abs txt" style="left:120px;top:570px;width:700px;color:{C}">Fonte da marca para títulos, textos e peças. Gratuita (Google Fonts, licença OFL), incluída na pasta “fontes” deste kit.</div>
 <div class="abs" style="left:120px;top:790px;font:500 30px/1.5 IS;color:{C};letter-spacing:.06em">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789 ?!@#$%&amp;</div>
 <div class="abs" style="left:1000px;top:200px">{pesos}</div>""", 'Tipografia')

# 16 hierarquia
pagina('', f"""<div class="cap">04 · Hierarquia</div><div class="tit">Como compor os textos</div>
 <div class="abs" style="left:120px;top:320px;width:900px">
  <div class="rot" style="margin-bottom:18px">Rótulo · SemiBold, caixa-alta, espaçado</div>
  <div style="font:700 72px/1.05 IS;letter-spacing:-.015em">Ideias que ganham forma.</div>
  <div style="font:500 34px/1.3 IS;color:{V};margin-top:22px">Subtítulo em Medium, frase curta e direta.</div>
  <div class="txt" style="margin-top:24px;width:760px">Texto corrido em Regular, entrelinha de 1,5. Frases curtas, alinhamento à esquerda e sempre com bom contraste com o fundo.</div>
 </div>
 <div class="abs" style="left:1140px;top:320px;width:660px;font:400 24px/1.9 IS">
  <div><b>Títulos</b> · Bold · 1,0–1,1 de entrelinha</div><div><b>Subtítulos</b> · Medium</div><div><b>Texto</b> · Regular · 1,5 de entrelinha</div><div><b>Rótulos</b> · SemiBold · caixa-alta · espaçamento 0,2–0,3 em</div><div><b>Destaque</b> · Verde Claro sobre verde, ou Verde Seven sobre claro</div>
 </div>""", 'Tipografia')

# 17 grafismos
gcel = lambda nome, lbl, txt, w: f'<div style="flex:1;background:{V};border-radius:28px;padding:40px;height:560px;display:flex;flex-direction:column;justify-content:space-between;color:#fff"><div class="rot" style="color:{C}">{lbl}</div><div style="width:{w}px;margin:0 auto">{graf(nome)}</div><div style="font:400 21px/1.45 IS;color:{C}">{txt}</div></div>'
pagina('', f"""<div class="cap">05 · Grafismos</div><div class="tit">Formas que nascem do 7</div>
 <div class="abs" style="left:120px;top:300px;right:120px;display:flex;gap:24px">
  {gcel('diagonal', 'Diagonal', 'Paralelogramo na inclinação de 60,5°, cantos arredondados. Em fundos, com 8–15% de opacidade.', 180)}
  {gcel('diagonal-dupla', 'Diagonal dupla', 'Ritmo e movimento: duas diagonais, a segunda mais transparente.', 260)}
  {gcel('pilula', 'Pílula', 'Botões, selos e destaques em Verde Claro.', 260)}
  {gcel('triangulo', 'Triângulo', 'O recorte do símbolo, para marcadores e detalhes.', 160)}
  {gcel('fio-diagonal', 'Fio de luz', 'Linha fina na diagonal: divisões e transições.', 120)}
 </div>""", 'Grafismos')

# 18 pattern
pcel = lambda arq, lbl, bgsize: f'<div style="flex:1"><div style="height:560px;border-radius:28px;background:url({pat(arq)}) 0 0/{bgsize}"></div><div class="rot" style="margin-top:20px">{lbl}</div></div>'
pagina('', f"""<div class="cap">05 · Pattern</div><div class="tit">Padrões da marca</div>
 <div class="abs" style="left:120px;top:300px;right:120px;display:flex;gap:24px">
  {pcel('seven-pattern-simbolo-verde', 'Pattern símbolo · verde', '300px auto')}
  {pcel('seven-pattern-simbolo-creme', 'Pattern símbolo · creme', '300px auto')}
  {pcel('seven-pattern-diagonal-verde-profundo', 'Pattern diagonal · profundo', '260px auto')}
  {pcel('seven-fundo-composicao-verde', 'Fundo de composição', 'cover')}
 </div>
 <div class="abs" style="left:120px;top:940px;font:400 21px/1 IS;opacity:.7">Use os padrões em fundos, embalagens, papel de seda, versos e brindes. Os módulos repetem sem emenda (arquivos na pasta “pattern”).</div>""", 'Grafismos')

# 19 imagem
pagina('', f"""<div class="cap">06 · Imagem</div><div class="tit">Fotografia<br>com propósito</div>
 <div class="abs txt" style="left:120px;top:420px;width:620px">Imagens de crescimento, luz natural e pessoas reais. Tons quentes e verdes, profundidade de campo rasa, poucos elementos. Fotos de produto em fundos limpos, com a marca aplicada no material.<br><br>Evite bancos de imagem genéricos, filtros fortes e cenários poluídos.</div>
 <div class="abs" style="left:820px;top:150px;width:340px;height:760px;border-radius:28px;background:url({foto('broto')}) center/cover"></div>
 <div class="abs" style="left:1190px;top:150px;width:300px;height:370px;border-radius:28px;background:url({foto('lampada')}) center/cover"></div>
 <div class="abs" style="left:1190px;top:540px;width:300px;height:370px;border-radius:28px;background:url({foto('cartaz')}) center/cover"></div>
 <div class="abs" style="left:1520px;top:150px;width:280px;height:760px;border-radius:28px;background:url({foto('monitor')}) center/cover"></div>""", 'Imagem e voz')

# 20 tom de voz
voz = [('Próxima', 'Falamos como gente, com clareza.', '“Chama a gente no WhatsApp.”'), ('Confiante', 'Mostramos o resultado, sem exagero.', '“Pronto em até 7 dias úteis.”'), ('Inspiradora', 'Lembramos o porquê de cada projeto.', '“Ideias que ganham forma.”'), ('Capixaba', 'Temos orgulho de onde estamos.', '“Empresa 100% capixaba.”')]
pagina('verde', f"""<div class="cap">06 · Tom de voz</div><div class="tit" style="color:#fff">Como a Seven fala</div>
 <div class="abs" style="left:120px;top:320px;right:120px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
  {''.join(f'<div style="background:rgba(220,235,227,.10);border-radius:28px;padding:40px"><div style="font:700 40px/1 IS">{a}</div><div style="font:400 24px/1.4 IS;color:{C};margin-top:14px">{b}</div><div style="font:italic 400 26px/1.4 IS;color:#fff;margin-top:16px">{c}</div></div>' for a, b, c in voz)}
 </div>""", 'Imagem e voz')

# 21 aplicações (grade)
MK = [('mockup-01-cartoes', 'Cartões de visita'), ('mockup-02-papelaria', 'Papelaria'), ('mockup-03-fachada', 'Fachada em ACM'), ('mockup-04-redes-sociais', 'Redes sociais'), ('mockup-05-embalagem', 'Embalagem'), ('mockup-06-uniforme', 'Uniforme e crachá')]
mk = lambda arq: data(f'mockups/{arq}.png', 'image/png')
pagina('', f"""<div class="cap">07 · Aplicações</div><div class="tit">A marca no mundo</div>
 <div class="abs" style="left:120px;top:290px;right:120px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
  {''.join(f'<div><div style="height:300px;border-radius:22px;background:url({mk(a)}) center/cover"></div><div class="rot" style="margin-top:14px">{b}</div></div>' for a, b in MK)}
 </div>""", 'Aplicações')

# 22–27 aplicações em página cheia
for a, b in MK:
    pagina('', f'<div class="abs" style="inset:0;background:url({mk(a)}) center/cover"></div><div class="abs" style="left:80px;top:70px;padding:16px 30px 18px;border-radius:999px;background:rgba(243,239,227,.92);font:600 22px/1 IS;letter-spacing:.2em;text-transform:uppercase;color:{P}">{b}</div>', 'Aplicações')
    pags[-1] = pags[-1].replace('<div class="pe">', '<div class="pe" style="color:#fff;opacity:.8;text-shadow:0 2px 8px rgba(0,0,0,.5)">')

# 28 kit
arvore = """logo/        svg e png · horizontal, vertical e símbolo · 5 cores
grafismos/   svg e png · diagonal, diagonal dupla, pílula, triângulo, fio, moldura
pattern/     svg e png · pattern símbolo, pattern diagonal e fundo de composição (3 cores)
fontes/      Instrument Sans · Regular, Medium, SemiBold, Bold e itálicos
mockups/     png 1920 x 1280 · seis aplicações
manual/      este manual em PDF e as páginas em PNG"""
pagina('profundo', f"""<div class="cap">Arquivos</div><div class="tit" style="color:#fff">O que vem no kit</div>
 <pre class="abs" style="left:120px;top:330px;font:500 28px/1.9 IS;color:{C};white-space:pre">{arvore}</pre>
 <div class="abs" style="left:1380px;top:700px;width:420px">{logo('horizontal', 'branco')}</div>""", 'Arquivos')

# 29 contracapa
pagina('verde', f"""{diag(-160, 520, 620, .1)}{diag(1500, -120, 620, .1)}
 <div class="abs" style="left:810px;top:330px;width:300px">{logo('simbolo', 'branco')}</div>
 <div class="abs" style="left:0;width:1920px;top:690px;text-align:center;font:500 30px/1 IS;letter-spacing:.32em;color:{C}">COMUNICAÇÃO COM PROPÓSITO</div>
 <div class="abs" style="left:0;width:1920px;top:760px;text-align:center;font:500 24px/1 IS;color:{C};opacity:.8">@seven.publicidade</div>""")

open('ferramentas/manual.html', 'w').write(f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Seven · Manual da Marca</title><style>{CSS}</style></head><body>' + '\n'.join(pags) + '</body></html>')
print('manual.html', len(pags), 'páginas')
