# app-icon-glossy

A squircle tile with a vertical gradient and a gloss band, with the object in white on top,
like a phone app icon. For app launchers, integration grids, feature tiles and marketing.

Starter: `assets/style-starters/app-icon-glossy.json`.

## Grid and live area

24 grid, live area 24: the tile fills the canvas. The glyph sits inside a 12 × 12 to
14 × 14 center area (5 to 19).

## Tile

- Squircle (continuous-corner square), not a plain rounded rectangle:
  `M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z`.
- `bg`: brand gradient, lighter top → deeper bottom.
- `gloss`: white about 45% → 0% over the top half, an arc that follows the tile.

## Glyph

- `glyph` white, `glyph2` white at about 65% for the secondary part (two tones on the tile).
- Simplified versions of the UI drawings; bars ≥ 1.8.

## States

None (default per theme). For variety across a grid of tiles, vary `bg` per category by
making one source per color or by using distinct tones per icon.

## Do

- Center the glyph optically; keep 5 units of padding.
- Keep the gloss subtle; it should not cut through the glyph.

## Avoid

- Text in the tile.
- Mimicking a real app's tile (shape, color and glyph combination of an existing brand).

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "bg", "type": "path", "d": "M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z"},
  {"tone": "gloss", "type": "path", "d": "M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z"},
  {"tone": "glyph2", "type": "path", "d": "M7.5 12h9v5.2a1.8 1.8 0 0 1-1.8 1.8H9.3a1.8 1.8 0 0 1-1.8-1.8z"},
  {"tone": "glyph", "type": "path", "d": "M11.2 5.4a1.2 1.2 0 0 1 1.6 0l5 4.2c.45.4.2 1.2-.4 1.2H6.6c-.6 0-.85-.8-.4-1.2z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="home-bg" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#6C7BFF"/><stop offset="1" stop-color="#2F3CC9"/></linearGradient><linearGradient id="home-gloss" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.451"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z" stroke="none" fill="url(#home-bg)"/><path d="M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z" stroke="none" fill="url(#home-gloss)"/><path d="M7.5 12h9v5.2a1.8 1.8 0 0 1-1.8 1.8H9.3a1.8 1.8 0 0 1-1.8-1.8z" stroke="none" fill="#FFFFFF" fill-opacity="0.651"/><path d="M11.2 5.4a1.2 1.2 0 0 1 1.6 0l5 4.2c.45.4.2 1.2-.4 1.2H6.6c-.6 0-.85-.8-.4-1.2z" stroke="none" fill="#FFFFFF"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "bg", "type": "path", "d": "M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z"},
  {"tone": "gloss", "type": "path", "d": "M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z"},
  {"tone": "glyph2", "type": "path", "d": "M12 5.4a4 4 0 0 1 4 4V11H8V9.4a4 4 0 0 1 4-4z"},
  {"tone": "glyph", "type": "path", "d": "M8 10.4h8v1.6l1 1.6a.9.9 0 0 1-.8 1.4H7.8a.9.9 0 0 1-.8-1.4l1-1.6z"},
  {"tone": "glyph", "type": "path", "d": "M10.4 16.2h3.2a1.6 1.6 0 0 1-3.2 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="bell-bg" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#6C7BFF"/><stop offset="1" stop-color="#2F3CC9"/></linearGradient><linearGradient id="bell-gloss" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.451"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z" stroke="none" fill="url(#bell-bg)"/><path d="M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z" stroke="none" fill="url(#bell-gloss)"/><path d="M12 5.4a4 4 0 0 1 4 4V11H8V9.4a4 4 0 0 1 4-4z" stroke="none" fill="#FFFFFF" fill-opacity="0.651"/><path d="M8 10.4h8v1.6l1 1.6a.9.9 0 0 1-.8 1.4H7.8a.9.9 0 0 1-.8-1.4l1-1.6z" stroke="none" fill="#FFFFFF"/><path d="M10.4 16.2h3.2a1.6 1.6 0 0 1-3.2 0z" stroke="none" fill="#FFFFFF"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "bg", "type": "path", "d": "M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z"},
  {"tone": "gloss", "type": "path", "d": "M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z"},
  {"tone": "glyph2", "type": "rect", "x": 7, "y": 11, "width": 2.2, "height": 6.5, "rx": 1.1},
  {"tone": "glyph2", "type": "rect", "x": 10.9, "y": 8, "width": 2.2, "height": 9.5, "rx": 1.1},
  {"tone": "glyph", "type": "rect", "x": 14.8, "y": 6, "width": 2.2, "height": 11.5, "rx": 1.1}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="chart-bg" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#6C7BFF"/><stop offset="1" stop-color="#2F3CC9"/></linearGradient><linearGradient id="chart-gloss" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.451"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z" stroke="none" fill="url(#chart-bg)"/><path d="M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z" stroke="none" fill="url(#chart-gloss)"/><rect x="7" y="11" width="2.2" height="6.5" rx="1.1" stroke="none" fill="#FFFFFF" fill-opacity="0.651"/><rect x="10.9" y="8" width="2.2" height="9.5" rx="1.1" stroke="none" fill="#FFFFFF" fill-opacity="0.651"/><rect x="14.8" y="6" width="2.2" height="11.5" rx="1.1" stroke="none" fill="#FFFFFF"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "bg", "type": "path", "d": "M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z"},
  {"tone": "gloss", "type": "path", "d": "M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z"},
  {"tone": "glyph2", "type": "circle", "cx": 12, "cy": 12, "r": 6.2},
  {"tone": "glyph", "type": "path", "d": "M9.3 12.1l1.8 1.8 3.6-3.6", "bar": 1.9}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="check-circle-bg" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#6C7BFF"/><stop offset="1" stop-color="#2F3CC9"/></linearGradient><linearGradient id="check-circle-gloss" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.451"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M12 0C20.6 0 24 3.4 24 12S20.6 24 12 24 0 20.6 0 12 3.4 0 12 0z" stroke="none" fill="url(#check-circle-bg)"/><path d="M12 .9c7.5 0 10.4 2.6 10.9 9.1-6.9 2.3-14.9 2.3-21.8 0C1.6 3.5 4.5.9 12 .9z" stroke="none" fill="url(#check-circle-gloss)"/><circle cx="12" cy="12" r="6.2" stroke="none" fill="#FFFFFF" fill-opacity="0.651"/><path d="M9.3 12.1l1.8 1.8 3.6-3.6" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" stroke="#FFFFFF"/></svg>
```
