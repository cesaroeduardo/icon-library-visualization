import { execSync } from 'node:child_process'
import { rmSync, mkdirSync, cpSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(process.cwd())
const DIST_ROOT = resolve(ROOT, 'dist')

function run(cmd, cwd = ROOT) {
  console.log(`\n▶ ${cmd} (${cwd})`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

// 1. Pack AI skill into apps/studio/public and apps/web/public
run('node packages/skill/pack-skill.mjs')

const viteBin = process.platform === 'win32' ? 'node_modules\\.bin\\vite.cmd' : 'node_modules/.bin/vite'

// 2. Build Landing Page (apps/web)
run(`"${resolve(ROOT, 'apps/web', viteBin)}" build`, resolve(ROOT, 'apps/web'))

// 3. Build Icon Library Studio (apps/studio)
run(`"${resolve(ROOT, 'apps/studio', viteBin)}" build`, resolve(ROOT, 'apps/studio'))

// 4. Assemble unified static output in /dist and /dist/studio
rmSync(DIST_ROOT, { recursive: true, force: true })
mkdirSync(DIST_ROOT, { recursive: true })
cpSync(resolve(ROOT, 'apps/web/dist'), DIST_ROOT, { recursive: true })
cpSync(resolve(ROOT, 'apps/studio/dist'), resolve(DIST_ROOT, 'studio'), { recursive: true })

console.log('\n✅ Monorepo build complete!')
console.log('   dist/        -> apps/web (Open Source Landing Page)')
console.log('   dist/studio/ -> apps/studio (Icon Library Studio)')
