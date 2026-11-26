# Icon Library Studio

Aplicação 100% estática no navegador (Vue 3 + Vite + Tailwind CSS) para montar, compilar e criar bibliotecas de ícones.

## Funcionalidades

1. **Subir Webfont**: Envie `.ttf`, `.otf`, `.woff`, `.woff2` (com ou sem `.css`) ou um `.zip` para inspecionar glifos, buscar, recolorir, redimensionar (`8px`–`320px`) e baixar em `.svg` ou `.png`.
2. **Subir SVGs e gerar Webfont**: Envie arquivos `.svg` ou `.zip`, valide problemas comuns de icon font, compile diretamente no navegador para `.ttf` + `.woff` + `.css` + `catalog.json` e baixe o pacote `.zip` pronto. Ícones multicoloridos são detectados automaticamente e renderizados inline.
3. **Criar meus próprios ícones**: Embute a skill `create-icons` em `skills/create-icons/` com download em `.zip`, instruções para Antigravity / Claude Code / Cursor, preview interativo dos 8 estilos iniciais e importação direta dos SVGs gerados para a galeria.
4. **Bilíngue (PT-BR / EN)** e **Tema Claro / Escuro**.

## Como rodar localmente

```bash
pnpm install
pnpm run dev
```

## Build estático (GitHub Pages / Vercel / Netlify)

```bash
pnpm run build
```

Os arquivos prontos para deploy ficam em `dist/` (incluindo `dist/skills/create-icons.zip` e `dist/style-gallery.html`).
