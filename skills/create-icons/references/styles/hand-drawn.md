# hand-drawn

An irregular, sketchy line, as if drawn with a pen: slight wobble, small overshoots where
lines meet, an optional loose wash fill. For editorial products, notes, friendly onboarding.

Starter: `assets/style-starters/hand-drawn.json`.

## Grid and live area

24 grid, 20 live area (stroke included).

## Weight and tones

- `ink` (primary): stroke 1.5 to 1.8, round caps and joins.
- `wash`: an optional light fill (`paint: "fill"`), slightly offset from the ink outline, as
  if colored loosely.

## Drawing

- Build each line from gentle cubic curves with 0.2 to 0.5 units of deviation; never perfectly
  straight, never zigzag.
- Let some lines overshoot their corner by 0.3 to 0.8 or stop just short of it.
- Draw closed shapes as one open path whose end slightly passes its start.
- Keep the object's proportions honest; the irregularity is in the line, not the form.

## States

Gray ink by default, brand ink when active; the wash follows a tint of the same color.

## Legibility at 16 px

The wobble disappears at 16 px; check that the silhouette still reads. Best at 20 to 32.

## Avoid

- Random jitter on every segment (it reads as noise).
- Mixing perfectly geometric icons with sketchy ones.

## Examples

### 1. home

Source shapes:

```json
[
  {"tone": "wash", "type": "path", "d": "M5.6 11.4c3.9-.3 8.6-.2 12.7.1l.1 8.3c-4.2.5-8.6.4-12.6.1z", "paint": "fill"},
  {"tone": "ink", "type": "path", "d": "M3.4 11.6C6.1 9.2 9 6.6 11.9 4.3c3 2.4 5.7 4.8 8.5 7.4"},
  {"tone": "ink", "type": "path", "d": "M5.5 10.2c.1 3.4-.1 6.9.2 10.3 4.3.4 8.4.3 12.7 0 .2-3.4.1-6.9 0-10.4"},
  {"tone": "ink", "type": "path", "d": "M10.1 20.4c-.1-1.6 0-3.1.1-4.6 1.2-.2 2.4-.1 3.6 0 .1 1.6.1 3.1 0 4.6"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.6 11.4c3.9-.3 8.6-.2 12.7.1l.1 8.3c-4.2.5-8.6.4-12.6.1z" stroke="none" fill="#DDE1E8"/><path d="M3.4 11.6C6.1 9.2 9 6.6 11.9 4.3c3 2.4 5.7 4.8 8.5 7.4" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M5.5 10.2c.1 3.4-.1 6.9.2 10.3 4.3.4 8.4.3 12.7 0 .2-3.4.1-6.9 0-10.4" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M10.1 20.4c-.1-1.6 0-3.1.1-4.6 1.2-.2 2.4-.1 3.6 0 .1 1.6.1 3.1 0 4.6" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/></svg>
```

### 2. bell

Source shapes:

```json
[
  {"tone": "wash", "type": "path", "d": "M7.1 15.8c-.1-2.4-.3-4.9.4-7.1 1.2-3.4 7.5-3.6 9 .2.8 2.1.5 4.5.5 6.9z", "paint": "fill"},
  {"tone": "ink", "type": "path", "d": "M6.9 16.1c0-2.6-.4-5.3.6-7.6 1.5-3.5 7.6-3.4 9 .3.8 2.3.4 4.8.6 7.2 1 .6 1.9 1.3 2.5 2.2-5.2.4-10.6.5-15.7-.1.8-.8 1.9-1.5 3-2z"},
  {"tone": "ink", "type": "path", "d": "M10.2 20.9c1.2.4 2.5.4 3.7-.1"},
  {"tone": "ink", "type": "path", "d": "M11.8 4.9c.1-.7.2-1.3.4-1.9"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 15.8c-.1-2.4-.3-4.9.4-7.1 1.2-3.4 7.5-3.6 9 .2.8 2.1.5 4.5.5 6.9z" stroke="none" fill="#DDE1E8"/><path d="M6.9 16.1c0-2.6-.4-5.3.6-7.6 1.5-3.5 7.6-3.4 9 .3.8 2.3.4 4.8.6 7.2 1 .6 1.9 1.3 2.5 2.2-5.2.4-10.6.5-15.7-.1.8-.8 1.9-1.5 3-2z" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M10.2 20.9c1.2.4 2.5.4 3.7-.1" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M11.8 4.9c.1-.7.2-1.3.4-1.9" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/></svg>
```

### 3. chart

Source shapes:

```json
[
  {"tone": "ink", "type": "path", "d": "M4.2 3.8c-.2 5.2-.3 10.6.1 15.9 5.2.3 10.5.4 15.7.1"},
  {"tone": "ink", "type": "path", "d": "M8.4 16.6c.1-1.3 0-2.7.2-4"},
  {"tone": "ink", "type": "path", "d": "M12.4 16.7c-.1-2.9 0-5.8.1-8.6"},
  {"tone": "ink", "type": "path", "d": "M16.6 16.6c.1-2 0-4.2.2-6.3"},
  {"tone": "ink", "type": "path", "d": "M7.6 9.6c2.4-1.6 5.2-3.6 8-4.8l1.9-.9"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.2 3.8c-.2 5.2-.3 10.6.1 15.9 5.2.3 10.5.4 15.7.1" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M8.4 16.6c.1-1.3 0-2.7.2-4" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M12.4 16.7c-.1-2.9 0-5.8.1-8.6" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M16.6 16.6c.1-2 0-4.2.2-6.3" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M7.6 9.6c2.4-1.6 5.2-3.6 8-4.8l1.9-.9" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/></svg>
```

### 4. check-circle

Source shapes:

```json
[
  {"tone": "ink", "type": "path", "d": "M12.4 3.1c4.9-.2 8.8 3.6 8.6 8.6-.2 4.9-4.3 8.6-9.2 8.4C7 19.9 3.1 16.4 3.2 11.7 3.3 7 7.4 3.4 12.1 3.2"},
  {"tone": "ink", "type": "path", "d": "M8 12.3c1 .8 1.9 1.7 2.7 2.8 1.6-2.3 3.4-4.4 5.5-6.4"}
]
```

Rendered (light, default state):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.4 3.1c4.9-.2 8.8 3.6 8.6 8.6-.2 4.9-4.3 8.6-9.2 8.4C7 19.9 3.1 16.4 3.2 11.7 3.3 7 7.4 3.4 12.1 3.2" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/><path d="M8 12.3c1 .8 1.9 1.7 2.7 2.8 1.6-2.3 3.4-4.4 5.5-6.4" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke="#2F3542"/></svg>
```
