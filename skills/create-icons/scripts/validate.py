#!/usr/bin/env python3
"""Validate an icon source (and optionally a built package) against its style sheet.

  python3 validate.py icons.json [--built ./packages/icons] [--strict]

Checks: names (kebab-case, unique), shape schema (no raw colors), tones exist in the
palette, every shape inside the live area (stroke width included), no outlines in
filled styles (only thick bars >= minBar), integer pixel grid for crispEdges styles,
duotone icons have a primary-tone part, well-formed SVG, right viewBox, and only
palette colors in the generated files. Exit 1 on errors (warnings too with --strict).
Python 3.8+, standard library only.
"""
import argparse
import math
import os
import re
import sys
import xml.etree.ElementTree as ET

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from iconlib import (NAME_RE, SHAPE_KEYS, SHAPE_TYPES, SourceError, allowed_hexes, flat_icons, fmt,  # noqa: E402
                     icon_nodes, load_source, offset, palette_color, svg_document)

TOL = 0.06
NUM_RE = re.compile(r"[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?")
CMD_RE = re.compile(r"[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?")
ARGC = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7, "Z": 0}


# ---------- geometry ----------

def path_points(d, steps=24):
    """Sample a path's outline (curves and arcs included) into points."""
    toks = CMD_RE.findall(d)
    pts, i = [], 0
    x = y = sx = sy = 0.0
    cmd = None
    last_ctrl = None
    prev = None
    while i < len(toks):
        t = toks[i]
        if re.match(r"[A-Za-z]", t):
            cmd = t
            i += 1
            if cmd in "Zz":
                x, y = sx, sy
                pts.append((x, y))
                prev, last_ctrl = "Z", None
                continue
        elif cmd is None:
            raise ValueError("path data must start with a command")
        up = cmd.upper()
        n = ARGC[up]
        # the 4th/5th arc args are flags that may be glued: "a1 1 0 01 2 2"
        args = []
        while len(args) < n:
            if i >= len(toks):
                raise ValueError("path data ends in the middle of %s" % cmd)
            tok = toks[i]
            if re.match(r"[A-Za-z]", tok):
                raise ValueError("not enough numbers for %s" % cmd)
            if up == "A" and len(args) in (3, 4) and len(tok) > 1 and tok[0] in "01" and not tok.startswith(("0.", "1.")):
                args.append(float(tok[0]))
                toks[i] = tok[1:]
                continue
            args.append(float(tok))
            i += 1
        rel = cmd.islower()
        ox, oy = (x, y) if rel else (0.0, 0.0)
        if up == "M":
            x, y = ox + args[0], oy + args[1]
            sx, sy = x, y
            pts.append((x, y))
            cmd = "l" if rel else "L"
            last_ctrl = None
        elif up == "L":
            x, y = ox + args[0], oy + args[1]
            pts.append((x, y))
            last_ctrl = None
        elif up == "H":
            x = (x if rel else 0) + args[0]
            pts.append((x, y))
            last_ctrl = None
        elif up == "V":
            y = (y if rel else 0) + args[0]
            pts.append((x, y))
            last_ctrl = None
        elif up in "CS":
            if up == "C":
                c1 = (ox + args[0], oy + args[1])
                c2 = (ox + args[2], oy + args[3])
                e = (ox + args[4], oy + args[5])
            else:
                c1 = (2 * x - last_ctrl[0], 2 * y - last_ctrl[1]) if prev in ("C", "S") and last_ctrl else (x, y)
                c2 = (ox + args[0], oy + args[1])
                e = (ox + args[2], oy + args[3])
            for k in range(1, steps + 1):
                tt = k / steps
                mt = 1 - tt
                pts.append((mt ** 3 * x + 3 * mt * mt * tt * c1[0] + 3 * mt * tt * tt * c2[0] + tt ** 3 * e[0],
                            mt ** 3 * y + 3 * mt * mt * tt * c1[1] + 3 * mt * tt * tt * c2[1] + tt ** 3 * e[1]))
            last_ctrl = c2
            x, y = e
        elif up in "QT":
            if up == "Q":
                c = (ox + args[0], oy + args[1])
                e = (ox + args[2], oy + args[3])
            else:
                c = (2 * x - last_ctrl[0], 2 * y - last_ctrl[1]) if prev in ("Q", "T") and last_ctrl else (x, y)
                e = (ox + args[0], oy + args[1])
            for k in range(1, steps + 1):
                tt = k / steps
                mt = 1 - tt
                pts.append((mt * mt * x + 2 * mt * tt * c[0] + tt * tt * e[0], mt * mt * y + 2 * mt * tt * c[1] + tt * tt * e[1]))
            last_ctrl = c
            x, y = e
        elif up == "A":
            rx, ry, rot, large, sweep = args[0], args[1], args[2], int(args[3]), int(args[4])
            ex, ey = ox + args[5], oy + args[6]
            pts += arc_points(x, y, rx, ry, rot, large, sweep, ex, ey, steps)
            x, y = ex, ey
            last_ctrl = None
        prev = up
    return pts


