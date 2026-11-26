# catalog-icons

An agent skill that scans SVG folders or webfont CSS files and produces a rich, validated `catalog.json` with human labels, groups, and searchable bilingual keywords — ready for **Icon Library Studio**.

## Install

Extract `catalog-icons.zip` into your agent's skills folder:
- **Antigravity**: `.agents/skills/catalog-icons`
- **Claude Code**: `~/.claude/skills/catalog-icons` or `.claude/skills/catalog-icons`
- **Cursor / Other SKILL.md agents**: `.cursor/skills/catalog-icons`

## Usage

```bash
python3 scripts/catalog_icons.py --svg-dir ./svg --prefix ic --out ./catalog.json
python3 scripts/catalog_icons.py --validate ./catalog.json
```

## License

MIT
