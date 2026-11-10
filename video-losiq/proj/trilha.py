#!/usr/bin/env python3
"""Trilha da edição antes/depois da Ótica Losiq, 100 % sintetizada aqui (piano, pad, pulso suave).
Batida de 0,65 s (92 BPM); os cortes da edição caem na grade da batida. Saída: assets/trilha.wav.
uso: python3 trilha.py"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 34.9
N = int(SR * DUR)
rng = np.random.default_rng(21)
BAT = 0.65
seco = np.zeros((2, N))   # efeitos e graves (sem reverb)
molhado = np.zeros((2, N))  # pad e piano (vão para o reverb)


def add(bus, sig, t, g=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N:
        return
    sig = sig[: N - i]
    a = (pan + 1) * np.pi / 4
    bus[0, i:i + len(sig)] += sig * g * np.cos(a)
    bus[1, i:i + len(sig)] += sig * g * np.sin(a)


def filt(x, f, kind="low", order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output="sos"), x)


def tt(d):
    return np.arange(int(d * SR)) / SR


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def adsr(n, a, r):
    t = np.arange(n) / SR
    e = np.minimum(t / max(a, 1e-4), 1.0)
    rel = np.clip((t[-1] - t) / max(r, 1e-4), 0, 1)
    return e * rel


# ---------- instrumentos ----------
def piano(n, d=2.4):
    t = tt(d)
    f = hz(n)
    s = sum(np.sin(2 * np.pi * f * k * t * (1 + 0.0004 * k)) * (0.55 ** (k - 1)) * np.exp(-t * (1.3 + 0.9 * k)) for k in range(1, 6))
    ataque = np.minimum(t / 0.004, 1)
    return s * ataque * 0.5


def pad(notas, d, a=2.0, r=2.0, corte=1400):
    t = tt(d)
    s = np.zeros(len(t))
    for n in notas:
        for det in (-0.12, 0.0, 0.11):
            f = hz(n + det)
            ph = rng.random() * 2 * np.pi
            # serra suave (poucos harmônicos)
            s += sum(np.sin(2 * np.pi * f * k * t + ph * k) / k for k in range(1, 7))
    s = filt(s, corte, "low", 2)
    return s * adsr(len(t), a, r) / (len(notas) * 3) * 0.6


def drone(f0, d, a=3.0, r=2.0):
    t = tt(d)
    s = np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * f0 * 1.5 * t + 0.3) + 0.3 * np.sin(2 * np.pi * f0 * 2.003 * t)
    return s * adsr(len(t), a, r) * 0.25


def ar(d, f=900):
    x = filt(rng.standard_normal(int(d * SR)), f, "low", 2)
    x = filt(x, 120, "high", 1)
    return x * adsr(len(x), d * 0.4, d * 0.5) * 0.25


def bumbo(g=1.0):
    t = tt(0.45)
    f = 42 + 80 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) * g


def chimbal(d=0.035):
    n = int(0.15 * SR)
    return filt(rng.standard_normal(n), 8000, "high") * np.exp(-np.arange(n) / SR / d) * 0.35


def palma():
    n = int(0.25 * SR)
    x = filt(filt(rng.standard_normal(n), 1000, "high"), 4000, "low")
    t = np.arange(n) / SR
    e = sum(np.exp(-np.maximum(t - k * 0.01, 0) / 0.006) * (t >= k * 0.01) for k in range(3)) * 0.5 + np.exp(-t / 0.08) * (t >= 0.02)
    return x * e * 0.5


def whoosh(d=0.9, f0=300, f1=3200, g=1.0):
    n = int(d * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blocos = 48
    for b in range(blocos):
        i0, i1 = b * n // blocos, (b + 1) * n // blocos
        p = b / (blocos - 1)
        fc = f0 * (f1 / f0) ** (np.sin(np.pi * p) if p < 0.5 else 1 - 0.5 * (p - 0.5))
        seg = filt(x[max(0, i0 - 2000):i1], [max(60, fc * 0.6), min(18000, fc * 1.6)], "band", 1)
        out[i0:i1] = seg[-(i1 - i0):]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return out * e * 0.35 * g


def impacto(g=1.0, d=2.8):
    t = tt(d)
    f = 34 + 70 * np.exp(-t / 0.06)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7)
    corpo = filt(rng.standard_normal(len(t)), 220, "low") * np.exp(-t / 0.18) * 0.7
    return (sub + corpo) * g


def sino(n, d=3.5):
    t = tt(d)
    f = hz(n)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 1.2) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.5) \
        + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.25)
    return s * np.minimum(t / 0.002, 1) * 0.3


def riser(d):
    t = tt(d)
    n = len(t)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    for b in range(64):
        i0, i1 = b * n // 64, (b + 1) * n // 64
        fc = 400 * (9000 / 400) ** (b / 63)
        seg = filt(x[max(0, i0 - 2000):i1], [fc * 0.7, min(20000, fc * 1.4)], "band", 1)
        out[i0:i1] = seg[-(i1 - i0):]
    tom = np.sin(2 * np.pi * np.cumsum(hz(50) * 2 ** (2 * t / d)) / SR) * 0.25
    e = (t / d) ** 2.2
    return (out * 0.5 + tom) * e


def tique():
    n = int(0.05 * SR)
    return filt(rng.standard_normal(n), 3000, "high") * np.exp(-np.arange(n) / SR / 0.006) * 0.25



CORTES = [3.25, 5.85, 9.75, 14.3, 17.55, 20.15, 22.75, 26.0, 28.6]
CORTINAS = [5.85, 28.6]
LOGO = 31.8

# antes: contido, em si menor
add(molhado, pad([47, 54, 59, 62, 66], 6.6, a=1.8, r=1.2, corte=1200), 0.2, 0.75)
add(seco, drone(hz(35), 6.4, a=2.0, r=1.2), 0.2, 0.4)
add(molhado, ar(6.0, 600), 0.3, 0.3)
for i, n in enumerate([66, 69, 71, 74, 71, 69, 66, 64]):
    add(molhado, piano(n, 2.2), 0.65 + i * BAT, 0.22, [-0.3, 0.2, -0.1, 0.3, -0.2, 0.1, 0.0, -0.2][i])
add(molhado, sino(78, 2), 3.25, 0.08)
# o depois: abre em ré maior
add(seco, whoosh(0.9, 250, 4000, 1.0), CORTINAS[0] - 0.45, 1, -0.3)
add(seco, impacto(0.75, 2.6), CORTINAS[0])
for n in (38, 50, 57, 62, 66, 69):
    add(molhado, piano(n, 3.5), CORTINAS[0], 0.26)
add(molhado, sino(86, 3.0), CORTINAS[0] + 0.01, 0.16)
acordes = [[50, 54, 57, 62, 66], [45, 52, 57, 61, 64], [47, 50, 54, 59, 62], [43, 50, 55, 59, 62]]
bar = 4 * BAT
t0 = CORTINAS[0]
j = 0
while t0 + j * bar < 28.6:
    add(molhado, pad(acordes[j % 4], bar + 0.5, a=0.3, r=0.5, corte=1900), t0 + j * bar, 0.8)
    j += 1
k = 0
while CORTINAS[0] + k * BAT < 28.6 - 0.05:
    tb = CORTINAS[0] + k * BAT
    add(seco, bumbo(0.45 if tb < 14.3 else 0.62), tb)
    add(seco, chimbal(0.03), tb + BAT / 2, 0.5 if tb < 14.3 else 0.7, 0.35)
    if tb >= 14.3 and k % 2 == 1:
        add(molhado, palma(), tb, 0.4)
    k += 1
arp = [74, 78, 81, 86, 81, 78, 76, 78]
for i in range(int((28.6 - CORTINAS[0]) / (BAT / 2))):
    tb = CORTINAS[0] + i * BAT / 2
    raiz = acordes[int((tb - t0) // bar) % 4][0]
    add(molhado, piano(raiz + 24 + [0, 4, 7, 12, 7, 4, 2, 4][i % 8] - (1 if raiz in (45,) and i % 8 == 1 else 0), 1.1), tb, 0.10, 0.5 * np.sin(i * 0.7))
for c in CORTES:
    if c not in CORTINAS:
        add(seco, whoosh(0.5, 400, 3000, 0.35), c - 0.22, 1, 0.4 if int(c * 10) % 2 else -0.4)
add(seco, whoosh(0.8, 300, 3200, 0.7), 9.75 - 0.1, 1, 0.0)
add(seco, impacto(0.45, 1.8), 9.75)
# o fecho
add(seco, whoosh(0.9, 250, 4000, 0.9), CORTINAS[1] - 0.45, 1, 0.3)
add(molhado, pad([43, 50, 55, 59, 62, 66], 3.4, a=0.4, r=1.0), 28.6, 0.9)
for i, n in enumerate([74, 78, 81, 83]):
    add(molhado, piano(n, 2.8), 29.2 + i * BAT, 0.22, [-0.2, 0.2, -0.1, 0.1][i])
add(seco, impacto(0.9, 3.0), LOGO)
for n in (38, 50, 57, 62, 66, 69, 76):
    add(molhado, piano(n, 3.8), LOGO, 0.26)
add(molhado, sino(86, 3.5), LOGO + 0.01, 0.22)
add(molhado, pad([38, 50, 54, 57, 62, 64], DUR - LOGO, a=0.5, r=2.2), LOGO, 1.0)
for i in range(5):
    add(seco, tique(), 32.6 + i * 0.075 + 0.05, 0.4, -0.4 + 0.2 * i)

# ---------- mixagem ----------
ir_t = tt(2.4)
ir = rng.standard_normal((2, len(ir_t))) * np.exp(-ir_t / 0.55)
ir = np.stack([filt(ir[0], 6000), filt(ir[1], 6000)])
ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
rev = np.stack([fftconvolve(molhado[c], ir[c])[:N] for c in range(2)])
mix = seco + molhado * 0.85 + rev * 0.45
mix = np.stack([filt(mix[c], 28, "high", 2) for c in range(2)])
# silêncio no começo e respiro antes do impacto
t = np.arange(N) / SR
g = np.clip((t - 0.1) / 0.5, 0, 1)
resp = 1
fim = np.clip((DUR - t) / 1.1, 0, 1) ** 1.5
mix *= g * resp * fim
# nível: RMS da parte ativa perto de -18 dBFS e pico abaixo de -1 dBFS
ativo = mix[:, int(0.5 * SR):int(34 * SR)]
rms = np.sqrt((ativo ** 2).mean())
mix *= 10 ** (-17 / 20) / rms
mix = np.tanh(mix * 1.1) / 1.1
mix *= 10 ** (-1 / 20) / max(1e-9, np.abs(mix).max())
os.makedirs("assets", exist_ok=True)
wavfile.write("assets/trilha.wav", SR, (mix.T * 32767).astype(np.int16))
print("assets/trilha.wav", DUR, "s")