def arc_points(x1, y1, rx, ry, rot, large, sweep, x2, y2, steps):
    if rx == 0 or ry == 0 or (x1 == x2 and y1 == y2):
        return [(x2, y2)]
    rx, ry = abs(rx), abs(ry)
    phi = math.radians(rot)
    cp, sp = math.cos(phi), math.sin(phi)
    dx, dy = (x1 - x2) / 2, (y1 - y2) / 2
    x1p, y1p = cp * dx + sp * dy, -sp * dx + cp * dy
    lam = (x1p ** 2) / (rx ** 2) + (y1p ** 2) / (ry ** 2)
    if lam > 1:
        rx, ry = rx * math.sqrt(lam), ry * math.sqrt(lam)
    num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
    den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
    co = math.sqrt(max(0, num / den)) if den else 0
    if large == sweep:
        co = -co
    cxp, cyp = co * rx * y1p / ry, -co * ry * x1p / rx
    cx = cp * cxp - sp * cyp + (x1 + x2) / 2
    cy = sp * cxp + cp * cyp + (y1 + y2) / 2

    def ang(ux, uy, vx, vy):
        a = math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
        return a

    t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry)
    dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry)
    if not sweep and dt > 0:
        dt -= 2 * math.pi
    elif sweep and dt < 0:
        dt += 2 * math.pi
    out = []
    for k in range(1, steps + 1):
        t = t1 + dt * k / steps
        out.append((cx + rx * math.cos(t) * cp - ry * math.sin(t) * sp, cy + rx * math.cos(t) * sp + ry * math.sin(t) * cp))
    return out


def shape_bbox(node):
    g = {k: v for k, v in node["geom"].items()}
    tag = node["tag"]
    f = lambda k, default=0.0: float(g.get(k, default))
    if tag == "rect":
        box = (f("x"), f("y"), f("x") + f("width"), f("y") + f("height"))
    elif tag == "circle":
        box = (f("cx") - f("r"), f("cy") - f("r"), f("cx") + f("r"), f("cy") + f("r"))
    elif tag == "ellipse":
        box = (f("cx") - f("rx"), f("cy") - f("ry"), f("cx") + f("rx"), f("cy") + f("ry"))
    elif tag == "line":
        box = (min(f("x1"), f("x2")), min(f("y1"), f("y2")), max(f("x1"), f("x2")), max(f("y1"), f("y2")))
    else:
        if tag == "path":
            pts = path_points(g["d"])
        else:
            nums = [float(n) for n in NUM_RE.findall(g["points"])]
            pts = list(zip(nums[0::2], nums[1::2]))
        if not pts:
            raise ValueError("empty geometry")
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        box = (min(xs), min(ys), max(xs), max(ys))
    if node["paint"] == "stroke":
        h = node["width"] / 2
        box = (box[0] - h, box[1] - h, box[2] + h, box[3] + h)
    return box


# ---------- checks ----------

