import opentype from 'opentype.js'
import JSZip from 'jszip'
import decompressWoff2 from 'woff2-encoder/decompress'
import { generateCss } from './svgToFont'
import { parseCatalogJson } from './catalogParser'

const FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2']

function getExt(name) {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx).toLowerCase() : ''
}

function cleanBaseName(name) {
  const base = name.split('/').pop().replace(/\.[^.]+$/, '')
  return base.replace(/[^a-zA-Z0-9_-]/g, '-') || 'uploaded-font'
}

/**
 * Parses a webfont CSS file to extract class names and unicode codepoints.
 * Supports patterns like:
 *   .ai.ai-home::before { content: '\e900'; }
 *   .pi-home:before { content: "\e901"; }
 *   .icon-home::before { content: '\ea01'; }
 */
export function parseIconCss(cssText) {
  const codepointToClass = new Map()
  let detectedFamily = ''
  let detectedPrefix = ''

  const familyMatch = cssText.match(/@font-face\s*\{[^}]*font-family\s*:\s*['"]?([^'";}]+)['"]?/i)
  if (familyMatch) {
    detectedFamily = familyMatch[1].trim()
  }

  const ruleRegex = /([^{}]+)\{[^}]*content\s*:\s*['"]\\([0-9a-fA-F]{2,6})['"][^}]*\}/g
  const prefixVotes = new Map()
  let match

  while ((match = ruleRegex.exec(cssText)) !== null) {
    const selectorBlock = match[1]
    const hex = match[2]
    const codepoint = parseInt(hex, 16)
    if (Number.isNaN(codepoint)) continue

    const firstSelector = selectorBlock.split(',')[0].trim()
    // Extract class tokens before ::before / :before
    const cleanSel = firstSelector.replace(/::?before\b.*$/i, '').trim()
    const classes = [...cleanSel.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1])
    if (classes.length === 0) continue

    let prefix = ''
    let name = ''
    if (classes.length >= 2) {
      prefix = classes[0]
      name = classes[classes.length - 1]
    } else {
      name = classes[0]
      const dashIdx = name.indexOf('-')
      if (dashIdx > 0) {
        prefix = name.slice(0, dashIdx)
      }
    }

    if (prefix) {
      prefixVotes.set(prefix, (prefixVotes.get(prefix) || 0) + 1)
    }

    if (!codepointToClass.has(codepoint)) {
      codepointToClass.set(codepoint, {
        name,
        fullClass: classes.join(' '),
        prefix
      })
    }
  }

  let topVotes = 0
  for (const [p, count] of prefixVotes.entries()) {
    if (count > topVotes) {
      topVotes = count
      detectedPrefix = p
    }
  }

  return {
    codepointToClass,
    detectedFamily,
    detectedPrefix
  }
}

