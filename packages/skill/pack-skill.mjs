import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..', '..')
const SKILL_DIR = join(HERE, 'create-icons')

const TARGET_PUBLIC_DIRS = [
  join(ROOT, 'apps', 'studio', 'public'),
  join(ROOT, 'apps', 'web', 'public')
]

function addFolderToZip(zip, folderPath, basePath) {
  const entries = readdirSync(folderPath)
  for (const entry of entries) {
    if (entry === '.git' || entry === 'node_modules' || entry === '__pycache__') continue
    const fullPath = join(folderPath, entry)
    const relPath = relative(basePath, fullPath).replace(/\\/g, '/')
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      addFolderToZip(zip, fullPath, basePath)
    } else {
      zip.file(relPath, readFileSync(fullPath))
    }
  }
}

async function main() {
  if (!existsSync(SKILL_DIR)) {
    console.error(`Skill directory not found: ${SKILL_DIR}`)
    process.exit(1)
  }

  const zip = new JSZip()
  const rootFolder = zip.folder('create-icons')
  addFolderToZip(rootFolder, SKILL_DIR, SKILL_DIR)

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  })

  const styleGallerySrc = join(SKILL_DIR, 'assets', 'style-gallery.html')

  for (const pubDir of TARGET_PUBLIC_DIRS) {
    const outSkillsDir = join(pubDir, 'skills')
    mkdirSync(outSkillsDir, { recursive: true })
    const outZip = join(outSkillsDir, 'create-icons.zip')
    writeFileSync(outZip, buffer)
    console.log(`✔ Packed skill -> ${relative(ROOT, outZip)} (${(buffer.length / 1024).toFixed(1)} KB)`)

    if (existsSync(styleGallerySrc)) {
      copyFileSync(styleGallerySrc, join(pubDir, 'style-gallery.html'))
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
