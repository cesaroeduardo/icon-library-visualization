/**
 * Client-side SVG validator for icon font readiness
 */

export function normalizeIconName(filename) {
  return filename
    .replace(/\.svg$/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'icon'
}

export function isColoredSvg(content) {
  if (/<linearGradient|<radialGradient/i.test(content)) return true
  const colorMatches = [
    ...content.matchAll(/(?:fill|stroke)="([^"]+)"/gi),
    ...content.matchAll(/(?:fill|stroke)\s*:\s*([^;"]+)/gi)
  ]
  const uniqueColors = new Set()
  for (const m of colorMatches) {
    const val = m[1].trim().toLowerCase()
    if (
      !val ||
      val === 'none' ||
      val === 'transparent' ||
      val === 'currentcolor' ||
      val === 'inherit' ||
      val.startsWith('var(')
    ) {
      continue
    }
    uniqueColors.add(val)
  }
  if (uniqueColors.size > 1) return true
  if (uniqueColors.size === 1) {
    const [only] = [...uniqueColors]
    const monoSet = new Set(['#000', '#000000', 'black', '#fff', '#ffffff', 'white', 'rgb(0,0,0)', 'rgb(0, 0, 0)'])
    if (!monoSet.has(only)) return true
  }
  return false
}

/**
 * True for outline / stroke-based icons (Feather, Lucide, Tabler outline, …).
 * Fill-first sets like Phosphor / Remix return false.
 */
export function isStrokeSvg(content) {
  const svg = String(content || '')
  if (!svg) return false

  const strokePaints = [...svg.matchAll(/\bstroke="([^"]*)"/gi)]
    .map((m) => m[1].trim().toLowerCase())
    .filter((v) => v && v !== 'none')
  if (strokePaints.length === 0) return false

  if (/\bstroke-width=/i.test(svg) || /\bstroke-width\s*:/i.test(svg)) return true
  if (/fill="none"/i.test(svg)) return true
  return false
}

export function inferStrokeWidth(content) {
  const svg = String(content || '')
  const attr = svg.match(/\bstroke-width="([^"]+)"/i)
  if (attr) {
    const n = parseFloat(attr[1])
    if (Number.isFinite(n)) return n
  }
  const css = svg.match(/\bstroke-width\s*:\s*([^;"]+)/i)
  if (css) {
    const n = parseFloat(css[1])
    if (Number.isFinite(n)) return n
  }
  return null
}

/**
 * Sample a library's SVG icons and decide whether stroke-width controls apply.
 *
 * @param {Array<{ svg?: string }>} icons
 * @param {{ sampleSize?: number }} [options]
 * @returns {{ strokeBased: boolean, defaultStrokeWidth: number|null }}
 */
export function analyzeStrokeLibrary(icons, { sampleSize = 24 } = {}) {
  const withSvg = (icons || []).filter((icon) => icon?.svg)
  if (!withSvg.length) {
    return { strokeBased: false, defaultStrokeWidth: null }
  }

  const sample = withSvg.slice(0, Math.min(sampleSize, withSvg.length))
  let strokeHits = 0
  const widthCounts = new Map()

  for (const icon of sample) {
    if (!isStrokeSvg(icon.svg)) continue
    strokeHits += 1
    const width = inferStrokeWidth(icon.svg)
    if (width != null) {
      widthCounts.set(width, (widthCounts.get(width) || 0) + 1)
    }
  }

  if (strokeHits / sample.length < 0.5) {
    return { strokeBased: false, defaultStrokeWidth: null }
  }

  let defaultStrokeWidth = 2
  let best = 0
  for (const [width, count] of widthCounts) {
    if (count > best) {
      best = count
      defaultStrokeWidth = width
    }
  }

  return { strokeBased: true, defaultStrokeWidth }
}

export function validateSvgFiles(svgItems) {
  const issues = {
    placeholder: [],
    noPath: [],
    filenameSpace: [],
    stroke: [],
    fillBlack: [],
    clipPath: [],
    nonSquareViewBox: [],
    nonStandardSize: []
  }

  for (const item of svgItems) {
    const { fileName, content } = item

    if (fileName.includes(' ')) {
      issues.filenameSpace.push({ file: fileName, detail: `"${fileName}"` })
    }

    if (content.includes('<rect') && content.includes('<text') && content.includes('?')) {
      issues.placeholder.push({
        file: fileName,
        detail: 'Placeholder <rect>+<text> with "?"'
      })
    }

    const hasVectorShape = /<(path|circle|rect|ellipse|polygon|polyline|line)\b/i.test(content)
    if (!hasVectorShape) {
      issues.noPath.push({ file: fileName, detail: 'No vector shape (<path>, <circle>, <rect>, etc.)' })
    }

    if (/stroke="(?!none)[^"]+"/i.test(content)) {
      const strokeColors = [...content.matchAll(/stroke="([^"]*)"/gi)]
        .map((m) => m[1])
        .filter((s) => s.toLowerCase() !== 'none')
      if (strokeColors.length > 0) {
        issues.stroke.push({
          file: fileName,
          detail: `stroke="${strokeColors.join(', ')}"`
        })
      }
    }

    const fillBlackMatches = [...content.matchAll(/fill="(black|#000|#000000)"/gi)]
    if (fillBlackMatches.length > 0) {
      issues.fillBlack.push({
        file: fileName,
        detail: `fill="${fillBlackMatches[0][1]}"`
      })
    }

    const viewBoxMatch = content.match(/viewBox="([^"]*)"/i)
    if (viewBoxMatch) {
      const vb = viewBoxMatch[1].trim()
      const parts = vb.split(/[\s,]+/).map(Number)
      if (parts.length === 4) {
        const [, , w, h] = parts
        if (w !== h) {
          issues.nonSquareViewBox.push({
            file: fileName,
            detail: `viewBox="${vb}" (${w}x${h})`
          })
        } else if (w !== 24 || h !== 24) {
          issues.nonStandardSize.push({
            file: fileName,
            detail: `viewBox="${vb}" (${w}x${h})`
          })
        }
      }
    }

    if (content.includes('<clipPath') || content.includes('clip-path=')) {
      issues.clipPath.push({
        file: fileName,
        detail: 'Uses <clipPath>'
      })
    }
  }

  const errorCount = issues.placeholder.length + issues.noPath.length
  const warnCount =
    issues.filenameSpace.length +
    issues.stroke.length +
    issues.fillBlack.length +
    issues.clipPath.length +
    issues.nonSquareViewBox.length
  const infoCount = issues.nonStandardSize.length

  return {
    issues,
    errorCount,
    warnCount,
    infoCount
  }
}
