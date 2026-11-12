#!/usr/bin/env python3
"""SoundDesign do filme SEVEN: trilha e efeitos 100 % sintetizados aqui (sem samples de terceiros).
Ré maior, 90 BPM. Começa em silêncio, cresce com pad, piano e percussão, segura a respiração antes
da revelação e solta o impacto quando o 7 aparece. Os marcos são os mesmos de js/roteiro.js.
Saída: assets/trilha.wav (48 kHz, estéreo).  uso: python3 trilha.py"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR, DUR = 48000, 42.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
BAT = 60 / 90  # uma batida

# marcos (iguais a js/roteiro.js)
M = dict(ponto=0.7, ideia=2.75, ideiaSai=4.45, tunel=4.6, criados=5.6, criadosSai=7.85, criar=8.7,
         cortina1=10.45, barra=11.5, tri=12.25, sete=12.95, simboloSobe=15.25, broto=15.5,
         cortina2=18.55, vitrine=[19.15, 22.45, 25.75], pan=[22.05, 25.35], cortina3=28.4,
         impacto=31.0, letras=31.95, assinatura=32.85, sobe=36.0, frase=36.6, volta=40.05, pouso=40.9)

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


# ---------- ATO 1: ORIGEM (silêncio, ar, um ponto de luz) ----------
add(seco, drone(hz(38), 11.5, a=4.0, r=2.5), 0.6, 0.45)
add(molhado, ar(10.0, 700), 0.8, 0.4)
add(seco, impacto(0.35, 2.0), M["ponto"])
add(molhado, sino(81, 4), M["ponto"], 0.28, 0.1)
add(molhado, piano(74), 2.2, 0.35, -0.3)
add(molhado, piano(78), M["ideia"], 0.45, 0.2)
add(seco, impacto(0.3, 1.5), M["ideia"])
add(seco, whoosh(0.7, 400, 2500, 0.5), M["ideiaSai"] - 0.15, 1, -0.3)

# ---------- ATO 2: INSPIRAÇÃO ----------
add(molhado, pad([50, 54, 57, 61, 64], 7.0, a=2.5, r=1.5), M["tunel"], 0.7)
for i, n in enumerate([66, 69, 73, 71]):
    add(molhado, piano(n), M["criados"] + i * BAT * 1.5, 0.32, [-0.4, 0.3, -0.1, 0.4][i])
add(seco, whoosh(0.8, 300, 2000, 0.4), M["criadosSai"] - 0.1, 1, 0.3)
add(seco, impacto(0.75, 2.4), M["criar"])
for n in (50, 57, 62, 66):
    add(molhado, piano(n, 3.2), M["criar"], 0.32)
add(molhado, sino(86, 3), M["criar"] + 0.02, 0.18, 0.3)

# ---------- ATO 3: IDENTIDADE ----------
add(seco, whoosh(1.0, 200, 4000, 1.0), M["cortina1"] - 0.1, 1, -0.4)
add(molhado, pad([47, 54, 59, 62, 69], 5.2, a=1.0, r=1.8), M["cortina1"] + 0.3, 1.0)
add(molhado, pad([43, 50, 55, 59, 66], 4.4, a=1.5, r=1.2), 15.3, 1.0)
add(seco, impacto(0.6, 2.2), M["barra"])
add(molhado, sino(86, 4), M["tri"], 0.25, 0.2)
add(seco, tique(), M["tri"], 0.6)
# pulsação suave
t0 = 12.0
k = 0
while t0 + k * BAT < M["cortina2"] - 0.1:
    tb = t0 + k * BAT
    add(seco, bumbo(0.35 if tb < 15.3 else 0.5), tb)
    if tb >= 15.3:
        add(seco, chimbal(), tb + BAT / 2, 0.5, 0.3)
    k += 1
arp = [71, 74, 78, 81, 78, 74]
for j in range(int((M["cortina2"] - 13.0) / (BAT / 2))):
    tb = 13.0 + j * BAT / 2
    nota = arp[j % len(arp)] - (4 if tb >= 15.3 else 0)
    add(molhado, piano(nota, 1.4), tb, 0.14, 0.5 * np.sin(j))
add(seco, whoosh(0.7, 500, 3000, 0.5), M["simboloSobe"] - 0.1, 1, 0.4)
add(seco, whoosh(0.9, 300, 2500, 0.45), M["broto"], 1, 0.5)

# ---------- ATO 4: EXPRESSÃO ----------
add(seco, whoosh(1.0, 200, 4500, 1.0), M["cortina2"] - 0.1, 1, 0.4)
acordes = [[43, 50, 55, 59, 62], [50, 54, 57, 62, 66], [45, 52, 57, 61, 64], [47, 50, 54, 59, 62]]
bar = 4 * BAT
ini4 = 19.0
for j in range(4):
    add(molhado, pad(acordes[j % 4], bar * 1.0 + 0.6, a=0.25, r=0.5, corte=2000), ini4 + j * bar, 0.85)
k = 0
while ini4 + k * BAT < M["cortina3"] - 0.05:
    tb = ini4 + k * BAT
    add(seco, bumbo(0.75), tb)
    add(seco, chimbal(0.03), tb + BAT / 2, 0.75, 0.35)
    add(seco, chimbal(0.012), tb + BAT * 0.75, 0.35, -0.35)
    if k % 2 == 1:
        add(molhado, palma(), tb, 0.55)
    k += 1
arp4 = [74, 78, 81, 86, 81, 78, 74, 69]
for j in range(int((M["cortina3"] - ini4) / (BAT / 2))):
    tb = ini4 + j * BAT / 2
    raiz = acordes[int((tb - ini4) // bar) % 4][1]
    add(molhado, piano(raiz + 24 + [0, 4 if raiz in (50,) else 3, 7, 12][j % 4], 1.2), tb, 0.13, 0.5 * np.cos(j))
for tv in M["vitrine"]:
    add(seco, whoosh(0.8, 250, 3500, 0.55), tv - 0.05, 1, -0.4)
for tp in M["pan"]:
    add(seco, whoosh(1.0, 200, 3000, 0.8), tp - 0.05, 1, 0.5)

# ---------- ATO 5: REVELAÇÃO ----------
add(seco, whoosh(1.0, 200, 4500, 1.0), M["cortina3"] - 0.1, 1, -0.4)
add(seco, riser(M["impacto"] - 0.15 - (M["cortina3"] + 0.2)), M["cortina3"] + 0.2, 0.55)
add(molhado, pad([45, 52, 57, 61, 64], 2.4, a=1.6, r=0.25, corte=2600), M["cortina3"] + 0.2, 0.7)
# respiração: silêncio de 0,15 s e o impacto
add(seco, impacto(1.25, 3.5), M["impacto"])
add(seco, bumbo(1.0), M["impacto"])
for n in (38, 50, 57, 62, 66, 69, 74):
    add(molhado, piano(n, 4.5), M["impacto"], 0.3)
add(molhado, sino(86, 5), M["impacto"] + 0.01, 0.3)
add(molhado, pad([38, 50, 54, 57, 62, 66], M["pouso"] - M["impacto"] + 1.0, a=0.6, r=1.5, corte=2200), M["impacto"], 1.15)
add(seco, drone(hz(38), 11.5, a=1.0, r=3.0), M["impacto"], 0.6)
for i in range(5):
    add(seco, tique(), M["letras"] + i * 0.075 + 0.05, 0.5, -0.4 + 0.2 * i)
for i, n in enumerate([81, 86, 90, 93]):
    add(molhado, sino(n, 2.5), M["assinatura"] + i * 0.12, 0.09, -0.3 + 0.2 * i)
for i, n in enumerate([74, 78, 81, 78, 76, 74]):
    add(molhado, piano(n, 2.6), 33.8 + i * BAT * 1.5, 0.22, [-0.3, 0.2, 0.0, 0.3, -0.2, 0.1][i])
add(seco, whoosh(0.9, 300, 2400, 0.5), M["sobe"] - 0.05, 1, 0.2)
for i, n in enumerate([69, 74, 78]):
    add(molhado, piano(n, 3.0), M["frase"] + i * 0.4, 0.25)
add(molhado, piano(81, 3.0), M["frase"] + 0.85, 0.25)
add(seco, whoosh(0.9, 300, 2400, 0.5), M["volta"] - 0.05, 1, -0.2)
# pouso final
add(seco, impacto(1.0, 2.6), M["pouso"])
for n in (50, 57, 62, 66, 69):
    add(molhado, piano(n, 3.0), M["pouso"], 0.3)
add(molhado, sino(86, 3.0), M["pouso"] + 0.01, 0.3)

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
g = np.clip((t - 0.5) / 0.4, 0, 1)
resp = 1 - 0.85 * np.clip((t - (M["impacto"] - 0.18)) / 0.08, 0, 1) * np.clip((M["impacto"] - t) / 0.02, 0, 1)
fim = np.clip((DUR - t) / 1.1, 0, 1) ** 1.5
mix *= g * resp * fim
# nível: RMS da parte ativa perto de -18 dBFS e pico abaixo de -1 dBFS
ativo = mix[:, int(0.8 * SR):int(41 * SR)]
rms = np.sqrt((ativo ** 2).mean())
mix *= 10 ** (-17 / 20) / rms
mix = np.tanh(mix * 1.1) / 1.1
mix *= 10 ** (-1 / 20) / max(1e-9, np.abs(mix).max())
os.makedirs("assets", exist_ok=True)
wavfile.write("assets/trilha.wav", SR, (mix.T * 32767).astype(np.int16))
print("assets/trilha.wav", DUR, "s")
