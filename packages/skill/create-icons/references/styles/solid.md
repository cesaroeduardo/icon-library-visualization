# solid

One color, filled; inner details are cut out as negative space. Works at the smallest sizes,
in tab bars, and as the selected twin of an outline set.

Starter: `assets/style-starters/solid.json`.

## Grid and live area

24 grid, 20 live area.

## Tones

One tone (`glyph`), `currentColor` by default. States change the color only.

## Corners

Outer 2.5 to 3.5. Cut-outs (doors, bars, checks) have their own radius 1 to 1.5 and are at
least 1.8 wide so they stay open at 16 px.

## How to cut out

Put the outer form and the holes in one `path` with `fillRule: "evenodd"`: the outer form
first, then each hole as its own subpath. For a check or arrow cut-out, draw its outline as
a closed polygon (offset the center line by half the bar width, round the ends with arcs).
Or leave a gap of at least 1.5 between separate filled parts (bell and clapper).

## States

Default gray, hover text color, active brand, disabled pale gray.

## Legibility at 16 px

Negative space closes first: holes ≥ 1.8, gaps ≥ 1.5. Prefer one strong cut-out over three
small ones.

## Do

- Keep the silhouette identical to the outline twin when both exist.
- Use cut-outs to show the identifying detail.

## Avoid

- Strokes or outlines (filled style).
- Tiny holes that turn into noise.

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "glyph", "type": "path", "d": "M13.3 2.9l7.4 6.3c.5.4.8 1 .8 1.6V19a3 3 0 0 1-3 3h-3.5v-5a3 3 0 0 0-6 0v5H5.5a3 3 0 0 1-3-3v-8.2c0-.6.3-1.2.8-1.6l7.4-6.3a2 2 0 0 1 2.6 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.3 2.9l7.4 6.3c.5.4.8 1 .8 1.6V19a3 3 0 0 1-3 3h-3.5v-5a3 3 0 0 0-6 0v5H5.5a3 3 0 0 1-3-3v-8.2c0-.6.3-1.2.8-1.6l7.4-6.3a2 2 0 0 1 2.6 0z" stroke="none" fill="#5E6676"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "glyph", "type": "path", "d": "M12 2.8a6.6 6.6 0 0 1 6.6 6.6v3.7l1.6 2.6a1.5 1.5 0 0 1-1.3 2.3H5.1a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6V9.4A6.6 6.6 0 0 1 12 2.8z"},
  {"tone": "glyph", "type": "path", "d": "M9.5 19.4h5a2.5 2.5 0 0 1-5 0z"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a6.6 6.6 0 0 1 6.6 6.6v3.7l1.6 2.6a1.5 1.5 0 0 1-1.3 2.3H5.1a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6V9.4A6.6 6.6 0 0 1 12 2.8z" stroke="none" fill="#5E6676"/><path d="M9.5 19.4h5a2.5 2.5 0 0 1-5 0z" stroke="none" fill="#5E6676"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "glyph", "type": "path", "d": "M6.5 2.5h11a4 4 0 0 1 4 4v11a4 4 0 0 1 -4 4h-11a4 4 0 0 1 -4 -4v-11a4 4 0 0 1 4 -4zM7.8 12h0a1.3 1.3 0 0 1 1.3 1.3v3.4a1.3 1.3 0 0 1 -1.3 1.3h-0a1.3 1.3 0 0 1 -1.3 -1.3v-3.4a1.3 1.3 0 0 1 1.3 -1.3zM12 8.5h0a1.3 1.3 0 0 1 1.3 1.3v6.9a1.3 1.3 0 0 1 -1.3 1.3h-0a1.3 1.3 0 0 1 -1.3 -1.3v-6.9a1.3 1.3 0 0 1 1.3 -1.3zM16.2 6h0a1.3 1.3 0 0 1 1.3 1.3v9.4a1.3 1.3 0 0 1 -1.3 1.3h-0a1.3 1.3 0 0 1 -1.3 -1.3v-9.4a1.3 1.3 0 0 1 1.3 -1.3z", "fillRule": "evenodd"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 2.5h11a4 4 0 0 1 4 4v11a4 4 0 0 1 -4 4h-11a4 4 0 0 1 -4 -4v-11a4 4 0 0 1 4 -4zM7.8 12h0a1.3 1.3 0 0 1 1.3 1.3v3.4a1.3 1.3 0 0 1 -1.3 1.3h-0a1.3 1.3 0 0 1 -1.3 -1.3v-3.4a1.3 1.3 0 0 1 1.3 -1.3zM12 8.5h0a1.3 1.3 0 0 1 1.3 1.3v6.9a1.3 1.3 0 0 1 -1.3 1.3h-0a1.3 1.3 0 0 1 -1.3 -1.3v-6.9a1.3 1.3 0 0 1 1.3 -1.3zM16.2 6h0a1.3 1.3 0 0 1 1.3 1.3v9.4a1.3 1.3 0 0 1 -1.3 1.3h-0a1.3 1.3 0 0 1 -1.3 -1.3v-9.4a1.3 1.3 0 0 1 1.3 -1.3z" stroke="none" fill-rule="evenodd" clip-rule="evenodd" fill="#5E6676"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "glyph", "type": "path", "d": "M2 12a10 10 0 1 1 20 0a10 10 0 1 1 -20 0zM6.88 13.22L10.6 16.94L17.12 10.42A1.3 1.3 0 0 1 15.28 8.58L10.6 13.26L8.72 11.38A1.3 1.3 0 0 1 6.88 13.22z", "fillRule": "evenodd"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12a10 10 0 1 1 20 0a10 10 0 1 1 -20 0zM6.88 13.22L10.6 16.94L17.12 10.42A1.3 1.3 0 0 1 15.28 8.58L10.6 13.26L8.72 11.38A1.3 1.3 0 0 1 6.88 13.22z" stroke="none" fill-rule="evenodd" clip-rule="evenodd" fill="#5E6676"/></svg>
```
