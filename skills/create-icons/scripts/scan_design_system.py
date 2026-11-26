#!/usr/bin/env python3
"""Read a project's design system so the icons can match it.

  python3 scan_design_system.py [project_dir] [--json report.json] [--max-files 6000]

Finds: color/radius/border tokens (CSS variables, Tailwind @theme and config, design-token
JSON, MUI/Chakra/shadcn themes), dark mode strategy, the icon libraries in use (how often,
which icons, stroke widths, sizes, fill vs line), custom SVG icons and their traits, fonts,
how rounded the components are, and how much shadow/gradient the UI uses.
Prints a readable summary and, with --json, the full evidence with file:line sources.
It reports evidence and gaps; it does not decide the style (the model does, with the person).
Python 3.8+, standard library only.
"""
import argparse
import collections
import json
import os
import re
import sys

SKIP_DIRS = {"node_modules", ".git", ".next", ".nuxt", ".svelte-kit", "dist", "build", "out", "coverage", ".turbo",
             ".vercel", ".expo", "ios", "android", "Pods", "vendor", ".venv", "venv", "__pycache__", ".cache",
             "storybook-static", ".output", "target", ".idea", ".vscode", "tmp", ".claude"}
CODE_EXT = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".html", ".mdx"}
STYLE_EXT = {".css", ".scss", ".sass", ".less", ".pcss"}

