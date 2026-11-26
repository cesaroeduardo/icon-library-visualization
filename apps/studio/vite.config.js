import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/studio/',
  plugins: [vue()],
  build: {
    outDir: 'dist/studio',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true
  },
  optimizeDeps: {
    include: ['opentype.js', 'jszip', 'svgpath']
  }
})
