import { generateFonts } from 'fantasticon'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import configs from '../fantasticon.config.js'

const LOG_DIR = 'tmp/log'

mkdirSync(LOG_DIR, { recursive: true });

const woff2Generate = async function () {
  async function generateWithLog(config) {
    console.log(`Generating ${config.name} from ${config.inputDir}...`)
    const result = await generateFonts(config);
    console.log(`  ✔ ${config.name}.woff2 written to ${config.outputDir}`)
    return result
  }

  for (const config of configs) {
    const result = await generateWithLog(config)
    const logPath = join(LOG_DIR, `${config.name}.result.json`)
    writeFileSync(logPath, JSON.stringify(result, null, 2))
    console.log(`  📄 result logged to ${logPath}`)
  }
}

woff2Generate()
