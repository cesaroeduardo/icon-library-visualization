#!/usr/bin/env python3
"""Propose the icon list for a project: where icons appear or are missing.

  python3 inventory.py [project_dir] [--json inventory.json] [--max-files 8000]

Looks for navigation/menu items (label + href/route objects), routes (Next.js app and
pages routers, SvelteKit, Nuxt, Expo Router, React Router), domain enums and unions
(types, kinds, categories, statuses, channels, methods, plans; TS, zod and Prisma),
emoji used as icons, and generic library icons already in use. Prints candidates
grouped by kind with suggested kebab-case names and file:line sources. The model
curates this into the final list with the person; nothing here is final.
Python 3.8+, standard library only.
"""
import argparse
import collections
import json
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scan_design_system import ICON_LIBS, SKIP_DIRS, read, walk  # noqa: E402

CODE_EXT = {".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte", ".astro", ".prisma", ".py", ".rb", ".php", ".html"}
NAV_RE = re.compile(r"\{[^{}]{0,400}?\b(?:label|title|name)\s*:\s*(?:t\(\s*)?[\"'`]([^\"'`\n]{2,40})[\"'`][^{}]{0,400}?\}")
HREF_RE = re.compile(r"\b(?:href|path|to|url|route|pathname)\s*:\s*[\"'`]([^\"'`\n]+)")
ICON_KEY_RE = re.compile(r"\bicon\s*:\s*<?\s*([A-Z][A-Za-z0-9]+)|\bicon\s*:\s*[\"']([^\"']+)")
TS_ENUM_RE = re.compile(r"\benum\s+(\w+)\s*\{([^}]*)\}")
UNION_RE = re.compile(r"\btype\s+(\w+)\s*=\s*((?:\s*\|?\s*[\"'][\w -]+[\"']\s*){2,})")
ZOD_RE = re.compile(r"(?:const|let)\s+(\w+)\s*=\s*z\.(?:enum|nativeEnum)\(\s*\[([^\]]+)\]")
ROUTE_RE = re.compile(r"(?:<Route\b[^>]*\bpath=|\bpath\s*:\s*)[\"'](/[\w\-/:]*)[\"']")
DOMAIN_WORDS = re.compile(r"(type|kind|category|status|channel|method|provider|plan|role|mode|format|source|stage|tier|segment|variant)s?$", re.I)
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF\U00002B00-\U00002BFF]")
SKIP_SEGMENTS = {"api", "_next", "admin-api", "[...slug]", "[[...slug]]", "_components", "components", "lib", "utils"}


def kebab(text):
    text = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode()
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", text)
    text = re.sub(r"[^A-Za-z0-9]+", "-", text).strip("-").lower()
    if text and text[0].isdigit():
        text = "n-" + text
    return text[:40]


def line_of(text, idx):
    return text.count("\n", 0, idx) + 1


def route_segments(rp):
    parts = rp.replace("\\", "/").split("/")
    if "app" in parts:
        parts = parts[parts.index("app") + 1:]
    elif "pages" in parts:
        parts = parts[parts.index("pages") + 1:]
    elif "routes" in parts:
        parts = parts[parts.index("routes") + 1:]
    else:
        return []
    parts = parts[:-1] if re.match(r"(page|\+page|index)\.", parts[-1]) else parts[:-1] + [os.path.splitext(parts[-1])[0]]
    return [p for p in parts if p and not p.startswith(("(", "[", "@", "_", "+")) and p not in SKIP_SEGMENTS]


