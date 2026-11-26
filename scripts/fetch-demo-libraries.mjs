import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(process.cwd())
const TARGETS = [
  join(ROOT, 'apps', 'web', 'public', 'demo', 'libraries'),
  join(ROOT, 'apps', 'studio', 'public', 'demo', 'libraries')
]

for (const dir of TARGETS) {
  mkdirSync(dir, { recursive: true })
}

function writeToTargets(fileName, payload) {
  const json = JSON.stringify(payload)
  for (const dir of TARGETS) {
    writeFileSync(join(dir, fileName), json)
  }
  return json.length
}

async function fetchMultiStyleSet({
  id,
  iconifyPrefix,
  name,
  url,
  license,
  prefix,
  styles,
  defaultStyle,
  maxIcons = 300,
  getKey,
  getBaseNames
}) {
  const srcUrl = `https://raw.githubusercontent.com/iconify/icon-sets/master/json/${iconifyPrefix}.json`
  console.log(`Fetching ${name} (${styles.join(', ')}) from ${srcUrl}...`)
  const res = await fetch(srcUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${srcUrl}`)
  const data = await res.json()
  const defaultW = data.width || 24
  const defaultH = data.height || 24
  const iconMap = data.icons || {}

  const baseNames = getBaseNames(iconMap).slice(0, maxIcons)

  for (const style of styles) {
    const icons = []
    for (const base of baseNames) {
      const key = getKey(base, style)
      const iconData = iconMap[key]
      if (!iconData) continue
      const w = iconData.width || defaultW
      const h = iconData.height || defaultH
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="24" height="24">${iconData.body}</svg>`
      icons.push({
        name: base,
        icon: `${prefix} ${prefix}-${key}`,
        keywords: base.replace(/[-_]/g, ' '),
        svg
      })
    }

    const payload = {
      meta: {
        id,
        style,
        name,
        url,
        license,
        prefix,
        count: icons.length
      },
      icons
    }

    const bytes = writeToTargets(`${id}-${style}.json`, payload)
    if (style === defaultStyle) {
      writeToTargets(`${id}.json`, payload)
    }
    console.log(`✔ ${name} (${style}): ${icons.length} icons (${(bytes / 1024).toFixed(1)} KB)`)
  }
}

async function fetchSimpleSet(cfg) {
  const url = `https://raw.githubusercontent.com/iconify/icon-sets/master/json/${cfg.iconifyPrefix}.json`
  console.log(`Fetching ${cfg.name} from ${url}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const data = await res.json()

  const defaultW = data.width || 24
  const defaultH = data.height || 24
  const allEntries = Object.entries(data.icons || {})
  const selected = allEntries.slice(0, cfg.maxIcons)

  const icons = selected.map(([name, iconData]) => {
    const w = iconData.width || defaultW
    const h = iconData.height || defaultH
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="24" height="24">${iconData.body}</svg>`
    return {
      name,
      icon: `${cfg.prefix} ${name}`,
      keywords: name.replace(/[-_]/g, ' '),
      svg
    }
  })

  const payload = {
    meta: {
      id: cfg.id,
      name: cfg.name,
      url: cfg.url,
      license: cfg.license,
      prefix: cfg.prefix,
      count: icons.length
    },
    icons
  }

  const bytes = writeToTargets(`${cfg.id}.json`, payload)
  console.log(`✔ ${cfg.name}: ${icons.length} icons (${(bytes / 1024).toFixed(1)} KB)`)
}

// 1. Phosphor Icons (6 official styles)
await fetchMultiStyleSet({
  id: 'phosphor',
  iconifyPrefix: 'ph',
  name: 'Phosphor Icons',
  url: 'https://phosphoricons.com/',
  license: 'MIT',
  prefix: 'ph',
  styles: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
  defaultStyle: 'regular',
  maxIcons: 300,
  getKey: (base, style) => (style === 'regular' ? base : `${base}-${style}`),
  getBaseNames: (iconMap) =>
    Object.keys(iconMap).filter((n) => !/-(thin|light|bold|fill|duotone)$/.test(n))
})

