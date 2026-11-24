#!/usr/bin/env python3
"""Trilha animada do Reels "O que a SEVEN faz?" — house-pop a 120 BPM em lá maior, 100 % sintetizada aqui
(sem samples de terceiros).

Estrutura presa às cenas (as trocas de página são em 2,85 / 5,85 / 11,85 / 17,85 / 23,85 / 28,05 s):
  0–3 s     gancho: acorde cortante + prato, palmas e acordes filtrados
  3–6 s     subida: bumbo, baixo, rufo de caixa acelerando e riser; um respiro antes do drop
  6–24 s    drop: bumbo 4/4, baixo house no contratempo, acordes sincopados, tema em pluck com eco, palmas, chimbais;
            prato e virada a cada serviço (12 e 18 s)
  24–28 s   respiro: sem bumbo, acordes longos e tema, riser e rufo
  28–33 s   drop final e acorde de fim com a logo
Progressão I–V–vi–IV (A–E–F#m–D), um compasso (2 s) por acorde.
Saída: assets/trilha.wav (48 kHz, estéreo, ≈ −14 LUFS, pico ≤ −1 dBFS).   uso: python3 trilha.py"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

import json
SR, DUR = 48000, json.load(open('trilha.json'))['fim']
N = int(SR * DUR)
B = 0.5            # batida (120 BPM)
COMP = 4 * B
rng = np.random.default_rng(120)
bus = {k: np.zeros((2, N)) for k in ('bat', 'baixo', 'acorde', 'lead', 'fx')}


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def tt(d):
    return np.arange(max(1, int(d * SR))) / SR


def filt(x, f, kind='low', order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


def add(b, sig, t, g=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)])
    i = int(round(t * SR))
    if i >= N or t < 0:
        return
    n = min(sig.shape[1], N - i)
    bus[b][:, i:i + n] += sig[:, :n] * g


def env(n, a, d, s=0.0, r=0.02):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    return e * np.clip((t[-1] - t) / r, 0, 1)


def saw(f, t, fase=0.0):
    return 2 * ((f * t + fase) % 1.0) - 1


# ---------------- instrumentos ----------------
def bumbo(v=1.0):
    t = tt(0.42)
    f = 48 + 150 * np.exp(-t / 0.028)
    corpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.17)
    clique = filt(rng.standard_normal(len(t)), 4000, 'high', 1) * np.exp(-t / 0.003) * 0.35
    return np.tanh(1.8 * (corpo + clique)) * 0.75 * v


def palma(v=1.0):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), [1000, 7000], 'band', 2)
    e = sum(np.exp(-np.maximum(t - k * 0.008, 0) / 0.004) * (t >= k * 0.008) for k in range(4)) * 0.5 + np.exp(-t / 0.075) * (t >= 0.024)
    return x * e * 0.42 * v


def caixa(v=1.0):
    t = tt(0.22)
    tom = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.5
    ruido = filt(rng.standard_normal(len(t)), [1500, 9000], 'band', 1) * np.exp(-t / 0.07)
    return (tom + ruido) * 0.38 * v


def chimbal(v=1.0, aberto=False):
    d = 0.3 if aberto else 0.06
    t = tt(d)
    x = filt(rng.standard_normal(len(t)), 8000, 'high', 2)
    return x * np.exp(-t / (0.09 if aberto else 0.014)) * 0.2 * v


def prato(d=2.2, v=1.0):
    t = tt(d)
    x = filt(rng.standard_normal(len(t)), 5000, 'high', 2)
    return x * np.exp(-t / 0.7) * np.minimum(t / 0.003, 1) * 0.16 * v


def prato_inv(d=1.0):
    return prato(d)[::-1] * 1.1


def baixo(n, d, v=1.0):
    """baixo house: serra com filtro que fecha + sub, curto e saltado"""
    t = tt(d)
    f = hz(n)
    x = saw(f, t) * 0.6 + saw(f * 1.005, t, 0.3) * 0.4
    out = np.zeros(len(t))
    blocos = 16
    for b in range(blocos):
        i0, i1 = b * len(t) // blocos, (b + 1) * len(t) // blocos
        fc = 220 + 1800 * np.exp(-(i0 / SR) / 0.06)
        seg = filt(x[max(0, i0 - 1200):i1], fc, 'low', 2)
        out[i0:i1] = seg[-(i1 - i0):]
    sub = np.sin(2 * np.pi * f * t)
    return np.tanh(1.3 * (out * 0.7 + sub * 0.75)) * env(len(t), 0.004, 0.14, 0.35, 0.03) * 0.42 * v


def stab(notas, d, corte=3500, v=1.0):
    """acorde cortante: supersaw curto, aberto em estéreo"""
    t = tt(d)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for n in notas:
        for k, det in enumerate((-0.14, -0.05, 0.05, 0.14)):
            s = saw(hz(n + det), t, rng.random())
            pan = -0.8 + 1.6 * k / 3
            L += s * np.cos((pan + 1) * np.pi / 4)
            R += s * np.sin((pan + 1) * np.pi / 4)
    L, R = filt(L, corte), filt(R, corte)
    e = env(len(t), 0.003, 0.11, 0.25, 0.04)
    return np.stack([L, R]) * e / (len(notas) * 4) * 0.9 * v


def pad(notas, d, corte=2200, a=0.4, v=1.0):
    t = tt(d)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for n in notas:
        for k, det in enumerate((-0.1, 0.0, 0.1)):
            s = saw(hz(n + det), t, rng.random())
            pan = -0.7 + 0.7 * k
            L += s * np.cos((pan + 1) * np.pi / 4)
            R += s * np.sin((pan + 1) * np.pi / 4)
    L, R = filt(L, corte), filt(R, corte)
    tt_ = np.arange(len(t)) / SR
    e = np.minimum(tt_ / a, 1) * np.clip((tt_[-1] - tt_) / 0.4, 0, 1)
    return np.stack([L, R]) * e / (len(notas) * 3) * 0.55 * v


def pluck(n, d=0.45, v=1.0):
    """tema: pluck brilhante (serra + quadrada) com filtro que fecha"""
    t = tt(d)
    f = hz(n)
    x = saw(f, t) * 0.5 + np.sign(np.sin(2 * np.pi * f * 2 * t)) * 0.18 + np.sin(2 * np.pi * f * t) * 0.4
    out = np.zeros(len(t))
    blocos = 12
    for b in range(blocos):
        i0, i1 = b * len(t) // blocos, (b + 1) * len(t) // blocos
        fc = 900 + 7000 * np.exp(-(i0 / SR) / 0.07)
        seg = filt(x[max(0, i0 - 1200):i1], fc, 'low', 2)
        out[i0:i1] = seg[-(i1 - i0):]
    return out * env(len(t), 0.002, 0.16, 0.0, 0.03) * 0.34 * v


def riser(d, v=1.0):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for b in range(48):
        i0, i1 = b * n // 48, (b + 1) * n // 48
        fc = 500 * (12000 / 500) ** (b / 47)
        seg = filt(x[max(0, i0 - 1500):i1], [fc * 0.6, min(20000, fc * 1.5)], 'band', 1)
        out[i0:i1] = seg[-(i1 - i0):]
    tt_ = np.arange(n) / SR
    return (out * (tt_ / d) ** 2) * 0.45 * v


def impacto(v=1.0):
    t = tt(2.0)
    f = 40 + 90 * np.exp(-t / 0.05)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.5)
    return np.tanh(1.4 * s) * 0.6 * v


def rufo(ini, fim, g=1.0):
    """rufo de caixa acelerando (colcheias → semicolcheias → fusas) e crescendo"""
    t = ini
    while t < fim - 0.01:
        p = (t - ini) / (fim - ini)
        passo = B / 2 if p < 0.4 else (B / 4 if p < 0.8 else B / 8)
        add('bat', caixa(0.35 + 0.65 * p), t, g, (rng.random() - 0.5) * 0.3)
        t += passo


# ---------------- harmonia e tema ----------------
ACORDES = [  # A, E, F#m, D
    {'raiz': 33, 'stab': [57, 61, 64, 69], 'pad': [45, 57, 61, 64, 69]},
    {'raiz': 40, 'stab': [56, 59, 64, 68], 'pad': [40, 56, 59, 64, 68]},
    {'raiz': 42, 'stab': [57, 61, 66, 69], 'pad': [42, 57, 61, 66, 69]},
    {'raiz': 38, 'stab': [57, 62, 66, 69], 'pad': [38, 57, 62, 66, 69]},
]
TEMA = [  # colcheias (0,25 s) por compasso; None = pausa
    [76, None, 81, 85, None, 83, 81, None],
    [80, None, 83, 88, None, 85, 83, None],
    [81, None, 85, 90, None, 88, 85, None],
    [78, None, 81, 86, 85, 83, 81, 76],
]
# acordes sincopados (em colcheias): no "e" do 1, no 2, no "e" do 3 e no 4
STAB_POS = [1, 2, 5, 6]

kicks = []


def compasso(t0, k, parte):
    ac = ACORDES[k % 4]
    if parte in ('drop', 'subida', 'final'):
        for b in range(4):
            add('bat', bumbo(), t0 + b * B)
            kicks.append(t0 + b * B)
    if parte in ('drop', 'final'):
        for b in range(4):
            add('bat', chimbal(0.9, aberto=True), t0 + b * B + B / 2, 1, 0.3)
            for s16 in (1, 3):
                add('bat', chimbal(0.55), t0 + b * B + s16 * B / 4, 1, -0.35)
        add('bat', palma(), t0 + B); add('bat', palma(), t0 + 3 * B)
        for e in range(8):  # baixo house: contratempos + oitava
            if e % 2 == 1:
                add('baixo', baixo(ac['raiz'] + (12 if e == 7 else 0), B * 0.45), t0 + e * B / 2)
        for p in STAB_POS:
            add('acorde', stab(ac['stab'], 0.28), t0 + p * B / 2, 1.0)
    if parte in ('drop', 'final', 'respiro'):
        for i, n in enumerate(TEMA[k % 4]):
            if n is None:
                continue
            for eco in range(3):  # eco de colcheia pontuada, alternando lados
                add('lead', pluck(n, 0.45, 0.85 ** (eco * 2)), t0 + i * B / 2 + eco * 0.375, 1, (-0.45, 0.45)[eco % 2] if eco else 0.0)
    if parte == 'gancho':
        # meio-tempo: bumbo no 1 e no 3, palmas, chimbal de semicolcheia e baixo já presente
        for b in (0, 2):
            add('bat', bumbo(0.95), t0 + b * B); kicks.append(t0 + b * B)
        add('bat', palma(0.9), t0 + B); add('bat', palma(0.9), t0 + 3 * B)
        for b in range(16):
            add('bat', chimbal(0.45 + 0.25 * (b % 2)), t0 + b * B / 4, 1, 0.3)
        for e in (1, 3, 5, 7):
            add('baixo', baixo(ac['raiz'], B * 0.4, 0.75), t0 + e * B / 2)
        for p in STAB_POS:
            add('acorde', stab(ac['stab'], 0.24, corte=2600), t0 + p * B / 2, 1.0)
        for i, n in enumerate(TEMA[k % 4]):
            if n is not None:
                add('lead', pluck(n, 0.4, 0.55), t0 + i * B / 2, 1, 0.0)
    if parte == 'subida':
        for e in range(8):
            if e % 2 == 1:
                add('baixo', baixo(ac['raiz'], B * 0.4, 0.8), t0 + e * B / 2)
        for p in STAB_POS:
            add('acorde', stab(ac['stab'], 0.24, corte=2200), t0 + p * B / 2, 0.85)
        add('bat', palma(0.8), t0 + B); add('bat', palma(0.8), t0 + 3 * B)
    if parte == 'respiro':
        add('acorde', pad(ac['pad'], COMP + 0.3, corte=2600), t0, 1.0)
        add('baixo', np.stack([np.sin(2 * np.pi * hz(ac['raiz']) * tt(COMP)) * env(int(COMP * SR), 0.02, 0.8, 0.6, 0.2) * 0.35] * 2), t0)
        add('bat', palma(0.7), t0 + B); add('bat', palma(0.7), t0 + 3 * B)


# ---------------- arranjo (genérico, preso às cenas do anúncio) ----------------
# CORTES: trocas de cena; o primeiro é o "drop" (fim do gancho). FIM: duração do vídeo.
import json as _json
_cfg = _json.load(open('trilha.json'))
CORTES, FIM = _cfg['cortes'], _cfg['fim']
DROP = CORTES[0]
add('acorde', stab(ACORDES[0]['stab'] + [76], 0.6, corte=6000), 0.0, 1.3)
add('fx', impacto(0.8), 0.0)
add('bat', prato(2.0), 0.0)
t0, k = 0.0, 0
while t0 < DROP - 0.01:
    compasso(t0, k, 'gancho' if t0 + COMP <= DROP - 1.0 else 'subida')
    t0 += COMP; k += 1
rufo(max(0.5, DROP - 1.4), DROP - 0.1, 0.55)
add('fx', riser(min(2.6, DROP - 0.2), 0.55), DROP - min(2.6, DROP - 0.2))
add('fx', prato_inv(0.9), DROP - 0.9)
# drop do primeiro corte até o fim
t0, k = DROP, 0
while t0 < FIM - 1.6:
    compasso(t0, k, 'drop')
    t0 += COMP; k += 1
add('bat', prato(2.2), DROP); add('fx', impacto(0.7), DROP)
for c in CORTES[1:]:
    add('bat', prato(2.0, 0.9), c); add('fx', impacto(0.5), c)
    add('fx', prato_inv(0.7), c - 0.7)
    for i in range(4):
        add('bat', caixa(0.45 + 0.12 * i), c - 0.5 + i * B / 4)
# fim: dois golpes e acorde aberto
tf = FIM - 1.4
for tg in (tf, tf + 0.25):
    add('bat', bumbo(1.0), tg); kicks.append(tg)
    add('acorde', stab(ACORDES[0]['stab'] + [76, 81], 0.22, corte=6000), tg, 1.2)
add('acorde', pad(ACORDES[0]['pad'] + [76], 1.1, corte=4000, a=0.01), tf + 0.5, 1.1)
add('bat', prato(1.2, 1.2), tf + 0.5)
add('lead', pluck(81, 0.6), tf + 0.5, 1.0); add('lead', pluck(88, 0.6), tf + 0.5, 0.8)

# ---------------- mixagem ----------------
duck = np.ones(N)
for tk in kicks:
    i = int(tk * SR)
    n = int(0.25 * SR)
    curva = 1 - 0.55 * np.exp(-np.arange(n) / SR / 0.07)
    j = min(N, i + n)
    duck[i:j] = np.minimum(duck[i:j], curva[:j - i])
bus['baixo'] *= 0.35 + 0.65 * duck
bus['acorde'] *= 0.45 + 0.55 * duck


def ir(dur, dec, pre):
    t = tt(dur)
    x = rng.standard_normal((2, len(t))) * np.exp(-t / dec)
    x = np.stack([filt(x[0], 8000), filt(x[1], 8000)])
    x = np.concatenate([np.zeros((2, int(pre * SR))), x], axis=1)
    return x / np.sqrt((x ** 2).sum(axis=1, keepdims=True))


IRV = ir(1.6, 0.35, 0.02)
rev = np.stack([fftconvolve(bus['acorde'][c] * 0.6 + bus['lead'][c] + bus['bat'][c] * 0.15, IRV[c])[:N] for c in range(2)])
mix = bus['bat'] * 1.0 + bus['baixo'] * 1.0 + bus['acorde'] * 0.75 + bus['lead'] * 0.7 + bus['fx'] * 0.8 + rev * 0.22
mix = np.stack([filt(mix[c], 28, 'high', 2) for c in range(2)])
t_all = np.arange(N) / SR
# respiro de 0,12 s antes do drop e fade final
resp = np.ones(N)
resp[int((DROP - 0.12) * SR):int(DROP * SR)] = 0.08
mix *= resp * np.clip((DUR - t_all) / 0.45, 0, 1)
# compressão de barramento (cola o groove)
envl = np.sqrt(fftconvolve(np.mean(mix ** 2, axis=0), np.ones(int(0.03 * SR)) / int(0.03 * SR), mode='same') + 1e-12)
lim = 10 ** (-15 / 20)
mix *= np.where(envl > lim, (lim / envl) ** (1 - 1 / 2.5), 1.0)
try:
    import pyloudnorm as pyln
    mix *= 10 ** ((-14.0 - pyln.Meter(SR).integrated_loudness(mix.T)) / 20)
except Exception:
    mix *= 10 ** (-16 / 20) / np.sqrt((mix ** 2).mean())
mix = np.tanh(mix * 1.15) / 1.15
mix *= min(1.0, 10 ** (-1 / 20) / np.abs(mix).max())
os.makedirs('assets', exist_ok=True)
wavfile.write('assets/trilha.wav', SR, (mix.T * 32767).astype(np.int16))
print('assets/trilha.wav', DUR, 's')