ICON_LIBS = {
    # package prefix: (label, default rendering, default stroke on a 24 grid)
    "lucide": ("Lucide", "line", 2),
    "@heroicons": ("Heroicons", "line 1.5 (outline) / filled (solid)", 1.5),
    "@phosphor-icons": ("Phosphor", "line 1.5 by default; weight prop changes it", 1.5),
    "phosphor-react": ("Phosphor", "line 1.5 by default; weight prop changes it", 1.5),
    "@tabler/icons": ("Tabler", "line", 2),
    "@mui/icons-material": ("Material Icons", "filled", None),
    "@material-symbols": ("Material Symbols", "line or filled (variable font)", None),
    "material-symbols": ("Material Symbols", "line or filled (variable font)", None),
    "@radix-ui/react-icons": ("Radix Icons", "line on a 15 grid", 1),
    "react-icons": ("react-icons (mixed sets)", "mixed", None),
    "@fortawesome": ("Font Awesome", "filled (solid) / line (regular)", None),
    "iconoir": ("Iconoir", "line", 1.5),
    "@iconify": ("Iconify (mixed sets)", "mixed", None),
    "remixicon": ("Remix Icon", "line / filled", None),
    "@remixicon": ("Remix Icon", "line / filled", None),
    "ionicons": ("Ionicons", "line / filled / sharp", None),
    "@expo/vector-icons": ("Expo vector icons (mixed sets)", "mixed", None),
    "react-native-vector-icons": ("RN vector icons (mixed sets)", "mixed", None),
    "expo-symbols": ("SF Symbols (expo-symbols)", "line or filled per symbol", None),
    "react-native-sfsymbols": ("SF Symbols", "line or filled per symbol", None),
    "feather-icons": ("Feather", "line", 2),
    "react-feather": ("Feather", "line", 2),
    "@primer/octicons": ("Octicons", "filled 16/24", None),
    "bootstrap-icons": ("Bootstrap Icons", "filled / line", None),
    "react-bootstrap-icons": ("Bootstrap Icons", "filled / line", None),
    "@carbon/icons": ("Carbon", "filled", None),
    "@hugeicons": ("Hugeicons", "line 1.5", 1.5),
    "@untitled-ui/icons": ("Untitled UI", "line 2", 2),
}
FONT_CLASS = {
    "monospace": ["mono", "courier", "consolas", "menlo", "jetbrains", "fira code"],
    "geometric": ["poppins", "montserrat", "futura", "outfit", "urbanist", "sora", "lexend", "dm sans", "plus jakarta",
                  "manrope", "gilroy", "avenir", "century gothic", "raleway", "josefin", "red hat display", "figtree",
                  "general sans", "satoshi", "clash", "geist"],
    "neo-grotesque": ["inter", "roboto", "helvetica", "arial", "sf pro", "-apple-system", "system-ui", "segoe", "public sans",
                      "ibm plex sans", "archivo", "work sans", "space grotesk", "instrument sans", "onest", "bricolage", "grotesk", "grotesque"],
    "humanist": ["open sans", "source sans", "lato", "noto sans", "fira sans", "pt sans", "frutiger", "myriad", "gill sans",
                 "cabin", "mulish", "hind", "karla", "nunito sans"],
    "rounded": ["nunito", "quicksand", "varela round", "comfortaa", "m plus rounded", "baloo", "fredoka", "sf pro rounded"],
    "serif": ["georgia", "merriweather", "playfair", "lora", "libre baskerville", "source serif", "pt serif", "crimson",
              "eb garamond", "dm serif", "fraunces", "newsreader", "instrument serif", "times"],
}
COLOR_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^)]*\)")
VAR_DECL_RE = re.compile(r"(--[\w-]+)\s*:\s*([^;}{]+)")
SELECTOR_RE = re.compile(r"([^{}]+)\{")
IMPORT_RE = re.compile(r"""import\s+(?:type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']""")
REQUIRE_RE = re.compile(r"""require\(\s*["']([^"']+)["']\s*\)""")
TW_ROUNDED_RE = re.compile(r"\brounded(?:-(none|xs|sm|md|lg|xl|2xl|3xl|4xl|full|\[[^\]]+\]))?\b")
TW_SIZE_RE = re.compile(r"\b(?:size|h|w)-(3|3\.5|4|5|6|7|8|10|12|\[\d+px\])\b")
SIZE_PROP_RE = re.compile(r"""\bsize=\{?["']?(\d{2})["']?\}?""")
STROKE_PROP_RE = re.compile(r"""\bstrokeWidth=\{?["']?([\d.]+)["']?\}?|stroke-width[=:]\s*["']?([\d.]+)""")
WEIGHT_PROP_RE = re.compile(r"""\bweight=["'](thin|light|regular|bold|fill|duotone)["']""")
FONT_FAMILY_RE = re.compile(r"font-family\s*:\s*([^;}{]+)|--font-(?:family[\w-]*|sans|serif|mono|display|heading|body|brand|ui)\s*:\s*([^;}{]+)")
NEXT_FONT_RE = re.compile(r"""import\s*\{([^}]+)\}\s*from\s*["']next/font/google["']""")
TW_TEXT_FONT_RE = re.compile(r"fontFamily\s*:\s*\{([\s\S]{0,600}?)\}")
PX_TW = {"none": 0, "xs": 2, "sm": 4, "": 4, "md": 6, "lg": 8, "xl": 12, "2xl": 16, "3xl": 24, "4xl": 32, "full": 9999}


def rel(root, path):
    return os.path.relpath(path, root)


def walk(root, max_files):
    count = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for f in filenames:
            yield os.path.join(dirpath, f)
            count += 1
            if count >= max_files:
                return


def read(path, limit=800_000):
    try:
        if os.path.getsize(path) > limit:
            return ""
        with open(path, encoding="utf-8", errors="ignore") as fh:
            return fh.read()
    except OSError:
        return ""


def line_of(text, idx):
    return text.count("\n", 0, idx) + 1


def classify_var(name, value):
    n = name.lower()
    if COLOR_RE.search(value) or re.search(r"\b\d+(\.\d+)?%?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%", value):
        return "color"
    if "radius" in n or "rounded" in n:
        return "radius"
    if "border" in n and ("width" in n or re.match(r"^\s*\d", value)):
        return "border"
    if n.startswith("--font") or "font-family" in n:
        return "font"
    if "shadow" in n:
        return "shadow"
    if "stroke" in n or ("icon" in n and re.search(r"\d", value)):
        return "icon"
    return None


