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

async function fetchPhosphorStyles() {
  const url = 'https://raw.githubusercontent.com/iconify/icon-sets/master/json/ph.json'
  console.log(`Fetching Phosphor Icons (all 6 styles) from ${url}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const defaultW = data.width || 256
  const defaultH = data.height || 256
  const allEntries = Object.entries(data.icons || {})

  // Pick 300 base icon names from regular (no style suffix)
  const baseNames = allEntries
    .map(([name]) => name)
    .filter((name) => !/-(thin|light|bold|fill|duotone)$/.test(name))
    .slice(0, 300)

  const styles = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone']

  for (const style of styles) {
    const icons = []
    for (const base of baseNames) {
      const key = style === 'regular' ? base : `${base}-${style}`
      const iconData = data.icons[key]
      if (!iconData) continue
      const w = iconData.width || defaultW
      const h = iconData.height || defaultH
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="24" height="24">${iconData.body}</svg>`
      icons.push({
        name: base,
        icon: `ph ph-${key}`,
        keywords: base.replace(/[-_]/g, ' '),
        svg
      })
    }

    const payload = {
      meta: {
        id: 'phosphor',
        style,
        name: 'Phosphor Icons',
        url: 'https://phosphoricons.com/',
        license: 'MIT',
        prefix: 'ph',
        count: icons.length
      },
      icons
    }

    const bytes = writeToTargets(`phosphor-${style}.json`, payload)
    if (style === 'regular') {
      writeToTargets('phosphor.json', payload)
    }
    console.log(`✔ Phosphor (${style}): ${icons.length} icons (${(bytes / 1024).toFixed(1)} KB)`)
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

await fetchPhosphorStyles()

await fetchSimpleSet({
  id: 'feather',
  iconifyPrefix: 'feather',
  name: 'Feather Icons',
  url: 'https://feathericons.com/',
  license: 'MIT',
  prefix: 'fe',
  maxIcons: 300
})

await fetchSimpleSet({
  id: 'pixelarticons',
  iconifyPrefix: 'pixelarticons',
  name: 'Pixelarticons',
  url: 'https://pixelarticons.com/',
  license: 'MIT',
  prefix: 'px',
  maxIcons: 480
})

await fetchSimpleSet({
  id: 'hugeicons',
  iconifyPrefix: 'hugeicons',
  name: 'Hugeicons',
  url: 'https://hugeicons.com/',
  license: 'MIT',
  prefix: 'hi',
  maxIcons: 360
})
