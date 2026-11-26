# duotone-filled

Filled shapes in two tones of one hue, no outline. The body is the light tone; the detail
that identifies the icon is the dark tone. Inactive icons are gray; active ones take the
brand pair. Built for app panels, menus and lists.

Starter: `assets/style-starters/duotone-filled.json` (palette, states, dark theme and the
large illustration variant).

## Grid and live area

24 grid, 20 live area (2 to 22). Keylines from the drawing guide.

## Tones

- `detail` (primary, first in `tones`): the dark tone. It alone must read at 16 px: roof and
  door of a house, the ring and handle of a magnifier, the bars of a chart.
- `body`: the light tone, the mass of the object. Without CSS it falls back to
  `currentColor` at 40%.
- Example pairs (replace with the project's): inactive light `#C9CED8` / dark `#7C8597`;
  active light is a tint of the brand, dark is the brand; dark theme inactive
  `#3A4252` / `#9AA3B5`, active a deep brand shade / a pale brand tint.
- Large colored variant (48 and 96): the same drawing, light tone → pale brand gradient,
  dark tone → brand gradient, one accent part (green or yellow) via `illo`, gradients
  vertical and soft.

## Corners

Outer 2 to 3.5, inner about 1 to 1.5. Arrows and checks are thick bars (`bar` 2.2 to 2.6)
with round caps; chains and handles too.

## States

| State | Colors |
|-------|--------|
| default | gray pair |
| hover | darker gray pair |
| active | brand pair (`aria-current`, `aria-selected`, `aria-pressed`) |
| disabled | pale gray pair |

## Legibility at 16 px

Turn on "Primary tone only" in the catalog: every icon must still be recognizable. Keep
dark details ≥ 1.8 wide and gaps ≥ 1.5.

## Do

- Overlap the dark detail on the light body (draw it after).
- Use the light tone for big, quiet areas and the dark for edges, handles, symbols.
- Keep the same proportion of dark to light across the set (roughly 30 to 45% dark).

## Avoid

- Outlines or hairlines (validator rejects strokes; bars must be ≥ `minBar`).
- Dark tone used only for tiny dots: the icon vanishes in the primary-only check.
- Two hues in the small sizes; the accent is for the large variant only.
- Light tone on light surfaces with no dark part touching the edge (the icon loses its shape).

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "body", "type": "path", "d": "M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"},
  {"tone": "detail", "type": "path", "d": "M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z"},
  {"tone": "detail", "type": "path", "d": "M10 22v-4a2 2 0 0 1 4 0v4z", "illo": "accent"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" stroke="none" fill="#C9CED8"/><path d="M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z" stroke="none" fill="#7C8597"/><path d="M10 22v-4a2 2 0 0 1 4 0v4z" stroke="none" fill="#7C8597"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "body", "type": "path", "d": "M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z"},
  {"tone": "detail", "type": "path", "d": "M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z"},
  {"tone": "detail", "type": "path", "d": "M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z", "illo": "accent2"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z" stroke="none" fill="#C9CED8"/><path d="M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z" stroke="none" fill="#7C8597"/><path d="M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z" stroke="none" fill="#7C8597"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "body", "type": "rect", "x": 2.5, "y": 2.5, "width": 19, "height": 19, "rx": 4},
  {"tone": "detail", "type": "rect", "x": 6.5, "y": 12, "width": 2.6, "height": 6, "rx": 1.3},
  {"tone": "detail", "type": "rect", "x": 10.7, "y": 8.5, "width": 2.6, "height": 9.5, "rx": 1.3},
  {"tone": "detail", "type": "rect", "x": 14.9, "y": 6, "width": 2.6, "height": 12, "rx": 1.3, "illo": "accent"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="none" fill="#C9CED8"/><rect x="6.5" y="12" width="2.6" height="6" rx="1.3" stroke="none" fill="#7C8597"/><rect x="10.7" y="8.5" width="2.6" height="9.5" rx="1.3" stroke="none" fill="#7C8597"/><rect x="14.9" y="6" width="2.6" height="12" rx="1.3" stroke="none" fill="#7C8597"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "body", "type": "circle", "cx": 12, "cy": 12, "r": 10},
  {"tone": "detail", "type": "path", "d": "M7.8 12.3l2.8 2.8 5.6-5.6", "bar": 2.6, "illo": "accent"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="none" fill="#C9CED8"/><path d="M7.8 12.3l2.8 2.8 5.6-5.6" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke="#7C8597"/></svg>
```
