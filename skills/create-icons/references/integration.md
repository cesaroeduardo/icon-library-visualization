# Integration

## Where the package goes

| Project | Location | Name |
|---------|----------|------|
| Monorepo (pnpm/yarn/bun/npm workspaces, Turborepo, Nx) | `packages/icons` | `@<scope>/icons` |
| Single app | `src/components/icons` (or `src/icons`) | import by relative path or alias |
| React Native app | `src/icons` or a workspace package | |
| No build tooling | `public/icons` with `--framework svg` | |

Keep `icons.json` and `icon-style.json` inside that folder so the source travels with the
output. Add `.icon-work/` to `.gitignore`.

The build never overwrites an existing `package.json`. In a monorepo, add the package to the
consuming app's dependencies the way the repo does (`"@scope/icons": "workspace:*"`).

## React (Next.js, Vite, Remix)

- Components are `.tsx` sources; no build step. Next.js: add the package to
  `transpilePackages` in `next.config.*` when it lives outside the app. Vite and most
  bundlers compile workspace sources already.
- Import the tones once, in the root layout or global CSS: `import "@scope/icons/icons.css"`
  (or `@import` in CSS). Without it the icons still work in `currentColor`.
- Needs React 18+ (`useId`). `size`, `title`, and any SVG prop (`className`, `style`, `onClick`).
- Tailwind: `className="size-4 text-muted-foreground"` works; `size` sets width/height
  attributes, a class can override them.

## Vue 3

- Components are `.ts` files with `defineComponent` and render functions (no SFC compiler
  needed). Needs Vue 3.5+ (`useId`).
- `<HomeIcon :size="20" title="Home" />`; attributes fall through to the `<svg>`.

## Svelte 5

- One `.svelte` file per icon, runes syntax, `$props.id()` (Svelte 5.20+).
- `<HomeIcon size={20} title="Home" />`; rest props spread onto the `<svg>`.

## React Native / Expo

- Needs `react-native-svg` (`npx expo install react-native-svg`).
- No CSS variables: `color="#fff"` paints every tone (secondary tones keep their fallback
  opacity), `colors={palette.light.active}` paints each tone exactly; `palette` is exported.
- Use the theme to pick `palette.light` or `palette.dark`.

## Plain SVG

- `sprite.svg` + `<svg><use href="/icons/sprite.svg#home"/></svg>` (inherits CSS variables
  when the sprite is inlined in the page or served same-origin).
- `svg/*.svg` for `<img>`, CMSs, e-mail and design tools (hex colors, default light palette).

## E-mail

E-mail clients ignore CSS variables and many block SVG. Export PNGs from `svg/` at 2× (any
SVG-to-PNG tool the person has, or a headless browser screenshot) and use
`<img width="24" height="24" alt="">`.

## Replacing emoji and placeholders

Only if the person asked. Replace one usage at a time, keep accessible names (an emoji with
meaning becomes an icon with `title` or a visible label), and run the project's typecheck,
lint and tests afterwards.

## Updating the library later

Add or edit icons in `icons.json`, then `validate.py` and `build.py` (or `--only` for a few).
Commit the source and the generated files together.
