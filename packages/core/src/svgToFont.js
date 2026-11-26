import opentype from 'opentype.js'
import svgpath from 'svgpath'
import pako from 'pako'
import JSZip from 'jszip'
import { compress as compressWoff2 } from 'woff2-encoder'
import { analyzeStrokeLibrary } from './svgValidator.js'

const UNITS_PER_EM = 1000
const ASCENDER = 850
const DESCENDER = -150
const START_CODEPOINT = 0xe900

function shapeToPathD(el) {
  const tag = el.tagName.toLowerCase()
  if (tag === 'path') {
    return el.getAttribute('d') || ''
  }
  if (tag === 'rect') {
    const x = parseFloat(el.getAttribute('x') || '0')
    const y = parseFloat(el.getAttribute('y') || '0')
    const w = parseFloat(el.getAttribute('width') || '0')
    const h = parseFloat(el.getAttribute('height') || '0')
    let rx = parseFloat(el.getAttribute('rx') || el.getAttribute('ry') || '0')
    let ry = parseFloat(el.getAttribute('ry') || el.getAttribute('rx') || '0')
    if (w <= 0 || h <= 0) return ''
    rx = Math.min(rx, w / 2)
    ry = Math.min(ry, h / 2)
    if (rx <= 0 && ry <= 0) {
      return `M${x} ${y}H${x + w}V${y + h}H${x}Z`
    }
    return [
      `M${x + rx} ${y}`,
      `H${x + w - rx}`,
      `A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}`,
      `V${y + h - ry}`,
      `A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}`,
      `H${x + rx}`,
      `A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}`,
      `V${y + ry}`,
      `A${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
      'Z'
    ].join(' ')
  }
  if (tag === 'circle') {
    const cx = parseFloat(el.getAttribute('cx') || '0')
    const cy = parseFloat(el.getAttribute('cy') || '0')
    const r = parseFloat(el.getAttribute('r') || '0')
    if (r <= 0) return ''
    return `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`
  }
  if (tag === 'ellipse') {
    const cx = parseFloat(el.getAttribute('cx') || '0')
    const cy = parseFloat(el.getAttribute('cy') || '0')
    const rx = parseFloat(el.getAttribute('rx') || '0')
    const ry = parseFloat(el.getAttribute('ry') || '0')
    if (rx <= 0 || ry <= 0) return ''
    return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`
  }
  if (tag === 'polygon' || tag === 'polyline') {
    const raw = (el.getAttribute('points') || '').trim()
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !Number.isNaN(n))
    if (nums.length < 4) return ''
    let d = `M${nums[0]} ${nums[1]}`
    for (let i = 2; i < nums.length - 1; i += 2) {
      d += `L${nums[i]} ${nums[i + 1]}`
    }
    if (tag === 'polygon') d += 'Z'
    return d
  }
  if (tag === 'line') {
    const x1 = parseFloat(el.getAttribute('x1') || '0')
    const y1 = parseFloat(el.getAttribute('y1') || '0')
    const x2 = parseFloat(el.getAttribute('x2') || '0')
    const y2 = parseFloat(el.getAttribute('y2') || '0')
    const sw = parseFloat(el.getAttribute('stroke-width') || '1.5')
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy)
    if (len === 0) return ''
    const nx = (-dy / len) * (sw / 2)
    const ny = (dx / len) * (sw / 2)
    return `M${x1 + nx} ${y1 + ny}L${x2 + nx} ${y2 + ny}L${x2 - nx} ${y2 - ny}L${x1 - nx} ${y1 - ny}Z`
  }
  return ''
}

function extractViewBox(svgEl) {
  const vb = svgEl.getAttribute('viewBox')
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/).map(Number)
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] }
    }
  }
  const w = parseFloat(svgEl.getAttribute('width') || '24') || 24
  const h = parseFloat(svgEl.getAttribute('height') || '24') || 24
  return { minX: 0, minY: 0, width: w, height: h }
}

