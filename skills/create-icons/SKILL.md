---
name: generate-icons
description: Generates a complete, original icon library that matches your project's design system. It reads the project's tokens, theme, fonts and the icons already in use, derives a style sheet (grid, stroke or fill, tones, radius, states, palette), proves it with a small sample next to the real UI, then draws every icon by hand as SVG and ships framework components (React, Vue, Svelte, React Native or plain SVG), standalone SVGs, a sprite, a self-contained review catalog and a README, all validated. Use it whenever someone wants custom icons, an icon set or icon pack, icons that match their brand or design system, to replace emoji or generic placeholder icons, product-specific icons (menu, product types, statuses, empty states, landing page), or types /generate-icons, even if they never say "library". Also covers duotone, outline, solid, 3D gradient, app-icon, flat, pixel and hand-drawn styles for projects with no design system yet.
---

# generate-icons

> Inspired by [@banhosdev](https://x.com/banhosdev)'s [generate-icons](https://github.com/sergiobanhos/generate-icons).

Build an icon library that looks like it was always part of this project. The center of the
work is **matching the person's design system**: read what the project already says about
color, shape, weight and type, turn that into an explicit style sheet, prove it on a few
icons, and only then draw the whole set. The eight starter styles are adjustment references
and the fallback for projects with no system yet, not the main path.

Everything you draw is original. You write every path yourself on the style's grid. Never
copy paths from icon packages (Lucide, Heroicons, Phosphor, Material, SF Symbols, Font
Awesome, Tabler, or any other) and never redraw third-party brand marks freehand. See
`references/licensing.md` and `references/third-party-marks.md`.

## Language

Write files (style sheet, source, README) in English unless the project's own docs are in
another language. Talk to the person, and ask every interview question, in the language they
write in.

## Files you will use

| Path | When |
|------|------|
| `scripts/scan_design_system.py` | Step 1. Reads tokens, themes, fonts, icon libraries, radius, dark mode. |
| `scripts/inventory.py` | Step 4. Proposes icon candidates from menus, routes, enums, emoji. |
| `scripts/export_reference_icons.py` | Step 5. Exports a few icons the project already uses, for the side-by-side check. |
| `scripts/validate.py` | After every drawing pass. Must pass before a build is shown. |
| `scripts/build.py` | Builds the package, the catalog, or a style gallery. |
| `references/style-detection.md` | Step 1-2. How evidence turns into style parameters, and when to ask. |
| `references/interview.md` | Step 2-3. The questions, with options, including the no-design-system branch. |
| `references/source-format.md` | Writing `icon-style.json` and `icons.json`. |
| `references/drawing-guide.md` | Before drawing anything. Grid, keylines, legibility, path craft. |
| `references/styles/<style>.md` | The base style's rules and examples (8 styles). |
| `references/combining-styles.md` | When the project needs two styles (panel and landing page). |
| `references/integration.md` | Where the package goes and how each framework consumes it. |
| `references/accessibility.md`, `licensing.md`, `third-party-marks.md` | Rules the output must follow. |
| `assets/style-starters/*.json` | A working style sheet plus 4 icons for each starter style. |
| `assets/style-gallery.html` | One page comparing the 8 starter styles in light and dark. |
| `examples/` | A finished 12-icon library in two styles, built for React. |

All scripts are Python 3.8+ with the standard library only. Run them with `python3`. Keep the
working files in `.icon-work/` at the project root (scan report, inventory, sources while
drafting, sample builds); the final source lives next to the generated package.

## Workflow

### 1. Read the design system first

Run the scanner from the project root, then read `references/style-detection.md`:

```bash
python3 <skill>/scripts/scan_design_system.py . --json .icon-work/scan.json
```

It reports evidence with `file:line` sources: color tokens by role, radius and border tokens,
dark-mode strategy, Tailwind `@theme`/config, shadcn/MUI/Chakra themes, design-token JSON,
fonts and their class, how rounded the components are, shadow and gradient use, the icon
libraries in use (imports, most used icons, size and stroke overrides), custom SVG traits,
and a list of **gaps**.

The scanner finds evidence; it does not decide. Open the main token file and one or two
real components (a nav, a button) to confirm what it found. If the person pasted screenshots
of their app or of references, analyze them with the checklist in `style-detection.md`
(stroke or fill, weight, corners, tones, volume) and treat them as evidence too.

### 2. Decide whether the evidence is enough

The evidence is **enough** when you know the brand color, the neutrals, how rounded the UI
is, and either the existing icon style or a clear visual language to derive one from.

It is **weak or missing** when there are no tokens, no theme and no icons (a new project, or
plain HTML), or when what you found is contradictory (several brand candidates, two icon
libraries with different construction, light-only tokens in an app that clearly has dark
mode). Then do not guess. Tell the person, in a few lines, what you found and what is
missing, and ask (questions and options in `references/interview.md`):

- the style, offering the 8 starters, with `assets/style-gallery.html` open so they can see
  an example of each;
- the brand colors (hex, a screenshot, or the brand's site to extract them from);
- the corners (square, soft, or very rounded);
- light, dark, or both;
- whether they have reference screenshots.

Those answers fill the same style sheet as detection would, and the flow continues.

### 3. Ask only what is still open

Whatever the scan did not settle, ask in one short batch with options (use a multiple-choice
question tool if you have one): where the icons will appear (menu, buttons, types, landing
page, empty states, e-mail, app), sizes, themes, framework (detect it from `package.json`
first and just confirm), and the package name and location. Skip any question the evidence
already answers, and say what you inferred so they can correct it.

### 4. Write the style sheet

Write `icon-style.json` (format in `references/source-format.md`), deriving every parameter
from the evidence: grid, live area, stroke or fill, stroke width or tone count, corner
radius, line caps, states (default, hover, active, disabled), sizes, the palette per theme,
the dark-mode selector, and the `context` block (font, UI radius, surfaces) the catalog uses
to show the icons in a mock of the real UI.

Every decision gets a `rationale` entry with where it came from:
`{"decision": "radius 2.5", "because": "--radius is 0.75rem (12 px); about 0.2× on a 24 grid", "source": "app/globals.css:14"}`.
When a palette color comes from a token, store `{"hex": "#5B21B6", "token": "--brand"}` so
the generated CSS uses `var(--brand, #5B21B6)` and follows future token changes.

Show the person a readable summary of the sheet (a short table: decision, because) before
drawing.

**Coherence with what exists.** If the project already uses an icon library for generic
icons, the new icons must sit next to it as one family: same grid, same visual weight, same
corner and cap treatment. Do not redraw the generic icons (close, chevrons, plus, search…)
unless the person asks; the library stays for those, and the new set covers what it lacks.

### 5. Inventory, then prove the style on a sample

```bash
python3 <skill>/scripts/inventory.py . --json .icon-work/inventory.json
```

Curate the candidates into a list grouped by area (navigation, product types, statuses,
actions, empty states…) with kebab-case names and labels, flag emoji and placeholder icons to
replace, mark third-party marks (payment brands, social networks) for the official-asset
route, and leave the library's generic icons out. Show the list and let the person approve
or edit it.

Then draw **6 to 8 sample icons** from that list, picked to stress the style (one with a
circle, one with diagonals, one dense, one that needs a small detail). Before drawing, read
`references/drawing-guide.md` and the base style's `references/styles/<style>.md`.

```bash
python3 <skill>/scripts/export_reference_icons.py --project . --names HomeIcon,Trash2,Bell --out .icon-work/reference
python3 <skill>/scripts/validate.py .icon-work/sample/icons.json
python3 <skill>/scripts/build.py .icon-work/sample/icons.json --out .icon-work/sample --catalog-only --compare .icon-work/reference
```

The catalog shows the sample in a mock sidebar, buttons and an empty state using the
project's font, radius and surfaces, in light and dark, and, with `--compare`, next to the
project's current icons at 24 and 16 px. Look at it yourself first (screenshot it with a
headless browser or a browser tool if you have one; otherwise read the HTML and reason about
the geometry), fix what is off, then open it for the person (`open`, `xdg-open` or `start`)
and ask for the go-ahead or adjustments ("thicker", "less rounded", "two tones instead of
one"). Translate each adjustment into a style-sheet change, redraw the sample, and repeat
until they approve. Do not draw the full library before this approval.

### 6. Draw and build the full library

Draw the remaining icons in `icons.json`, in batches of about 10, validating after each
batch. Then build into the package location agreed in step 3:

```bash
python3 <skill>/scripts/validate.py packages/icons/icons.json
python3 <skill>/scripts/build.py packages/icons/icons.json --out packages/icons --framework react
python3 <skill>/scripts/validate.py packages/icons/icons.json --built packages/icons
```

The build writes one component per icon (tree-shakeable, with `size`, `title`/`aria-label`
and `currentColor` or token-driven tones), `svg/` (hex colors, for `<img>`, e-mail and design
tools), `sprite.svg`, `icons.css` (tones per state and theme), `manifest.json`, `catalog.json`
(with `name`, `icon`, `label`, `group` and searchable `keywords` derived from `tags`/`keywords`),
`catalog.html` and `README.md`. Always fill rich `tags` (5–8 synonyms/actions per icon) in
`icons.json` so `catalog.json` powers instant search. It never overwrites an existing
`package.json`. Wire it in
following `references/integration.md` (workspace entry, Next.js `transpilePackages`, CSS
import), and replace the emoji and placeholders the inventory found only if the person asked
for that.

### 7. Review and adjust

Open the catalog and invite comments. For "this one looks odd" or "make it rounder", edit
only the affected icons (or the style sheet, if the change is global), validate, and rebuild
just those:

```bash
python3 <skill>/scripts/build.py packages/icons/icons.json --out packages/icons --only cart,bell
```

`--only` rewrites those icons' files and always rebuilds the aggregates (index, sprite, CSS,
catalog, README). A style-sheet change affects every icon, so rebuild without `--only`.

### 8. Hand off

Tell the person, briefly: where the package and the source live, how to use an icon (one
line per framework), how states and dark mode work, how to add an icon later (add it to
`icons.json`, validate, build), and anything left open (an unapproved icon, a mark that needs
the official file).

## Quality bar

- The primary tone (or the line, in single-tone styles) must identify the icon on its own at
  16 px. The catalog's "Primary tone only" toggle checks it.
- Nothing crosses the live area, strokes included. Filled styles have no outlines; thick
  bars (`bar`, at least `minBar` wide) are allowed for arrows, checks and chains.
- Colors only from the palette; shapes never carry colors.
- One metaphor per concept across the set, front-facing, the same detail budget for every icon.
- Decorative icons are hidden from assistive tech; informative ones get `title` (see
  `references/accessibility.md`). Tone pairs keep enough contrast against their surface.
- `validate.py` passes with no errors before anything is shown.

## When the person has no project open

If there is no project (a blank folder, or they only want icons for a deck or a site
builder), skip the scan, run the no-design-system interview, and build with
`--framework svg`.

## Visualizing & compiling in Icon Library Studio

After generating the package (`svg/` + `catalog.json` via `scripts/build.py`), tell the user they can drag and drop the `svg/` files together with `catalog.json` (or a `.zip` of the output folder) directly into **Icon Library Studio** ("Upload SVGs & Build Webfont" or the import zone inside "Create My Own Icons") to:
- Browse, search by name and `keywords` from `catalog.json`, recolor, and resize all generated icons in an interactive gallery.
- Validate font-readiness and compile monochrome SVGs into a downloadable webfont bundle (`.woff`, `.ttf`, `.css`, `catalog.json`).
- Keep multicolor/duotone SVGs rendered inline with their original palette.
