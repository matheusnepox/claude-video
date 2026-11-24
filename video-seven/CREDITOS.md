# Créditos e licenças

## Áudio
Toda a trilha e os efeitos são **originais**, sintetizados em código por `proj/trilha.py`: drone, pad, piano, sino, bumbo, chimbal, palmas, whooshes, riser e impactos. Não há sample, loop nem música de terceiros. A trilha é do projeto e pode ser usada sem restrição.
Para gerar de novo: `cd proj && python3 trilha.py` (precisa de numpy e scipy).

## Imagens
- A logo SEVEN (símbolo, wordmark e assinatura) foi vetorizada a partir dos arquivos originais fornecidos pela marca (`referencias/`), com `ferramentas/vetorizar.py`. Ela não foi redesenhada.
- As fotos de mockup (cartões, fachada, caixa, cartaz, broto) são recortes das peças da marca fornecidas (`referencias/`). Copie os direitos de uso delas do mesmo lugar de onde vieram as peças originais.

## Fonte
Instrument Sans: Google Fonts, SIL Open Font License, carregada pelo link na hora do render. Os arquivos da fonte não foram copiados para o projeto.

## Código
- GSAP 3.14.2 (`proj/vendor/gsap.min.js`), da GreenSock, sob a licença padrão gratuita do GSAP.
- HyperFrames 0.8.181 (renderização), baixado com `npx` na hora do render.
- Motor de tempo `studio.js` e método de trabalho da skill claude-video (licença MIT).
