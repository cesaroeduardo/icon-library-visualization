---
name: catalog-icons
description: Generates, enriches, and validates a searchable catalog.json (name, icon class, human label, category group, and rich bilingual keywords/synonyms) for any folder of SVG icons or webfont CSS. Use whenever someone wants to catalog icons, add search keywords/tags to an icon library, organize icons into groups, merge new icons into an existing catalog.json, or prepare icon metadata for Icon Library Studio.
---

# catalog-icons

Build and maintain a clean, searchable `catalog.json` for any icon library (SVGs or webfonts) so designers and developers can find any icon immediately by name, visual metaphor, action, or localized synonym.

## Output Schema (`catalog.json`)

Every entry in `catalog.json` follows this exact structure (compatible with Icon Library Studio):

```json
[
  {
    "name": "arrow-left",
    "icon": "ic arrow-left",
    "label": "Arrow Left",
    "group": "arrows",
    "keywords": "arrow left back previous return voltar seta esquerda anterior"
  }
]
```

See `references/catalog-schema.md` for field constraints, group taxonomy, and keyword quality guidelines.

## Files you will use

| Path | When |
|------|------|
| `scripts/catalog_icons.py` | Scans SVG folders or webfont `.css` files, creates/merges `catalog.json`, and validates the output. |
| `references/catalog-schema.md` | Field rules, standard groups, and bilingual keyword craft. |

All scripts use Python 3.8+ standard library only (`python3`).

## Workflow

### 1. Scan the icon source

Run the scanner against a folder of `.svg` files or a webfont `.css` file:

```bash
# From a folder of SVGs
python3 <skill>/scripts/catalog_icons.py --svg-dir ./svg --prefix ic --out ./catalog.json

# From a webfont CSS file
python3 <skill>/scripts/catalog_icons.py --css ./my-icons.css --out ./catalog.json

# Merge newly added icons into an existing catalog.json without losing manual keywords
python3 <skill>/scripts/catalog_icons.py --svg-dir ./svg --prefix ic --merge ./catalog.json --out ./catalog.json
```

### 2. Enrich `label`, `group`, and `keywords`

The script seeds each icon with its normalized `name`, `icon` class, inferred `label`, and initial `group`. Your main job as the agent is to **enrich every entry** in `catalog.json` with thoughtful metadata:

- **`label`**: Clean, human-readable title (e.g., `trash-2` → `"Trash"`, `user-plus` → `"Add User"`).
- **`group`**: Pick one consistent category from the standard taxonomy (`navigation`, `arrows`, `actions`, `media`, `communication`, `files`, `commerce`, `status`, `user`, `device`, `editor`, `brand`, `misc`).
- **`keywords`**: Space-separated string of **6 to 12 high-signal search terms** covering:
  1. Visual metaphor (`trash`, `bin`, `garbage`)
  2. User intent / action (`delete`, `remove`, `discard`)
  3. Localized synonyms when requested (e.g., Portuguese + English: `lixeira excluir apagar remover`)
  4. Avoid filler words or repeating the exact `name` redundantly.

Process large libraries (100+ icons) in batches of 30–50 entries so quality stays high on every single icon.

### 3. Validate before handoff

Always run validation after editing `catalog.json`:

```bash
python3 <skill>/scripts/catalog_icons.py --validate ./catalog.json
```

Validation checks:
- Valid JSON array of objects
- Unique kebab-case `name` per entry
- Non-empty `icon`, `label`, `group`, and `keywords`
- No duplicate tokens inside `keywords`

### 4. Use in Icon Library Studio

Once `catalog.json` passes validation, drop it together with the `.svg` files or webfont (`.woff2`/`.woff`/`.ttf` + `.css`) into **Icon Library Studio** to power instant keyword search across the entire gallery.
