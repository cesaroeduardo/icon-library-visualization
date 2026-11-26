# Source format

One library = one `icons.json` (the icons) plus one `icon-style.json` (the style sheet). Every
output is generated from these two files; never edit the generated files by hand.

## icons.json

```json
{
  "package": { "name": "@acme/icons", "version": "0.1.0" },
  "framework": "react",
  "style": "./icon-style.json",
  "icons": [
    {
      "name": "invoice",
      "label": "Invoice",
      "group": "billing",
      "tags": ["bill", "receipt"],
      "shapes": [
        { "tone": "body", "type": "rect", "x": 4, "y": 2, "width": 16, "height": 20, "rx": 3 },
        { "tone": "detail", "type": "rect", "x": 7.5, "y": 6.5, "width": 9, "height": 2.2, "rx": 1.1 },
        { "tone": "detail", "type": "path", "d": "M8 16.5l2.5 2.5 5-5", "bar": 2.4 }
      ]
    }
  ]
}
```

- `style` is a path relative to `icons.json`, or the style object inline.
- Instead of `icons`, you can group: `"groups": { "billing": [ … ], "navigation": [ … ] }`.
- `name`: kebab-case, starts with a letter, unique. The component is PascalCase + `Icon`
  (`invoice` → `InvoiceIcon`).
- `label`: human name (used in the catalog, README and as a suggested `title`).
- `tags`: search words for the catalog and `manifest.json`.

### Shapes

| `type` | Required keys | Optional |
|--------|---------------|----------|
| `path` | `d` | `fillRule: "evenodd"` |
| `rect` | `x`, `y`, `width`, `height` | `rx`, `ry` |
| `circle` | `cx`, `cy`, `r` | |
| `ellipse` | `cx`, `cy`, `rx`, `ry` | |
| `line` | `x1`, `y1`, `x2`, `y2` | (stroke styles) |
| `polyline`, `polygon` | `points` | |

Common keys:

- `tone`: which tone paints the shape (default: the first tone in `style.tones`).
- `bar`: in **filled** styles, paints the shape as a thick rounded line of this width
  (arrows, checks, chains, handles). Must be ≥ `style.minBar`.
- `paint: "fill"`: in **stroke** styles, fills the shape instead of stroking it (dots,
  small solid details).
- `illo`: the tone this shape uses in the large illustration variant (e.g. `"accent"`), when
  the style defines `illustration`.
- `note`: free text, ignored by the build.

Shapes never carry colors (`fill`, `stroke`, `style`, `color` are rejected). Color always
comes from the tone, so states and themes work.

Order matters: later shapes paint over earlier ones. Draw the body first, then details.

## icon-style.json

```json
{
  "name": "duotone-filled",
  "grid": 24,
  "live": 20,
  "paint": "fill",
  "minBar": 1.8,
  "stroke": { "width": 2, "linecap": "round", "linejoin": "round" },
  "radius": { "outer": 3, "inner": 1.2 },
  "prefix": "ic",
  "tones": {
    "detail": { "fallbackOpacity": 1 },
    "body": { "fallbackOpacity": 0.4 }
  },
  "palette": {
    "light": {
      "default":  { "detail": "#6B7280", "body": "#D1D5DB" },
      "hover":    { "detail": "#374151", "body": "#B8BEC8" },
      "active":   { "detail": { "hex": "#4338CA", "token": "--primary" }, "body": "#C7D2FE" },
      "disabled": { "detail": "#B4BAC6", "body": "#E5E7EB" }
    },
    "dark": { "default": { "detail": "#9CA3AF", "body": "#374151" } }
  },
  "illustration": {
    "sizes": [48, 96],
    "tones": { "body": ["#EEF2FF", "#C7D2FE"], "detail": ["#6366F1", "#4338CA"], "accent": ["#6EE7B7", "#10B981"] }
  },
  "sizes": [16, 20, 24],
  "darkMode": "class",
  "darkSelector": [".dark", "[data-theme=\"dark\"]"],
  "rendering": "geometricPrecision",
  "primaryCheck": true,
  "context": { "font": "Inter, sans-serif", "radius": 10, "brand": "#4338CA", "onBrand": "#FFFFFF",
               "surface": "#FFFFFF", "sidebar": "#F7F7F9", "text": "#111827", "border": "#E5E7EB",
               "surfaceDark": "#0B0D12", "sidebarDark": "#14171F", "textDark": "#E5E7EB", "borderDark": "#262B36" },
  "rationale": [ { "decision": "…", "because": "…", "source": "file:line" } ]
}
```

| Field | Meaning |
|-------|---------|
| `grid` | viewBox size. 24 for UI; 16 or 24 for pixel; 15 to match Radix. |
| `live` | side of the centered live area; nothing (strokes included) may cross it. Usually `grid - 4`. Use `live = grid` only for tiles that fill the canvas (app icons). |
| `paint` | `"fill"` or `"stroke"`: the default for shapes. |
| `stroke` | width, caps and joins for stroke styles (and for `bar`/`paint: "stroke"` caps). |
| `minBar` | thinnest allowed `bar` in filled styles. |
| `radius` | guidance for your drawing (not enforced): outer corners and inner corners. |
| `prefix` | CSS variable prefix: `--<prefix>-<tone>`. Use a distinct prefix per style when combining styles. |
| `tones` | ordered; the **first is the primary** tone (identifies the icon alone). `fallback`: `"currentColor"` (default), a hex, or `"palette"` (light default color). `fallbackOpacity`: used when the CSS variable is unset. |
| `palette` | `palette[theme][state][tone]`. States: `default`, `hover`, `active`, `disabled`; a missing state falls back to `default`. Values: `"#RRGGBB"`, `"#RRGGBBAA"`, `{"hex", "token"}`, or `{"gradient": [top, bottom], "angle": 180}`. |
| `illustration` | optional large colored variant: per tone (or per `illo` key) a `[top, bottom]` gradient. Built into the catalog at `sizes`. |
| `darkMode` | `"class"` (default), `"media"` or `"both"`; `darkSelector` lists the classes/attributes. |
| `rendering` | `"crispEdges"` for pixel styles (also makes the validator require integer coordinates). |
| `primaryCheck` | set `false` for multicolor illustration styles where no single tone carries the icon. |
| `context` | the mock UI in the catalog: font, UI radius, brand, surfaces (light and dark). |
| `rationale` | why each decision was made, with sources; printed at the top of the catalog. |

## How colors reach the output

- **Components and sprite**: each shape is painted with `var(--<prefix>-<tone>, <fallback>)`
  and `var(--<prefix>-<tone>-opacity, <fallbackOpacity>)`. With no CSS imported, a duotone
  icon is `currentColor` at 100% and 40%, so it works anywhere. Importing `icons.css` sets the
  exact palette per state and theme.
- **Gradient tones** become `<linearGradient>` with stop colors from
  `--<prefix>-<tone>-<n>` variables (React/Vue/Svelte use a unique id per instance).
- **`svg/` files** are resolved to the light default palette in hex (e-mail, `<img>`, Figma).
- **React Native** has no CSS variables: components take `color` (one color for every tone,
  with fallback opacities) or `colors` (exact per tone, e.g. `palette.light.active`).

## CLI

```bash
python3 scripts/validate.py icons.json [--built <out>] [--strict]
python3 scripts/build.py icons.json --out <dir> [--framework react|vue|svelte|react-native|svg]
                         [--name @scope/icons] [--only a,b] [--compare <svg-dir>] [--catalog-only]
python3 scripts/build.py --gallery a.json b.json … --out gallery.html
```