def role_of(name):
    n = name.lower()
    for role, keys in (("brand", ("brand", "primary", "accent", "main")), ("danger", ("danger", "destructive", "error", "red")),
                       ("success", ("success", "positive", "green")), ("warning", ("warning", "amber", "yellow")),
                       ("neutral", ("gray", "grey", "neutral", "slate", "zinc", "muted", "ink", "foreground", "background", "surface",
                                    "border", "card", "text"))):
        if any(k in n for k in keys):
            return role
    return "other"


def to_px(value, root_px=16):
    m = re.match(r"\s*([\d.]+)\s*(rem|px|em)?", value)
    if not m:
        return None
    v = float(m.group(1))
    return round(v * root_px, 2) if m.group(2) in ("rem", "em") else v


def scan(root, max_files=6000):
    r = {
        "root": os.path.abspath(root),
        "tokens": {"color": [], "radius": [], "border": [], "font": [], "shadow": [], "icon": []},
        "darkMode": {"strategy": None, "evidence": []},
        "tailwind": {"version": None, "configs": [], "themeBlocks": []},
        "themes": [],
        "tokenFiles": [],
        "iconLibraries": {},
        "iconUsage": {"sizes": collections.Counter(), "strokeWidths": collections.Counter(), "weights": collections.Counter(),
                      "topIcons": collections.Counter(), "colorProps": collections.Counter()},
        "customSvg": {"files": 0, "inline": 0, "fill": 0, "stroke": 0, "strokeWidths": collections.Counter(),
                      "viewBoxes": collections.Counter(), "currentColor": 0, "hexColors": 0, "examples": []},
        "fonts": [],
        "shape": {"roundedClasses": collections.Counter(), "shadowUses": 0, "gradientUses": 0, "borderUses": 0},
        "packages": {},
        "shadcn": None,
    }
    pkg_files = []
    for path in walk(root, max_files):
        base = os.path.basename(path)
        ext = os.path.splitext(base)[1].lower()
        rp = rel(root, path)
        if base == "package.json":
            pkg_files.append(path)
            continue
        if base == "components.json":
            try:
                data = json.loads(read(path))
                if isinstance(data, dict) and ("tailwind" in data or "style" in data):
                    r["shadcn"] = {"file": rp, "style": data.get("style"), "baseColor": (data.get("tailwind") or {}).get("baseColor"),
                                   "css": (data.get("tailwind") or {}).get("css"), "iconLibrary": data.get("iconLibrary")}
            except ValueError:
                pass
            continue
        if re.match(r"tailwind\.config\.(js|cjs|mjs|ts)$", base):
            text = read(path)
            r["tailwind"]["configs"].append(rp)
            if re.search(r"darkMode\s*:\s*\[?\s*['\"](class|selector)", text):
                r["darkMode"]["evidence"].append("%s: darkMode class/selector" % rp)
                r["darkMode"]["strategy"] = r["darkMode"]["strategy"] or "class"
            elif re.search(r"darkMode\s*:\s*['\"]media", text):
                r["darkMode"]["evidence"].append("%s: darkMode media" % rp)
                r["darkMode"]["strategy"] = r["darkMode"]["strategy"] or "media"
            for m in re.finditer(r"([\w-]+)\s*:\s*['\"](#[0-9a-fA-F]{3,8})['\"]", text):
                r["tokens"]["color"].append({"name": m.group(1), "value": m.group(2), "role": role_of(m.group(1)),
                                             "source": "%s:%d" % (rp, line_of(text, m.start())), "scope": "tailwind.config"})
            for m in re.finditer(r"borderRadius\s*:\s*\{([\s\S]{0,400}?)\}", text):
                for k, v in re.findall(r"['\"]?([\w-]+)['\"]?\s*:\s*['\"]([^'\"]+)['\"]", m.group(1)):
                    r["tokens"]["radius"].append({"name": k, "value": v, "px": to_px(v), "source": "%s:%d" % (rp, line_of(text, m.start())),
                                                  "scope": "tailwind.config"})
            fm = TW_TEXT_FONT_RE.search(text)
            if fm:
                r["fonts"].append({"family": " ".join(fm.group(1).split())[:160], "source": rp})
            continue
        if ext == ".json" and re.search(r"token|theme|design", base, re.I) and "lock" not in base:
            text = read(path, 400_000)
            try:
                data = json.loads(text)
            except ValueError:
                continue
            found = flatten_tokens(data)
            if found:
                r["tokenFiles"].append(rp)
                for name, value in found:
                    kind = classify_var(name, str(value))
                    if kind:
                        entry = {"name": name, "value": str(value), "source": rp, "scope": "json"}
                        if kind == "color":
                            entry["role"] = role_of(name)
                        if kind in ("radius", "border"):
                            entry["px"] = to_px(str(value))
                        r["tokens"][kind].append(entry)
            continue
        if ext in STYLE_EXT or ext in (".vue", ".svelte", ".astro"):
            text = read(path)
            if text:
                scan_css(text, rp, r)
        if ext in CODE_EXT:
            text = read(path)
            if text:
                scan_code(text, rp, r)
        if ext == ".svg" and not rp.startswith(("public/fonts", "fonts")):
            text = read(path, 200_000)
            if text and "<svg" in text:
                scan_svg(text, rp, r, inline=False)

    for p in pkg_files:
        try:
            data = json.loads(read(p))
        except ValueError:
            continue
        deps = {}
        for k in ("dependencies", "devDependencies", "peerDependencies"):
            deps.update(data.get(k) or {})
        for dep, ver in deps.items():
            if dep == "tailwindcss":
                r["tailwind"]["version"] = ver
            for prefix, info in ICON_LIBS.items():
                if dep == prefix or dep.startswith(prefix + "/") or dep.startswith(prefix + "-") or (prefix in ("lucide",) and dep.startswith("lucide")):
                    lib = r["iconLibraries"].setdefault(info[0], {"packages": set(), "imports": 0, "files": set(),
                                                                  "rendering": info[1], "defaultStroke": info[2]})
                    lib["packages"].add(dep)
            if re.search(r"@mui/material|@chakra-ui|@mantine|antd|@radix-ui/themes|vuetify|@nextui|@heroui|daisyui|@shadcn", dep):
                r["packages"][dep] = ver
            if dep.startswith("@fontsource"):
                r["fonts"].append({"family": dep.split("/")[-1].replace("-", " "), "source": rel(root, p)})
    return finish(r)


