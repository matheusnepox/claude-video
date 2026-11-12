#!/usr/bin/env python3
"""Junta a locução (ElevenLabs, voz "André - Natural excitement") com a trilha do Reels.
Corta as 7 falas da tomada, põe cada uma na cena dela, trata a voz (graves, compressão leve) e abaixa a música
enquanto a voz fala (ducking ~9 dB). Saída: assets/trilha-com-voz.wav.
uso (de dentro de proj/): python3 mixa_voz.py [../locucao/take1.mp3]"""
import os
import subprocess
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
TOMADA = sys.argv[1] if len(sys.argv) > 1 else '../locucao/take1.mp3'
# (início no áudio da tomada, fim, onde entra no vídeo) — cortes achados nos silêncios da tomada 1
FALAS = [
    (0.00, 1.28, 0.35),    # O que a Seven faz?
    (2.84, 5.37, 3.10),    # A gente transforma ideias em soluções.
    (6.04, 11.42, 6.20),   # Na gráfica: ...
    (12.06, 16.95, 12.30), # Na comunicação visual: ...
    (17.35, 22.41, 18.30), # E na publicidade: ...
    (22.98, 26.67, 24.10), # Mais do que produzir materiais...
    (27.33, 31.32, 28.40), # Seven. Comunicação com propósito. Chama a gente no direct!
]

wav = '/tmp/claude-0/-home-user-claude-video/09db05f7-933a-538c-bfb5-0084b9864786/scratchpad/voz.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', TOMADA, '-ac', '1', '-ar', str(SR), wav], check=True)
_, v = wavfile.read(wav)
v = v.astype(np.float64) / 32768
sr_m, musica = wavfile.read('assets/trilha.wav')
musica = musica.astype(np.float64).T / 32768
N = musica.shape[1]

# voz: corta cada fala com 40 ms de folga e fades curtos, e posiciona
voz = np.zeros(N)
for a, b, t in FALAS:
    i0, i1 = max(0, int((a - 0.04) * SR)), min(len(v), int((b + 0.12) * SR))
    seg = v[i0:i1].copy()
    f = int(0.012 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f * 3:] *= np.linspace(1, 0, f * 3)
    j = int((t - 0.04) * SR)
    voz[j:j + len(seg)] += seg[:N - j]
# tratamento: corta graves abaixo de 90 Hz, realce de presença, compressão suave
voz = sosfilt(butter(2, 90, 'high', fs=SR, output='sos'), voz)
pres = sosfilt(butter(2, [2500, 6000], 'band', fs=SR, output='sos'), voz)
voz = voz + 0.18 * pres
env = np.sqrt(fftconvolve(voz ** 2, np.ones(int(0.02 * SR)) / int(0.02 * SR), mode='same') + 1e-12)
lim = 10 ** (-20 / 20)
voz *= np.where(env > lim, (lim / env) ** (1 - 1 / 3.0), 1.0)
voz *= 10 ** (-16 / 20) / (np.sqrt(np.mean(voz[np.abs(voz) > 1e-4] ** 2)) + 1e-9)

# ducking: a música abaixa ~9 dB onde há voz (ataque 60 ms, soltura 350 ms)
ativo = (np.abs(voz) > 0.004).astype(float)
ativo = fftconvolve(ativo, np.ones(int(0.25 * SR)) / int(0.25 * SR), mode='same') > 0.02
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
