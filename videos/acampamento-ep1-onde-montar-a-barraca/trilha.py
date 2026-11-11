import json, urllib.request, sys
prompt = ("Instrumental background music for a cheerful children's camping video with a young scout in a toy-like 3D world. "
  "Bright acoustic guitar strumming, ukulele, light hand claps, glockenspiel and soft whistling melody, playful and adventurous, around 105 BPM. "
  "Short gentle build every 15 seconds to mark each new tip, a playful stinger around 0:25 and 0:52, a brief tense pulse with low drum around 0:59 for the lightning, "
  "then back to happy. Final 15 seconds a little bigger and celebratory, ending on a clean final chord. No vocals, no lyrics. Stay light under narration.")
body = json.dumps({'prompt': prompt, 'music_length_ms': int(float(sys.argv[1]) * 1000), 'model_id': 'music_v1', 'force_instrumental': True}).encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', data=body, headers={'Content-Type': 'application/json'})
try:
    data = urllib.request.urlopen(req, timeout=600).read()
    open('trilha.mp3', 'wb').write(data); print('ok', len(data))
except urllib.error.HTTPError as e:
    print('ERRO', e.code, e.read()[:500])