def flatten_tokens(data, prefix=""):
    out = []
    if isinstance(data, dict):
        if "$value" in data or ("value" in data and not isinstance(data.get("value"), (dict, list))):
            out.append((prefix, data.get("$value", data.get("value"))))
            return out
        for k, v in data.items():
            if k.startswith("$"):
                continue
            out += flatten_tokens(v, (prefix + "." + k) if prefix else k)
    elif isinstance(data, str) and prefix:
        if COLOR_RE.fullmatch(data.strip()) or re.match(r"^\s*[\d.]+(px|rem)\s*$", data):
            out.append((prefix, data))
    return out[:4000]


def scan_css(text, rp, r):
    text = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S)
    # walk declarations with the selector that encloses them
    for block in re.finditer(r"([^{}@;]+|@theme[^{]*|@media[^{]*|@layer[^{]*)\{([^{}]*)\}", text):
        selector = " ".join(block.group(1).split())[:120]
        body = block.group(2)
        is_theme = selector.startswith("@theme")
        if is_theme:
            r["tailwind"]["themeBlocks"].append(rp)
        dark = bool(re.search(r"\.dark\b|\[data-theme=['\"]?dark|\[data-mode=['\"]?dark|prefers-color-scheme:\s*dark|:root\.dark", selector))
        for m in VAR_DECL_RE.finditer(body):
            name, value = m.group(1), " ".join(m.group(2).split())
            kind = classify_var(name, value)
            if not kind:
                continue
            entry = {"name": name, "value": value, "source": "%s:%d" % (rp, line_of(text, block.start(2) + m.start())),
                     "scope": "dark" if dark else ("@theme" if is_theme else selector)}
            if kind == "color":
                entry["role"] = role_of(name)
            if kind in ("radius", "border"):
                entry["px"] = to_px(value)
            r["tokens"][kind].append(entry)
        if dark:
            strat = "media" if "prefers-color-scheme" in selector else "class"
            r["darkMode"]["evidence"].append("%s: %s" % (rp, selector[:60]))
            r["darkMode"]["strategy"] = r["darkMode"]["strategy"] or strat
    if re.search(r"@custom-variant\s+dark\s*\(", text):
        m = re.search(r"@custom-variant\s+dark\s*\(([^;]+)\)", text)
        r["darkMode"]["evidence"].append("%s: @custom-variant dark %s" % (rp, m.group(1)[:60] if m else ""))
        r["darkMode"]["strategy"] = "class"
    for m in FONT_FAMILY_RE.finditer(text):
        fam = (m.group(1) or m.group(2) or "").strip()
        if fam and re.search(r"[A-Za-z]{3}", fam) and not fam.startswith(("var(", "inherit")) and len(r["fonts"]) < 40:
            r["fonts"].append({"family": fam[:160], "source": "%s:%d" % (rp, line_of(text, m.start()))})
    r["shape"]["shadowUses"] += len(re.findall(r"box-shadow\s*:", text))
    r["shape"]["gradientUses"] += len(re.findall(r"(?:linear|radial|conic)-gradient\(", text))


