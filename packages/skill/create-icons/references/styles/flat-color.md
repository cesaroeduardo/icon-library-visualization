# flat-color

Flat shapes in 2 to 4 brand colors, no gradients, no outlines. For feature lists, docs,
help centers, onboarding.

Starter: `assets/style-starters/flat-color.json`.

## Grid and live area

24 grid, 20 live area; used at 24 to 48.

## Tones

- `detail`: the darkest brand color (identifies the object).
- `body`: a light tint of the brand.
- `accent`, `accent2`: one or two complementary colors for single parts (a check, a coin, a
  spark). Max 4 colors per icon, usually 3.
- `fallback: "palette"`; `primaryCheck: false` (color carries part of the meaning).

## Corners

Outer 2.5 to 3.5. Bars ≥ 1.8 for checks and arrows.

## States

Default per theme. Dark theme swaps to deeper body and lighter detail.

## Do

- Use the same accent for the same meaning across the set (green = done, yellow = money).
- Leave large areas in the body tint so the icon stays calm.

## Avoid

- Gradients, shadows, highlights (that is soft-3d).
- More than one accent part per icon.

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "body", "type": "path", "d": "M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"},
  {"tone": "detail", "type": "path", "d": "M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z"},
  {"tone": "accent", "type": "path", "d": "M10 22v-4a2 2 0 0 1 4 0v4z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" stroke="none" fill="#AEB9FF"/><path d="M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z" stroke="none" fill="#2E3A8C"/><path d="M10 22v-4a2 2 0 0 1 4 0v4z" stroke="none" fill="#22C38E"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "body", "type": "path", "d": "M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z"},
  {"tone": "detail", "type": "path", "d": "M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z"},
  {"tone": "accent2", "type": "path", "d": "M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z" stroke="none" fill="#AEB9FF"/><path d="M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z" stroke="none" fill="#2E3A8C"/><path d="M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z" stroke="none" fill="#FFC23D"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "body", "type": "rect", "x": 2.5, "y": 2.5, "width": 19, "height": 19, "rx": 4},
  {"tone": "detail", "type": "rect", "x": 6.5, "y": 12, "width": 2.6, "height": 6, "rx": 1.3},
  {"tone": "detail", "type": "rect", "x": 10.7, "y": 8.5, "width": 2.6, "height": 9.5, "rx": 1.3},
  {"tone": "accent", "type": "rect", "x": 14.9, "y": 6, "width": 2.6, "height": 12, "rx": 1.3}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="none" fill="#AEB9FF"/><rect x="6.5" y="12" width="2.6" height="6" rx="1.3" stroke="none" fill="#2E3A8C"/><rect x="10.7" y="8.5" width="2.6" height="9.5" rx="1.3" stroke="none" fill="#2E3A8C"/><rect x="14.9" y="6" width="2.6" height="12" rx="1.3" stroke="none" fill="#22C38E"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "body", "type": "circle", "cx": 12, "cy": 12, "r": 10},
  {"tone": "accent", "type": "path", "d": "M7.8 12.3l2.8 2.8 5.6-5.6", "bar": 2.6}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="none" fill="#AEB9FF"/><path d="M7.8 12.3l2.8 2.8 5.6-5.6" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke="#22C38E"/></svg>
```
