/**
 * Resize the root <svg> and optionally bake `currentColor` into a concrete color.
 *
 * Only mutates attributes on the root `<svg>` tag. A naive global
 * `width|height` replace corrupts `stroke-width="…"` (becomes `stroke-`) and
 * strips dimensions from child `<rect>` / `<image>` elements — which makes
 * Figma report "Unable to convert SVG" on paste.
 *
 * @param {string} svgString
 * @param {{ color?: string, dimension?: number|string, colored?: boolean }} [options]
 * @returns {string}
 */
export function prepareSvg(svgString, { color, dimension, colored = false } = {}) {
  let svg = String(svgString || '')
  if (!svg) return ''

  if (!colored && color) {
    svg = svg.replace(/fill="currentColor"/gi, `fill="${color}"`)
    svg = svg.replace(/stroke="currentColor"/gi, `stroke="${color}"`)
  }

  const openMatch = svg.match(/<svg\b([^>]*)>/i)
  if (!openMatch) return svg

  let attrs = openMatch[1]

  // Mono icons with no fill at all (stroke-only roots) get an explicit root fill
  if (!colored && color && !/\bfill=/i.test(svg)) {
    attrs += ` fill="${color}"`
  }

  if (!/\bviewBox=/i.test(attrs)) {
    const origW = (attrs.match(/\bwidth="([^"]*)"/i) || [])[1] || '24'
    const origH = (attrs.match(/\bheight="([^"]*)"/i) || [])[1] || '24'
    attrs += ` viewBox="0 0 ${origW} ${origH}"`
  }

  if (dimension != null) {
    attrs = attrs.replace(/\s*\b(width|height)="[^"]*"/gi, '')
    attrs = ` width="${dimension}" height="${dimension}"` + attrs
  }

  if (!/\bxmlns=/i.test(attrs)) {
    attrs = ` xmlns="http://www.w3.org/2000/svg"` + attrs
  }

  return svg.replace(openMatch[0], `<svg${attrs}>`)
}