def scan_code(text, rp, r):
    for m in IMPORT_RE.finditer(text):
        names, mod = m.group(1), m.group(2)
        for prefix, info in ICON_LIBS.items():
            if mod == prefix or mod.startswith(prefix + "/") or mod.startswith(prefix + "-") or (prefix == "lucide" and mod.startswith("lucide")):
                lib = r["iconLibraries"].setdefault(info[0], {"packages": set(), "imports": 0, "files": set(),
                                                              "rendering": info[1], "defaultStroke": info[2]})
                lib["packages"].add(mod.split("/")[0] if not mod.startswith("@") else "/".join(mod.split("/")[:2]))
                lib["imports"] += 1
                lib["files"].add(rp)
                for n in re.findall(r"\b([A-Z][A-Za-z0-9]+)\b", names):
                    if n not in ("Icon", "LucideIcon", "LucideProps", "IconProps", "SVGProps"):
                        r["iconUsage"]["topIcons"][n] += 1
                if "/24/solid" in mod or "/20/solid" in mod or "/16/solid" in mod:
                    r["iconUsage"]["weights"]["heroicons-solid"] += 1
                elif "/24/outline" in mod:
                    r["iconUsage"]["weights"]["heroicons-outline"] += 1
                if "Filled" in names or "Rounded" in names or "Outlined" in names or "Sharp" in names:
                    for v in ("Filled", "Rounded", "Outlined", "Sharp", "TwoTone"):
                        if v in names:
                            r["iconUsage"]["weights"]["material-" + v.lower()] += 1
    for m in SIZE_PROP_RE.finditer(text):
        r["iconUsage"]["sizes"][int(m.group(1))] += 1
    for m in TW_SIZE_RE.finditer(text):
        v = m.group(1)
        px = int(v[1:-3]) if v.startswith("[") else int(float(v) * 4)
        if 12 <= px <= 48:
            r["iconUsage"]["sizes"][px] += 0  # tailwind sizes are ambiguous (not only icons); keep as a weak signal below
            r["iconUsage"].setdefault("twSizes", collections.Counter())[px] += 1
    for m in STROKE_PROP_RE.finditer(text):
        r["iconUsage"]["strokeWidths"][float(m.group(1) or m.group(2))] += 1
    for m in WEIGHT_PROP_RE.finditer(text):
        r["iconUsage"]["weights"]["phosphor-" + m.group(1)] += 1
    for m in TW_ROUNDED_RE.finditer(text):
        r["shape"]["roundedClasses"][m.group(1) or ""] += 1
    r["shape"]["shadowUses"] += len(re.findall(r"\bshadow(?:-(?:xs|sm|md|lg|xl|2xl|inner))?\b", text))
    r["shape"]["gradientUses"] += len(re.findall(r"\bbg-(?:linear|gradient)-to-|\bbg-linear-|gradient\(", text))
    r["shape"]["borderUses"] += len(re.findall(r"\bborder(?:-\d)?\b", text))
    for m in NEXT_FONT_RE.finditer(text):
        for fam in m.group(1).split(","):
            fam = fam.strip().replace("_", " ")
            if fam:
                r["fonts"].append({"family": fam, "source": rp + " (next/font)"})
    for m in re.finditer(r"localFont\(\s*\{([\s\S]{0,500}?)\}\s*\)", text):
        block = m.group(1)
        srcm = re.search(r"[\"']([^\"']+\.(?:woff2?|ttf|otf))", block)
        if not srcm:
            continue
        fam = re.sub(r"[-_](variable|vf|regular|latin|wght).*$", "", os.path.splitext(os.path.basename(srcm.group(1)))[0], flags=re.I)
        var = re.search(r"variable\s*:\s*[\"'](--[\w-]+)", block)
        r["fonts"].append({"family": fam.replace("-", " ").replace("_", " "), "source": rp + " (next/font/local)",
                           "variable": var.group(1) if var else None})
    for m in re.finditer(r"<svg\b[\s\S]{0,4000}?</svg>", text):
        scan_svg(m.group(0), rp, r, inline=True)


