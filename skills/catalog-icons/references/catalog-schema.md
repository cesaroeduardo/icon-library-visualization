# Catalog Schema (`catalog.json`)

`catalog.json` is a JSON array of icon metadata objects used by Icon Library Studio and search indexes.

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Unique `kebab-case` identifier matching the SVG filename or CSS glyph name (e.g., `arrow-left`). |
| `icon` | `string` | Yes | Full CSS class string used in `<i class="..."></i>` (e.g., `ic arrow-left`). |
| `label` | `string` | Yes | Human-readable display title (e.g., `Arrow Left`). |
| `group` | `string` | Yes | Category from the standard taxonomy below. |
| `keywords` | `string` | Yes | Space-separated search terms: visual metaphor, actions, and localized synonyms. |

## Standard Group Taxonomy

- `arrows` — directional arrows, chevrons, refresh, undo/redo, external links
- `navigation` — home, menu, search, filter, compass, map, layout grids
- `actions` — add, remove, edit, copy, save, download, upload, share, lock, eye
- `communication` — mail, chat, phone, bell, send, inbox
- `media` — play, pause, volume, mic, camera, video, image, music
- `files` — file, folder, document, clipboard, archive, code, terminal
- `commerce` — cart, bag, card, tag, wallet, gift, receipt
- `status` — alert, info, help, shield, clock, calendar, star, heart, flag
- `user` — user, users, profile, team, award
- `device` — monitor, phone, tablet, wifi, battery, server, cloud, database
- `editor` — typography, alignment, crop, layers, sliders, palette
- `brand` — third-party marks and platforms
- `misc` — anything outside the groups above

## Keyword Craft

Good `keywords` combine **what it looks like** + **what it does** + **localized equivalents**:

- Bad: `"trash"`
- Good: `"bin garbage delete remove discard lixeira excluir apagar"`
