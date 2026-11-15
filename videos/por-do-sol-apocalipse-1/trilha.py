import json, urllib.request, sys
prompt = ("Instrumental devotional music for a peaceful Friday sunset (welcoming the Sabbath) with Jesus and a young scout by a lake, in a toy-like 3D world. "
  "Warm acoustic guitar fingerpicking, soft piano, gentle strings and a light pad, 72 BPM, reverent, hopeful and tender. "
  "Slowly grows from very intimate to a warm, uplifting full string swell around the last 40 seconds as the sun disappears, "
  "then settles into a calm, peaceful ending chord. No drums, no vocals, no lyrics. Leave space for dialogue.")
body = json.dumps({'prompt': prompt, 'music_length_ms': int(float(sys.argv[1]) * 1000), 'model_id': 'music_v1', 'force_instrumental': True}).encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', data=body, headers={'Content-Type': 'application/json'})
try:
    data = urllib.request.urlopen(req, timeout=600).read()
    open('trilha.mp3', 'wb').write(data); print('ok', len(data))
except urllib.error.HTTPError as e:
    print('ERRO', e.code, e.read()[:500])