function glyphToSvgString(glyph, unitsPerEm, ascender) {
  try {
    const viewSize = 24
    const path = glyph.getPath(0, (ascender / unitsPerEm) * viewSize, viewSize)
    const bbox = path.getBoundingBox()
    const w = bbox.x2 - bbox.x1
    const h = bbox.y2 - bbox.y1

    if (!Number.isFinite(w) || !Number.isFinite(h) || (w === 0 && h === 0)) {
      return ''
    }

    const pad = 2
    const target = viewSize - pad * 2
    const scale = target / Math.max(w, h)
    const tx = pad + (target - w * scale) / 2 - bbox.x1 * scale
    const ty = pad + (target - h * scale) / 2 - bbox.y1 * scale

    const d = path.toPathData(2)
    if (!d) return ''

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewSize} ${viewSize}" width="${viewSize}" height="${viewSize}"><g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})"><path d="${d}" fill="currentColor"/></g></svg>`
  } catch {
    return ''
  }
}

export async function extractFilesFromUpload(fileList) {
  const fonts = []
  const cssFiles = []
  const jsonFiles = []

  for (const file of Array.from(fileList)) {
    const ext = getExt(file.name)
    if (ext === '.zip') {
      const zip = await JSZip.loadAsync(file)
      for (const [relPath, entry] of Object.entries(zip.files)) {
        if (entry.dir || relPath.includes('__MACOSX')) continue
        const entryExt = getExt(relPath)
        if (FONT_EXTENSIONS.includes(entryExt)) {
          const buffer = await entry.async('arraybuffer')
          fonts.push({ name: relPath.split('/').pop(), ext: entryExt, buffer })
        } else if (entryExt === '.css') {
          const text = await entry.async('string')
          cssFiles.push({ name: relPath.split('/').pop(), text })
        } else if (entryExt === '.json') {
          const text = await entry.async('string')
          jsonFiles.push({ name: relPath.split('/').pop(), text })
        }
      }
    } else if (FONT_EXTENSIONS.includes(ext)) {
      const buffer = await file.arrayBuffer()
      fonts.push({ name: file.name, ext, buffer })
    } else if (ext === '.css') {
      const text = await file.text()
      cssFiles.push({ name: file.name, text })
    } else if (ext === '.json') {
      const text = await file.text()
      jsonFiles.push({ name: file.name, text })
    }
  }

  return { fonts, cssFiles, jsonFiles }
}

/**
 * Loads an uploaded webfont (TTF/OTF/WOFF/WOFF2 + optional CSS + optional catalog.json) into a searchable Icon Library.
 */
export async function parseUploadedWebfont({
  fonts,
  cssFiles,
  jsonFiles = [],
  customFontName = '',
  customPrefix = ''
}) {
  if (!fonts || fonts.length === 0) {
    throw new Error('NO_FONT_FILE')
  }

  const catalogMap = new Map()
  for (const jf of jsonFiles) {
    const parsed = parseCatalogJson(jf.text)
    for (const [k, v] of parsed.entries()) catalogMap.set(k, v)
  }

  // Prefer TTF/OTF/WOFF for opentype.js glyph inspection, or decompress WOFF2 client-side
  let parseableBuffer =
    (
      fonts.find((f) => f.ext === '.ttf') ||
      fonts.find((f) => f.ext === '.otf') ||
      fonts.find((f) => f.ext === '.woff')
    )?.buffer || null

  const woff2Font = fonts.find((f) => f.ext === '.woff2')
  if (!parseableBuffer && woff2Font) {
    try {
      const ttfBytes = await decompressWoff2(woff2Font.buffer.slice(0))
      parseableBuffer = ttfBytes.buffer.slice(
        ttfBytes.byteOffset,
        ttfBytes.byteOffset + ttfBytes.byteLength
      )
    } catch (e) {
      console.warn('Failed to decompress WOFF2 with woff2-encoder:', e)
    }
  }

  const displayFont = woff2Font || fonts[0]

  const combinedCss = cssFiles.map((c) => c.text).join('\n')
  const cssInfo = combinedCss ? parseIconCss(combinedCss) : null

  const fontName =
    customFontName.trim() || cssInfo?.detectedFamily || cleanBaseName(displayFont.name)
  const prefix = customPrefix.trim() || cssInfo?.detectedPrefix || 'ic'
  const runtimeFamily = `${fontName.replace(/[^a-zA-Z0-9_-]/g, '-')}-${Date.now()}`

  // Register font in browser
  const fontFace = new FontFace(runtimeFamily, displayFont.buffer.slice(0))
  await fontFace.load()
  document.fonts.add(fontFace)

  const icons = []
  const codepoints = {}
  let notice = ''

  if (parseableBuffer) {
    const otFont = opentype.parse(parseableBuffer.slice(0))
    const unitsPerEm = otFont.unitsPerEm || 1000
    const ascender = otFont.ascender || 850

    for (let i = 0; i < otFont.glyphs.length; i++) {
      const glyph = otFont.glyphs.get(i)
      if (!glyph) continue
      const unicode = glyph.unicode
      if (unicode === undefined || unicode === null || unicode === 0 || unicode === 32) continue
      if (glyph.name === '.notdef' || glyph.name === '.null' || glyph.name === 'nonmarkingreturn') {
        continue
      }

      const cssMatch = cssInfo?.codepointToClass.get(unicode)
      const fallbackName =
        glyph.name && !glyph.name.startsWith('uni')
          ? glyph.name
          : `glyph-${unicode.toString(16)}`
      const name = cssMatch?.name || fallbackName
      const iconClass = cssMatch?.fullClass || `${prefix} ${name}`
      const svg = glyphToSvgString(glyph, unitsPerEm, ascender)

      const meta = catalogMap.get(name.toLowerCase())
      codepoints[name] = unicode
      icons.push({
        name,
        icon: iconClass,
        keywords: `${name.replace(/[-_]/g, ' ')} ${meta?.keywords || ''} u+${unicode.toString(16)}`.trim(),
        label: meta?.label || name,
        group: meta?.group || '',
        unicode,
        char: String.fromCodePoint(unicode),
        svg,
        colored: false
      })
    }
  } else if (cssInfo && cssInfo.codepointToClass.size > 0) {
    // WOFF2 + CSS path
    for (const [unicode, info] of cssInfo.codepointToClass.entries()) {
      const meta = catalogMap.get(info.name.toLowerCase())
      codepoints[info.name] = unicode
      icons.push({
        name: info.name,
        icon: info.fullClass || `${prefix} ${info.name}`,
        keywords: `${info.name.replace(/[-_]/g, ' ')} ${meta?.keywords || ''} u+${unicode.toString(16)}`.trim(),
        label: meta?.label || info.name,
        group: meta?.group || '',
        unicode,
        char: String.fromCodePoint(unicode),
        svg: '',
        colored: false
      })
    }
  } else {
    // WOFF2 alone without CSS: cannot inspect glyph table directly without woff2 decoder
    notice = 'WOFF2_WITHOUT_CSS'
  }

  const finalCss =
    combinedCss ||
    generateCss({
      fontName,
      prefix,
      codepoints
    })

  const artifacts = {
    cssContent: finalCss,
    catalogJson: JSON.stringify(
      icons.map(({ name, icon, keywords }) => ({ name, icon, keywords })),
      null,
      2
    )
  }

  const ttfFile = fonts.find((f) => f.ext === '.ttf')
  const otfFile = fonts.find((f) => f.ext === '.otf')
  const woffFile = fonts.find((f) => f.ext === '.woff')
  const woff2File = fonts.find((f) => f.ext === '.woff2')
  if (ttfFile) artifacts.ttfBuffer = ttfFile.buffer
  if (otfFile) artifacts.otfBuffer = otfFile.buffer
  if (woffFile) artifacts.woffBytes = new Uint8Array(woffFile.buffer)
  if (woff2File) artifacts.woff2Buffer = woff2File.buffer

  return {
    sourceType: 'webfont',
    fontName,
    runtimeFamily,
    prefix,
    icons,
    monoCount: icons.length,
    coloredCount: 0,
    notice,
    artifacts
  }
}
