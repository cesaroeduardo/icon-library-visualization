# outline

A uniform line with rounded ends and joins, in the spirit of modern UI line sets. One tone,
`currentColor` by default. Pairs with line libraries; dense interfaces, toolbars, tables.

Starter: `assets/style-starters/outline.json`.

## Grid and live area

24 grid, 20 live area. The stroke counts toward it: with width w, geometry stays inside
`2 + w/2` to `22 - w/2`.

## Weight

1.5 to 2 (`stroke.width`). Match the library already in use (Lucide/Tabler/Feather 2,
Heroicons/Phosphor 1.5) or the most used `strokeWidth` override. One width for every line.

## Corners

`linecap` and `linejoin` round. Rectangles `rx` 2 to 3; small inner corners 1. Square UI or
sharp type: butt caps and miter joins, `rx` 0.5 to 1.

## States

Default `--muted-foreground`-like gray, hover the text color, active the brand, disabled a
pale gray. Optional: a filled `solid` twin for the selected tab (see combining-styles.md).

## Legibility at 16 px

At 2 px the line becomes 1.33 px: keep parallel lines ≥ 3 units apart center to center,
inner counters ≥ 4 units, and no more than 4 or 5 strokes per icon.

## Do

- Close shapes with round joins; end open lines on whole or half units.
- Use `paint: "fill"` for small dots (r ≈ 0.6 × stroke).
- Keep the same corner radius on every rectangle.

## Avoid

- Mixed stroke widths, or scaling an icon to fake a thinner line.
- Lines that touch at a sharp angle (they blob at 16 px); leave a 1-unit gap or join them.
- Copying a library's drawings: match its construction, draw your own.

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "line", "type": "path", "d": "M3 11.2l8.2-6.9a1.2 1.2 0 0 1 1.6 0l8.2 6.9"},
  {"tone": "line", "type": "path", "d": "M5 9.6V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.6"},
  {"tone": "line", "type": "path", "d": "M10 21v-4.5a2 2 0 0 1 4 0V21"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.2l8.2-6.9a1.2 1.2 0 0 1 1.6 0l8.2 6.9" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M5 9.6V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.6" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M10 21v-4.5a2 2 0 0 1 4 0V21" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "line", "type": "path", "d": "M6 16.5V10a6 6 0 0 1 12 0v6.5l1.5 2h-15z"},
  {"tone": "line", "type": "path", "d": "M10 21.1h4"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16.5V10a6 6 0 0 1 12 0v6.5l1.5 2h-15z" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M10 21.1h4" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "line", "type": "path", "d": "M4 4v14.5A1.5 1.5 0 0 0 5.5 20H20"},
  {"tone": "line", "type": "path", "d": "M9 16v-4"},
  {"tone": "line", "type": "path", "d": "M13 16V8"},
  {"tone": "line", "type": "path", "d": "M17 16v-6"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v14.5A1.5 1.5 0 0 0 5.5 20H20" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M9 16v-4" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M13 16V8" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M17 16v-6" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "line", "type": "circle", "cx": 12, "cy": 12, "r": 9},
  {"tone": "line", "type": "path", "d": "M8.2 12.2l2.6 2.6 5-5"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/><path d="M8.2 12.2l2.6 2.6 5-5" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="#5E6676"/></svg>
```
