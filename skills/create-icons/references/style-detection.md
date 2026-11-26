# Style detection: from a design system to an icon style sheet

The goal is a style sheet (`icon-style.json`) whose every parameter can be traced to
something in the project. Use the scanner's report as the starting point, confirm by
reading the files it cites, and record each decision with its source in `rationale`.

## Contents

1. Where the evidence lives
2. Mapping evidence to parameters
3. Reading screenshots
4. Conflicts, weak evidence, and when to ask
5. Writing the rationale
6. Worked example (generic)

## 1. Where the evidence lives

| Source | What to look for |
|--------|------------------|
| CSS variables (`:root`, `.dark`, `[data-theme]`) | brand, neutrals, states, surfaces, `--radius*`, `--border-width` |
| Tailwind v4 `@theme` in CSS | `--color-*`, `--radius-*`, `--font-*` |
| Tailwind v3 `tailwind.config.*` | `theme.extend.colors`, `borderRadius`, `fontFamily`, `darkMode` |
| shadcn `components.json` | `iconLibrary` (often `lucide`), `baseColor`, the CSS file with the variables |
| Design-token JSON (`tokens.json`, `*.tokens.json`, Style Dictionary, Tokens Studio) | `$value`/`value` per token; colors, radius, border |
| MUI `createTheme`, Chakra `extendTheme`, Mantine `createTheme` | `palette.primary.main`, `shape.borderRadius`, `typography.fontFamily` |
| Mobile (`theme.ts`, `colors.ts`, NativeWind) | the same roles; often a TS object |
| Icon imports | the library, which icons, `size`, `strokeWidth`, `weight`, `Filled/Outlined` variants |
| Custom SVG (files and inline) | fill vs line, stroke widths, viewBox, `currentColor` vs fixed hex |
| Fonts (`next/font`, `@fontsource`, `font-family`, `--font-*`) | geometric, neo-grotesque, humanist, rounded, serif |
| Components | the button and card radius, borders vs shadows, density, gradients |

The scanner skips `node_modules`, build folders and dot-folders. In monorepos, scan the app
the icons are for (`apps/web`), but read shared token packages too.

## 2. Mapping evidence to parameters

### Construction (stroke or fill, grid)

| Evidence | Style sheet |
|----------|-------------|
| Lucide, Feather, Tabler, Untitled UI (line 2) | `paint: "stroke"`, `stroke.width: 2`, round caps and joins, grid 24, live 20 |
| Heroicons outline, Phosphor regular, Iconoir, Hugeicons (line 1.5) | stroke 1.5, round caps, grid 24 |
| `strokeWidth` overrides dominate (e.g. 1.75 ×40) | use the override, not the library default |
| Heroicons solid, Material filled, Font Awesome solid, Octicons | `paint: "fill"`, one tone (`solid`) |
| Phosphor `duotone`, Material two-tone, custom two-tone SVGs | `duotone-filled` (or a two-tone outline: line + soft fill) |
| Phosphor `fill` for the active state, outline otherwise | outline style; note in rationale that active may switch to a filled variant |
| Radix icons (15 grid) | grid 15, live 13, stroke 1 (or match visually on 24 if mixed) |
| Custom SVGs, mostly filled with `currentColor` | filled; count tones used |
| No icons at all | no construction evidence: ask (section 4) |

The new icons must match the library used for generic icons side by side: same grid,
weight, corner and cap. Measure weight optically, not only numerically: a filled icon set
next to a 2-px line set should use small, open shapes so it does not look heavier.

### Corner radius

UI radius is the strongest shape signal. Read `--radius` (shadcn), `--radius-*` or the most
used `rounded-*` class (the scanner reports a histogram and a typical px value).

Rule of thumb on a 24 grid: **outer icon radius ≈ UI radius × 0.2, clamped to 1-4**, inner
radius about half of that. 4 px UI → 1; 8 px → 1.5-2; 12 px → 2.5; 16 px or pill-shaped
UI → 3-3.5. Square UI (radius 0-2) → 0.5-1 and square caps (`linecap: "butt"`,
`linejoin: "miter"`) if the type is sharp too.

### Line caps and terminals

| Evidence | Caps |
|----------|------|
| Rounded or geometric sans (Nunito, Poppins, Geist), radius ≥ 8 | round caps and joins |
| Neo-grotesque (Inter, Roboto) with radius 4-8 | round caps; slightly tighter radius |
| Square UI, condensed or industrial type, serif editorial brands | butt caps, miter or round joins |

### Weight and size

- Stroke: library default unless overridden; for a custom line set start at 1.5 for 20-24 px
  use and 2 for 16-20 px use.
- Sizes: from `size` props and `size-*/h-*/w-*` classes near icons; always include 16, 20, 24
  if the UI is dense; add 32/48/96 for empty states and marketing.

### Tones and palette

