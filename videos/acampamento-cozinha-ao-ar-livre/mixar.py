"""mixar.py: trilha bem baixa sob a voz (baixo) e mais presente nas pausas (alto), com rampas de 0,3 s."""
import json, subprocess, sys
sys.setrecursionlimit(10000)
d = json.loads(open('proj/tempos.js').read()[16:-2]); D = d['D']
m = []
for f in d['falas']:
    a, b = f['t0'] - 0.25, f['t1'] + 0.35
    if m and a <= m[-1][1]: m[-1] = (m[-1][0], b)
    else: m.append((a, b))
baixo, alto, r = 0.024, 0.3, 0.3
def nest(i):
    if i == len(m): return str(alto)
    a, b = m[i]
    return f"if(between(t,{a-r:.3f},{a:.3f}),{alto}+({baixo}-{alto})*(t-{a-r:.3f})/{r},if(between(t,{a:.3f},{b:.3f}),{baixo},if(between(t,{b:.3f},{b+r:.3f}),{baixo}+({alto}-{baixo})*(t-{b:.3f})/{r},{nest(i+1)})))"
v = nest(0)
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', 'proj/media/voz.wav', '-i', 'trilha.mp3', '-filter_complex',
    f"[1]aresample=44100,volume='{v}':eval=frame,afade=t=out:st={D-4}:d=4[m];[0]aresample=44100[v];[v][m]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=11[o]",
    '-map', '[o]', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', 'mix.wav'])
if len(sys.argv) > 1:  # conferir a diferença voz x trilha em cada fala
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', 'trilha.mp3', '-af', f"aresample=44100,volume='{v}':eval=frame", sys.argv[1]])
    def vol(f, a, b):
        o = subprocess.run(['ffmpeg', '-ss', str(a), '-to', str(b), '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
        return float(o.split('mean_volume: ')[1].split(' dB')[0])
    ds = [vol('proj/media/voz.wav', f['t0'], f['t1']) - vol(sys.argv[1], f['t0'] + 0.1, max(f['t0'] + 0.3, f['t1'] - 0.1)) for f in d['falas']]
    print('voz acima da trilha (dB):', [round(x, 1) for x in ds], '| menor', round(min(ds), 1))
