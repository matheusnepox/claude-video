#!/usr/bin/env python3
"""Trilha chiptune do Reels SEVEN (estilo jogo de 8 bits), 100 % sintetizada aqui: onda quadrada, triângulo e ruído.
Ré maior, 132 BPM. Tema de título, fase escura, tema principal com pulos e moedas, LEVEL UP, amanhecer calmo
e tema final na revelação da logo. Bips de diálogo a cada letra digitada.
Os marcos copiam js/roteiro.js. Saída: assets/trilha.wav (48 kHz, estéreo).  uso: python3 trilha.py"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR, DUR = 48000, 40.0
N = int(SR * DUR)
B = 60 / 132          # batida
E = B / 2             # colcheia
rng = np.random.default_rng(3)

# ---- marcos (iguais a js/roteiro.js) ----
TROCAS = [4.6, 10.3, 20.2, 27.2, 33.2]
FALAS = [
    (0.8, 4.35, 'Toda empresa começa com uma ideia.'),
    (5.0, 10.05, 'Mas uma ideia só ganha força quando as pessoas conseguem ver.'),
    (10.6, 19.95, 'Na Seven, a gente transforma ideias em cartões, panfletos, adesivos, banners, fachadas e identidade visual.'),
    (20.5, 26.95, 'Cada material é pensado pra comunicar o melhor da sua marca e ajudar o seu negócio a crescer.'),
    (27.5, 32.95, 'Porque a gente acredita que fomos criados pelo Criador... pra criar.'),
    (33.6, 36.2, 'Seven. Comunicação com propósito.'),
    (36.4, 40.5, 'Chama a gente no direct e tira a sua ideia do papel.'),
]
CPS = 30
START, LUZ = 4.0, 8.5
BATIDAS = [11.6, 12.95, 14.3, 15.65, 17.0, 18.35]
OBRA, LEVELUP = 20.8, 25.4
BLOCOS, NITIDEZ = 33.5, [35.3, 35.55, 35.8]

mix = np.zeros((2, N))


def add(sig, t, g=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    a = (pan + 1) * np.pi / 4
    mix[0, i:i + len(sig)] += sig * g * np.cos(a)
    mix[1, i:i + len(sig)] += sig * g * np.sin(a)


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def tt(d):
    return np.arange(max(1, int(d * SR))) / SR


def env(n, a=0.003, r=0.03, sus=1.0):
    t = np.arange(n) / SR
    e = np.minimum(t / a, 1.0) * sus
    tail = np.clip((t[-1] - t) / r, 0, 1)
    return e * tail


def quadrada(n, d, duty=0.5, vol=0.25, decai=None):
    t = tt(d)
    ph = (hz(n) * t) % 1.0
    s = np.where(ph < duty, 1.0, -1.0)
    e = env(len(t))
    if decai:
        e = e * np.exp(-t / decai)
    return s * e * vol


def triangulo(n, d, vol=0.35):
    t = tt(d)
    ph = (hz(n) * t) % 1.0
    s = 4 * np.abs(ph - 0.5) - 1
    # degraus de 4 bits, como nos chips antigos
    s = np.round(s * 7.5) / 7.5
    return s * env(len(t), 0.002, 0.02) * vol


def ruido(d, decai=0.05, vol=0.3, curto=False):
    n = int(d * SR)
    passo = 93 if curto else 1
    x = np.repeat(rng.choice([-1.0, 1.0], n // passo + 1), passo)[:n]
    return x * np.exp(-np.arange(n) / SR / decai) * vol


def varre(f0, f1, d, duty=0.5, vol=0.22):
    t = tt(d)
    f = f0 * (f1 / f0) ** (t / d)
    ph = np.cumsum(f) / SR % 1.0
    return np.where(ph < duty, 1.0, -1.0) * env(len(t), 0.002, 0.02) * vol


def bumbo():
    t = tt(0.16)
    f = 50 + 140 * np.exp(-t / 0.02)
    ph = np.cumsum(f) / SR % 1.0
    return (4 * np.abs(ph - 0.5) - 1) * np.exp(-t / 0.07) * 0.55


def caixa():
    return ruido(0.14, 0.045, 0.28)


def chimbal():
    return ruido(0.05, 0.012, 0.12, curto=True)


def moeda():
    return np.concatenate([quadrada(83, 0.06, 0.5, 0.2), quadrada(88, 0.28, 0.5, 0.2, decai=0.12)])


def pulo():
    return varre(hz(62), hz(79), 0.16, 0.25, 0.16)


def bip():
    return quadrada(81 + rng.integers(0, 3), 0.028, 0.5, 0.07)


# ---- harmonia ----
D, A, Bm, G = 0, 1, 2, 3
RAIZ = {D: 38, A: 45, Bm: 47, G: 43}
ARP = {D: [74, 78, 81, 78, 86, 81, 78, 81], A: [73, 76, 81, 76, 85, 81, 76, 81],
       Bm: [71, 74, 78, 74, 83, 78, 74, 78], G: [71, 74, 79, 74, 83, 79, 74, 79]}
TEMA = {D: [(81, 1), (83, 1), (86, 2)], A: [(85, 1), (81, 1), (76, 2)],
        Bm: [(78, 1), (81, 1), (83, 2)], G: [(83, 1), (79, 1), (81, 2)]}
PROG = [D, A, Bm, G]
COMPASSO = 4 * B


def compasso(t0, ac, arp=0.10, tema=0.13, baixo=0.33, bateria=1.0, bpan=0.0):
    for i, n in enumerate(ARP[ac]):
        if arp:
            add(quadrada(n, E * 0.9, 0.125, arp), t0 + i * E, 1, -0.35)
    if tema:
        tb = t0
        for n, dur in TEMA[ac]:
            add(quadrada(n, dur * B * 0.92, 0.5, tema, decai=dur * B * 1.5), tb, 1, 0.3)
            tb += dur * B
    if baixo:
        for i in range(8):
            n = RAIZ[ac] + (12 if i % 2 else 0)
            add(triangulo(n, E * 0.95, baixo), t0 + i * E)
    if bateria:
        for i in range(4):
            add(bumbo(), t0 + i * B, bateria)
            add(chimbal(), t0 + i * B + E, bateria, 0.4)
            if i % 2:
                add(caixa(), t0 + i * B, bateria * 0.9)


def trecho(ini, fim, **kw):
    t, k = ini, 0
    while t < fim - 0.5:
        compasso(t, PROG[k % 4], **kw)
        t += COMPASSO
        k += 1
    return t


# ---------- TÍTULO (0–4,6) ----------
trecho(0.45, 4.1, arp=0.08, tema=0.10, baixo=0.25, bateria=0.0)
for i, n in enumerate([74, 78, 81, 86, 90]):         # "start"
    add(quadrada(n, 0.07, 0.25, 0.18), START + i * 0.045)
add(ruido(0.3, 0.12, 0.10), TROCAS[0] - 0.3)

# ---------- FASE 1: escuro (4,6–10,3) ----------
for k in range(int((LUZ - 4.7) / (2 * B))):
    tb = 4.7 + k * 2 * B
    add(triangulo(35 if k % 2 == 0 else 38, 2 * B * 0.9, 0.28), tb)
    add(quadrada([71, 74, 78, 74][k % 4], 0.12, 0.125, 0.06, decai=0.2), tb + B, 1, 0.3)
for k in range(int((LUZ - 5.0) / 0.25)):               # passinhos
    if 5.0 + k * 0.25 < 8.2:
        add(ruido(0.03, 0.008, 0.07, curto=True), 5.0 + k * 0.25, 1, -0.2)
for k in range(5):                                    # lâmpada piscando
    add(quadrada(90, 0.03, 0.5, 0.08), LUZ - 0.25 + k * 0.066)
add(varre(hz(50), hz(98), 0.55, 0.5, 0.2), LUZ)       # acende!
for n in (62, 66, 69, 74):
    add(quadrada(n, 0.9, 0.5, 0.09, decai=0.5), LUZ + 0.55)
add(triangulo(38, 0.9, 0.35), LUZ + 0.55)
for i in range(3):                                    # os "!"
    add(quadrada(88, 0.05, 0.25, 0.12), 9.05 + i * 0.12)
add(ruido(0.3, 0.12, 0.10), TROCAS[1] - 0.3)

# ---------- FASE 2: corrida (10,3–20,2) ----------
trecho(TROCAS[1], TROCAS[2] - 0.1)
for hb in BATIDAS:
    add(pulo(), hb - 0.32, 1, -0.1)
    add(ruido(0.04, 0.01, 0.15), hb)
    add(moeda(), hb + 0.02, 1, 0.2)
add(ruido(0.3, 0.12, 0.10), TROCAS[2] - 0.3)

# ---------- FASE 3: construção (20,2–27,2) ----------
trecho(TROCAS[2] + 0.05, LEVELUP - 0.05, arp=0.09, tema=0.11, baixo=0.3, bateria=0.8)
for r in range(12):
    add(ruido(0.05, 0.015, 0.16), OBRA + r * 0.17 + 0.22, 1, 0.1)
    add(quadrada(50 + r, 0.04, 0.5, 0.08), OBRA + r * 0.17 + 0.22)
for i in range(5):
    add(quadrada(79 + i * 2, 0.06, 0.25, 0.1), 23.0 + i * 0.45, 1, 0.4)
for i, n in enumerate([74, 78, 81, 86, 90, 93]):      # LEVEL UP
    add(quadrada(n, 0.08, 0.5, 0.16), LEVELUP + i * 0.06, 1, 0.1)
for n in (74, 78, 81, 86):
    add(quadrada(n, 1.1, 0.5, 0.07, decai=0.6), LEVELUP + 0.38)
add(triangulo(38, 1.0, 0.35), LEVELUP + 0.38)
compasso(LEVELUP + 0.38 + 0.3, D, arp=0.07, tema=0, baixo=0.25, bateria=0.5)
add(ruido(0.3, 0.12, 0.10), TROCAS[3] - 0.3)

# ---------- FASE 4: amanhecer (27,2–33,2) ----------
lento = [(D, 27.3), (Bm, 28.8), (G, 30.3), (A, 31.8)]
for ac, t0 in lento:
    for i, n in enumerate(ARP[ac]):
        add(triangulo(n - 12, B * 0.6, 0.16), t0 + i * (1.5 / 8), 1)
    add(triangulo(RAIZ[ac], 1.45, 0.3), t0)
for i, (n, d) in enumerate([(78, 1.5), (81, 0.75), (83, 0.75), (86, 1.5), (85, 1.5)]):
    add(quadrada(n, d * 0.95, 0.5, 0.07, decai=d), 27.3 + sum(x[1] for x in [(78, 1.5), (81, 0.75), (83, 0.75), (86, 1.5), (85, 1.5)][:i]), 1, 0.2)
add(ruido(0.3, 0.12, 0.10), TROCAS[4] - 0.3)

# ---------- FASE 5: revelação (33,2–40) ----------
for k in range(int(1.9 / 0.06)):                      # blocos chegando
    add(quadrada(60 + (k % 12), 0.03, 0.5, 0.05), BLOCOS + 0.4 + k * 0.06, 1, -0.5 + (k % 10) / 10)
add(triangulo(38, NITIDEZ[0] - BLOCOS, 0.25), BLOCOS)
for i, tn in enumerate(NITIDEZ):
    add(quadrada(81 + i * 5, 0.08, 0.25, 0.14), tn)
for n in (62, 66, 69, 74, 78, 81):                    # acorde da logo
    add(quadrada(n, 1.6, 0.5, 0.06, decai=1.0), NITIDEZ[2])
add(triangulo(38, 1.6, 0.4), NITIDEZ[2])
add(ruido(0.5, 0.25, 0.15), NITIDEZ[2])
fim = NITIDEZ[2] + 1.0
for ac in (G, A, D):                                  # cadência final
    compasso(fim, ac, arp=0.07, tema=0.10, baixo=0.3, bateria=0.7 if ac != D else 0)
    fim += COMPASSO
for n in (62, 66, 69, 74):
    add(quadrada(n, 0.6, 0.5, 0.06, decai=0.3), fim - COMPASSO)

# ---------- bips do diálogo ----------
for ini, fimf, txt in FALAS:
    for i, ch in enumerate(txt):
        tc = ini + i / CPS
        if tc >= fimf or tc >= DUR:
            break
        if ch.strip() and i % 2 == 0:
            add(bip(), tc, 1, 0.0)

# ---------- master ----------
m = np.stack([sosfilt(butter(1, 30, 'high', fs=SR, output='sos'), mix[c]) for c in range(2)])
t = np.arange(N) / SR
m *= np.clip((DUR - t) / 0.8, 0, 1)
ativo = m[:, int(0.5 * SR):int(39 * SR)]
m *= 10 ** (-18.5 / 20) / np.sqrt((ativo ** 2).mean())
m = np.tanh(m * 1.05) / 1.05
m *= 10 ** (-1.5 / 20) / max(1e-9, np.abs(m).max())
os.makedirs('assets', exist_ok=True)
wavfile.write('assets/trilha.wav', SR, (m.T * 32767).astype(np.int16))
print('assets/trilha.wav', DUR, 's')
