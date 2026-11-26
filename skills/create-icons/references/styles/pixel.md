# pixel

8-bit pixel art: integer squares on a 16 or 24 cell grid, crisp edges. For games, playful
brands and retro aesthetics.

Starter: `assets/style-starters/pixel.json`.

## Grid and live area

`grid: 16`, `live: 14` (cells 1 to 14), or `grid: 24`, `live: 22`. `rendering:
"crispEdges"`, which also makes the validator require integer coordinates. Render only at
integer multiples (16, 32, 48) so cells stay square.

## Tones

- `ink` (primary): the outline and key details, 1 cell wide.
- `fill`: the inside, a light tone. A third tone for a highlight is fine at 24 cells.

## Drawing

Draw on paper-like rows: in the starter each icon is ASCII art converted to rect runs (one
`rect` per horizontal run of the same tone). Curves are stair steps of 1-2-3 cells; avoid
lone diagonal cells except at 45°.

## States

Same as any UI style: gray ink by default, brand ink when active.

## Do

- Keep a 1-cell outline all around.
- Use symmetrical forms where the object is symmetrical.

## Avoid

- Half cells, anti-aliasing, non-integer sizes.
- Rendering at 20 or 24 px for a 16-cell grid (blurry cells).

## Examples

The source of each icon is one `rect` per horizontal run of cells; see the starter JSON. The rendered SVGs below show the result.

### 1. home

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><rect x="7" y="1" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="6" y="2" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="2" width="2" height="1" stroke="none" fill="#C9CED8"/><rect x="9" y="2" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="6" y="3" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="10" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="4" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="5" width="8" height="1" stroke="none" fill="#C9CED8"/><rect x="12" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="6" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="7" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="7" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="7" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="8" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="9" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="7" y="9" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="9" y="9" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="10" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="6" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="9" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="10" y="10" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="11" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="6" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="9" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="10" y="11" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="12" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="6" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="9" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="10" y="12" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="13" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="13" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="6" y="13" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="9" y="13" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="10" y="13" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="13" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="14" width="12" height="1" stroke="none" fill="#2F3542"/></svg>
```

### 2. bell

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><rect x="7" y="1" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="6" y="2" width="4" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="6" y="3" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="10" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="4" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="5" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="6" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="7" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="7" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="7" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="8" width="8" height="1" stroke="none" fill="#C9CED8"/><rect x="12" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="4" y="9" width="8" height="1" stroke="none" fill="#C9CED8"/><rect x="12" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="10" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="11" width="12" height="1" stroke="none" fill="#2F3542"/><rect x="6" y="13" width="4" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="14" width="2" height="1" stroke="none" fill="#2F3542"/></svg>
```

### 3. chart

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><rect x="1" y="1" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="2" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="2" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="3" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="4" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="5" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="5" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="6" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="6" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="7" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="7" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="7" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="8" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="8" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="8" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="9" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="9" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="9" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="10" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="10" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="10" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="11" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="7" y="11" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="11" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="13" width="14" height="1" stroke="none" fill="#2F3542"/></svg>
```

### 4. check-circle

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"><rect x="5" y="1" width="6" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="2" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="2" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="2" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="3" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="3" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="4" width="7" height="1" stroke="none" fill="#C9CED8"/><rect x="10" y="4" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="12" y="4" width="1" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="4" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="5" width="8" height="1" stroke="none" fill="#C9CED8"/><rect x="10" y="5" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="12" y="5" width="2" height="1" stroke="none" fill="#C9CED8"/><rect x="14" y="5" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="6" width="7" height="1" stroke="none" fill="#C9CED8"/><rect x="9" y="6" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="6" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="14" y="6" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="7" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="7" width="1" height="1" stroke="none" fill="#C9CED8"/><rect x="3" y="7" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="7" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="9" y="7" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="11" y="7" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="14" y="7" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="8" width="2" height="1" stroke="none" fill="#C9CED8"/><rect x="4" y="8" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="6" y="8" width="2" height="1" stroke="none" fill="#C9CED8"/><rect x="8" y="8" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="10" y="8" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="14" y="8" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="9" width="3" height="1" stroke="none" fill="#C9CED8"/><rect x="5" y="9" width="4" height="1" stroke="none" fill="#2F3542"/><rect x="9" y="9" width="5" height="1" stroke="none" fill="#C9CED8"/><rect x="14" y="9" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="1" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="10" width="4" height="1" stroke="none" fill="#C9CED8"/><rect x="6" y="10" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="8" y="10" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="14" y="10" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="11" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="11" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="2" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="12" width="10" height="1" stroke="none" fill="#C9CED8"/><rect x="13" y="12" width="1" height="1" stroke="none" fill="#2F3542"/><rect x="3" y="13" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="13" width="6" height="1" stroke="none" fill="#C9CED8"/><rect x="11" y="13" width="2" height="1" stroke="none" fill="#2F3542"/><rect x="5" y="14" width="6" height="1" stroke="none" fill="#2F3542"/></svg>
```
