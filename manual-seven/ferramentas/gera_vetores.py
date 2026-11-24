#!/usr/bin/env python3
"""Gera os vetores oficiais da marca SEVEN a partir da logo original vetorizada (ferramentas/logo.json).
Nada é redesenhado: as versões só reposicionam as partes originais (símbolo, letras e assinatura).
Saída: logo/svg, grafismos/svg, pattern/svg.   uso (da pasta manual-seven): python3 ferramentas/gera_vetores.py"""
import json, math, os

L = json.load(open('ferramentas/logo.json'))
COR = {'verde': '#07583F', 'profundo': '#043D2D', 'claro': '#DCEBE3', 'creme': '#F3EFE3', 'branco': '#FFFFFF', 'preto': '#111111'}
K = 1 / math.tan(math.radians(60.5))  # deslocamento horizontal por unidade de altura (diagonal do 7)

def svg(vb, corpo, extra=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{extra}>\n{corpo}\n</svg>\n'

def paths(partes, cor, dx=0, dy=0, s=1):
    g = ''.join(f'<path fill-rule="evenodd" d="{p["d"]}"/>' for p in partes)
    return f'<g fill="{cor}" transform="translate({dx:.2f} {dy:.2f}) scale({s})">{g}</g>'

lk = L['lockup']
simbolo_lk = [lk['corpo'], lk['triangulo']]
palavra = lk['letras'] + lk['assinatura']
sb = L['simbolo']

def horizontal(cor):
    return svg('17 17 1153 279', paths(simbolo_lk + palavra, cor))

def vertical(cor):
    # símbolo centralizado sobre a palavra; a palavra (letras + assinatura) desce
    cx_pal = 358.5 + 811.3 / 2
    cx_sim = 17.8 + 306 / 2
    dx = cx_pal - cx_sim
    dy_pal = 293 + 70 - 75
    corpo = paths(simbolo_lk, cor, dx, 0) + paths(palavra, cor, 0, dy_pal)
    return svg(f'350 12 830 {295 + dy_pal - 12 + 10}', corpo)

def simbolo(cor):
    return svg('28 27 855 770', paths([sb['corpo'], sb['triangulo']], cor))

def para(cx, cy, w, h, r):
    """paralelogramo com cantos arredondados, inclinado na diagonal do 7 (60,5°)."""
    d = h * K / 2
    P = [(cx - w / 2 + d, cy - h / 2), (cx + w / 2 + d, cy - h / 2), (cx + w / 2 - d, cy + h / 2), (cx - w / 2 - d, cy + h / 2)]
    out = ''
    for i in range(4):
        a, b, c = P[i - 1], P[i], P[(i + 1) % 4]
        def em(p, q, t):  # ponto a distância t de p em direção a q
            L_ = math.hypot(q[0] - p[0], q[1] - p[1]); return (p[0] + (q[0] - p[0]) * t / L_, p[1] + (q[1] - p[1]) * t / L_)
        p1, p2 = em(b, a, r), em(b, c, r)
        out += ('M' if i == 0 else 'L') + f'{p1[0]:.1f},{p1[1]:.1f} Q{b[0]:.1f},{b[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} '
    return out + 'Z'

def pilula(x, y, w, h):
    r = h / 2
    return f'M{x + r},{y} H{x + w - r} A{r},{r} 0 0 1 {x + w - r},{y + h} H{x + r} A{r},{r} 0 0 1 {x + r},{y} Z'

os.makedirs('logo/svg', exist_ok=True)
for nome, cor in [('verde', COR['verde']), ('branco', COR['branco']), ('preto', COR['preto']), ('verde-claro', COR['claro']), ('verde-profundo', COR['profundo'])]:
    open(f'logo/svg/seven-horizontal-{nome}.svg', 'w').write(horizontal(cor))
    open(f'logo/svg/seven-vertical-{nome}.svg', 'w').write(vertical(cor))
    open(f'logo/svg/seven-simbolo-{nome}.svg', 'w').write(simbolo(cor))

os.makedirs('grafismos/svg', exist_ok=True)
G = {
    'diagonal': ('-40 0 600 600', f'<path fill="{COR["claro"]}" d="{para(260, 300, 260, 560, 46)}"/>'),
    'diagonal-dupla': ('-40 0 860 600', f'<path fill="{COR["claro"]}" d="{para(260, 300, 240, 560, 44)}"/><path fill="{COR["claro"]}" opacity="0.45" d="{para(520, 300, 240, 560, 44)}"/>'),
    'pilula': ('0 0 640 200', f'<path fill="{COR["claro"]}" d="{pilula(10, 10, 620, 180)}"/>'),
    'triangulo': ('95 310 290 258', f'<path fill="{COR["claro"]}" fill-rule="evenodd" d="{sb["triangulo"]["d"]}"/>'),
    'fio-diagonal': ('0 0 400 700', f'<line x1="{200 + 340 * K:.1f}" y1="10" x2="{200 - 340 * K:.1f}" y2="690" stroke="{COR["claro"]}" stroke-width="8" stroke-linecap="round"/>'),
    'moldura-diagonal': ('-50 -10 620 620', f'<path fill="none" stroke="{COR["claro"]}" stroke-width="10" d="{para(260, 300, 260, 560, 46)}"/>'),
}
for nome, (vb, corpo) in G.items():
    open(f'grafismos/svg/seven-grafismo-{nome}.svg', 'w').write(svg(vb, corpo))

os.makedirs('pattern/svg', exist_ok=True)
def pattern_simbolo(fundo, frente, op):
    # módulo 480 x 480: símbolos de 120 px em grade alternada, todos na mesma inclinação da marca
    s = 120 / 855
    corpo = f'<rect width="480" height="480" fill="{fundo}"/>'
    for (x, y) in [(60, 60), (300, 60), (180, 300), (420, 300), (-60, 300)]:
        corpo += f'<g opacity="{op}">' + paths([sb['corpo'], sb['triangulo']], frente, x - 28 * s, y - 27 * s, s) + '</g>'
    return svg('0 0 480 480', corpo)

def pattern_diagonal(fundo, frente, op):
    # módulo 400 x 353,5: faixas paralelas na diagonal do 7 (repetem sem emenda na horizontal)
    # altura do módulo escolhida para a inclinação andar exatamente um passo (200): repete sem emenda nos dois sentidos
    H = 200 / K
    corpo = f'<rect width="400" height="{H:.3f}" fill="{fundo}"/><g fill="{frente}" opacity="{op}">'
    for cx in [-200, 0, 200, 400, 600]:
        corpo += f'<path d="{para(cx, H / 2, 90, H, 0)}"/>'
    corpo += '</g>'
    return svg(f'0 0 400 {H:.3f}', corpo)

def pattern_composicao(fundo, frente):
    # composição livre para fundos de peças: diagonais grandes e pílula, como nas peças da marca
    corpo = f'<rect width="1080" height="1350" fill="{fundo}"/>'
    corpo += f'<path fill="{frente}" opacity="0.10" d="{para(150, 180, 330, 900, 60)}"/>'
    corpo += f'<path fill="{frente}" opacity="0.10" d="{para(980, 1150, 330, 900, 60)}"/>'
    corpo += f'<path fill="{frente}" opacity="0.22" d="{para(860, 1240, 220, 420, 50)}"/>'
    corpo += f'<path fill="{frente}" opacity="0.85" d="{pilula(820, 90, 360, 150)}"/>'
    return svg('0 0 1080 1350', corpo)

CW = [('verde', COR['verde'], COR['claro'], 0.12), ('verde-profundo', COR['profundo'], COR['verde'], 0.9), ('creme', COR['creme'], COR['verde'], 0.14)]
for nome, fundo, frente, op in CW:
    open(f'pattern/svg/seven-pattern-simbolo-{nome}.svg', 'w').write(pattern_simbolo(fundo, frente, op))
    open(f'pattern/svg/seven-pattern-diagonal-{nome}.svg', 'w').write(pattern_diagonal(fundo, frente, op * 0.8 if op > 0.5 else op))
    open(f'pattern/svg/seven-fundo-composicao-{nome}.svg', 'w').write(pattern_composicao(fundo, frente if nome != 'verde-profundo' else COR['claro']))
print('vetores gerados')
