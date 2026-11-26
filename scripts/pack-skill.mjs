import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import JSZip from 'jszip'

const ROOT = resolve(process.cwd())
const SKILL_DIR = join(ROOT, 'skills', 'create-icons')
const PUBLIC_DIR = join(ROOT, 'public')
const OUT_SKILLS_DIR = join(PUBLIC_DIR, 'skills')
const OUT_ZIP = join(OUT_SKILLS_DIR, 'create-icons.zip')

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

  mkdirSync(OUT_SKILLS_DIR, { recursive: true })

  const zip = new JSZip()
  const rootFolder = zip.folder('create-icons')
  addFolderToZip(rootFolder, SKILL_DIR, SKILL_DIR)

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  })

  writeFileSync(OUT_ZIP, buffer)
  console.log(`✔ Packed skill -> ${relative(ROOT, OUT_ZIP)} (${(buffer.length / 1024).toFixed(1)} KB)`)

  const styleGallerySrc = join(SKILL_DIR, 'assets', 'style-gallery.html')
  if (existsSync(styleGallerySrc)) {
    copyFileSync(styleGallerySrc, join(PUBLIC_DIR, 'style-gallery.html'))
    console.log('✔ Copied style-gallery.html -> public/style-gallery.html')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