def scan_svg(text, rp, r, inline):
    c = r["customSvg"]
    if inline:
        c["inline"] += 1
    else:
        c["files"] += 1
    vb = re.search(r"viewBox=[\"']([^\"']+)", text)
    if vb:
        c["viewBoxes"][" ".join(vb.group(1).split())] += 1
    has_stroke = bool(re.search(r"stroke=[\"'](?!none)[^\"']+|stroke:\s*(?!none)", text))
    has_fill = bool(re.search(r"fill=[\"'](?!none)[^\"']+", text)) or (not has_stroke and "<path" in text)
    if has_stroke and not re.search(r"fill=[\"'](?!none)", text):
        c["stroke"] += 1
    elif has_fill:
        c["fill"] += 1
    for sw in re.findall(r"stroke-width=[\"']?([\d.]+)|strokeWidth=\{?[\"']?([\d.]+)", text):
        c["strokeWidths"][float(sw[0] or sw[1])] += 1
    if "currentColor" in text:
        c["currentColor"] += 1
    if re.search(r"#[0-9a-fA-F]{3,6}\b", text):
        c["hexColors"] += 1
    if len(c["examples"]) < 12 and not inline:
        c["examples"].append(rp)


def classify_font(family):
    f = family.lower()
    for kind, names in FONT_CLASS.items():
        if any(n in f for n in names):
            return kind
    return "unknown"


def finish(r):
    libs = {}
    for name, lib in r["iconLibraries"].items():
        libs[name] = {"packages": sorted(lib["packages"]), "imports": lib["imports"], "files": len(lib["files"]),
                      "rendering": lib["rendering"], "defaultStroke": lib["defaultStroke"]}
    r["iconLibraries"] = dict(sorted(libs.items(), key=lambda kv: -kv[1]["imports"]))
    u = r["iconUsage"]
    r["iconUsage"] = {
        "sizes": dict(u["sizes"].most_common(8)),
        "tailwindSizeClasses": dict((u.get("twSizes") or collections.Counter()).most_common(8)),
        "strokeWidths": {fmtn(k): v for k, v in u["strokeWidths"].most_common(6)},
        "weights": dict(u["weights"].most_common(8)),
        "topIcons": dict(u["topIcons"].most_common(40)),
    }
    c = r["customSvg"]
    c["strokeWidths"] = {fmtn(k): v for k, v in c["strokeWidths"].most_common(6)}
    c["viewBoxes"] = dict(c["viewBoxes"].most_common(6))
    s = r["shape"]
    rounded = s["roundedClasses"]
    s["roundedClasses"] = dict(rounded.most_common(10))
    total = sum(rounded.values())
    s["typicalRadiusPx"] = None
    if total:
        top = rounded.most_common(1)[0][0]
        s["typicalRadiusPx"] = PX_TW.get(top) if not top.startswith("[") else to_px(top.strip("[]"))
    def font_rank(f):
        var = f.get("variable") or ""
        if re.search(r"--font-(sans|body|ui|display|heading)", var):
            return 0
        if re.search(r"(^|/)(layout|_app|_document|root|app|main|index|globals?)\.", f["source"].split(" ")[0]):
            return 1
        if "@theme" in f["source"] or ":root" in f["source"]:
            return 2
        return 3
    r["fonts"].sort(key=font_rank)
    seen = set()
    fonts = []
    for f in r["fonts"]:
        key = f["family"].lower()
        if key in seen:
            continue
        seen.add(key)
        f["class"] = classify_font(f["family"])
        fonts.append(f)
    r["fonts"] = fonts[:12]
    for kind in r["tokens"]:
        r["tokens"][kind] = r["tokens"][kind][:400]
    r["tailwind"]["themeBlocks"] = sorted(set(r["tailwind"]["themeBlocks"]))
    r["gaps"] = gaps(r)
    return r


