import json, urllib.request, sys
prompt = ("Instrumental background music for a cheerful children's outdoor cooking and campfire video with a young scout in a toy-like 3D world. "
  "Acoustic guitar and banjo strumming, light hand percussion, playful whistling melody, warm and adventurous, around 100 BPM, campfire vibe. "
  "Small transitions every 20 to 30 seconds to mark new topics; keep it light and steady, never busy. "
  "Final 15 seconds a bit bigger and happy, ending on a clean final chord. No vocals, no lyrics. Leave space for narration.")
body = json.dumps({'prompt': prompt, 'music_length_ms': int(float(sys.argv[1]) * 1000), 'model_id': 'music_v1', 'force_instrumental': True}).encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', data=body, headers={'Content-Type': 'application/json'})
try:
    data = urllib.request.urlopen(req, timeout=600).read()
    open('trilha.mp3', 'wb').write(data); print('ok', len(data))
except urllib.error.HTTPError as e:
    print('ERRO', e.code, e.read()[:500])
