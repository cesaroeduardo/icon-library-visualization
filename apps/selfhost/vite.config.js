import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))
const config = JSON.parse(readFileSync(new URL('./selfhost.config.json', import.meta.url), 'utf8'))

export default defineConfig({
  base: config.base || '/',
  plugins: [
    vue(),
    {
      name: 'selfhost-html',
      transformIndexHtml(html) {
        const title = config.title || 'Icons'
        return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      }
    }
  ],
  define: {
    'import.meta.env.VITE_SELFHOST_TITLE': JSON.stringify(config.title || 'Icons'),
    'import.meta.env.VITE_SELFHOST_FONT': JSON.stringify(config.fontName || 'my-icons'),
    'import.meta.env.VITE_SELFHOST_ALLOW_UPLOAD': JSON.stringify(config.allowUpload !== false)
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@studio': fileURLToPath(new URL('../studio/src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
    fs: {
      allow: [root, fileURLToPath(new URL('..', import.meta.url))]
    }
  },
  optimizeDeps: {
    include: ['opentype.js', 'jszip', 'svgpath']
  }
})
