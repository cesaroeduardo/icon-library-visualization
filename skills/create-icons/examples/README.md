# Examples

A 12-icon library (home, search, bell, settings, user, calendar, chart, mail, lock, cart,
trash, check-circle) drawn in two styles from scratch and built for React. No project was
scanned for these, so the palette is a neutral example (gray when inactive, indigo when
active) and each `icon-style.json` says so in its `rationale`.

| Folder | What it shows |
|--------|---------------|
| `duotone-filled/` | Filled, two tones, thick bars for the check, the mail flap and the handles; large colored variant at 48 and 96. |
| `outline/` | Uniform 1.75 line, round caps and joins, filled dots where needed. |

Each folder has the source (`icons.json`, `icon-style.json`) and the build in `react/`:
components in `src/`, `svg/`, `sprite.svg`, `icons.css`, `manifest.json`, `README.md` and
`catalog.html` (open it in a browser).

Rebuild:

```bash
python3 ../scripts/validate.py duotone-filled/icons.json
python3 ../scripts/build.py duotone-filled/icons.json --out duotone-filled/react --framework react
```
