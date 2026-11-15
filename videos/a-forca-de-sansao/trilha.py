import json, urllib.request, sys
prompt = ("Instrumental cinematic underscore for a children's Bible animation about Samson, made of toy-like 3D blocks. "
  "Warm, hopeful and adventurous. 0:00-0:17 playful light intro with pizzicato strings, marimba and soft piano. "
  "0:17-0:45 heroic build with orchestral strings and big taiko drum hits for the lion fight. "
  "0:45-1:24 slower and tense: low strings, quiet suspense, a sad cello melody as Samson loses his strength. "
  "1:24-1:52 gentle hope rising: soft piano, warm string swell, choir pads, a powerful dramatic hit at 1:50 when God answers his prayer. "
  "1:52-2:44 bright, uplifting and triumphant finale with strings, light brass and steady percussion, ending on a resolved major chord. "
  "No vocals, no lyrics. Leave space for dialogue, never too loud or busy.")
body = json.dumps({'prompt': prompt, 'music_length_ms': int(float(sys.argv[1]) * 1000), 'model_id': 'music_v1', 'force_instrumental': True}).encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', data=body, headers={'Content-Type': 'application/json'})
try:
    data = urllib.request.urlopen(req, timeout=600).read()
    open('trilha.mp3', 'wb').write(data); print('ok', len(data))
except urllib.error.HTTPError as e:
    print('ERRO', e.code, e.read()[:500])
