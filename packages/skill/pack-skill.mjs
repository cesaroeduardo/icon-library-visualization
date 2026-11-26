import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..', '..')
const SKILLS_ROOT = join(ROOT, 'skills')
const SKILL_NAMES = ['create-icons', 'catalog-icons']

const TARGET_PUBLIC_DIRS = [
  join(ROOT, 'apps', 'web', 'public'),
  join(ROOT, 'apps', 'studio', 'public')
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

async function packOne(skillName) {
  const skillDir = join(SKILLS_ROOT, skillName)
  if (!existsSync(skillDir)) {
    console.error(`Skill directory not found: ${skillDir}`)
    process.exit(1)
  }

  const zip = new JSZip()
  const rootFolder = zip.folder(skillName)
  addFolderToZip(rootFolder, skillDir, skillDir)

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  })

  for (const pubDir of TARGET_PUBLIC_DIRS) {
    const outSkillsDir = join(pubDir, 'skills')
    mkdirSync(outSkillsDir, { recursive: true })
    const outZip = join(outSkillsDir, `${skillName}.zip`)
    writeFileSync(outZip, buffer)
    console.log(`✔ Packed ${skillName} -> ${relative(ROOT, outZip)} (${(buffer.length / 1024).toFixed(1)} KB)`)
  }
}

async function main() {
  for (const name of SKILL_NAMES) {
    await packOne(name)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