def fmtn(v):
    return ("%g" % v)


def gaps(r):
    out = []
    colors = r["tokens"]["color"]
    if not colors:
        out.append("no color tokens found: ask for the brand colors (hex, a screenshot or the brand site)")
    elif not any(c.get("role") == "brand" for c in colors):
        out.append("color tokens exist but none is named primary/brand/accent: confirm which one is the brand")
    brand_values = {c["value"].lower() for c in colors if c.get("scope") != "dark"
                    and re.search(r"(^|[-.])(brand|primary|accent)$", c["name"].lower())}
    if len(brand_values) > 3:
        out.append("several different brand/primary values (%d): confirm the one icons should use" % len(brand_values))
    if not r["tokens"]["radius"] and not r["shape"]["typicalRadiusPx"]:
        out.append("no radius token or rounded classes: ask how rounded the corners should be")
    if not r["darkMode"]["strategy"] and not any(c.get("scope") == "dark" for c in colors):
        out.append("no dark mode found: ask if the icons need a dark theme")
    if not r["iconLibraries"] and not (r["customSvg"]["files"] + r["customSvg"]["inline"]):
        out.append("no icons in use: there is no existing icon style to match; offer the starter styles")
    if len([n for n, l in r["iconLibraries"].items() if l["imports"]]) > 1:
        out.append("more than one icon library is imported: ask which one the new icons should sit next to")
    if not r["fonts"]:
        out.append("no font found: typography cannot guide the shape language")
    return out


