#!/usr/bin/env python3
"""Scan SVG folders or webfont CSS files to generate, merge, and validate catalog.json.

Usage:
  python3 catalog_icons.py --svg-dir ./svg --prefix ic --out ./catalog.json
  python3 catalog_icons.py --css ./icons.css --out ./catalog.json
  python3 catalog_icons.py --svg-dir ./svg --merge ./catalog.json --out ./catalog.json
  python3 catalog_icons.py --validate ./catalog.json

Python 3.8+, standard library only.
"""
import argparse
import json
import os
import re
import sys

GROUP_HINTS = {
    "arrows": ("arrow", "chevron", "corner", "caret", "move", "external", "refresh", "rotate", "undo", "redo"),
    "navigation": ("home", "menu", "compass", "map", "pin", "globe", "sidebar", "grid", "list", "search", "filter"),
    "actions": ("plus", "minus", "check", "x", "close", "trash", "edit", "pencil", "copy", "save", "download", "upload", "share", "link", "lock", "unlock", "eye"),
    "communication": ("mail", "message", "chat", "phone", "bell", "send", "inbox", "at-sign", "comment"),
    "media": ("play", "pause", "stop", "volume", "mic", "camera", "video", "image", "music", "film", "headphones"),
    "files": ("file", "folder", "document", "book", "clipboard", "archive", "paperclip", "code", "terminal"),
    "commerce": ("cart", "bag", "credit-card", "dollar", "tag", "shopping", "gift", "receipt", "percent", "wallet"),
    "status": ("alert", "info", "help", "warning", "error", "shield", "loader", "clock", "calendar", "star", "heart", "flag"),
    "user": ("user", "users", "profile", "account", "person", "team", "smile", "award"),
    "device": ("monitor", "smartphone", "tablet", "laptop", "cpu", "wifi", "bluetooth", "battery", "printer", "server", "cloud", "database"),
    "editor": ("bold", "italic", "underline", "align", "type", "text", "scissors", "crop", "layers", "sliders", "palette"),
}


def normalize_name(raw: str) -> str:
    s = re.sub(r"\.svg$", "", raw.strip(), flags=re.IGNORECASE)
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "icon"


def to_label(name: str) -> str:
    return " ".join(part.capitalize() for part in name.split("-") if part)


def infer_group(name: str) -> str:
    tokens = set(name.split("-"))
    for group, hints in GROUP_HINTS.items():
        for h in hints:
            if h in name or h in tokens:
                return group
    return "misc"


def scan_svg_dir(svg_dir: str, prefix: str):
    entries = []
    seen = set()
    for root, _, files in os.walk(svg_dir):
        for fname in sorted(files):
            if not fname.lower().endswith(".svg"):
                continue
            name = normalize_name(fname)
            if name in seen:
                continue
            seen.add(name)
            label = to_label(name)
            group = infer_group(name)
            words = [w for w in name.split("-") if len(w) > 1]
            entries.append({
                "name": name,
                "icon": f"{prefix} {name}",
                "label": label,
                "group": group,
                "keywords": " ".join(dict.fromkeys(words + [group])),
            })
    return entries


def scan_css_file(css_path: str, prefix_override: str = ""):
    with open(css_path, "r", encoding="utf-8") as fh:
        css = fh.read()
    pattern = re.compile(r"([^{}]+)\{[^}]*content\s*:\s*['\"]\\([0-9a-fA-F]{2,6})['\"][^}]*\}")
    entries = []
    seen = set()
    for match in pattern.finditer(css):
        sel_block = match.group(1).split(",")[0].strip()
        clean_sel = re.sub(r"::?before\b.*$", "", sel_block, flags=re.IGNORECASE).strip()
        classes = re.findall(r"\.([a-zA-Z0-9_-]+)", clean_sel)
        if not classes:
            continue
        if len(classes) >= 2:
            prefix = prefix_override or classes[0]
            raw_name = classes[-1]
        else:
            raw_name = classes[0]
            prefix = prefix_override or (raw_name.split("-")[0] if "-" in raw_name else "ic")
        name = normalize_name(raw_name)
        if name in seen:
            continue
        seen.add(name)
        group = infer_group(name)
        words = [w for w in name.split("-") if len(w) > 1]
        entries.append({
            "name": name,
            "icon": " ".join(classes) if not prefix_override else f"{prefix} {name}",
            "label": to_label(name),
            "group": group,
            "keywords": " ".join(dict.fromkeys(words + [group])),
        })
    return entries


def merge_catalogs(existing_path: str, incoming: list):
    with open(existing_path, "r", encoding="utf-8") as fh:
        existing = json.load(fh)
    by_name = {item["name"]: item for item in existing if isinstance(item, dict) and "name" in item}
    merged = []
    for item in incoming:
        if item["name"] in by_name:
            merged.append(by_name[item["name"]])
        else:
            merged.append(item)
    return merged


def validate_catalog(path: str) -> int:
    try:
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except Exception as exc:
        print(f"ERROR: Could not parse JSON: {exc}", file=sys.stderr)
        return 1

    if not isinstance(data, list):
        print("ERROR: catalog.json root must be a JSON array.", file=sys.stderr)
        return 1

    errors = []
    warnings = []
    seen_names = set()

    for idx, entry in enumerate(data):
        if not isinstance(entry, dict):
            errors.append(f"[{idx}] Entry is not an object")
            continue
        name = entry.get("name", "")
        if not name or not isinstance(name, str):
            errors.append(f"[{idx}] Missing or invalid 'name'")
        elif name in seen_names:
            errors.append(f"[{idx}] Duplicate name '{name}'")
        else:
            seen_names.add(name)
            if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", name):
                warnings.append(f"[{idx}] '{name}' is not strict kebab-case")

        for req in ("icon", "label", "group", "keywords"):
            val = entry.get(req)
            if not isinstance(val, str) or not val.strip():
                warnings.append(f"[{idx}] '{name}' has empty '{req}'")

        kw = entry.get("keywords", "")
        if isinstance(kw, str) and kw.strip():
            words = kw.lower().split()
            if len(words) != len(set(words)):
                warnings.append(f"[{idx}] '{name}' has duplicate words in keywords")

    print(f"Validated {len(data)} entries: {len(errors)} errors, {len(warnings)} warnings")
    for e in errors[:20]:
        print(f"  ERROR: {e}")
    for w in warnings[:20]:
        print(f"  WARN:  {w}")

    return 1 if errors else 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--svg-dir", help="Directory containing .svg icon files")
    ap.add_argument("--css", help="Webfont .css file to extract icon classes from")
    ap.add_argument("--prefix", default="ic", help="CSS class prefix (default: ic)")
    ap.add_argument("--merge", help="Existing catalog.json to preserve curated labels/keywords")
    ap.add_argument("--out", help="Output path for catalog.json")
    ap.add_argument("--validate", help="Validate an existing catalog.json file")
    args = ap.parse_args(argv)

    if args.validate:
        return validate_catalog(args.validate)

    if not args.svg_dir and not args.css:
        ap.error("Provide --svg-dir, --css, or --validate")

    entries = []
    if args.svg_dir:
        entries = scan_svg_dir(args.svg_dir, args.prefix)
    elif args.css:
        entries = scan_css_file(args.css, args.prefix if args.prefix != "ic" else "")

    if args.merge and os.path.exists(args.merge):
        entries = merge_catalogs(args.merge, entries)

    out_path = args.out or "catalog.json"
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"Wrote {len(entries)} icon entries -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
