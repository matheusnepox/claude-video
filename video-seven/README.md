# SEVEN — filme de rebranding

Filme vertical de 42 s que apresenta a nova identidade da SEVEN. O roteiro, a direção e o tempo de cada cena estão em `STORYBOARD.md`.

**Assistir:** `entrega/seven-rebranding-9x16.mp4` (alta qualidade) ou `entrega/seven-rebranding-9x16-leve.mp4` (versão leve, para enviar).

## Como o projeto está organizado

```
proj/
  index.html          a composição (1080 × 1920, 42 s) e a trilha
  js/roteiro.js       TODOS os textos e tempos do filme (comece por aqui)
  js/marca.js         BrandColors: as 4 cores oficiais e o ângulo da diagonal do 7
  js/tipografia.js    KineticTypography: linhas que entram e saem por máscara
  js/geometria.js     GeometricTransitions / SceneTransitions: cortinas, linhas de construção, túnel de formas
  js/logo.js          LogoReveal: monta o 7, o "seven" e a assinatura a partir da logo vetorizada
  js/vitrine.js       ProductShowcase: cartões de foto com revelação diagonal e paralaxe
  js/cena.js          os 5 atos montados com os componentes acima (um relógio só)
  js/logo-dados.js    a logo original em vetor (gerada, não edite à mão)
  trilha.py           SoundDesign: gera assets/trilha.wav, presa aos mesmos tempos
  media/              logo em SVG e fotos dos mockups
ferramentas/          vetorizar.py e logo_para_js.py (logo raster → vetor → JS)
referencias/          as imagens originais enviadas pela marca
```

## Ajustes comuns

- **Mudar um texto:** edite `textos` em `proj/js/roteiro.js`.
- **Mudar um tempo:** edite `marcos` em `proj/js/roteiro.js`. Se o tempo tiver um som preso a ele, ajuste também o dicionário `M` no topo de `proj/trilha.py` e rode `python3 trilha.py`.
- **Mudar as cores:** edite `CORES` em `proj/js/marca.js`.
- **Trocar fotos:** substitua os arquivos em `proj/media/` ou mude os caminhos em `roteiro.js`.

## Renderizar

Precisa de Node 22+, ffmpeg e internet (para a fonte e o HyperFrames).

```
cd proj
npx hyperframes@0.8.181 snapshot . --at 3,9,14,20,33,38 -o frames/   # olhar quadros
npx hyperframes@0.8.181 render . -o ../entrega/seven-rebranding-9x16.mp4 -q high
```

## Versão horizontal 16:9

Todos os elementos são posicionados pelas coordenadas da tela em `cena.js`, e os componentes não dependem do formato. Para fazer o 16:9, copie `proj/` para `proj-16x9/`, troque `data-width`/`data-height` para 1920 × 1080 no `index.html` e reposicione as coordenadas em `cena.js` (texto à esquerda, foto ou símbolo à direita). A trilha e o roteiro servem sem mudança.
