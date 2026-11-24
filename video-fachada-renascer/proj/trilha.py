#!/usr/bin/env python3
"""Trilha da apresentação do projeto de fachada (Floricultura Renascer), 100 % sintetizada aqui.
Mesma linguagem sonora do filme da SEVEN: pad, piano, pulso suave, whooshes nas cortinas, tiques no traço.
Os marcos copiam js/roteiro.js. Saída: assets/trilha.wav (48 kHz, estéreo).  uso: python3 trilha.py"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 34.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
BAT = 60 / 96
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



T = dict(simbolo=0.35, titulo=0.7, medidas=1.7, cortinaAntes=3.05, cartaoAntes=3.9, cortinaProjeto=7.3,
         contorno=8.3, frisos=9.2, cotas=10.0, adesivos=11.6, legenda=12.2, encaixe=14.2, preenche=15.5,
         expande=16.3, cartaoDepois=17.2, comparar=20.0, divisor=[20.3, 22.0], detalhe1=24.8, detalhe2=26.7,
         cortinaFim=28.55, fimTexto=29.1, lockup=30.2)

# abertura
add(molhado, pad([50, 57, 62, 66, 69], 7.6, a=1.2, r=1.5), 0.0, 0.8)
add(seco, drone(hz(38), 7.4, a=1.0, r=2.0), 0.0, 0.5)
add(seco, impacto(0.45, 1.8), T['simbolo'])
add(molhado, sino(86, 3), T['simbolo'] + 0.35, 0.18, 0.2)
add(molhado, piano(74), T['titulo'], 0.3, -0.2)
add(molhado, piano(78), T['titulo'] + 0.3, 0.3, 0.2)
add(molhado, piano(81), T['medidas'], 0.3, 0.0)
# antes
add(seco, whoosh(0.9, 250, 3500, 0.9), T['cortinaAntes'] - 0.1, 1, -0.3)
for i, n in enumerate([69, 71, 74, 76]):
    add(molhado, piano(n, 2.0), T['cartaoAntes'] + i * BAT * 1.5, 0.22, [-0.3, 0.2, -0.1, 0.3][i])
# o projeto
add(seco, whoosh(0.9, 250, 3500, 0.9), T['cortinaProjeto'] - 0.1, 1, 0.3)
add(molhado, pad([47, 54, 59, 62, 66], 4.5, a=0.8, r=1.2, corte=1800), T['cortinaProjeto'] + 0.2, 0.9)
add(molhado, pad([43, 50, 55, 59, 62], 3.4, a=1.0, r=1.0, corte=1800), 11.6, 0.9)
k = 0
while T['contorno'] + k * BAT < T['encaixe'] + 1.4:
    tb = T['contorno'] + k * BAT
    add(seco, bumbo(0.35), tb)
    add(seco, chimbal(), tb + BAT / 2, 0.45, 0.3)
    k += 1
for i in range(8):  # o traço riscando
    add(seco, tique(), T['contorno'] + i * 0.16, 0.45, -0.5 + i * 0.12)
for i in range(10):
    add(seco, tique(), T['frisos'] + i * 0.07, 0.3, 0.4 - i * 0.08)
for i in range(12):  # cotas contando
    add(seco, tique(), T['cotas'] + i * 0.09, 0.35, 0.0)
for i in range(5):  # áreas de adesivo acendendo
    add(molhado, sino(81 + [0, 2, 4, 7, 9][i], 2.0), T['adesivos'] + i * 0.14, 0.12, -0.4 + 0.2 * i)
# encaixe e a fachada pronta
add(seco, whoosh(1.4, 200, 4000, 1.0), T['encaixe'], 1, 0.0)
add(seco, riser(T['expande'] - T['encaixe']), T['encaixe'], 0.4)
add(seco, impacto(1.0, 3.0), T['expande'] + 0.05)
add(seco, bumbo(0.9), T['expande'] + 0.05)
for n in (38, 50, 57, 62, 66, 69, 74):
    add(molhado, piano(n, 4.0), T['expande'] + 0.05, 0.28)
add(molhado, sino(86, 4), T['expande'] + 0.06, 0.25)
add(molhado, pad([38, 50, 54, 57, 62, 66], 12.5, a=0.5, r=2.0, corte=2200), T['expande'], 1.0)
k = 0
while T['expande'] + 2 + k * BAT < T['cortinaFim'] - 0.2:
    tb = T['expande'] + 2 + k * BAT
    add(seco, bumbo(0.5), tb)
    add(seco, chimbal(0.03), tb + BAT / 2, 0.6, 0.35)
    if k % 2:
        add(molhado, palma(), tb, 0.35)
    k += 1
arp = [74, 78, 81, 86, 81, 78]
for j in range(int((T['cortinaFim'] - T['expande'] - 2) / (BAT / 2))):
    add(molhado, piano(arp[j % 6], 1.2), T['expande'] + 2 + j * BAT / 2, 0.11, 0.5 * np.sin(j))
# comparação e detalhes
add(seco, whoosh(1.2, 200, 3000, 0.8), T['divisor'][0] - 0.05, 1, 0.5)
add(seco, whoosh(1.0, 300, 2500, 0.6), T['divisor'][1] - 0.05, 1, -0.5)
add(seco, whoosh(0.9, 250, 3500, 0.8), T['detalhe1'] - 0.1, 1, -0.3)
add(seco, whoosh(0.9, 250, 3500, 0.8), T['detalhe2'] - 0.1, 1, 0.3)
# assinatura
add(seco, whoosh(1.0, 200, 4500, 1.0), T['cortinaFim'] - 0.1, 1, 0.0)
add(molhado, pad([43, 50, 55, 59, 62, 66], 2.0, a=0.3, r=0.6), T['cortinaFim'], 0.8)
for i, n in enumerate([74, 78, 81]):
    add(molhado, piano(n, 2.5), T['fimTexto'] + i * 0.3, 0.22)
add(seco, impacto(1.1, 3.0), T['lockup'])
for n in (38, 50, 57, 62, 66, 69, 74):
    add(molhado, piano(n, 4.0), T['lockup'], 0.28)
add(molhado, sino(86, 4), T['lockup'] + 0.01, 0.28)
add(molhado, pad([38, 50, 54, 57, 62, 66], DUR - T['lockup'], a=0.4, r=2.5), T['lockup'], 1.0)
for i in range(5):
    add(seco, tique(), T['lockup'] + 0.8 + i * 0.075 + 0.05, 0.45, -0.4 + 0.2 * i)
for i, n in enumerate([81, 86, 90, 93]):
    add(molhado, sino(n, 2.5), T['lockup'] + 1.6 + i * 0.12, 0.08, -0.3 + 0.2 * i)

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
g = np.clip((t - 0.05) / 0.3, 0, 1)
resp = 1
fim = np.clip((DUR - t) / 1.1, 0, 1) ** 1.5
mix *= g * resp * fim
# nível: RMS da parte ativa perto de -18 dBFS e pico abaixo de -1 dBFS
ativo = mix[:, int(0.3 * SR):int(33 * SR)]
rms = np.sqrt((ativo ** 2).mean())
mix *= 10 ** (-17 / 20) / rms
mix = np.tanh(mix * 1.1) / 1.1
mix *= 10 ** (-1 / 20) / max(1e-9, np.abs(mix).max())
os.makedirs("assets", exist_ok=True)
wavfile.write("assets/trilha.wav", SR, (mix.T * 32767).astype(np.int16))
print("assets/trilha.wav", DUR, "s")
