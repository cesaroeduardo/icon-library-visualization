# Icon Library Studio

Open-source monorepo for inspecting webfonts, compiling SVGs into webfonts, and generating/cataloging icon libraries with AI coding agents — 100% static in the browser.

## Repository Structure

```text
├── apps/
│   ├── web/            # Open-source Landing Page & TUFFUI Docs (React 19 + Tailwind CSS v4)
│   └── studio/         # Focused Icon Library app (Vue 3 + Tailwind CSS)
├── packages/
│   ├── core/           # Shared browser engine (SVG validator, SVG→TTF/WOFF compiler, Webfont & catalog.json parser)
│   └── skill/          # Skill packaging scripts (pack-skill.mjs)
├── skills/
│   ├── create-icons/   # AI skill for generating original icon libraries (inspired by @banhosdev — github.com/sergiobanhos/generate-icons)
│   └── catalog-icons/  # AI skill for cataloging SVGs/webfont CSS into validated catalog.json with keywords
└── scripts/
    └── build-all.mjs   # Unified static build -> dist/ (web + docs) + dist/studio/ (library app)
```

## Development

```bash
pnpm install

# Run Website & Docs (http://localhost:5173)
pnpm run dev:web

# Run Icon Library App (http://localhost:5174)
pnpm run dev:studio
```

## Production Build

```bash
pnpm run build
```

Outputs a unified static site in `dist/`:
- `dist/` → Landing Page & Documentation (`apps/web`)
- `dist/studio/` → Icon Library App (`apps/studio`)

## License

MIT
