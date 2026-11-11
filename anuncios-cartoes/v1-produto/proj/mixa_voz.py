#!/usr/bin/env python3
"""Junta as falas (assets/falas/fala-N.wav, posicionadas por assets/falas/tempos.json) com a trilha (assets/trilha.wav).
Trata a voz (graves, presença, compressão leve) e abaixa a música ~9 dB enquanto a voz fala.
Saída: assets/trilha-com-voz.wav (≈ −14 LUFS, pico ≤ −1 dBFS).   uso (de dentro de proj/): python3 mixa_voz.py"""
import json
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
_, musica = wavfile.read('assets/trilha.wav')
musica = musica.astype(np.float64).T / 32768
N = musica.shape[1]
voz = np.zeros(N)
for f in json.load(open('assets/falas/tempos.json')):
    sr, x = wavfile.read(f"assets/falas/fala-{f['fala']}.wav")
    x = x.astype(np.float64) / 32768
    j = int(f['ini'] * SR)
    n = min(len(x), N - j)
    voz[j:j + n] += x[:n]
voz = sosfilt(butter(2, 90, 'high', fs=SR, output='sos'), voz)
voz = voz + 0.18 * sosfilt(butter(2, [2500, 6000], 'band', fs=SR, output='sos'), voz)
env = np.sqrt(fftconvolve(voz ** 2, np.ones(int(0.02 * SR)) / int(0.02 * SR), mode='same') + 1e-12)
lim = 10 ** (-20 / 20)
voz *= np.where(env > lim, (lim / env) ** (1 - 1 / 3.0), 1.0)
voz *= 10 ** (-16 / 20) / (np.sqrt(np.mean(voz[np.abs(voz) > 1e-4] ** 2)) + 1e-9)
ativo = fftconvolve((np.abs(voz) > 0.004).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same') > 0.02
alvo = np.where(ativo, 10 ** (-9 / 20), 1.0)
g = np.empty(N); g[0] = 1.0
at, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.35 * SR))
for i in range(1, N):
    c = at if alvo[i] < g[i - 1] else rel
    g[i] = c * g[i - 1] + (1 - c) * alvo[i]
mix = musica * g + np.stack([voz, voz])
try:
    import pyloudnorm as pyln
    mix *= 10 ** ((-14.0 - pyln.Meter(SR).integrated_loudness(mix.T)) / 20)
except Exception:
    pass
mix = np.tanh(mix * 1.1) / 1.1
mix *= min(1.0, 10 ** (-1 / 20) / np.abs(mix).max())
wavfile.write('assets/trilha-com-voz.wav', SR, (mix.T * 32767).astype(np.int16))
print('assets/trilha-com-voz.wav pronto')
