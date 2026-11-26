# Drawing guide

You draw every icon by hand as SVG geometry on the style's grid. These rules apply to all
styles; the style reference adds its own.

## Contents

1. The grid and keylines
2. Optical balance
3. Legibility at 16 px
4. Consistency across the set
5. Path craft
6. Filled styles
7. Stroke styles
8. Checking your work
9. Common mistakes

## 1. The grid and keylines

On a 24 grid with a 20 live area (2 to 22), use these keyline shapes as the outer boundary
of the main form:

| Keyline | Box | Use for |
|---------|-----|---------|
| Circle | Ø 20, centered | round objects (clock, globe, status) |
| Square | 18 × 18 at 3,3 | boxy objects (app, grid, calendar) |
| Portrait | 16 × 20 at 4,2 | documents, phones, bottles |
| Landscape | 20 × 16 at 2,4 | cards, screens, mail, tickets |

A circle at Ø 20 and a square at 18 look the same size; that is the point of keylines.
In stroke styles the stroke counts: a 2-px line on a Ø 20 circle needs r = 9 (the outer
edge lands on 22).

## 2. Optical balance

- Pointed shapes (triangles, play buttons, arrows) look smaller than their box: let them
  overshoot slightly (0.5) or shift play triangles ~0.5 right of center.
- Visually heavy parts sit slightly low; center by mass, not by bounding box.
- Diagonals at 45° read cleanest; avoid near-misses like 40° or 50°.
- Keep counters (holes, gaps) at least 1.5 units at 24 so they stay open at 16 px.

## 3. Legibility at 16 px

16 px is 2/3 of the grid: 1 unit becomes 0.67 px. So:

- No detail smaller than ~1.5 units; no gap smaller than ~1.5; no line thinner than the style
  minimum.
- In multi-tone styles the **primary tone must identify the icon alone**. Put the
  identifying feature in it (the roof and door of a house, the handle of a magnifier, the
  bars of a chart), and keep the secondary tone for mass.
- Two or three meaningful parts per icon; four only when the concept needs it.
- Prefer a silhouette that is recognizable as a blob: if you blur the icon, it should still
  hint at the object.

## 4. Consistency across the set

- One metaphor per concept; reuse the same sub-shapes (the same clock, the same document
  corner) wherever the concept recurs.
- Front-facing, no perspective, unless the style says otherwise (soft 3D adds volume through
  shading, not perspective).
- Same corner radii everywhere: `radius.outer` for main forms, `radius.inner` for small parts.
- Same visual density: a busy icon next to a sparse one reads as two families.
- Modifiers (plus, check, x, clock) go bottom-right at the same size and position.

## 5. Path craft

- Use whole or half units for main coordinates; finer values only for curves.
- Rounded rectangles: `rect` with `rx`, not hand-written arcs.
- Circles: `circle`. Rings: a `path` with an outer and inner circle and `fillRule: "evenodd"`,
  or (stroke styles) a circle with the stroke.
- Arcs: `a rx ry 0 large sweep dx dy`. A quarter turn of radius r is `a r r 0 0 1 r r`.
- Rounded polygon corners: stop short of the vertex by the radius and use `Q vertex end`.
- Cut-outs in one-color styles: combine subpaths in one `path` with `fillRule: "evenodd"`.
- Keep every icon self-contained (no transforms; the build does not support them).
- Write coordinates absolutely when you are unsure; relative commands are fine once a shape
  works.

## 6. Filled styles

- No outlines. Lines that must exist (arrows, checks, chains) are thick `bar`s with round
  caps, at least `minBar` wide (2.2-2.6 reads well at 24).
- Separate overlapping parts with a gap of ~1.5 or with the tone change, not with a stroke.
- Light body, dark detail is the default split (duotone). The dark part may overlap the
  light part; draw it after.

## 7. Stroke styles

- One stroke width for every line. Never scale a stroke to fake a lighter weight.
- Ends: round caps unless the sheet says butt. Open paths end on whole or half units.
- Inner corners: radius ≈ `radius.inner`; outer corners `radius.outer`.
- Small solid details (dots) use `paint: "fill"`; size them so they match the stroke weight
  visually (r ≈ stroke × 0.6).
- Stroke width counts toward the live area: geometry stays within `2 + w/2` and `22 - w/2`.

## 8. Checking your work

1. `validate.py` (live area, bars, tones, names, SVG).
2. Build the catalog. Turn on "Show icon bounds" to see the canvas, and "Primary tone only"
   to test 16-px legibility.
3. Look at the 16 px column in light and dark: anything that turns into a smudge needs
   fewer parts or bigger gaps.
4. Compare with the project's current icons (`--compare`): weight, size inside the canvas,
   corners.

## 9. Common mistakes

- Filling the whole live area with every icon: square-ish icons should use the 18 keyline.
- Thin gaps that close at 16 px.
- Details in the secondary tone only (they vanish in the primary-only check).
- Mixing 1.5 and 2 strokes, or rounded and sharp corners, in one set.
- Text or letters inside icons (they do not localize and blur at 16 px), unless the concept
  is the letter itself (a font or "A" for text).
- Redrawing a brand logo by hand: use the official asset (third-party-marks.md).
