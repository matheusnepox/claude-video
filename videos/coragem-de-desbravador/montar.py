"""montar.py: lê falas.json e voz/fNN.wav, monta a linha do tempo, a faixa de voz e o movimento da boca.
Saída: proj/tempos.js (window.TEMPOS) e proj/media/voz.wav."""
import json, subprocess, re, wave, struct, math, os

AQUI = os.path.dirname(os.path.abspath(__file__))
os.chdir(AQUI)
falas = json.load(open('falas.json'))
FPS = 30
GAP = 0.26
PAUSA_ANTES = {1: 2.4, 7: 0.7, 12: 1.2, 17: 0.7, 21: 0.7, 26: 0.8, 29: 0.3, 31: 1.0, 33: 0.4}
PAUSA_DEPOIS_FIM = 3.8
DESTAQUE = {1: 'bravo', 2: 'quiser', 3: 'medo', 4: 'tranquilo', 5: 'escuro', 6: 'desbravador', 7: 'angústia',
            8: 'Getsêmani', 9: 'Senhor', 10: 'medo', 11: 'confiar', 12: 'tempestade', 13: 'barco', 14: 'medo',
            15: 'tempestade', 16: 'barco', 17: 'água', 18: 'afundar', 19: 'mão', 20: 'mim', 21: 'aperto',
            22: 'coração', 23: 'corajoso', 24: 'poder', 25: 'especialidade', 26: 'sozinho', 27: 'fortalece',
            28: 'coragem', 29: 'lenço', 30: 'missão', 31: 'medo', 32: 'sozinho', 33: 'motiva'}
TELA = {26: lambda s: s.replace('Salmo vinte e três', 'Salmo 23'),
        14: lambda s: s.replace('perguntei: Por que', 'perguntei: “Por que').replace('medo?', 'medo?”'),
        23: lambda s: s.replace('Josué: Seja', 'Josué: “Seja').replace('andar.', 'andar.”')}


def dur(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))


def limpa(w):
    return re.sub(r'[^\wÀ-ú]', '', w).lower()


def pedacos(palavras):
    """grupos de no máximo 5 palavras, quebrando em pontuação."""
    out, cur = [], []
    for i, w in enumerate(palavras):
        cur.append(i)
        fim = w[-1] in '.,!?:…' or w.endswith('...')
        if len(cur) >= 5 or (fim and len(cur) >= 2) or (w[-1] in '.!?' and len(cur) >= 1):
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    # nada de pedaço de uma palavra só: junta com o vizinho (até 6 palavras)
    i = 0
    while i < len(out):
        if len(out[i]) == 1 and len(out) > 1:
            if i > 0 and len(out[i - 1]) <= 5:
                out[i - 1] += out.pop(i); continue
            if i + 1 < len(out) and len(out[i + 1]) <= 5:
                out[i + 1] = out[i] + out[i + 1]; out.pop(i); continue
        i += 1
    return out


t = 0.0
saida, faixas = [], []
for f in falas:
    t += PAUSA_ANTES.get(f['id'], 0) + (GAP if f['id'] > 1 else 0)
    arq = 'voz/f%02d.wav' % f['id']
    d = dur(arq)
    tela = TELA.get(f['id'], lambda s: s)(f['txt'])
    ws = tela.split()
    # tempo de cada palavra proporcional ao número de letras (+1 por espaço, +3 por pausa de pontuação)
    pesos = [len(w) + 1 + (3 if w[-1] in '.,!?:' else 0) for w in ws]
    tot = sum(pesos)
    margem_i, margem_f = 0.08, 0.15
    util = d - margem_i - margem_f
    acum, pal = 0, []
    for w, p in zip(ws, pesos):
        pal.append({'w': w, 't': round(t + margem_i + util * acum / tot, 3)})
        acum += p
    alvo = DESTAQUE.get(f['id'])
    chunks = []
    for grupo in pedacos(ws):
        html, marcou = [], False
        for i in grupo:
            w = ws[i]
            if alvo and not marcou and limpa(w) == limpa(alvo):
                html.append('<b>%s</b>' % w); marcou = True; alvo = None
            else:
                html.append(w)
        chunks.append({'t0': pal[grupo[0]]['t'] - 0.08, 'html': ' '.join(html)})
    for i, c in enumerate(chunks):
        c['t1'] = round(chunks[i + 1]['t0'] if i + 1 < len(chunks) else t + d + 0.25, 3)
        c['t0'] = round(c['t0'], 3)
    saida.append({'id': f['id'], 'cena': f['cena'], 'quem': f['quem'], 'ref': f.get('ref'),
                  't0': round(t, 3), 't1': round(t + d, 3), 'palavras': pal, 'chunks': chunks})
    faixas.append((arq, t))
    t += d
D = round(t + PAUSA_DEPOIS_FIM, 2)

# faixa de voz única
os.makedirs('proj/media', exist_ok=True)
args = ['ffmpeg', '-y', '-v', 'error']
for a, _ in faixas:
    args += ['-i', a]
filt = ''.join('[%d]adelay=%d:all=1[a%d];' % (i, int(st * 1000), i) for i, (_, st) in enumerate(faixas))
filt += ''.join('[a%d]' % i for i in range(len(faixas))) + 'amix=inputs=%d:normalize=0,apad=whole_dur=%.2f[o]' % (len(faixas), D)
args += ['-filter_complex', filt, '-map', '[o]', '-ar', '24000', '-ac', '1', 'proj/media/voz.wav']
subprocess.check_call(args)

# boca: abertura 0..1 por quadro, separada por quem fala
w = wave.open('proj/media/voz.wav')
sr, n = w.getframerate(), w.getnframes()
amostras = struct.unpack('<%dh' % n, w.readframes(n))
nq = int(math.ceil(D * FPS))
rms = []
for q in range(nq):
    a, b = int(q * sr / FPS), int((q + 1) * sr / FPS)
    seg = amostras[a:b] or [0]
    rms.append(math.sqrt(sum(x * x for x in seg) / len(seg)) / 32768)
pico = sorted(rms)[int(len(rms) * 0.97)] or 1
boca = {'J': [0] * nq, 'D': [0] * nq}
for s in saida:
    for q in range(int(s['t0'] * FPS), min(nq, int(s['t1'] * FPS) + 1)):
        boca[s['quem']][q] = round(min(1, rms[q] / pico) ** 0.7, 2)

open('proj/tempos.js', 'w').write('window.TEMPOS = ' + json.dumps({'D': D, 'fps': FPS, 'falas': saida, 'boca': boca}, ensure_ascii=False) + ';\n')
print('duração', D, 's;', len(saida), 'falas')
for s in saida:
    print('%3d %s %6.2f-%6.2f cena %d' % (s['id'], s['quem'], s['t0'], s['t1'], s['cena']))