function svgToOpentypePath(svgString) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svgEl = doc.querySelector('svg')
  if (!svgEl) return new opentype.Path()

  const { minX, minY, width, height } = extractViewBox(svgEl)
  const scale = UNITS_PER_EM / Math.max(width, height)
  const xOffset = (UNITS_PER_EM - width * scale) / 2
  const yOffset = (UNITS_PER_EM - height * scale) / 2

  const elements = svgEl.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line')
  const otPath = new opentype.Path()

  elements.forEach((el) => {
    if (el.closest('defs') || el.closest('clipPath') || el.closest('mask')) return
    const rawD = shapeToPathD(el)
    if (!rawD) return

    try {
      const transformed = svgpath(rawD)
        .abs()
        .unshort()
        .unarc()
        .translate(-minX, -minY)
        .scale(scale, -scale)
        .translate(xOffset, ASCENDER - yOffset)
        .round(2)

      transformed.iterate((seg) => {
        const cmd = seg[0]
        if (cmd === 'M') {
          otPath.moveTo(seg[1], seg[2])
        } else if (cmd === 'L') {
          otPath.lineTo(seg[1], seg[2])
        } else if (cmd === 'H') {
          const prev = otPath.commands[otPath.commands.length - 1]
          otPath.lineTo(seg[1], prev?.y ?? 0)
        } else if (cmd === 'V') {
          const prev = otPath.commands[otPath.commands.length - 1]
          otPath.lineTo(prev?.x ?? 0, seg[1])
        } else if (cmd === 'C') {
          otPath.curveTo(seg[1], seg[2], seg[3], seg[4], seg[5], seg[6])
        } else if (cmd === 'Q') {
          otPath.quadraticCurveTo(seg[1], seg[2], seg[3], seg[4])
        } else if (cmd === 'Z' || cmd === 'z') {
          otPath.close()
        }
      })
    } catch (e) {
      console.warn('Skipping malformed path segment:', e)
    }
  })

  return otPath
}

/**
 * Wraps a TrueType (.ttf) Uint8Array into a valid WOFF 1.0 binary using pako deflate.
 */
export function ttfToWoff(ttfBuffer) {
  const sfnt = new Uint8Array(ttfBuffer)
  const view = new DataView(sfnt.buffer, sfnt.byteOffset, sfnt.byteLength)

  const flavor = view.getUint32(0, false)
  const numTables = view.getUint16(4, false)

  const tables = []
  for (let i = 0; i < numTables; i++) {
    const entryOffset = 12 + i * 16
    const tag = view.getUint32(entryOffset, false)
    const checksum = view.getUint32(entryOffset + 4, false)
    const offset = view.getUint32(entryOffset + 8, false)
    const origLength = view.getUint32(entryOffset + 12, false)
    const rawData = sfnt.subarray(offset, offset + origLength)
    const compressed = pako.deflate(rawData)
    const useCompressed = compressed.length < rawData.length
    const data = useCompressed ? compressed : rawData
    tables.push({
      tag,
      checksum,
      origLength,
      compLength: data.length,
      data
    })
  }

  const headerSize = 44
  const dirSize = numTables * 20
  let totalSize = headerSize + dirSize
  let totalSfntSize = 12 + numTables * 16

  for (const t of tables) {
    t.woffOffset = totalSize
    const paddedComp = (t.compLength + 3) & ~3
    totalSize += paddedComp
    totalSfntSize += (t.origLength + 3) & ~3
  }

  const out = new Uint8Array(totalSize)
  const outView = new DataView(out.buffer)

  // WOFF Header
  outView.setUint32(0, 0x774f4646, false) // 'wOFF'
  outView.setUint32(4, flavor, false)
  outView.setUint32(8, totalSize, false)
  outView.setUint16(12, numTables, false)
  outView.setUint16(14, 0, false) // reserved
  outView.setUint32(16, totalSfntSize, false)
  outView.setUint16(20, 1, false) // majorVersion
  outView.setUint16(22, 0, false) // minorVersion
  outView.setUint32(24, 0, false) // metaOffset
  outView.setUint32(28, 0, false) // metaLength
  outView.setUint32(32, 0, false) // metaOrigLength
  outView.setUint32(36, 0, false) // privOffset
  outView.setUint32(40, 0, false) // privLength

  // Table Directory & Data
  tables.forEach((t, idx) => {
    const dirPos = headerSize + idx * 20
    outView.setUint32(dirPos, t.tag, false)
    outView.setUint32(dirPos + 4, t.woffOffset, false)
    outView.setUint32(dirPos + 8, t.compLength, false)
    outView.setUint32(dirPos + 12, t.origLength, false)
    outView.setUint32(dirPos + 16, t.checksum, false)
    out.set(t.data, t.woffOffset)
  })

  return out
}

