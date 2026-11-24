"""Recorta as falas de uma tomada da ElevenLabs pelos silêncios, acelera 7 % (atempo, sem mudar o tom)
e monta a linha do tempo: cada fala entra 0,3 s depois da anterior. Saída: <saida>/fala-N.wav e tempos.json.
uso: python3 -I falas.py tomada.mp3 pasta_saida [lead] [gap] [fator]"""
import json, os, subprocess, sys
import numpy as np
from scipy.io import wavfile
src, out = sys.argv[1], sys.argv[2]
lead = float(sys.argv[3]) if len(sys.argv) > 3 else 0.3
gap = float(sys.argv[4]) if len(sys.argv) > 4 else 0.3
fator = float(sys.argv[5]) if len(sys.argv) > 5 else 1.07
os.makedirs(out, exist_ok=True)
tmp = os.path.join(out, '_tudo.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', f'atempo={fator}', '-ac', '1', '-ar', '48000', tmp], check=True)
sr, x = wavfile.read(tmp); x = x.astype(float) / 32768
# envelope em janelas de 10 ms
w = int(0.01 * sr); n = len(x) // w
env = np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1))
voz = env > 10 ** (-42 / 20)
# junta buracos curtos (< 0,32 s) e separa nas pausas longas
segs, i = [], 0
while i < n:
    if voz[i]:
        j = i
        while j < n and (voz[j] or (j + 32 < n and voz[j:j + 32].any())):
            j += 1
        segs.append((i * w / sr, j * w / sr)); i = j
    else:
        i += 1
segs = [s for s in segs if s[1] - s[0] > 0.4]
t, tempos = lead, []
for k, (a, b) in enumerate(segs):
    a0, b0 = max(0, a - 0.03), min(len(x) / sr, b + 0.08)
    seg = x[int(a0 * sr):int(b0 * sr)].copy()
    f = int(0.01 * sr); seg[:f] *= np.linspace(0, 1, f); seg[-3 * f:] *= np.linspace(1, 0, 3 * f)
    wavfile.write(os.path.join(out, f'fala-{k + 1}.wav'), sr, (seg * 32767).astype(np.int16))
    tempos.append({'fala': k + 1, 'ini': round(t, 2), 'dur': round(b0 - a0, 2), 'fim': round(t + b0 - a0, 2)})
    t += (b0 - a0) + gap
os.remove(tmp)
json.dump(tempos, open(os.path.join(out, 'tempos.json'), 'w'), indent=1)
for q in tempos: print(q)
print('fim da última fala:', tempos[-1]['fim'])