def validate_source(path):
    errors, warnings = [], []
    src, style = load_source(path)
    icons = flat_icons(src)
    off = offset(style)
    lo, hi = off - TOL, style["grid"] - off + TOL
    seen = {}
    tones = list(style["tones"])
    primary = tones[0]
    filled = style["paint"] == "fill"
    crisp = style.get("rendering") == "crispEdges"

    for theme, states in style["palette"].items():
        for state, values in states.items():
            for tone in values:
                if tone not in style["tones"]:
                    errors.append("palette.%s.%s uses tone %r that is not declared in style.tones" % (theme, state, tone))
        for tone in tones:
            try:
                palette_color(style, theme, "default", tone)
            except SourceError as exc:
                errors.append(str(exc))

    for icon in icons:
        name = icon.get("name", "")
        where = "icon %r" % name
        if not NAME_RE.match(name):
            errors.append("%s: name must be kebab-case (a-z, 0-9, hyphens) and start with a letter" % where)
        if name in seen:
            errors.append("%s: duplicate name (also in group %r)" % (where, seen[name]))
        seen[name] = icon.get("group")
        shapes = icon.get("shapes") or []
        if not shapes:
            errors.append("%s: has no shapes" % where)
            continue
        for k, shape in enumerate(shapes):
            sw = "%s shape %d" % (where, k)
            extra = set(shape) - SHAPE_KEYS
            if extra:
                errors.append("%s: unsupported keys %s (colors come from tones, never from shapes)" % (sw, sorted(extra)))
            typ = shape.get("type", "path")
            if typ not in SHAPE_TYPES:
                errors.append("%s: unknown type %r" % (sw, typ))
                continue
            missing = [a for a in SHAPE_TYPES[typ] if a not in shape]
            if missing:
                errors.append("%s: %s needs %s" % (sw, typ, ", ".join(missing)))
                continue
            if shape.get("tone", primary) not in style["tones"]:
                errors.append("%s: tone %r is not declared in style.tones" % (sw, shape.get("tone")))
            if "bar" in shape:
                if not filled:
                    warnings.append("%s: `bar` is meant for filled styles; in stroke styles every line already uses the style width" % sw)
                elif float(shape["bar"]) < style["minBar"]:
                    errors.append("%s: bar %s is thinner than minBar %s (reads as an outline at small sizes)" % (
                        sw, shape["bar"], style["minBar"]))
            if filled and shape.get("paint") == "stroke":
                errors.append("%s: outlines are not allowed in a filled style; draw the shape filled or use a thick `bar`" % sw)
            if crisp:
                nums = [v for k2, v in shape.items() if k2 in ("x", "y", "width", "height")]
                nums += [float(n) for n in NUM_RE.findall(str(shape.get("d", "")) + " " + str(shape.get("points", "")))]
                if any(abs(float(v) - round(float(v))) > 1e-6 for v in nums):
                    errors.append("%s: crispEdges (pixel) styles need integer coordinates" % sw)
        try:
            nodes = icon_nodes(icon, style)
            for k, node in enumerate(nodes):
                x0, y0, x1, y1 = shape_bbox(node)
                if x0 < lo or y0 < lo or x1 > hi or y1 > hi:
                    errors.append("%s shape %d: outside the live area %s..%s (bounds %s,%s → %s,%s%s)" % (
                        where, k, fmt(off), fmt(style["grid"] - off), fmt(round(x0, 2)), fmt(round(y0, 2)),
                        fmt(round(x1, 2)), fmt(round(y1, 2)), ", stroke included" if node["paint"] == "stroke" else ""))
        except (ValueError, KeyError, IndexError) as exc:
            errors.append("%s: cannot read geometry (%s)" % (where, exc))
            continue
        used = {n["tone"] for n in nodes}
        if len(tones) > 1 and primary not in used and style.get("primaryCheck", True):
            warnings.append("%s: no shape uses the primary tone %r; the icon may vanish at 16 px in the primary-only check" % (where, primary))
        try:
            ET.fromstring(svg_document(icon, style, "hex"))
        except ET.ParseError as exc:
            errors.append("%s: produces malformed SVG (%s)" % (where, exc))
        except SourceError:
            pass  # unknown tone, already reported above
    return src, style, icons, errors, warnings


def validate_built(built, style, icons):
    errors, warnings = [], []
    allowed = allowed_hexes(style)
    want_vb = "0 0 %s %s" % (fmt(style["grid"]), fmt(style["grid"]))
    svg_dir = os.path.join(built, "svg")
    names = {i["name"] for i in icons}
    if not os.path.isdir(svg_dir):
        return ["%s: missing svg/ directory (run build.py first)" % built], warnings
    files = {f[:-4] for f in os.listdir(svg_dir) if f.endswith(".svg")}
    for missing in sorted(names - files):
        errors.append("svg/%s.svg is missing" % missing)
    for stale in sorted(files - names):
        warnings.append("svg/%s.svg is not in the source any more (delete it)" % stale)
    for name in sorted(files & names):
        p = os.path.join(svg_dir, name + ".svg")
        text = open(p, encoding="utf-8").read()
        try:
            root = ET.fromstring(text)
        except ET.ParseError as exc:
            errors.append("svg/%s.svg: malformed (%s)" % (name, exc))
            continue
        if root.get("viewBox") != want_vb:
            errors.append("svg/%s.svg: viewBox is %r, expected %r" % (name, root.get("viewBox"), want_vb))
        for hexv in re.findall(r"#[0-9a-fA-F]{6}\b", text):
            if hexv.upper() not in allowed:
                errors.append("svg/%s.svg: color %s is not in the palette" % (name, hexv))
    for agg in ("sprite.svg", "catalog.html", "icons.css", "manifest.json"):
        if not os.path.exists(os.path.join(built, agg)):
            errors.append("%s is missing" % agg)
    sprite = os.path.join(built, "sprite.svg")
    if os.path.exists(sprite):
        try:
            ET.parse(sprite)
        except ET.ParseError as exc:
            errors.append("sprite.svg: malformed (%s)" % exc)
    return errors, warnings


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source")
    ap.add_argument("--built", help="built package directory to check as well")
    ap.add_argument("--strict", action="store_true", help="fail on warnings too")
    args = ap.parse_args(argv)
    try:
        src, style, icons, errors, warnings = validate_source(args.source)
    except (SourceError, ValueError, OSError) as exc:
        print("error: %s" % exc, file=sys.stderr)
        return 1
    if args.built:
        e2, w2 = validate_built(args.built, style, icons)
        errors += e2
        warnings += w2
    for w in warnings:
        print("warning: " + w)
    for e in errors:
        print("error: " + e)
    ok = not errors and not (args.strict and warnings)
    print("%s: %d icon(s), %d error(s), %d warning(s)" % ("OK" if ok else "FAILED", len(icons), len(errors), len(warnings)))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
