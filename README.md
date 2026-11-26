# Icon Library Studio

Open-source monorepo for inspecting webfonts, compiling SVGs into webfonts, and generating original icon libraries with AI coding agents — 100% static in the browser.

## Monorepo Structure

```text
├── apps/
│   ├── web/            # Open-source Landing Page (React 19 + Tailwind CSS v4 + TUFFUI)
│   └── studio/         # Icon Library Studio app (Vue 3 + Tailwind CSS + Docs)
├── packages/
│   ├── core/           # Shared browser engine (SVG validator, SVG→TTF/WOFF compiler, Webfont & catalog.json parser)
│   └── skill/          # AI agent skill (create-icons + pack-skill.mjs)
└── scripts/
    └── build-all.mjs   # Unified static build -> dist/ (web) + dist/studio/ (studio)
```

## Development

```bash
pnpm install

# Run Landing Page (http://localhost:5173)
pnpm run dev:web

# Run Icon Library Studio (http://localhost:5174)
pnpm run dev:studio
```

## Production Build (Static Deploy)

```bash
pnpm run build
```

Outputs a unified static site in `dist/`:
- `dist/` → Landing Page (`apps/web`)
- `dist/studio/` → Icon Library Studio (`apps/studio`)

## License

MIT
