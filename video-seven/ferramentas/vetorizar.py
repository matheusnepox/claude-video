"""Vetoriza a logo SEVEN a partir das imagens rasterizadas (branco sobre verde).
Cada parte conectada vira um <path> separado, para poder ser animada (barra do 7, triângulo, letras).
uso: python3 vetorizar.py entrada.png saida.svg [recorte x0,y0,x1,y1] [escala]"""
import sys, cv2, numpy as np, potrace

src, out = sys.argv[1], sys.argv[2]
crop = [int(v) for v in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] != '-' else None
up = float(sys.argv[4]) if len(sys.argv) > 4 else 3.0
img = cv2.imread(src)
if crop: img = img[crop[1]:crop[3], crop[0]:crop[2]]
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
g = cv2.resize(g, None, fx=up, fy=up, interpolation=cv2.INTER_CUBIC)
g = cv2.GaussianBlur(g, (0, 0), up * 0.6)
mask = (g > 150).astype(np.uint8)
n, lab, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
parts = []
for i in range(1, n):
    x, y, w, h, a = stats[i]
    if a < 6 * up * up: continue
    bm = potrace.Bitmap(lab == i)
    pl = bm.trace(turdsize=int(2 * up * up), alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for c in pl:
        pts = [c.start_point] + [sg.end_point for sg in c.segments]
        if min(q.x for q in pts) <= 0.5 or min(q.y for q in pts) <= 0.5:
            continue  # o potracer devolve a moldura da imagem como curva: descarta
        s = c.start_point; d.append(f"M{s.x/up:.2f},{s.y/up:.2f}")
        for seg in c.segments:
            if seg.is_corner:
                d.append(f"L{seg.c.x/up:.2f},{seg.c.y/up:.2f}L{seg.end_point.x/up:.2f},{seg.end_point.y/up:.2f}")
            else:
                d.append(f"C{seg.c1.x/up:.2f},{seg.c1.y/up:.2f} {seg.c2.x/up:.2f},{seg.c2.y/up:.2f} {seg.end_point.x/up:.2f},{seg.end_point.y/up:.2f}")
        d.append("Z")
    parts.append((x / up, y / up, w / up, h / up, "".join(d)))
parts.sort(key=lambda p: (p[0]))
H, W = mask.shape[0] / up, mask.shape[1] / up
with open(out, "w") as f:
    f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" fill="#fff">\n')
    for k, (x, y, w, h, d) in enumerate(parts):
        f.write(f'<path data-i="{k}" data-box="{x:.1f},{y:.1f},{w:.1f},{h:.1f}" fill-rule="evenodd" d="{d}"/>\n')
    f.write("</svg>\n")
print(out, len(parts), "partes")
for k, p in enumerate(parts): print(k, [round(v) for v in p[:4]])
