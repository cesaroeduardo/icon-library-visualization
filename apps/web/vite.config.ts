import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      // Forward /studio to the Vue studio app (npm run dev starts both)
      '/studio': {
        target: 'http://127.0.0.1:5174',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ['opentype.js', 'jszip', 'svgpath']
  }
})