def scan(root, max_files):
    cands = collections.OrderedDict()
    generic = collections.Counter()

    def add(name, label, kind, source, current=None):
        key = kebab(name)
        if not key or len(key) < 2:
            return
        c = cands.setdefault(key, {"name": key, "label": label, "kinds": [], "sources": [], "currentIcons": []})
        if kind not in c["kinds"]:
            c["kinds"].append(kind)
        if len(c["sources"]) < 5 and source not in c["sources"]:
            c["sources"].append(source)
        if current and current not in c["currentIcons"]:
            c["currentIcons"].append(current)

    for path in walk(root, max_files):
        rp = os.path.relpath(path, root)
        ext = os.path.splitext(path)[1].lower()
        base = os.path.basename(path)
        if re.match(r"(page|\+page)\.(tsx|jsx|ts|js|svelte|vue|mdx)$", base) or (
                "/pages/" in "/" + rp and ext in (".vue", ".tsx", ".jsx") and not base.startswith("_")):
            segs = route_segments(rp)
            if segs and len(segs) <= 3:
                add(segs[-1], segs[-1].replace("-", " ").capitalize(), "route", rp)
        if ext not in CODE_EXT or re.search(r"\.(test|spec|stories|fixture)\.|__tests__|__mocks__|/fixtures?/|/e2e/", rp):
            continue
        text = read(path)
        if not text:
            continue
        for m in NAV_RE.finditer(text):
            block = m.group(0)
            href = HREF_RE.search(block)
            icon = ICON_KEY_RE.search(block)
            if not (href or icon):
                continue
            label = m.group(1).strip()
            if href and href.group(1).startswith(("http", "mailto")) and not icon:
                continue
            add(label, label, "nav", "%s:%d" % (rp, line_of(text, m.start())),
                (icon.group(1) or icon.group(2)) if icon else None)
        for m in TS_ENUM_RE.finditer(text):
            if DOMAIN_WORDS.search(m.group(1)) or ext == ".prisma":
                for member in re.findall(r"^\s*([A-Za-z_][\w]*)", m.group(2), flags=re.M):
                    if member.upper() == member and len(member) <= 2:
                        continue
                    add(member, member.replace("_", " ").capitalize(), "enum:%s" % m.group(1), "%s:%d" % (rp, line_of(text, m.start())))
        for m in UNION_RE.finditer(text):
            if DOMAIN_WORDS.search(m.group(1)):
                for v in re.findall(r"[\"']([\w -]+)[\"']", m.group(2)):
                    add(v, v.replace("_", " ").capitalize(), "union:%s" % m.group(1), "%s:%d" % (rp, line_of(text, m.start())))
        for m in ZOD_RE.finditer(text):
            if DOMAIN_WORDS.search(re.sub(r"(Schema|Enum)$", "", m.group(1))):
                for v in re.findall(r"[\"']([\w -]+)[\"']", m.group(2)):
                    add(v, v.replace("_", " ").capitalize(), "zod:%s" % m.group(1), "%s:%d" % (rp, line_of(text, m.start())))
        for m in ROUTE_RE.finditer(text):
            segs = [s for s in m.group(1).split("/") if s and not s.startswith(":")]
            if segs and len(segs) <= 2 and segs[-1] not in SKIP_SEGMENTS:
                add(segs[-1], segs[-1].replace("-", " ").capitalize(), "route", "%s:%d" % (rp, line_of(text, m.start())))
        if ext in (".tsx", ".jsx", ".vue", ".svelte", ".astro", ".html"):
            for m in EMOJI_RE.finditer(text):
                ln = line_of(text, m.start())
                ctx = text.splitlines()[ln - 1].strip()[:90] if ln - 1 < len(text.splitlines()) else ""
                if ctx.startswith(("//", "/*", "*", "{/*")):
                    continue
                add("emoji-" + "%x" % ord(m.group(0)), m.group(0), "emoji", "%s:%d  %s" % (rp, ln, ctx))
        for m in re.finditer(r"""import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']""", text):
            if any(m.group(2).startswith(p) for p in ICON_LIBS):
                for n in re.findall(r"\b([A-Z][A-Za-z0-9]+)\b", m.group(1)):
                    generic[n] += 1
    return list(cands.values()), generic


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--json")
    ap.add_argument("--max-files", type=int, default=8000)
    args = ap.parse_args(argv)
    if not os.path.isdir(args.root):
        print("error: %s is not a directory" % args.root, file=sys.stderr)
        return 1
    cands, generic = scan(args.root, args.max_files)
    groups = collections.OrderedDict((k, []) for k in ("nav", "route", "domain", "emoji"))
    for c in cands:
        k = c["kinds"][0].split(":")[0]
        groups["domain" if k in ("enum", "union", "zod") else k].append(c)
    titles = {"nav": "NAVIGATION / MENU ITEMS", "route": "ROUTES (screens)",
              "domain": "DOMAIN TYPES (enums and unions: product types, statuses, channels…)",
              "emoji": "EMOJI USED AS ICONS (replace)"}
    groups["nav"].sort(key=lambda c: not c["currentIcons"])  # items that already show an icon first
    for k, items in groups.items():
        print("%s — %d" % (titles[k], len(items)))
        for c in items[:60]:
            cur = " [now: %s]" % ", ".join(c["currentIcons"]) if c["currentIcons"] else ""
            print("  - %-28s %s%s  ← %s" % (c["name"], c["label"] if k != "emoji" else c["label"],
                                             cur, c["sources"][0]))
        if len(items) > 60:
            print("  … +%d more in the JSON" % (len(items) - 60))
        print()
    if generic:
        print("GENERIC LIBRARY ICONS IN USE (keep them; redesign only if the person asks) — %d distinct" % len(generic))
        print("  " + ", ".join("%s(%d)" % kv for kv in generic.most_common(30)))
    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump({"candidates": cands, "genericIcons": dict(generic.most_common())}, fh, indent=2, ensure_ascii=False)
        print("\nfull inventory: %s" % os.path.abspath(args.json))
    return 0


if __name__ == "__main__":
    sys.exit(main())
