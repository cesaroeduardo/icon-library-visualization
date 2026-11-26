import { createRequire } from 'node:module'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { DOMParser } from 'linkedom'

const require = createRequire(import.meta.url)
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

globalThis.DOMParser = DOMParser

const coreDir = dirname(require.resolve('@icon-library/core'))
const svgToFont = await import(pathToFileURL(join(coreDir, 'svgToFont.js')).href)
const svgValidator = await import(pathToFileURL(join(coreDir, 'svgValidator.js')).href)
const catalogParser = await import(pathToFileURL(join(coreDir, 'catalogParser.js')).href)
const { compileSvgsToWebfont } = svgToFont
const { normalizeIconName, isColoredSvg } = svgValidator
const { parseCatalogJson } = catalogParser

function readConfig() {
  const raw = readFileSync(join(ROOT, 'selfhost.config.json'), 'utf8')
  const config = JSON.parse(raw)
  return {
    title: config.title || 'Icons',
    fontName: config.fontName || 'my-icons',
    prefix: config.prefix || 'ic',
    iconsDir: config.iconsDir || 'icons',
    logo: config.logo || ''
  }
}

function walkSvgs(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkSvgs(full, out)
    else if (entry.name.toLowerCase().endsWith('.svg')) out.push(full)
  }
  return out
}

function toBytes(value) {
  if (!value) return null
  if (Buffer.isBuffer(value)) return value
  if (value instanceof Uint8Array) return Buffer.from(value)
  if (value instanceof ArrayBuffer) return Buffer.from(value)
  return null
}

function writeBinary(filePath, value) {
  const bytes = toBytes(value)
  if (!bytes) return false
  writeFileSync(filePath, bytes)
  return true
}

function loadCatalog(iconsDir) {
  const catalogPath = join(iconsDir, 'catalog.json')
  if (!existsSync(catalogPath)) return new Map()
  return parseCatalogJson(readFileSync(catalogPath, 'utf8'))
}

function copyLogo(logoRel) {
  const brandOut = join(ROOT, 'public', 'brand')
  mkdirSync(brandOut, { recursive: true })
  if (!logoRel) return
  const source = join(ROOT, logoRel)
  if (!existsSync(source)) {
    console.warn(`Logo not found at ${logoRel}: header will fall back to the title.`)
    return
  }
  copyFileSync(source, join(brandOut, 'logo.svg'))
}

const config = readConfig()
const iconsDir = join(ROOT, config.iconsDir)
const svgPaths = walkSvgs(iconsDir).sort()

if (svgPaths.length === 0) {
  console.error(`No SVG files in ${config.iconsDir}/. Add icons there and build again.`)
  process.exit(1)
}

const catalog = loadCatalog(iconsDir)
const used = new Map()
const svgItems = svgPaths.map((filePath) => {
  const content = readFileSync(filePath, 'utf8')
  let baseName = normalizeIconName(basename(filePath))
  const count = used.get(baseName) || 0
  used.set(baseName, count + 1)
  const name = count > 0 ? `${baseName}-${count + 1}` : baseName
  const meta = catalog.get(name.toLowerCase()) || catalog.get(baseName.toLowerCase()) || null
  return {
    fileName: basename(filePath),
    name,
    content,
    colored: isColoredSvg(content),
    keywords: meta?.keywords || '',
    label: meta?.label || '',
    group: meta?.group || ''
  }
})

const library = await compileSvgsToWebfont({
  svgItems,
  fontName: config.fontName,
  prefix: config.prefix,
  registerRuntime: false
})

const outDir = join(ROOT, 'public', 'library')
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const svgOut = join(outDir, 'svg')
mkdirSync(svgOut, { recursive: true })

const { artifacts, fontName } = library
const files = {
  woff2: writeBinary(join(outDir, `${fontName}.woff2`), artifacts.woff2Buffer),
  woff: writeBinary(join(outDir, `${fontName}.woff`), artifacts.woffBytes),
  ttf: writeBinary(join(outDir, `${fontName}.ttf`), artifacts.ttfBuffer)
}

if (artifacts.cssContent) {
  writeFileSync(join(outDir, `${fontName}.css`), artifacts.cssContent)
}
if (artifacts.catalogJson) {
  writeFileSync(join(outDir, 'catalog.json'), artifacts.catalogJson)
}

for (const icon of library.icons) {
  if (icon.svg) writeFileSync(join(svgOut, `${icon.name}.svg`), icon.svg)
}

const manifest = {
  meta: {
    title: config.title,
    name: fontName,
    prefix: library.prefix,
    fontFile: files.ttf ? `${fontName}.ttf` : '',
    cssFile: artifacts.cssContent ? `${fontName}.css` : '',
    catalogFile: 'catalog.json',
    hasCatalog: catalog.size > 0,
    builtAt: new Date().toISOString()
  },
  sourceType: 'selfhost',
  fontName,
  prefix: library.prefix,
  monoCount: library.monoCount,
  coloredCount: library.coloredCount,
  icons: library.icons.map((icon) => ({
    name: icon.name,
    icon: icon.icon,
    keywords: icon.keywords || '',
    label: icon.label || '',
    group: icon.group || '',
    unicode: icon.unicode ?? null,
    char: icon.char || '',
    svg: icon.svg || '',
    colored: Boolean(icon.colored)
  }))
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest))
copyLogo(config.logo)

const catalogNote = catalog.size > 0 ? 'with catalog.json' : 'without catalog.json (names only)'
console.log(
  `Built ${library.icons.length} icons (${library.monoCount} mono, ${library.coloredCount} color) ${catalogNote} → public/library/`
)
