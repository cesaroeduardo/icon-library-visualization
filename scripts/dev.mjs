import { spawn } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWin = process.platform === 'win32'
const npm = isWin ? 'npm.cmd' : 'npm'

const children = []

function run(name, args, cwd) {
  const child = spawn(npm, args, {
    cwd,
    stdio: 'inherit',
    shell: isWin,
    env: process.env
  })
  child.on('exit', (code, signal) => {
    if (signal) return
    if (code && code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`)
      shutdown(code)
    }
  })
  children.push(child)
  return child
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

run('web', ['run', 'dev'], resolve(ROOT, 'apps/web'))
run('studio', ['run', 'dev'], resolve(ROOT, 'apps/studio'))

console.log('[dev] web → http://localhost:5173/')
console.log('[dev] studio → http://localhost:5174/studio/ (also via http://localhost:5173/studio/)')
