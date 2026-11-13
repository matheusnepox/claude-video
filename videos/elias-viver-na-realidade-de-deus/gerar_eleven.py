"""gerar_eleven.py: gera cada fala com a ElevenLabs (com tempos de cada caractere). A chave vem do proxy do ambiente."""
import json, base64, urllib.request, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
VOZ = {'J': 'bZztR6P62TDbe6sgaZgz', 'D': 'mQTtm28IjDcoO2sbXmov'}  # Roberto Valença, Filipe
MODELO = os.environ.get('MODELO', 'eleven_v3')
falas = json.load(open(os.path.join(AQUI, 'falas.json')))
so = set(int(x) for x in sys.argv[1:])
for f in falas:
    if so and f['id'] not in so: continue
    out = os.path.join(AQUI, 'voz', 'f%02d' % f['id'])
    if os.path.exists(out + '.mp3') and not so: continue
    body = json.dumps({'text': f['fala'], 'model_id': MODELO, 'language_code': 'pt'}).encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/%s/with-timestamps?output_format=mp3_44100_128' % VOZ[f['quem']],
                                 data=body, headers={'Content-Type': 'application/json'})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        print('fala', f['id'], 'ERRO', e.code, e.read()[:300]); continue
    open(out + '.mp3', 'wb').write(base64.b64decode(r['audio_base64']))
    json.dump(r.get('normalized_alignment') or r.get('alignment'), open(out + '.json', 'w'))
    print('fala', f['id'], 'ok')