export function generateCss({ fontName, prefix, codepoints, formats = ['woff2', 'woff', 'ttf'] }) {
  const formatMap = {
    woff2: `url('./${fontName}.woff2') format('woff2')`,
    woff: `url('./${fontName}.woff') format('woff')`,
    ttf: `url('./${fontName}.ttf') format('truetype')`,
    otf: `url('./${fontName}.otf') format('opentype')`
  }
  const srcLines = formats.filter((f) => formatMap[f]).map((f) => formatMap[f])
  const src = srcLines.length
    ? srcLines.join(',\n       ')
    : `url('./${fontName}.woff') format('woff'),\n       url('./${fontName}.ttf') format('truetype')`

  const lines = [
    `@font-face {`,
    `  font-family: '${fontName}';`,
    `  src: ${src};`,
    `  font-weight: normal;`,
    `  font-style: normal;`,
    `  font-display: block;`,
    `}`,
    ``,
    `.${prefix} {`,
    `  font-family: '${fontName}';`,
    `  speak: none;`,
    `  font-style: normal;`,
    `  font-weight: normal;`,
    `  font-variant: normal;`,
    `  text-transform: none;`,
    `  line-height: 1;`,
    `  display: inline-block;`,
    `  -webkit-font-smoothing: antialiased;`,
    `  -moz-osx-font-smoothing: grayscale;`,
    `}`,
    ``
  ]

  for (const [name, cp] of Object.entries(codepoints)) {
    const hex = cp.toString(16)
    lines.push(`.${prefix}.${name}::before {`)
    lines.push(`  content: '\\${hex}';`)
    lines.push(`}`)
  }

  return lines.join('\n') + '\n'
}

/**
 * Compiles monochrome SVGs into an in-memory TTF / WOFF / WOFF2 webfont, optionally registers
 * it in the browser, and returns the complete gallery dataset + exportable bundle artifacts.
 */
function hasFontArtifacts(artifacts) {
  return Boolean(
    artifacts?.ttfBuffer ||
      artifacts?.otfBuffer ||
      artifacts?.woffBytes ||
      artifacts?.woff2Buffer
  )
}

function listFontFormats(artifacts) {
  const formats = []
  if (artifacts?.woff2Buffer) formats.push('woff2')
  if (artifacts?.woffBytes) formats.push('woff')
  if (artifacts?.ttfBuffer) formats.push('ttf')
  if (artifacts?.otfBuffer) formats.push('otf')
  return formats
}

