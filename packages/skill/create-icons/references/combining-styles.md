# Combining styles

Most products need one style for the interface and, sometimes, a second for large,
expressive moments. Combine on purpose, by surface, never inside one row of icons.

## Which style where

| Surface | Good fit | Why |
|---------|----------|-----|
| Side menu, tabs, toolbars, tables | the style matched to the system (often `outline` or `duotone-filled`) | small sizes, states, density |
| Buttons and inline text | the same UI style, single tone or `currentColor` | must follow the text color |
| Product/content types, categories | `duotone-filled` or `flat-color` | the extra tone helps scanning a list |
| Statuses and badges | UI style + semantic colors (success, warning, danger) as tones | color carries meaning; still needs a shape difference |
| Empty states, onboarding | `soft-3d-gradient`, the duotone `illustration` variant, or `flat-color` at 48-96 | larger, friendlier, still the same drawings |
| Landing page features | `soft-3d-gradient`, `app-icon-glossy`, `flat-color` | expressive, brand colors, no states |
| App launcher tiles, integrations grid | `app-icon-glossy` | recognizable tiles |
| E-mail | the UI drawings as PNG or hex-colored `svg/` files | e-mail clients ignore CSS variables and often SVG |
| Games, playful brands | `pixel`, `hand-drawn` | personality over neutrality |

## Rules

1. **Same drawings, different finish.** The best pairing reuses the UI geometry: the duotone
   `home` becomes the soft-3D `home` by swapping tones for gradients (that is how the starters
   are built). People recognize the object across surfaces.
2. **One source per style.** Keep `icons.json` (UI) and `icons-marketing.json` (landing) side
   by side with their own `icon-style.json`, a distinct `prefix` and their own output folder
   (`packages/icons` and `packages/icons-marketing`, or one package with two subpaths).
3. **Shared names.** Use the same icon names in both sources so code can pick
   `HomeIcon` from either package.
4. **Never mix in one group.** A menu is all one style; a feature grid is all one style.
5. **Size thresholds.** Multi-color and gradient styles below 24 px turn to mush; keep them at
   32 px and up.
6. **States only in the UI style.** Marketing styles usually have just a default state per
   theme.

## Typical pairs

- `outline` (UI, matched to a line library) + `soft-3d-gradient` (landing, empty states).
- `duotone-filled` (UI) + its own `illustration` variant (empty states) — no second source
  needed, the build renders it from the same drawings.
- `solid` (mobile tab bar, selected state) + `outline` (unselected), same drawings: a common
  platform pattern; keep both sources aligned icon by icon.
- `flat-color` (docs and help center) + `outline` (product UI).
