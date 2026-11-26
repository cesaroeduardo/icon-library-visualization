# soft-3d-gradient

The filled drawing with soft vertical gradients and a light highlight that suggests volume,
no background tile. For landing pages, empty states and onboarding at 48 px and up.

Starter: `assets/style-starters/soft-3d-gradient.json` (reuses the duotone geometry).

## Grid and live area

24 grid, 20 live area; rendered at 48, 64 or 96. No perspective: volume comes from shading.

## Tones

All tones are gradients (`{"gradient": [top, bottom]}`), top lighter than bottom:

- `body`: pale tint → mid tint of the brand.
- `detail`: brand light → brand.
- `accent`: one complementary color for the part that should pop (green, yellow, coral).
- `shine`: white at about 70% → 0%, a thin crescent or band near the top of the body.

`fallback: "palette"` so the component looks right with no CSS. `primaryCheck: false`.

## Corners

Generous: outer 3 to 4. Soft shapes read better with gradients.

## States

Usually only default (per theme). On dark backgrounds use deeper body gradients so the
icon does not glow.

## Legibility

Not for 16 to 24 px. At 48 px keep at most 3 parts plus the highlight.

## Do

- Start from the UI drawing so the object is recognized across surfaces.
- One accent part per icon.
- Highlights follow the form (a crescent inside a circle, a band across a roof).

## Avoid

- Drop shadows baked into the SVG (let the page add them with CSS if needed).
- Rainbow gradients or more than 3 hues.
- Highlights that cross the edge of the shape.

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "body", "type": "path", "d": "M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"},
  {"tone": "detail", "type": "path", "d": "M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z"},
  {"tone": "accent", "type": "path", "d": "M10 22v-4a2 2 0 0 1 4 0v4z"},
  {"tone": "shine", "type": "path", "d": "M5.2 11.2h13.6v2.2c-4.4 1.3-9.2 1.3-13.6 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="home-body" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#F1F3FF"/><stop offset="1" stop-color="#C7CEFF"/></linearGradient><linearGradient id="home-detail" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#7987F5"/><stop offset="1" stop-color="#3442D6"/></linearGradient><linearGradient id="home-accent" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#8CF2CC"/><stop offset="1" stop-color="#18BE80"/></linearGradient><linearGradient id="home-shine" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.702"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" stroke="none" fill="url(#home-body)"/><path d="M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z" stroke="none" fill="url(#home-detail)"/><path d="M10 22v-4a2 2 0 0 1 4 0v4z" stroke="none" fill="url(#home-accent)"/><path d="M5.2 11.2h13.6v2.2c-4.4 1.3-9.2 1.3-13.6 0z" stroke="none" fill="url(#home-shine)"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "body", "type": "path", "d": "M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z"},
  {"tone": "detail", "type": "path", "d": "M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z"},
  {"tone": "detail", "type": "path", "d": "M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z"},
  {"tone": "shine", "type": "path", "d": "M8.3 5.6a4.9 4.9 0 0 1 7.4 0c-2.3-.9-5.1-.9-7.4 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="bell-body" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#F1F3FF"/><stop offset="1" stop-color="#C7CEFF"/></linearGradient><linearGradient id="bell-detail" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#7987F5"/><stop offset="1" stop-color="#3442D6"/></linearGradient><linearGradient id="bell-shine" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.702"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z" stroke="none" fill="url(#bell-body)"/><path d="M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z" stroke="none" fill="url(#bell-detail)"/><path d="M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z" stroke="none" fill="url(#bell-detail)"/><path d="M8.3 5.6a4.9 4.9 0 0 1 7.4 0c-2.3-.9-5.1-.9-7.4 0z" stroke="none" fill="url(#bell-shine)"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "body", "type": "rect", "x": 2.5, "y": 2.5, "width": 19, "height": 19, "rx": 4},
  {"tone": "detail", "type": "rect", "x": 6.5, "y": 12, "width": 2.6, "height": 6, "rx": 1.3},
  {"tone": "detail", "type": "rect", "x": 10.7, "y": 8.5, "width": 2.6, "height": 9.5, "rx": 1.3},
  {"tone": "accent", "type": "rect", "x": 14.9, "y": 6, "width": 2.6, "height": 12, "rx": 1.3},
  {"tone": "shine", "type": "path", "d": "M4 6.5a3 3 0 0 1 3-2.6h10a3 3 0 0 1 3 2.6c-5.3-1.1-10.7-1.1-16 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="chart-body" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#F1F3FF"/><stop offset="1" stop-color="#C7CEFF"/></linearGradient><linearGradient id="chart-detail" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#7987F5"/><stop offset="1" stop-color="#3442D6"/></linearGradient><linearGradient id="chart-accent" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#8CF2CC"/><stop offset="1" stop-color="#18BE80"/></linearGradient><linearGradient id="chart-shine" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.702"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="none" fill="url(#chart-body)"/><rect x="6.5" y="12" width="2.6" height="6" rx="1.3" stroke="none" fill="url(#chart-detail)"/><rect x="10.7" y="8.5" width="2.6" height="9.5" rx="1.3" stroke="none" fill="url(#chart-detail)"/><rect x="14.9" y="6" width="2.6" height="12" rx="1.3" stroke="none" fill="url(#chart-accent)"/><path d="M4 6.5a3 3 0 0 1 3-2.6h10a3 3 0 0 1 3 2.6c-5.3-1.1-10.7-1.1-16 0z" stroke="none" fill="url(#chart-shine)"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "body", "type": "circle", "cx": 12, "cy": 12, "r": 10},
  {"tone": "accent", "type": "path", "d": "M7.8 12.3l2.8 2.8 5.6-5.6", "bar": 2.6},
  {"tone": "shine", "type": "path", "d": "M5 8.6a7.9 7.9 0 0 1 14 0c-4.4-1.9-9.6-1.9-14 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="check-circle-body" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#F1F3FF"/><stop offset="1" stop-color="#C7CEFF"/></linearGradient><linearGradient id="check-circle-accent" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#8CF2CC"/><stop offset="1" stop-color="#18BE80"/></linearGradient><linearGradient id="check-circle-shine" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.702"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><circle cx="12" cy="12" r="10" stroke="none" fill="url(#check-circle-body)"/><path d="M7.8 12.3l2.8 2.8 5.6-5.6" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke="url(#check-circle-accent)"/><path d="M5 8.6a7.9 7.9 0 0 1 14 0c-4.4-1.9-9.6-1.9-14 0z" stroke="none" fill="url(#check-circle-shine)"/></svg>
```