export async function compileSvgsToWebfont({
  svgItems,
  fontName = 'custom-icons',
  prefix = 'ic',
  registerRuntime = true
}) {
  const safeFontName = fontName.trim().replace(/[^a-zA-Z0-9_-]/g, '-') || 'custom-icons'
  const safePrefix = prefix.trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'ic'

  const monoItems = svgItems.filter((item) => !item.colored)
  const coloredItems = svgItems.filter((item) => item.colored)

  const glyphs = [
    new opentype.Glyph({
      name: '.notdef',
      unicode: 0,
      advanceWidth: UNITS_PER_EM,
      path: new opentype.Path()
    })
  ]

  const codepoints = {}
  const monoCatalog = []

  monoItems.forEach((item, index) => {
    const unicode = START_CODEPOINT + index
    const path = svgToOpentypePath(item.content)

    glyphs.push(
      new opentype.Glyph({
        name: item.name,
        unicode,
        advanceWidth: UNITS_PER_EM,
        path
      })
    )

    codepoints[item.name] = unicode
    const fallbackKw = item.name.replace(/[-_]/g, ' ')
    const mergedKw = item.keywords ? `${fallbackKw} ${item.keywords}`.trim() : fallbackKw
    monoCatalog.push({
      name: item.name,
      icon: `${safePrefix} ${item.name}`,
      keywords: mergedKw,
      label: item.label || item.name,
      group: item.group || '',
      unicode,
      char: String.fromCodePoint(unicode),
      svg: item.content,
      colored: false
    })
  })

  const coloredCatalog = coloredItems.map((item) => {
    const fallbackKw = item.name.replace(/[-_]/g, ' ')
    const mergedKw = item.keywords ? `${fallbackKw} ${item.keywords}`.trim() : fallbackKw
    return {
      name: item.name,
      icon: `${safePrefix}-color ${item.name}`,
      keywords: mergedKw,
      label: item.label || item.name,
      group: item.group || '',
      svg: item.content,
      colored: true
    }
  })

  let ttfBuffer = null
  let woffBytes = null
  let woff2Buffer = null
  let runtimeFamily = `${safeFontName}-${Date.now()}`

  if (monoItems.length > 0) {
    const font = new opentype.Font({
      familyName: safeFontName,
      styleName: 'Regular',
      unitsPerEm: UNITS_PER_EM,
      ascender: ASCENDER,
      descender: DESCENDER,
      glyphs
    })

    ttfBuffer = font.toArrayBuffer()
    woffBytes = ttfToWoff(ttfBuffer)

    try {
      woff2Buffer = await compressWoff2(ttfBuffer)
    } catch (e) {
      console.warn('Failed to compress WOFF2:', e)
    }

    if (registerRuntime && typeof FontFace !== 'undefined' && typeof document !== 'undefined') {
      const fontFace = new FontFace(runtimeFamily, ttfBuffer)
      await fontFace.load()
      document.fonts.add(fontFace)
    }
  }

  const formats = listFontFormats({ ttfBuffer, woffBytes, woff2Buffer })
  const cssContent = generateCss({
    fontName: safeFontName,
    prefix: safePrefix,
    codepoints,
    formats: formats.length ? formats : ['woff', 'ttf']
  })

  const icons = [...monoCatalog, ...coloredCatalog]
  const strokeMeta = analyzeStrokeLibrary(icons)

  return {
    sourceType: 'svg-build',
    fontName: safeFontName,
    runtimeFamily,
    prefix: safePrefix,
    icons,
    monoCount: monoCatalog.length,
    coloredCount: coloredCatalog.length,
    strokeBased: strokeMeta.strokeBased,
    defaultStrokeWidth: strokeMeta.defaultStrokeWidth,
    artifacts: {
      ttfBuffer,
      woffBytes,
      woff2Buffer,
      cssContent,
      catalogJson: JSON.stringify(
        monoCatalog.map(({ name, icon, keywords }) => ({ name, icon, keywords })),
        null,
        2
      ),
      colorCatalogJson: JSON.stringify(
        coloredCatalog.map(({ name, icon, keywords, svg }) => ({
          name,
          icon,
          keywords,
          colored: true,
          svg
        })),
        null,
        2
      )
    }
  }
}

async function deriveMissingFontFormats(artifacts) {
  const next = { ...artifacts }
  const sfntSource = next.ttfBuffer || next.otfBuffer

  if (sfntSource && !next.woffBytes) {
    try {
      next.woffBytes = ttfToWoff(sfntSource)
    } catch (e) {
      console.warn('Failed to derive WOFF from font:', e)
    }
  }

  if (sfntSource && !next.woff2Buffer) {
    try {
      next.woff2Buffer = await compressWoff2(sfntSource)
    } catch (e) {
      console.warn('Failed to derive WOFF2 from font:', e)
    }
  }

  return next
}