// 2. Solar Icons (6 official styles)
await fetchMultiStyleSet({
  id: 'solar',
  iconifyPrefix: 'solar',
  name: 'Solar Icons',
  url: 'https://github.com/480design/Solar-Icon-Set',
  license: 'CC BY 4.0',
  prefix: 'solar',
  styles: ['linear', 'outline', 'bold', 'bold-duotone', 'broken', 'line-duotone'],
  defaultStyle: 'linear',
  maxIcons: 300,
  getKey: (base, style) => `${base}-${style}`,
  getBaseNames: (iconMap) => {
    const keys = Object.keys(iconMap)
    const bases = new Set()
    for (const k of keys) {
      if (k.endsWith('-linear')) {
        const base = k.slice(0, -'-linear'.length)
        if (
          iconMap[`${base}-outline`] &&
          iconMap[`${base}-bold`] &&
          iconMap[`${base}-bold-duotone`] &&
          iconMap[`${base}-broken`] &&
          iconMap[`${base}-line-duotone`]
        ) {
          bases.add(base)
        }
      }
    }
    return [...bases]
  }
})

// 3. Tabler Icons (2 official styles: outline, filled)
await fetchMultiStyleSet({
  id: 'tabler',
  iconifyPrefix: 'tabler',
  name: 'Tabler Icons',
  url: 'https://tabler.io/icons',
  license: 'MIT',
  prefix: 'ti',
  styles: ['outline', 'filled'],
  defaultStyle: 'outline',
  maxIcons: 300,
  getKey: (base, style) => (style === 'outline' ? base : `${base}-filled`),
  getBaseNames: (iconMap) =>
    Object.keys(iconMap).filter(
      (n) => !n.endsWith('-filled') && Boolean(iconMap[`${n}-filled`])
    )
})

// 4. Remix Icon (2 official styles: line, fill)
await fetchMultiStyleSet({
  id: 'remix',
  iconifyPrefix: 'ri',
  name: 'Remix Icon',
  url: 'https://remixicon.com/',
  license: 'Apache 2.0',
  prefix: 'ri',
  styles: ['line', 'fill'],
  defaultStyle: 'line',
  maxIcons: 300,
  getKey: (base, style) => `${base}-${style}`,
  getBaseNames: (iconMap) =>
    Object.keys(iconMap)
      .filter((n) => n.endsWith('-line'))
      .map((n) => n.slice(0, -'-line'.length))
      .filter((base) => Boolean(iconMap[`${base}-fill`]))
})

// 5. Lucide Icons (single official outline style)
await fetchSimpleSet({
  id: 'lucide',
  iconifyPrefix: 'lucide',
  name: 'Lucide Icons',
  url: 'https://lucide.dev/',
  license: 'ISC',
  prefix: 'lucide',
  maxIcons: 360
})

// 6. Feather Icons (single official outline style)
await fetchSimpleSet({
  id: 'feather',
  iconifyPrefix: 'feather',
  name: 'Feather Icons',
  url: 'https://feathericons.com/',
  license: 'MIT',
  prefix: 'fe',
  maxIcons: 300
})

// 7. Hugeicons (single official free Stroke Rounded style)
await fetchSimpleSet({
  id: 'hugeicons',
  iconifyPrefix: 'hugeicons',
  name: 'Hugeicons',
  url: 'https://hugeicons.com/',
  license: 'MIT',
  prefix: 'hi',
  maxIcons: 360
})

// 8. Pixelarticons (single official pixel style)
await fetchSimpleSet({
  id: 'pixelarticons',
  iconifyPrefix: 'pixelarticons',
  name: 'Pixelarticons',
  url: 'https://pixelarticons.com/',
  license: 'MIT',
  prefix: 'px',
  maxIcons: 480
})
