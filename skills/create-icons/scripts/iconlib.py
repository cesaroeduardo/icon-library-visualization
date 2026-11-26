"""Shared model for generate-icons: loads a source (icons.json + icon-style.json)
and turns each icon into a neutral node list that every output backend serializes.

Python 3.8+, standard library only.
"""
import json
import os
import re

NAME_RE = re.compile(r"^[a-z][a-z0-9]*(-[a-z0-9]+)*$")
HEX_RE = re.compile(r"^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$")
SHAPE_TYPES = {
    "path": ("d",),
    "rect": ("x", "y", "width", "height"),
    "circle": ("cx", "cy", "r"),
    "ellipse": ("cx", "cy", "rx", "ry"),
    "line": ("x1", "y1", "x2", "y2"),
    "polyline": ("points",),
    "polygon": ("points",),
}
GEOMETRY_KEYS = {"d", "x", "y", "width", "height", "rx", "ry", "cx", "cy", "r", "x1", "y1", "x2", "y2", "points"}
SHAPE_KEYS = GEOMETRY_KEYS | {"type", "tone", "bar", "paint", "illo", "fillRule", "note"}
STATES = ("default", "hover", "active", "disabled")


class SourceError(Exception):
    pass


def load_source(path):
    """Return (source, style). `source["style"]` may be an inline object or a path."""
    with open(path, encoding="utf-8") as fh:
        src = json.load(fh)
    style = src.get("style")
    if isinstance(style, str):
        style_path = os.path.join(os.path.dirname(os.path.abspath(path)), style)
        with open(style_path, encoding="utf-8") as fh:
            style = json.load(fh)
    if not isinstance(style, dict):
        raise SourceError("source needs a `style` object or a path to icon-style.json")
    return src, normalize_style(style)


def normalize_style(style):
    s = dict(style)
    s.setdefault("grid", 24)
    s.setdefault("live", s["grid"] - 4)
    s.setdefault("paint", "fill")
    s.setdefault("prefix", "ic")
    s.setdefault("sizes", [16, 20, 24])
    s.setdefault("minBar", 1.8)
    stroke = dict(s.get("stroke") or {})
    stroke.setdefault("width", 2)
    stroke.setdefault("linecap", "round")
    stroke.setdefault("linejoin", "round")
    s["stroke"] = stroke
    if not s.get("tones"):
        raise SourceError("style.tones must declare at least one tone")
    if not s.get("palette"):
        raise SourceError("style.palette must declare at least a `light` theme")
    s.setdefault("themes", list(s["palette"].keys()))
    return s


def offset(style):
    return (style["grid"] - style["live"]) / 2


def component_name(name, suffix="Icon"):
    return "".join(part.capitalize() for part in name.split("-")) + suffix


def flat_icons(src):
    """Icons as a flat list; accepts `icons: [...]` or `groups: {group: [...]}`."""
    out = []
    if isinstance(src.get("icons"), list):
        out.extend(src["icons"])
    for group, icons in (src.get("groups") or {}).items():
        for icon in icons:
            icon = dict(icon)
            icon.setdefault("group", group)
            out.append(icon)
    for icon in out:
        icon.setdefault("group", "general")
        icon.setdefault("label", icon.get("name", "").replace("-", " ").capitalize())
    return out


# ---------- colors ----------

def parse_color(value):
    """Palette value -> dict(kind='solid', hex, opacity, token) or dict(kind='gradient', stops=[...], angle)."""
    if isinstance(value, str):
        return _solid(value, None)
    if isinstance(value, dict) and "gradient" in value:
        stops = [parse_color(v) for v in value["gradient"]]
        return {"kind": "gradient", "stops": stops, "angle": value.get("angle", 180)}
    if isinstance(value, dict) and "hex" in value:
        return _solid(value["hex"], value.get("token"))
    raise SourceError("invalid palette value: %r" % (value,))


def _solid(hexv, token):
    if not HEX_RE.match(hexv or ""):
        raise SourceError("palette colors must be hex (#rgb, #rrggbb or #rrggbbaa), got %r" % hexv)
    h = hexv[1:]
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    opacity = 1.0
    if len(h) == 8:
        opacity = round(int(h[6:], 16) / 255, 3)
        h = h[:6]
    return {"kind": "solid", "hex": "#" + h.upper(), "opacity": opacity, "token": token}


def palette_color(style, theme, state, tone):
    themes = style["palette"]
    pal = themes.get(theme) or themes.get("light") or next(iter(themes.values()))
    states = pal.get(state) or pal.get("default") or {}
    value = states.get(tone)
    if value is None:
        value = (pal.get("default") or {}).get(tone)
    if value is None:
        raise SourceError("palette.%s.%s has no color for tone %r" % (theme, state, tone))
    return parse_color(value)


