#!/usr/bin/env python3
"""Trilha da edição antes/depois da Ótica Losiq — 100 % original, sintetizada aqui (sem samples de terceiros).

A história sonora acompanha a imagem:
  ANTES (0–5,85 s)   em si menor, abafada (filtro fechado), piano distante, ar.
                     Um riser abre o filtro e há um respiro de silêncio antes da virada.
  DEPOIS (5,85 s)    ré maior, filtro aberto: piano com tema, sub-baixo, bumbo, chimbal, ducking no pad.
  COMPARATIVO        entra um sino em contracanto.
  DETALHES (14,3 s)  groove completo: palmas, shaker, cordas sintéticas, viradas.
  FECHO (28,6 s)     breakdown só com piano e pad; prato invertido; acorde final na logo (31,8 s).
Ré maior, 92,3 BPM (batida de 0,65 s), progressão I–V6–vi–IV. Os cortes da edição caem na grade.
Saída: assets/trilha.wav (48 kHz, estéreo, ≈ −14,5 LUFS, pico ≤ −1 dBFS).   uso: python3 trilha.py"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, sosfilt_zi, fftconvolve

SR, DUR = 48000, 34.9
N = int(SR * DUR)
BAT = 0.65
COMP = 4 * BAT
rng = np.random.default_rng(33)

DEPOIS, SPLIT, DETALHES, FECHO, LOGO = 5.85, 9.75, 14.3, 28.6, 31.8
CORTES = [3.25, 5.85, 9.75, 14.3, 17.55, 20.15, 22.75, 26.0, 28.6]

# barramentos: música (vai ao reverb grande), bateria (reverb curto), efeitos (seco), graves (seco, com ducking)
bus = {k: np.zeros((2, N)) for k in ('musica', 'pad', 'bateria', 'fx', 'grave')}


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def tt(d):
    return np.arange(max(1, int(d * SR))) / SR


def add(b, sig, t, g=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)])
    i = int(round(t * SR))
    if i >= N:
        return
    if i < 0:
        sig, i = sig[:, -i:], 0
    n = min(sig.shape[1], N - i)
    bus[b][:, i:i + n] += sig[:, :n] * g


def filt(x, f, kind='low', order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


def env_ar(n, a, r):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1.0) * np.clip((t[-1] - t) / max(r, 1e-4), 0, 1)


# ---------------- instrumentos ----------------
def piano(n, d=3.0, vel=1.0, brilho=1.0):
    """Piano: parciais levemente inarmônicas, duas cordas desafinadas (coro), martelo e decaimento por parcial."""
    t = tt(d)
    f0 = hz(n)
    B = 0.0004
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for k in range(1, 9):
        fk = f0 * k * np.sqrt(1 + B * k * k)
        if fk > 16000:
            break
        amp = (0.62 ** (k - 1)) * (1 + 0.35 * brilho * vel * (k > 2))
        dec = np.exp(-t * (0.7 + 0.55 * k) * (1 + (n - 60) / 60))
        ph = rng.random() * 6.28
        L += amp * dec * np.sin(2 * np.pi * fk * 0.9993 * t + ph)
        R += amp * dec * np.sin(2 * np.pi * fk * 1.0007 * t + ph + 0.4)
    martelo = filt(rng.standard_normal(len(t)), [800, 5000], 'band', 1) * np.exp(-t / 0.008) * 0.25
    ataque = np.minimum(t / 0.003, 1) * np.clip((d - t) / 0.25, 0, 1)
    s = np.stack([L + martelo, R + martelo]) * ataque * 0.16 * vel
    return s


def supersaw(notas, d, corte=2400, a=1.0, r=1.0, vozes=5, det=0.11):
    t = tt(d)
    L = np.zeros(len(t))
    R = np.zeros(len(t))
    for n in notas:
        for v in range(vozes):
            dv = (v - (vozes - 1) / 2) / ((vozes - 1) / 2) * det
            f = hz(n + dv)
            ph = (f * t + rng.random()) % 1.0
            saw = 2 * ph - 1
            pan = (v / (vozes - 1)) * 2 - 1
            L += saw * np.cos((pan + 1) * np.pi / 4)
            R += saw * np.sin((pan + 1) * np.pi / 4)
    L, R = filt(L, corte, 'low', 2), filt(R, corte, 'low', 2)
    e = env_ar(len(t), a, r)
    return np.stack([L, R]) * e / (len(notas) * vozes) * 0.55


def sub(n, d, vel=1.0):
    t = tt(d)
    s = np.sin(2 * np.pi * hz(n) * t)
    s = np.tanh(1.6 * s) / np.tanh(1.6)
    return s * env_ar(len(t), 0.008, 0.08) * 0.42 * vel


def baixo(n, d, vel=1.0):
    """Baixo com ataque: serra filtrada com envelope de filtro + sub."""
    t = tt(d)
    f = hz(n)
    saw = 2 * ((f * t) % 1.0) - 1
    out = np.zeros(len(t))
    blocos = 24
    for b in range(blocos):
        i0, i1 = b * len(t) // blocos, (b + 1) * len(t) // blocos
        fc = 180 + 1400 * np.exp(-(i0 / SR) / 0.09)
        seg = filt(saw[max(0, i0 - 1500):i1], fc, 'low', 2)
        out[i0:i1] = seg[-(i1 - i0):]
    return (out * 0.5 + np.sin(2 * np.pi * f * t) * 0.6) * env_ar(len(t), 0.004, 0.06) * 0.35 * vel


def sino(n, d=2.5, vel=1.0):
    t = tt(d)
    fc = hz(n)
    mod = np.sin(2 * np.pi * fc * 3.5 * t) * 2.2 * np.exp(-t / 0.35)
    s = np.sin(2 * np.pi * fc * t + mod) * np.exp(-t / 0.9)
    return s * np.minimum(t / 0.002, 1) * 0.12 * vel


def bumbo(vel=1.0):
    t = tt(0.5)
    f = 44 + 110 * np.exp(-t / 0.035)
    corpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    clique = filt(rng.standard_normal(len(t)), 3500, 'high', 1) * np.exp(-t / 0.004) * 0.25
    return np.tanh(1.4 * (corpo + clique)) * 0.62 * vel


def palma(vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), [900, 6000], 'band', 2)
    e = sum(np.exp(-np.maximum(t - k * 0.009, 0) / 0.005) * (t >= k * 0.009) for k in range(4)) * 0.45 + np.exp(-t / 0.09) * (t >= 0.027)
    return x * e * 0.32 * vel


def chimbal(vel=1.0, aberto=False):
    d = 0.35 if aberto else 0.07
    n = int(d * SR)
    t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 7000, 'high', 2)
    return x * np.exp(-t / (0.11 if aberto else 0.018)) * 0.16 * vel


def shaker(vel=1.0):
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), [4000, 11000], 'band', 1)
    return x * np.minimum(t / 0.012, 1) * np.exp(-t / 0.03) * 0.07 * vel


def ruido_varre(d, f0, f1, g=1.0, forma='sobe'):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blocos = 60
    for b in range(blocos):
        i0, i1 = b * n // blocos, (b + 1) * n // blocos
        p = b / (blocos - 1)
        fc = f0 * (f1 / f0) ** p
        seg = filt(x[max(0, i0 - 2000):i1], [max(40, fc * 0.6), min(20000, fc * 1.5)], 'band', 1)
        out[i0:i1] = seg[-(i1 - i0):]
    p = np.linspace(0, 1, n)
    e = p ** 2.2 if forma == 'sobe' else np.sin(np.pi * p) ** 2
    return out * e * 0.3 * g


def impacto(vel=1.0, d=3.0):
    t = tt(d)
    f = 32 + 60 * np.exp(-t / 0.08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    corpo = filt(rng.standard_normal(len(t)), 260, 'low') * np.exp(-t / 0.2) * 0.6
    return np.tanh(1.3 * (s + corpo)) * 0.55 * vel


def prato_invertido(d=1.4):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 3000, 'high', 1) * np.exp(-t / 0.45)
    return x[::-1] * 0.14


def ar(d):
    x = filt(filt(rng.standard_normal(int(d * SR)), 1800, 'low'), 200, 'high', 1)
    return x * env_ar(len(x), d * 0.3, d * 0.3) * 0.05


# ---------------- harmonia ----------------
# I – V6 – vi – IV em ré maior (um compasso cada)
ACORDES = [
    {'raiz': 38, 'pad': [50, 57, 62, 66, 69], 'piano': [50, 57, 62, 66]},      # D
    {'raiz': 37, 'pad': [49, 57, 61, 64, 69], 'piano': [49, 57, 61, 64]},      # A/C#
    {'raiz': 35, 'pad': [47, 54, 59, 62, 66], 'piano': [47, 54, 59, 62]},      # Bm
    {'raiz': 31, 'pad': [43, 55, 59, 62, 66], 'piano': [43, 55, 59, 62]},      # G
]
# tema do piano: (colcheia dentro do compasso, nota, duração em colcheias), um compasso por acorde
TEMA = [
    [(0, 78, 2), (2, 81, 2), (4, 86, 3), (7, 85, 1)],
    [(0, 76, 2), (2, 81, 2), (4, 85, 3), (7, 83, 1)],
    [(0, 74, 2), (2, 78, 2), (4, 83, 3), (7, 81, 1)],
    [(0, 74, 2), (2, 79, 2), (4, 83, 2), (6, 81, 1), (7, 79, 1)],
]
E = BAT / 2

# ---------------- ANTES (abafado) ----------------
antes = np.zeros((2, N))


def add_antes(sig, t, g=1.0, pan=0.0):
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)])
    i = int(t * SR)
    n = min(sig.shape[1], N - i)
    antes[:, i:i + n] += sig[:, :n] * g


add_antes(supersaw([47, 54, 59, 62, 66], 6.3, corte=1800, a=1.6, r=0.6, det=0.08), 0.15, 0.9)
add_antes(np.stack([sub(35, 5.7, 0.6)] * 2), 0.15)
motivo = [(0, 66), (2, 71), (3, 74), (4, 73), (6, 71), (8, 66), (10, 69), (11, 71), (12, 69), (14, 66)]
for c, n in motivo:
    add_antes(piano(n, 2.6, 0.75), 0.65 + c * E, 1.0)
add_antes(np.stack([ar(5.6)] * 2), 0.2)
# o filtro fecha o antes e abre no riser (o "véu" que sai na virada)
corte = np.full(N, 700.0)
t_all = np.arange(N) / SR
abre = (t_all >= 4.0) & (t_all < DEPOIS)
corte[abre] = 700 * (12000 / 700) ** ((t_all[abre] - 4.0) / (DEPOIS - 4.0)) ** 2
corte[t_all >= DEPOIS] = 16000
fil = np.zeros_like(antes)
B = 512
for c in range(2):
    zi = None
    for i0 in range(0, int(DEPOIS * SR) + B, B):
        i1 = min(N, i0 + B)
        sos = butter(2, min(corte[i0], 18000), 'low', fs=SR, output='sos')
        if zi is None:
            zi = sosfilt_zi(sos) * 0
        fil[c, i0:i1], zi = sosfilt(sos, antes[c, i0:i1], zi=zi)
fil[:, int(DEPOIS * SR):] += antes[:, int(DEPOIS * SR):]
bus['musica'] += fil * 0.42
add('fx', ruido_varre(DEPOIS - 0.1 - 4.0, 400, 9000, 0.9), 4.0, 1, 0.0)
add('fx', prato_invertido(1.5), DEPOIS - 0.1 - 1.5, 1.0)
# um corte no antes: toque leve
add('musica', sino(83, 1.8, 0.5), 3.25, 1, 0.3)

# ---------------- DEPOIS em diante ----------------
fim_groove = FECHO
k = 0
t = DEPOIS
compassos = []
while t < LOGO + COMP:
    compassos.append((t, ACORDES[k % 4], k))
    t += COMP
    k += 1

kicks = []
for t0, ac, k in compassos:
    if t0 >= LOGO - 0.01:
        break
    breakdown = t0 >= FECHO - 0.01
    # pad (cordas sintéticas mais largas nos detalhes)
    larg = 0.11 if t0 < DETALHES else 0.15
    add('pad', supersaw(ac['pad'], COMP + 0.4, corte=2600 if t0 < DETALHES else 3600, a=0.25, r=0.45, det=larg), t0, 0.5 if breakdown else 0.85)
    # piano: acorde no tempo 1 e tema
    for n in ac['piano']:
        add('musica', piano(n, COMP * 1.1, 0.4 if breakdown else 0.55), t0, 1.0, (n - 55) / 40)
    for c, n, dc in TEMA[k % 4]:
        vel = 0.6 if breakdown else (0.85 if t0 >= DETALHES else 0.75)
        add('musica', piano(n, dc * E + 1.2, vel, 1.2), t0 + c * E, 1.0, ((n - 78) / 20))
    # graves
    if not breakdown:
        for b in range(8):
            n = ac['raiz'] + (12 if b in (3, 7) else 0)
            add('grave', baixo(n, E * 0.92, 0.95 if b % 2 == 0 else 0.7), t0 + b * E)
    else:
        add('grave', np.stack([sub(ac['raiz'], COMP, 0.7)] * 2), t0)
    # bateria
    if not breakdown:
        for b in range(4):
            tb = t0 + b * BAT
            add('bateria', bumbo(1.0 if b == 0 else 0.9), tb)
            kicks.append(tb)
            add('bateria', chimbal(0.8 + 0.2 * (b % 2)), tb + E, 1, 0.35)
            if t0 >= DETALHES and b in (1, 3):
                add('bateria', palma(), tb, 1, -0.05)
        if t0 >= DETALHES:
            for s in range(16):
                sw = 0.018 if s % 2 else 0.0  # leve swing
                add('bateria', shaker(1.0 if s % 4 == 2 else 0.6), t0 + s * BAT / 4 + sw, 1, -0.45)
        if k % 2 == 1:
            add('bateria', chimbal(0.7, aberto=True), t0 + 3.5 * BAT, 1, 0.4)
    # contracanto de sino a partir do comparativo
    if SPLIT <= t0 < FECHO:
        for c, n in ((1, ac['pad'][-1] + 12), (5, ac['pad'][-2] + 12)):
            add('musica', sino(n, 2.0, 0.7), t0 + c * E, 1, 0.5 if c == 1 else -0.5)

# virada de bateria antes do fecho
for i in range(8):
    add('bateria', palma(0.35 + 0.08 * i), FECHO - 8 * (BAT / 4) + i * BAT / 4, 1, (-1) ** i * 0.2)
add('fx', ruido_varre(1.3, 600, 8000, 0.6), FECHO - 1.3)

# virada para o depois: impacto, acorde cheio e sino
add('fx', np.stack([impacto(1.0)] * 2), DEPOIS)
for n in (38, 50, 57, 62, 66, 69, 74):
    add('musica', piano(n, 4.0, 0.95), DEPOIS, 1.0, (n - 60) / 40)
add('musica', sino(86, 3.0, 1.0), DEPOIS + 0.01, 1, 0.2)
# comparativo
add('fx', ruido_varre(0.6, 2000, 300, 0.5, 'arco'), SPLIT - 0.3, 1, 0.0)
add('fx', np.stack([impacto(0.45, 1.6)] * 2), SPLIT)
# toques nos cortes secos
for c in CORTES:
    if c not in (DEPOIS, SPLIT, FECHO):
        add('fx', ruido_varre(0.45, 3000, 600, 0.35, 'arco'), c - 0.25, 1, 0.5 if int(c) % 2 else -0.5)
# fecho: cortina, prato invertido e o acorde final na logo
add('fx', ruido_varre(0.8, 500, 6000, 0.6, 'arco'), FECHO - 0.4, 1, 0.3)
add('fx', prato_invertido(1.6), LOGO - 1.6, 1.2)
add('fx', np.stack([impacto(1.0, 3.2)] * 2), LOGO)
for n in (38, 50, 57, 62, 66, 69, 76, 81):
    add('musica', piano(n, DUR - LOGO, 0.9), LOGO, 1.0, (n - 60) / 40)
add('musica', sino(86, 3.0, 1.0), LOGO + 0.02, 1, 0.2)
add('pad', supersaw([50, 57, 62, 66, 69, 76], DUR - LOGO, corte=3000, a=0.3, r=2.5, det=0.13), LOGO, 1.0)
add('grave', np.stack([sub(38, DUR - LOGO, 0.9)] * 2), LOGO)
for i, n in enumerate([81, 86, 90, 93]):
    add('musica', sino(n, 2.2, 0.55), 33.35 + i * 0.11, 1, -0.3 + 0.2 * i)

# ---------------- mixagem ----------------
# ducking (efeito "respirando" no pad e nos graves a cada bumbo)
duck = np.ones(N)
for tk in kicks:
    i = int(tk * SR)
    n = int(0.32 * SR)
    curva = 1 - 0.45 * np.exp(-np.arange(n) / SR / 0.09)
    j = min(N, i + n)
    duck[i:j] = np.minimum(duck[i:j], curva[:j - i])
bus['pad'] *= duck
bus['grave'] *= 0.5 + 0.5 * duck


def ir(dur, dec, pre):
    t = tt(dur)
    x = rng.standard_normal((2, len(t))) * np.exp(-t / dec)
    x = np.stack([filt(x[0], 7000), filt(x[1], 7000)])
    x = np.concatenate([np.zeros((2, int(pre * SR))), x], axis=1)
    return x / np.sqrt((x ** 2).sum(axis=1, keepdims=True))


IR_G, IR_P = ir(3.2, 0.85, 0.025), ir(1.0, 0.22, 0.008)
rev_g = np.stack([fftconvolve(bus['musica'][c] + 0.6 * bus['pad'][c], IR_G[c])[:N] for c in range(2)])
rev_p = np.stack([fftconvolve(bus['bateria'][c], IR_P[c])[:N] for c in range(2)])
mix = (bus['musica'] * 0.95 + bus['pad'] * 0.75 + bus['bateria'] * 1.15 + bus['grave'] * 0.95 + bus['fx'] * 0.8
       + rev_g * 0.38 + rev_p * 0.18)
mix = np.stack([filt(mix[c], 25, 'high', 2) for c in range(2)])
# respiro de silêncio antes da virada e fade no fim
resp = np.ones(N)
a, b = int((DEPOIS - 0.12) * SR), int(DEPOIS * SR)
resp[a:b] = 0.12
mix *= resp * np.clip((DUR - t_all) / 1.2, 0, 1) ** 1.3 * np.clip(t_all / 0.15, 0, 1)
# compressão suave do barramento
env = np.sqrt(fftconvolve(np.mean(mix ** 2, axis=0), np.ones(int(0.05 * SR)) / int(0.05 * SR), mode='same') + 1e-12)
lim = 10 ** (-14 / 20)
ganho = np.where(env > lim, (lim / env) ** (1 - 1 / 2.2), 1.0)
mix *= ganho
# volume integrado e limitador
try:
    import pyloudnorm as pyln
    lufs = pyln.Meter(SR).integrated_loudness(mix.T)
    mix *= 10 ** ((-14.5 - lufs) / 20)
except Exception:
    mix *= 10 ** (-17 / 20) / np.sqrt((mix ** 2).mean())
mix = np.tanh(mix * 1.2) / 1.2
mix *= min(1.0, 10 ** (-1 / 20) / np.abs(mix).max())
os.makedirs('assets', exist_ok=True)
wavfile.write('assets/trilha.wav', SR, (mix.T * 32767).astype(np.int16))
print('assets/trilha.wav', DUR, 's')
