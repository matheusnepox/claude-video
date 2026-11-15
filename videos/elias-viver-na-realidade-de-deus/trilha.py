import json, urllib.request, sys
prompt = ("Instrumental cinematic underscore for a children's Bible animation about the prophet Elijah, made of toy-like 3D blocks. "
  "0:00-0:20 gentle, slightly melancholic piano and soft strings, a boy who is tired of praying. "
  "0:20-0:45 warm storytelling theme with oud-like plucked strings and light hand percussion, a dry desert feeling, then playful when ravens bring bread. "
  "0:45-1:20 tension builds on Mount Carmel: low drums, rising strings, a held suspense chord, then a huge triumphant hit when fire falls from heaven at about 1:15. "
  "1:20-1:45 patient, hopeful build: soft repeating piano motif that grows a little each time, like praying seven times, then thunder-like timpani and full warm strings when the rain comes. "
  "1:45-end tender and peaceful, then bright and determined, ending on a resolved major chord. No vocals, no lyrics. Leave space for dialogue.")
body = json.dumps({'prompt': prompt, 'music_length_ms': int(float(sys.argv[1]) * 1000), 'model_id': 'music_v1', 'force_instrumental': True}).encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', data=body, headers={'Content-Type': 'application/json'})
try:
    data = urllib.request.urlopen(req, timeout=600).read()
    open('trilha.mp3', 'wb').write(data); print('ok', len(data))
except urllib.error.HTTPError as e:
    print('ERRO', e.code, e.read()[:500])