| Role | Typical tokens | Use |
|------|----------------|-----|
| Default (inactive) | `--muted-foreground`, `--text-muted`, gray-500 | icons in menus and lists |
| Hover | `--foreground`, `--ink`, gray-700/900 | hovered links and buttons |
| Active | `--primary`, `--brand`, `--accent` | `aria-current`, selected tabs |
| Disabled | `--border-strong`, gray-300 | disabled controls |
| On brand surfaces | `--primary-foreground` | icons inside primary buttons (use `currentColor`) |

For two-tone styles, derive the light tone from the same hue: a tint of the dark tone (the
token's `-subtle`/`-muted`/`-200` sibling when it exists). Check contrast (accessibility.md).
For dark themes read the `.dark` / `[data-theme="dark"]` / `prefers-color-scheme` block; do
not invert the light palette by hand when tokens exist.

Use `{"hex": "...", "token": "--name"}` for palette entries backed by a token, so the
generated CSS references the variable with the hex as fallback.

### Dark mode

| Evidence | Style sheet |
|----------|-------------|
| `.dark` class (Tailwind `darkMode: "class"`, `@custom-variant dark (&:is(.dark *))`, next-themes) | `darkMode: "class"`, `darkSelector: [".dark"]` |
| `[data-theme="dark"]` | `darkSelector: ["[data-theme=\"dark\"]"]` |
| Only `@media (prefers-color-scheme: dark)` | `darkMode: "media"` |
| Both | `darkMode: "both"` |
| None | ask whether a dark theme is needed |

### Volume and decoration

| Evidence | Style |
|----------|-------|
| Flat UI, borders over shadows, few gradients | flat construction; no gradients in UI icons |
| Many soft shadows and gradients in the product | `soft-3d-gradient` is plausible for large/marketing icons, still flat at 16-24 |
| Marketing site with glossy illustrations | `app-icon-glossy` or `soft-3d-gradient` for the landing page only |

## 3. Reading screenshots

When the person pastes screenshots of their app or of references, note:

1. Line or fill. If line: approximate weight relative to the text stroke at the same size
   (a 2-px line on 24 px looks like the stem of 14-px medium text).
2. Corners: sharp, soft, very round; cap shape at line ends.
3. Tones: one color, two tones of one hue, multicolor; where the brand color appears
   (only active, or always).
4. Volume: flat, gradient, shadow, gloss.
5. Detail level: how many strokes or parts a typical icon has.
6. Size in the layout and the surrounding density.

Write these as rationale entries with `"source": "screenshot 1"`.

## 4. Conflicts, weak evidence, and when to ask

Ask instead of guessing when:

- there are no color tokens and no theme (new project, plain HTML);
- several values claim to be the brand (`primary` differs between files, or a marketing
  palette and a product palette);
- two icon libraries with different construction are in use (line in the web app, filled in
  the mobile app): ask which surface the new icons are for, or plan two styles
  (combining-styles.md);
- the tokens are light-only but the app clearly ships a dark theme;
- the screenshots contradict the code (the code says Lucide, the screenshots show filled
  icons from a newer redesign).

How to ask: state what you found and what is missing in two or three lines, then ask the
smallest set of questions that unblocks the sheet (see interview.md). Offer a default for
each so the person can just confirm.

## 5. Writing the rationale

One entry per decision, in plain words, with a source someone can open:

```json
"rationale": [
  {"decision": "outline, stroke 2", "because": "Lucide is used for generic icons (210 imports); new icons sit next to it", "source": "components.json iconLibrary; scan"},
  {"decision": "radius 2", "because": "--radius is 0.625rem (10 px); 0.2× on a 24 grid", "source": "src/app/globals.css:8"},
  {"decision": "active = --primary", "because": "primary is the only brand token; used for selected nav items", "source": "src/app/globals.css:15"},
  {"decision": "dark via .dark", "because": "next-themes with attribute=class", "source": "src/app/providers.tsx:12"},
  {"decision": "open question", "because": "mobile uses filled Material icons; confirm the new set is web-only", "source": "scan gaps"}
]
```

The catalog prints this table at the top, so the person can see why the icons look the way
they do and push back on a specific decision.

## 6. Worked example (generic)

A Next.js app with shadcn: `components.json` says `iconLibrary: "lucide"`; `globals.css`
has `--radius: 0.75rem`, `--primary: oklch(0.55 0.2 265)`, `--muted-foreground` and a
`.dark` block; Inter via `next/font`; mostly borders, few shadows.

Resulting sheet: outline, stroke 2 (Lucide default, no overrides found), round caps and
joins, grid 24 / live 20, outer radius 2.5 (12 px × 0.2), palette default
`--muted-foreground`, hover `--foreground`, active `--primary` (converted to hex for the
fallback), disabled `--border`; dark from `.dark`; flat. Sample: the 6-8 product icons the
inventory found missing, shown next to Lucide's `house`, `settings` and `bell`.