def allowed_hexes(style):
    out = set()

    def walk(v):
        if isinstance(v, str) and HEX_RE.match(v):
            out.add(parse_color(v)["hex"])
        elif isinstance(v, dict):
            if "hex" in v and isinstance(v["hex"], str):
                out.add(parse_color(v["hex"])["hex"])
            for k, x in v.items():
                if k != "hex":
                    walk(x)
        elif isinstance(v, list):
            for x in v:
                walk(x)

    walk(style["palette"])
    walk((style.get("illustration") or {}).get("tones") or {})
    for tone in style["tones"].values():
        fb = (tone or {}).get("fallback")
        if isinstance(fb, str) and HEX_RE.match(fb):
            out.add(parse_color(fb)["hex"])
    return out


def gradient_xy(angle):
    """CSS-like angle (180 = top to bottom) -> x1,y1,x2,y2 in objectBoundingBox units."""
    import math
    rad = math.radians(angle - 90)
    dx, dy = math.cos(rad) / 2, math.sin(rad) / 2
    return tuple(fmt(round(v, 3)) for v in (0.5 - dx, 0.5 - dy, 0.5 + dx, 0.5 + dy))


# ---------- nodes ----------

def fmt(v):
    if isinstance(v, float):
        s = ("%.3f" % v).rstrip("0").rstrip(".")
        return s if s not in ("-0", "") else "0"
    return str(v)


def icon_nodes(icon, style):
    """Neutral nodes: dict(tag, geom{attr: str}, paint 'fill'|'stroke', width, tone, illo, fillRule)."""
    nodes = []
    for shape in icon.get("shapes", []):
        tag = shape.get("type", "path")
        geom = {k: fmt(shape[k]) for k in shape if k in GEOMETRY_KEYS}
        if "bar" in shape:
            paint, width = "stroke", float(shape["bar"])
        elif style["paint"] == "stroke" and shape.get("paint") != "fill":
            paint, width = "stroke", float(style["stroke"]["width"])
        else:
            paint, width = shape.get("paint", "fill"), None
            if paint == "stroke":
                width = float(style["stroke"]["width"])
        nodes.append({
            "tag": tag,
            "geom": geom,
            "paint": paint,
            "width": width,
            "tone": shape.get("tone") or next(iter(style["tones"])),
            "illo": shape.get("illo"),
            "fillRule": shape.get("fillRule"),
        })
    return nodes


def node_tones(nodes):
    seen = []
    for n in nodes:
        if n["tone"] not in seen:
            seen.append(n["tone"])
    return seen


def tone_is_gradient(style, tone):
    try:
        return palette_color(style, "light", "default", tone)["kind"] == "gradient"
    except SourceError:
        return False


def tone_fallback(style, tone):
    """(color, opacity) used by components when the CSS variable is not set."""
    spec = style["tones"].get(tone) or {}
    fb = spec.get("fallback", "currentColor")
    op = spec.get("fallbackOpacity", 1)
    if fb == "palette":
        c = palette_color(style, "light", "default", tone)
        if c["kind"] == "gradient":
            c = c["stops"][0]
        return c["hex"], c["opacity"]
    if isinstance(fb, str) and HEX_RE.match(fb):
        c = parse_color(fb)
        return c["hex"], c["opacity"] * op
    return "currentColor", op


def paint_props(node, style, mode, theme="light", state="default", gid=None):
    """Return (attrs, css) for a node.

    attrs: static presentation attributes (kebab-case). css: dict of CSS props that
    may hold var() (serialized into a style attribute by backends that support it).
    mode: 'vars' (CSS variables + fallback), 'hex' (resolved palette), 'illo' (illustration).
    gid(tone) -> gradient element id, needed when the tone is a gradient.
    """
    attrs, css = {}, {}
    kind = node["paint"]
    other = "stroke" if kind == "fill" else "fill"
    attrs[other] = "none"
    if kind == "stroke":
        attrs["stroke-width"] = fmt(node["width"])
        attrs["stroke-linecap"] = style["stroke"]["linecap"]
        attrs["stroke-linejoin"] = style["stroke"]["linejoin"]
    if node.get("fillRule"):
        attrs["fill-rule"] = node["fillRule"]
        attrs["clip-rule"] = node["fillRule"]
    tone = node["tone"]
    p = style["prefix"]
    if mode == "illo":
        attrs[kind] = "url(#%s)" % gid(node.get("illo") or tone)
        return attrs, css
    if mode == "hex":
        c = palette_color(style, theme, state, tone)
        if c["kind"] == "gradient":
            attrs[kind] = "url(#%s)" % gid(tone)
        else:
            attrs[kind] = c["hex"]
            if c["opacity"] < 1:
                attrs[kind + "-opacity"] = fmt(c["opacity"])
        return attrs, css
    # vars
    if tone_is_gradient(style, tone):
        attrs[kind] = "url(#%s)" % gid(tone)
        return attrs, css
    color, op = tone_fallback(style, tone)
    css[kind] = "var(--%s-%s, %s)" % (p, tone, color)
    css[kind + "-opacity"] = "var(--%s-%s-opacity, %s)" % (p, tone, fmt(op))
    return attrs, css


