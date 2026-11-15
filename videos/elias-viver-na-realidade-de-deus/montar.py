"""montar.py (Elias): tempos das falas a partir das vozes da ElevenLabs (tempo de cada caractere),
legenda em pedaços, faixa de voz única e abertura da boca. Saída: proj/tempos.js e proj/media/voz.wav"""
import json, subprocess, re, wave, struct, math, os
AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI)
falas = json.load(open('falas.json'))
FPS, GAP = 30, 0.3
PAUSA_ANTES = {1: 1.8, 4: 0.8, 7: 0.4, 9: 0.9, 12: 0.2, 14: 0.9, 16: 1.0, 18: 0.4, 19: 0.3, 20: 1.4, 23: 0.2, 25: 0.9, 27: 0.4}
FIM = 4.0
DESTAQUE = {1: 'nada', 2: 'sete', 3: 'sete', 4: 'diante', 5: 'choveu', 6: 'sobreviveu', 7: 'corvos', 8: 'entrega', 9: '450', 10: 'mancando', 11: 'dois', 12: 'existisse', 13: 'assim', 14: 'fogo', 15: 'uau', 16: 'chuva', 17: 'nada', 18: 'nuvem', 19: 'chuva', 20: 'perseverar', 21: 'igual', 22: 'mim', 23: 'cuidou', 24: 'realidade', 25: 'quantas', 26: 'ouvindo', 27: 'real'}
def dur(p): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))
def limpa(w): return re.sub(r'[^\wÀ-ú-]', '', w).lower()
def pedacos(ws):
    out, cur = [], []
    for w in ws:
        cur.append(w)
        if len(cur) >= 5 or (w[-1] in '.,!?:' and len(cur) >= 2) or w[-1] in '.!?':
            out.append(cur); cur = []
    if cur: out.append(cur)
    i = 0
    while i < len(out):
        if len(out[i]) == 1 and len(out) > 1:
            if i > 0 and len(out[i - 1]) <= 5: out[i - 1] += out.pop(i); continue
            if i + 1 < len(out) and len(out[i + 1]) <= 5: out[i + 1] = out[i] + out[i + 1]; out.pop(i); continue
        i += 1
    return out
t, saida, faixas = 0.0, [], []
for f in falas:
    t += PAUSA_ANTES.get(f['id'], 0) + (GAP if f['id'] > 1 else 0)
    base = 'voz/f%02d' % f['id']
    d = dur(base + '.mp3')
    al = json.load(open(base + '.json'))
    chars = ''.join(al['characters']); st = al['character_start_times_seconds']
    ws = f['txt'].split()
    pal, pos = [], 0
    for w in ws:
        k = chars.find(w, pos)
        if k < 0: k = chars.lower().find(limpa(w)[:4], pos)
        tw = st[k] if k >= 0 else (pal[-1]['t'] - t + 0.3 if pal else 0)
        if k >= 0: pos = k + len(w)
        pal.append({'w': w, 't': round(t + tw, 3)})
    alvo = DESTAQUE.get(f['id']); chunks = []; idx = 0
    for g in pedacos(ws):
        html = []
        for w in g:
            if alvo and limpa(w).startswith(limpa(alvo)): html.append('<b>%s</b>' % w); alvo = None
            else: html.append(w)
        chunks.append({'t0': round(pal[idx]['t'] - 0.06, 3), 'html': ' '.join(html)}); idx += len(g)
    for i, c in enumerate(chunks):
        c['t1'] = chunks[i + 1]['t0'] if i + 1 < len(chunks) else round(t + d + 0.2, 3)
    saida.append({'id': f['id'], 'cena': f['cena'], 'quem': f['quem'], 'ref': f.get('ref'), 't0': round(t, 3), 't1': round(t + d, 3), 'palavras': pal, 'chunks': chunks})
    faixas.append((base + '.mp3', t)); t += d
D = round(t + FIM, 2)
os.makedirs('proj/media', exist_ok=True)
args = ['ffmpeg', '-y', '-v', 'error']
for a, _ in faixas: args += ['-i', a]
filt = ''.join('[%d]adelay=%d:all=1[a%d];' % (i, int(s * 1000), i) for i, (_, s) in enumerate(faixas))
filt += ''.join('[a%d]' % i for i in range(len(faixas))) + 'amix=inputs=%d:normalize=0,apad=whole_dur=%.2f[o]' % (len(faixas), D)
subprocess.check_call(args + ['-filter_complex', filt, '-map', '[o]', '-ar', '44100', '-ac', '1', 'proj/media/voz.wav'])
w = wave.open('proj/media/voz.wav'); sr, n = w.getframerate(), w.getnframes()
am = struct.unpack('<%dh' % n, w.readframes(n)); nq = int(math.ceil(D * FPS)); rms = []
for q in range(nq):
    seg = am[int(q * sr / FPS):int((q + 1) * sr / FPS)] or [0]
    rms.append(math.sqrt(sum(x * x for x in seg) / len(seg)) / 32768)
pico = sorted(rms)[int(len(rms) * 0.97)] or 1
boca = {'J': [0] * nq, 'D': [0] * nq}
for s in saida:
    for q in range(int(s['t0'] * FPS), min(nq, int(s['t1'] * FPS) + 1)):
        boca[s['quem']][q] = round(min(1, rms[q] / pico) ** 0.7, 2)
open('proj/tempos.js', 'w').write('window.TEMPOS = ' + json.dumps({'D': D, 'fps': FPS, 'falas': saida, 'boca': boca}, ensure_ascii=False) + ';\n')
print('duração', D)
for s in saida: print('%2d %s %6.2f-%6.2f c%d %s' % (s['id'], s['quem'], s['t0'], s['t1'], s['cena'], ' | '.join(c['html'] for c in s['chunks'])))
