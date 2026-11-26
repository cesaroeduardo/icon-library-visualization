#!/usr/bin/env python3
"""Export a few icons the project already uses to plain SVG files, for the
side-by-side strip in catalog.html (build.py --compare <dir>).

  python3 export_reference_icons.py --project . --names HomeIcon,Search,Bell --out .icon-work/reference

Works from node_modules without running Node:
  - lucide-react / lucide-vue-next / lucide-svelte / lucide-react-native (parses the icon node arrays)
  - packages that ship raw SVG files: lucide-static, heroicons, @tabler/icons, iconoir, bootstrap-icons,
    @phosphor-icons/core, remixicon, feather-icons, @material-symbols/svg-400
Names may be component names (HomeIcon, Trash2) or kebab file names (trash-2).
Reference files are for local comparison only; never copy them into the generated library.
Python 3.8+, standard library only.
"""
import argparse
import glob
import os
import re
import sys

LUCIDE_PKGS = ["lucide-react", "lucide-vue-next", "lucide-svelte", "lucide-react-native", "lucide-preact", "lucide-solid", "lucide"]
RAW_DIRS = [
    "lucide-static/icons", "heroicons/24/outline", "heroicons/24/solid", "@tabler/icons/icons/outline", "@tabler/icons/icons",
    "iconoir/icons/regular", "iconoir/icons", "bootstrap-icons/icons", "@phosphor-icons/core/assets/regular",
    "remixicon/icons/*", "feather-icons/dist/icons", "@material-symbols/svg-400/rounded", "@material-symbols/svg-400/outlined",
]
LUCIDE_ATTRS = ('xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"')


def kebab(name):
    name = re.sub(r"Icon$", "", name) if re.match(r"^[A-Z]", name) else name
    name = re.sub(r"([a-z])([A-Z0-9])", r"\1-\2", name)
    name = re.sub(r"([0-9])([A-Za-z])", r"\1-\2", name)
    return name.lower()


def find_node_modules(project):
    out = []
    cur = os.path.abspath(project)
    while True:
        nm = os.path.join(cur, "node_modules")
        if os.path.isdir(nm):
            out.append(nm)
        parent = os.path.dirname(cur)
        if parent == cur:
            return out
        cur = parent


def lucide_svg(nm, pkg, name):
    base = os.path.join(nm, pkg, "dist", "esm")
    icons = os.path.join(base, "icons")
    if not os.path.isdir(icons):
        return None
    candidates = [kebab(name), name]
    for index in glob.glob(os.path.join(base, "*.mjs")) + glob.glob(os.path.join(base, "*.js")):
        text = open(index, encoding="utf-8", errors="ignore").read()
        for names, file in re.findall(r"export\s*\{([^}]*)\}\s*from\s*['\"]\./icons/([\w-]+)\.m?js['\"]", text):
            aliases = re.findall(r"\bas\s+(\w+)|default\s+as\s+(\w+)", names)
            flat = {a or b for a, b in aliases}
            if name in flat or re.sub(r"Icon$", "", name) in flat:
                candidates.insert(0, file)
    for c in candidates:
        for ext in (".mjs", ".js"):
            p = os.path.join(icons, c + ext)
            if os.path.exists(p):
                text = open(p, encoding="utf-8").read()
                nodes = re.findall(r"\[\s*\"(\w+)\"\s*,\s*\{([^}]*)\}\s*\]", text)
                if not nodes:
                    continue
                parts = []
                for tag, attrs in nodes:
                    kv = [(k, v) for k, v in re.findall(r"(\w+)\s*:\s*\"([^\"]*)\"", attrs) if k != "key"]
                    parts.append("<%s %s/>" % (tag, " ".join('%s="%s"' % (re.sub(r"([A-Z])", r"-\1", k).lower(), v) for k, v in kv)))
                return "<svg %s>%s</svg>\n" % (LUCIDE_ATTRS, "".join(parts)), "%s:%s" % (pkg, c)
    return None


def raw_svg(nm, name):
    for d in RAW_DIRS:
        for folder in glob.glob(os.path.join(nm, d)):
            for c in (kebab(name), name):
                p = os.path.join(folder, c + ".svg")
                if os.path.exists(p):
                    return open(p, encoding="utf-8").read(), os.path.relpath(p, nm)
    return None


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--project", default=".")
    ap.add_argument("--names", required=True, help="comma-separated icon names")
    ap.add_argument("--out", required=True)
    args = ap.parse_args(argv)
    nms = find_node_modules(args.project)
    if not nms:
        print("error: no node_modules found from %s upwards (install dependencies first)" % args.project, file=sys.stderr)
        return 1
    os.makedirs(args.out, exist_ok=True)
    missing = []
    for i, name in enumerate(filter(None, (n.strip() for n in args.names.split(",")))):
        found = None
        for nm in nms:
            for pkg in LUCIDE_PKGS:
                found = found or lucide_svg(nm, pkg, name)
            found = found or raw_svg(nm, name)
            if found:
                break
        if not found:
            missing.append(name)
            continue
        svg, origin = found
        target = os.path.join(args.out, "%02d-%s.svg" % (i, kebab(name)))
        with open(target, "w", encoding="utf-8") as fh:
            fh.write(svg)
        print("%-24s ← %s" % (os.path.basename(target), origin))
    if missing:
        print("not found (read them by hand from the library or the project): %s" % ", ".join(missing))
    return 0


if __name__ == "__main__":
    sys.exit(main())