def summary(r):
    L = []
    add = L.append
    add("Design system scan: %s" % r["root"])
    add("")
    add("ICONS IN USE")
    if r["iconLibraries"]:
        for name, lib in r["iconLibraries"].items():
            add("  - %s (%s): %d imports in %d files; renders %s%s" % (
                name, ", ".join(lib["packages"]), lib["imports"], lib["files"], lib["rendering"],
                "; default stroke %s" % lib["defaultStroke"] if lib["defaultStroke"] else ""))
    else:
        add("  - no icon library")
    u = r["iconUsage"]
    if u["topIcons"]:
        add("  - most imported: %s" % ", ".join("%s(%d)" % kv for kv in list(u["topIcons"].items())[:16]))
    if u["sizes"]:
        add("  - size props: %s" % ", ".join("%spx×%d" % kv for kv in u["sizes"].items()))
    if u["tailwindSizeClasses"]:
        add("  - size/h/w classes (weak signal): %s" % ", ".join("%spx×%d" % kv for kv in u["tailwindSizeClasses"].items()))
    if u["strokeWidths"]:
        add("  - strokeWidth overrides: %s" % ", ".join("%s×%d" % kv for kv in u["strokeWidths"].items()))
    if u["weights"]:
        add("  - variants: %s" % ", ".join("%s×%d" % kv for kv in u["weights"].items()))
    c = r["customSvg"]
    if c["files"] or c["inline"]:
        add("  - custom SVG: %d files, %d inline; %d filled, %d line; currentColor in %d, hex colors in %d" % (
            c["files"], c["inline"], c["fill"], c["stroke"], c["currentColor"], c["hexColors"]))
        if c["viewBoxes"]:
            add("    viewBoxes: %s" % ", ".join("%s×%d" % kv for kv in c["viewBoxes"].items()))
        if c["strokeWidths"]:
            add("    stroke widths: %s" % ", ".join("%s×%d" % kv for kv in c["strokeWidths"].items()))
    add("")
    add("COLOR TOKENS (%d)" % len(r["tokens"]["color"]))
    by_role = collections.defaultdict(list)
    for t in r["tokens"]["color"]:
        by_role[t.get("role", "other")].append(t)
    for role in ("brand", "neutral", "success", "warning", "danger", "other"):
        items = by_role.get(role) or []
        if items:
            shown = ", ".join("%s=%s%s" % (t["name"], t["value"][:28], " (dark)" if t.get("scope") == "dark" else "") for t in items[:8])
            add("  - %s: %s%s" % (role, shown, " …+%d" % (len(items) - 8) if len(items) > 8 else ""))
            add("      e.g. %s" % items[0]["source"])
    add("")
    add("SHAPE")
    for t in r["tokens"]["radius"][:6]:
        add("  - radius %s = %s%s  (%s)" % (t["name"], t["value"], " → %spx" % t["px"] if t.get("px") is not None else "", t["source"]))
    if r["shape"]["roundedClasses"]:
        add("  - rounded classes: %s → typical %spx" % (
            ", ".join("%s×%d" % (k or "rounded", v) for k, v in r["shape"]["roundedClasses"].items()), r["shape"]["typicalRadiusPx"]))
    for t in r["tokens"]["border"][:3]:
        add("  - border %s = %s (%s)" % (t["name"], t["value"], t["source"]))
    add("  - shadows: %d uses · gradients: %d uses · borders: %d uses" % (
        r["shape"]["shadowUses"], r["shape"]["gradientUses"], r["shape"]["borderUses"]))
    add("")
    add("TYPE")
    for f in r["fonts"][:6]:
        add("  - %s → %s  (%s)" % (f["family"][:70], f["class"], f["source"]))
    if not r["fonts"]:
        add("  - none found")
    add("")
    add("THEME")
    add("  - dark mode: %s%s" % (r["darkMode"]["strategy"] or "not found",
                                 " (%s)" % r["darkMode"]["evidence"][0] if r["darkMode"]["evidence"] else ""))
    if r["tailwind"]["version"] or r["tailwind"]["configs"] or r["tailwind"]["themeBlocks"]:
        add("  - tailwind %s; config: %s; @theme in: %s" % (r["tailwind"]["version"] or "?", ", ".join(r["tailwind"]["configs"]) or "-",
                                                            ", ".join(r["tailwind"]["themeBlocks"][:4]) or "-"))
    if r["shadcn"]:
        add("  - shadcn: %s" % json.dumps(r["shadcn"]))
    if r["packages"]:
        add("  - UI kits: %s" % ", ".join(r["packages"]))
    if r["tokenFiles"]:
        add("  - token files: %s" % ", ".join(r["tokenFiles"][:6]))
    add("")
    add("GAPS (ask the person about these)" if r["gaps"] else "GAPS: none")
    for g in r["gaps"]:
        add("  - " + g)
    return "\n".join(L)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("root", nargs="?", default=".")
    ap.add_argument("--json", help="write the full report here")
    ap.add_argument("--max-files", type=int, default=6000)
    args = ap.parse_args(argv)
    if not os.path.isdir(args.root):
        print("error: %s is not a directory" % args.root, file=sys.stderr)
        return 1
    report = scan(args.root, args.max_files)
    print(summary(report))
    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump(report, fh, indent=2, ensure_ascii=False, default=list)
        print("\nfull report: %s" % os.path.abspath(args.json))
    return 0


if __name__ == "__main__":
    sys.exit(main())
