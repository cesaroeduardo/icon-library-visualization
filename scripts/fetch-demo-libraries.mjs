import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(process.cwd())
const TARGETS = [
  join(ROOT, 'apps', 'web', 'public', 'demo', 'libraries'),
  join(ROOT, 'apps', 'studio', 'public', 'demo', 'libraries')
]

const SETS = [
  {
    id: 'phosphor',
    iconifyPrefix: 'ph',
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com/',
    license: 'MIT',
    prefix: 'ph',
    maxIcons: 360,
    // Keep regular icons (exclude -bold, -duotone, -fill, -light, -thin variants so the showcase is diverse)
    filter: (name) => !/-(bold|duotone|fill|light|thin)$/.test(name)
  },
  {
    id: 'feather',
    iconifyPrefix: 'feather',
    name: 'Feather Icons',
    url: 'https://feathericons.com/',
    license: 'MIT',
    prefix: 'fe',
    maxIcons: 300,
    filter: () => true
  },
  {
    id: 'pixelarticons',
    iconifyPrefix: 'pixelarticons',
    name: 'Pixelarticons (Free)',
    url: 'https://pixelarticons.com/',
    license: 'MIT',
    prefix: 'px',
    maxIcons: 480,
    filter: () => true
  },
  {
    id: 'hugeicons',
    iconifyPrefix: 'hugeicons',
    name: 'Hugeicons (Free)',
    url: 'https://hugeicons.com/',
    license: 'MIT (Free)',
    prefix: 'hi',
    maxIcons: 360,
    filter: () => true
  }
]

for (const dir of TARGETS) {
  mkdirSync(dir, { recursive: true })
}

async function fetchSet(cfg) {
  const url = `https://raw.githubusercontent.com/iconify/icon-sets/master/json/${cfg.iconifyPrefix}.json`
  console.log(`Fetching ${cfg.name} from ${url}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const data = await res.json()

  const defaultW = data.width || 24
  const defaultH = data.height || 24
  const allEntries = Object.entries(data.icons || {}).filter(([name]) => cfg.filter(name))
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
      count: icons.length,
      totalInPack: allEntries.length
    },
    icons
  }

  const json = JSON.stringify(payload)
  for (const dir of TARGETS) {
    writeFileSync(join(dir, `${cfg.id}.json`), json)
  }
  console.log(`✔ ${cfg.name}: ${icons.length} icons (${(json.length / 1024).toFixed(1)} KB)`)
}

for (const cfg of SETS) {
  await fetchSet(cfg)
}