def gradient_defs(style, nodes, mode, theme="light", state="default", gid=None):
    """List of (id, x1, y1, x2, y2, stops[(offset, color_css, opacity_css)])."""
    defs, done = [], set()
    p = style["prefix"]
    for n in nodes:
        if mode == "illo":
            key = n.get("illo") or n["tone"]
            spec = ((style.get("illustration") or {}).get("tones") or {}).get(key)
            if spec is None:
                raise SourceError("illustration.tones has no entry for %r" % key)
            g = parse_color({"gradient": spec} if isinstance(spec, list) else spec)
            if g["kind"] == "solid":
                g = {"kind": "gradient", "stops": [g, g], "angle": 180}
        else:
            key = n["tone"]
            g = palette_color(style, theme, state, key)
            if g["kind"] != "gradient":
                continue
        if key in done:
            continue
        done.add(key)
        x1, y1, x2, y2 = gradient_xy(g.get("angle", 180))
        stops = []
        last = len(g["stops"]) - 1
        for i, st in enumerate(g["stops"]):
            off = fmt(i / last if last else 0)
            if mode == "vars":
                var = "%s-%s-%d" % (p, key, i)
                stops.append((off, "var(--%s, %s)" % (var, st["hex"]), "var(--%s-opacity, %s)" % (var, fmt(st["opacity"]))))
            else:
                stops.append((off, st["hex"], fmt(st["opacity"])))
        defs.append((gid(key), x1, y1, x2, y2, stops))
    return defs


# ---------- SVG string backend (files, sprite, catalog) ----------

def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def css_str(css):
    return ";".join("%s:%s" % (k, v) for k, v in css.items())


def svg_inner(icon, style, mode, theme="light", state="default", id_prefix=None, data_tone=False):
    nodes = icon_nodes(icon, style)
    id_prefix = id_prefix or icon["name"]
    gid = lambda tone: "%s-%s" % (id_prefix, tone)
    out = []
    defs = gradient_defs(style, nodes, mode, theme, state, gid)
    if defs:
        out.append("<defs>")
        for d_id, x1, y1, x2, y2, stops in defs:
            out.append('<linearGradient id="%s" x1="%s" y1="%s" x2="%s" y2="%s">' % (d_id, x1, y1, x2, y2))
            for off, color, op in stops:
                if mode == "vars":
                    out.append('<stop offset="%s" style="stop-color:%s;stop-opacity:%s"/>' % (off, color, op))
                else:
                    extra = ' stop-opacity="%s"' % op if op not in ("1",) else ""
                    out.append('<stop offset="%s" stop-color="%s"%s/>' % (off, color, extra))
            out.append("</linearGradient>")
        out.append("</defs>")
    for n in nodes:
        attrs, css = paint_props(n, style, mode, theme, state, gid)
        parts = ['%s="%s"' % (k, esc(v)) for k, v in n["geom"].items()]
        parts += ['%s="%s"' % (k, esc(v)) for k, v in attrs.items()]
        if css:
            parts.append('style="%s"' % esc(css_str(css)))
        if data_tone:
            parts.append('data-tone="%s"' % n["tone"])
        out.append("<%s %s/>" % (n["tag"], " ".join(parts)))
    return "".join(out)


def svg_document(icon, style, mode="hex", theme="light", state="default", size=None, title=None):
    g = style["grid"]
    size = size or g
    rendering = ' shape-rendering="%s"' % style["rendering"] if style.get("rendering") else ""
    a11y = ' role="img"' if title else ' aria-hidden="true"'
    t = "<title>%s</title>" % esc(title) if title else ""
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%s" height="%s" viewBox="0 0 %s %s"%s%s>%s%s</svg>\n'
            % (size, size, fmt(g), fmt(g), rendering, a11y, t,
               svg_inner(icon, style, mode, theme, state)))
