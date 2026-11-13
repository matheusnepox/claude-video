#!/usr/bin/env bash
# mixar.sh: trilha estendida até o fim do vídeo e bem baixa sob a voz (cerca de 20 dB abaixo nas falas).
# A trilha da ElevenLabs veio com 89 s: emenda o trecho 15-50 s depois dos 82 s, com crossfade.
set -e; cd "$(dirname "$0")"
D=$(python3 -c "import json;print(json.loads(open('proj/tempos.js').read()[16:-2])['D'])")
ffmpeg -y -v error -t 82 -i trilha.mp3 -ss 15 -t 35 -i trilha.mp3 -filter_complex \
  "[0]aresample=44100[a];[1]aresample=44100[b];[a][b]acrossfade=d=2.5:c1=tri:c2=tri[x];[x]atrim=0:$D,afade=t=out:st=$(python3 -c "print($D-4)"):d=4[o]" -map "[o]" trilha-longa.wav
VOL=$(python3 - <<'PY'
import json
d=json.loads(open('proj/tempos.js').read()[16:-2]); m=[]
for f in d['falas']:
    a,b=f['t0']-0.25,f['t1']+0.35
    if m and a<=m[-1][1]: m[-1]=(m[-1][0],b)
    else: m.append((a,b))
baixo,alto,r=0.05,0.32,0.3   # 0.05 sob a voz, 0.32 nas pausas
def nest(i):
    if i==len(m): return str(alto)
    a,b=m[i]
    return f"if(between(t,{a-r:.3f},{a:.3f}),{alto}+({baixo}-{alto})*(t-{a-r:.3f})/{r},if(between(t,{a:.3f},{b:.3f}),{baixo},if(between(t,{b:.3f},{b+r:.3f}),{baixo}+({alto}-{baixo})*(t-{b:.3f})/{r},{nest(i+1)})))"
print(nest(0))
PY
)
ffmpeg -y -v error -i proj/media/voz.wav -i trilha-longa.wav -filter_complex \
  "[1]aresample=44100,volume='$VOL':eval=frame[m];[0]aresample=44100[v];[v][m]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=11[o]" \
  -map "[o]" -ar 44100 -ac 2 -c:a pcm_s16le mix.wav
echo "mix.wav pronto ($D s). Junte com o vídeo: ffmpeg -i mudo.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -shortest final.mp4"