async function ensureBundleArtifacts(libraryData) {
  let artifacts = await deriveMissingFontFormats({ ...(libraryData.artifacts || {}) })

  if (hasFontArtifacts(artifacts)) {
    if (libraryData.sourceType === 'svg-build' || libraryData.sourceType === 'preset') {
      const codepoints = {}
      for (const icon of libraryData.icons || []) {
        if (!icon.colored && icon.unicode != null) {
          codepoints[icon.name] = icon.unicode
        }
      }
      if (Object.keys(codepoints).length) {
        artifacts.cssContent = generateCss({
          fontName: libraryData.fontName,
          prefix: libraryData.prefix,
          codepoints,
          formats: listFontFormats(artifacts)
        })
      }
    }
    return { ...libraryData, artifacts }
  }

  const svgItems = (libraryData.icons || [])
    .filter((icon) => icon.svg)
    .map((icon) => ({
      name: icon.name,
      content: icon.svg,
      colored: Boolean(icon.colored),
      keywords: icon.keywords,
      label: icon.label,
      group: icon.group
    }))

  if (!svgItems.some((item) => !item.colored)) {
    return { ...libraryData, artifacts }
  }

  const compiled = await compileSvgsToWebfont({
    svgItems,
    fontName: libraryData.fontName || 'icons',
    prefix: libraryData.prefix || 'ic',
    registerRuntime: false
  })

  artifacts = {
    ...artifacts,
    ...compiled.artifacts,
    catalogJson: artifacts.catalogJson || compiled.artifacts.catalogJson,
    colorCatalogJson: artifacts.colorCatalogJson || compiled.artifacts.colorCatalogJson
  }

  return {
    ...libraryData,
    artifacts
  }
}

export async function createBundleZip(libraryData) {
  const prepared = await ensureBundleArtifacts(libraryData)
  const zip = new JSZip()
  const { fontName, prefix, artifacts, icons } = prepared
  const fontFiles = []

  if (artifacts?.woff2Buffer) {
    zip.file(`${fontName}.woff2`, artifacts.woff2Buffer)
    fontFiles.push(`${fontName}.woff2`)
  }
  if (artifacts?.woffBytes) {
    zip.file(`${fontName}.woff`, artifacts.woffBytes)
    fontFiles.push(`${fontName}.woff`)
  }
  if (artifacts?.ttfBuffer) {
    zip.file(`${fontName}.ttf`, artifacts.ttfBuffer)
    fontFiles.push(`${fontName}.ttf`)
  }
  if (artifacts?.otfBuffer) {
    zip.file(`${fontName}.otf`, artifacts.otfBuffer)
    fontFiles.push(`${fontName}.otf`)
  }
  if (artifacts?.cssContent) {
    zip.file(`${fontName}.css`, artifacts.cssContent)
  }
  if (artifacts?.catalogJson) {
    zip.file('catalog.json', artifacts.catalogJson)
  }
  if (artifacts?.colorCatalogJson && prepared.coloredCount > 0) {
    zip.file('color-catalog.json', artifacts.colorCatalogJson)
  }

  const svgFolder = zip.folder('svg')
  for (const icon of icons) {
    if (icon.svg) {
      svgFolder.file(`${icon.name}.svg`, icon.svg)
    }
  }

  const contents = []
  if (fontFiles.length) {
    contents.push(`- ${fontFiles.map((f) => `\`${f}\``).join(' / ')} — Webfont files`)
  }
  if (artifacts?.cssContent) {
    contents.push(`- \`${fontName}.css\` — CSS classes (\`.${prefix}\`)`)
  }
  contents.push(`- \`catalog.json\` — Icon metadata (${icons.length} icons)`)
  contents.push(`- \`svg/\` — Standalone SVG files`)

  const readme = `# ${fontName}

Generated by **Icon Library Studio**.

## Usage

\`\`\`html
<link rel="stylesheet" href="./${fontName}.css" />
<i class="${prefix} ${icons[0]?.name || 'example'}"></i>
\`\`\`

## Contents
${contents.join('\n')}
`
  zip.file('README.md', readme)

  return await zip.generateAsync({ type: 'blob' })
}
