#!/usr/bin/env python3
"""Prepara as tomadas do vídeo antes/depois da Ótica Losiq a partir dos vídeos brutos.
Para cada tomada: corta o trecho, estabiliza (vidstab, 2 passadas), leva a 1080 × 1920 (lanczos + nitidez leve
nas gravações de 540 × 960) e aplica a correção de cor do lado (antes: mais frio e contido; depois: limpo e claro).
uso (da pasta video-losiq): python3 -I ferramentas/tomadas.py"""
import os
import subprocess
import sys

BRUTOS = 'brutos'
SAIDA = 'proj/media'
FOLGA = 0.6  # segundos a mais em cada tomada, para as transições

# nome, arquivo bruto, início no bruto (s), duração na edição (s), lado [, segundos de quadro congelado no fim]
TOMADAS = [
    ('antes-rua', 'VID_20261029_162713.mp4', 0.3, 3.2, 'antes'),
    ('antes-placa', 'VID_20261029_162608.mp4', 0.0, 2.6, 'antes'),
    ('depois-rua', 'VID_20261110_100703.mp4', 10.8, 4.2, 'depois'),
    ('cmp-antes', 'VID_20261029_162713.mp4', 2.3, 4.2, 'antes'),
    ('cmp-depois', 'VID_20261110_100703.mp4', 0.1, 4.2, 'depois'),
    ('placa-perto', 'VID_20261110_095244.mp4', 6.0, 3.2, 'depois'),
    ('placa-angulo', 'VID_20261110_100611.mp4', 8.6, 2.6, 'depois'),
    ('baloes', 'VID_20261110_100611.mp4', 17.3, 2.65, 'depois'),
    ('entrada', 'VID_20261110_100611.mp4', 12.6, 3.0, 'depois'),
    ('chegada', 'VID_20261110_100703.mp4', 24.2, 2.6, 'depois'),
    ('final-rua', 'VID_20261110_100703.mp4', 16.6, 3.2, 'depois', 2.8),  # congela o último quadro por 2,8 s
]

COR = {
    'antes': 'eq=contrast=1.04:brightness=-0.015:saturation=0.72:gamma=0.98,colorbalance=bs=0.035:bm=0.02:bh=0.01',
    'depois': 'eq=contrast=1.07:brightness=0.025:saturation=1.06:gamma=1.03,colorbalance=rm=0.015:gm=0.005:bh=-0.01',
}


def roda(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(r.stderr[-2000:])


def largura(arq):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width', '-of', 'csv=p=0', arq],
                       capture_output=True, text=True)
    return int(r.stdout.strip().split(',')[0])


os.makedirs(SAIDA, exist_ok=True)
so = sys.argv[1:]
for nome, arq, ini, dur, lado, *resto in TOMADAS:
    congela = resto[0] if resto else 0
    if so and nome not in so:
        continue
    src = os.path.join(BRUTOS, arq)
    out = os.path.join(SAIDA, nome + '.mp4')
    trf = os.path.join(SAIDA, nome + '.trf')
    d = dur + FOLGA
    baixa = largura(src) < 1000  # as gravações de 540 × 960
    roda(['ffmpeg', '-v', 'error', '-y', '-ss', str(ini), '-t', str(d), '-i', src,
          '-vf', f'vidstabdetect=shakiness=6:accuracy=15:result={trf}', '-f', 'null', '-'])
    nitidez = ',unsharp=5:5:0.7:5:5:0.0' if baixa else ''
    vf = (f'vidstabtransform=input={trf}:smoothing=24:zoom=5:optzoom=0:interpol=bicubic,'
          f'scale=1080:1920:flags=lanczos:force_original_aspect_ratio=increase,crop=1080:1920{nitidez},{COR[lado]},format=yuv420p'
          + (f',tpad=stop_mode=clone:stop_duration={congela}' if congela else ''))
    roda(['ffmpeg', '-v', 'error', '-y', '-ss', str(ini), '-t', str(d), '-i', src, '-vf', vf, '-an',
          '-c:v', 'libx264', '-crf', '15', '-preset', 'fast', '-g', '15', '-r', '30', out])
    os.remove(trf)
    print('ok', nome, f'{d:.1f}s', '(540p ampliada)' if baixa else '')
