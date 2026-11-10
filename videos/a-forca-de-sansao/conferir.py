import json, os, urllib.request, uuid, re, difflib
AQUI = os.path.dirname(os.path.abspath(__file__))
falas = json.load(open(os.path.join(AQUI, 'falas.json')))
def norm(s): return re.sub(r'[^\wà-ú ]', '', s.lower()).split()
tot = 0
for f in falas:
    p = os.path.join(AQUI, 'voz', 'f%02d.mp3' % f['id'])
    b = '----' + uuid.uuid4().hex
    data = open(p, 'rb').read()
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n--{b}\r\nContent-Disposition: form-data; name="language_code"\r\n\r\npt\r\n--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n').encode() + data + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={'Content-Type': 'multipart/form-data; boundary=' + b})
    r = json.load(urllib.request.urlopen(req, timeout=120))
    a, o = norm(f['txt']), norm(r['text'])
    sim = difflib.SequenceMatcher(None, a, o).ratio()
    print('%2d %.2f %s' % (f['id'], sim, '' if sim > 0.97 else '| ouvido: ' + r['text']))
