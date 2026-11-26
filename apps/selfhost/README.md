# Self-host Studio

Galeria estática da **sua** icon library. Sem demos, sem landing. A pasta `icons/` é a fonte da verdade: o build gera a webfont e a galeria abre só ela.

`catalog.json` é opcional. Sem ele a busca usa o nome do arquivo.

Guia no site: [Self-host da sua library](https://icons.cesaroeduardo.com/#docs-selfhost) · no Studio: [Create your own Icon Library](https://icons.cesaroeduardo.com/studio/#create-own)

## Uso

1. Edite [`selfhost.config.json`](selfhost.config.json) (`title`, `fontName`, `prefix`, `base`, `allowUpload`).
2. Troque [`brand/logo.svg`](brand/logo.svg).
3. Coloque os SVGs em [`icons/`](icons/). Subpastas entram no build. `icons/catalog.json` é opcional (`label`, `group`, `keywords`).
4. Na raiz do monorepo:

```bash
pnpm install
pnpm --filter @icon-library/selfhost build
```

5. Publique `apps/selfhost/dist/` (Cloudflare Pages, Vercel, Netlify, nginx).

Dev local: `pnpm --filter @icon-library/selfhost dev` → http://127.0.0.1:5175

## Alimentar a library

Adicione ou edite SVGs em `icons/`, rode o build de novo e faça redeploy. Não tem append de glifo numa fonte pronta: o build recompila o set inteiro.

O botão **Experimentar upload** (se `allowUpload` for `true`) compila no navegador e grava só no IndexedDB daquele browser. Não altera `icons/` e some no próximo deploy limpo.

## O que o build gera

`public/library/` (copiado para `dist/library/`):

- `{fontName}.woff2`, `.woff`, `.ttf`, `.css`
- `catalog.json` (gerado; keywords extras só se você tiver enviado o catalog)
- `manifest.json` (a galeria lê este arquivo)
- `svg/` com os SVGs individuais

Pra usar a fonte no seu app, sirva `{fontName}.css` + os arquivos de fonte. As classes são `.{prefix}.{nome}`.
