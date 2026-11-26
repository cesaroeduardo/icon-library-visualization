<script setup>
import { ref } from 'vue'
import { Code2, Copy, Download, Check } from 'lucide-vue-next'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const props = defineProps({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  keywords: { type: String, default: '' },
  color: { type: String, required: true },
  size: { type: Number, required: true },
  downloadFormat: { type: String, required: true },
  svg: { type: String, default: '' },
  colored: { type: Boolean, default: false },
  char: { type: String, default: '' },
  fontFamily: { type: String, default: '' }
})

const showCheckIcon = ref(false)
const showImageCheckIcon = ref(false)

function prepareSvg(svgString, color, dimension) {
  let svg = svgString
  if (!props.colored) {
    svg = svg.replace(/fill="currentColor"/gi, `fill="${color}"`)
    svg = svg.replace(/stroke="currentColor"/gi, `stroke="${color}"`)
    if (!/fill="/i.test(svg)) {
      svg = svg.replace('<svg', `<svg fill="${color}"`)
    }
  }
  if (!svg.includes('viewBox')) {
    const origW = (svg.match(/width="([^"]*)"/) || [])[1] || '24'
    const origH = (svg.match(/height="([^"]*)"/) || [])[1] || '24'
    svg = svg.replace('<svg', `<svg viewBox="0 0 ${origW} ${origH}"`)
  }
  svg = svg.replace(/\s*(width|height)="[^"]*"/g, '')
  svg = svg.replace('<svg', `<svg width="${dimension}" height="${dimension}"`)
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
  return svg
}

function renderGlyphToPngBlob(dimension) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = dimension
    canvas.height = dimension
    const ctx = canvas.getContext('2d')
    if (props.svg) {
      const svg = prepareSvg(props.svg, props.color, dimension)
      const img = new Image()
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(svgBlob)
      img.onload = () => {
        ctx.drawImage(img, 0, 0, dimension, dimension)
        URL.revokeObjectURL(url)
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      }
      img.onerror = (e) => {
        URL.revokeObjectURL(url)
        reject(e)
      }
      img.src = url
    } else if (props.char && props.fontFamily) {
      ctx.fillStyle = props.color
      ctx.font = `${Math.round(dimension * 0.85)}px "${props.fontFamily}"`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(props.char, dimension / 2, dimension / 2)
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    } else {
      reject(new Error('No renderable SVG or glyph'))
    }
  })
}

async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text)
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

async function copyCode() {
  try {
    await copyToClipboard(`<i class="${props.icon}"></i>`)
    showCheckIcon.value = true
    setTimeout(() => (showCheckIcon.value = false), 1200)
  } catch (e) {
    console.error('Failed to copy code:', e)
  }
}

async function copyImage() {
  try {
    if (props.downloadFormat === 'svg' && props.svg) {
      const svg = prepareSvg(props.svg, props.color, props.size)
      await copyToClipboard(svg)
    } else {
      const blob = await renderGlyphToPngBlob(Math.max(props.size, 32))
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      } else {
        const reader = new FileReader()
        reader.onloadend = () => copyToClipboard(reader.result)
        reader.readAsDataURL(blob)
      }
    }
    showImageCheckIcon.value = true
    setTimeout(() => (showImageCheckIcon.value = false), 1200)
  } catch (e) {
    console.error('Failed to copy image:', e)
  }
}

async function downloadIcon() {
  try {
    let blob
    let ext = props.downloadFormat
    if (ext === 'svg' && props.svg) {
      const svg = prepareSvg(props.svg, props.color, props.size)
      blob = new Blob([svg], { type: 'image/svg+xml' })
    } else {
      ext = 'png'
      blob = await renderGlyphToPngBlob(Math.max(props.size, 32))
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.name.toLowerCase()}.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Failed to download icon:', e)
  }
}
</script>

<template>
  <li
    class="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm group hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
  >
    <div class="relative min-h-40">
      <p
        class="absolute z-10 top-3 left-3 right-3 text-neutral-500 dark:text-neutral-400 truncate text-xs font-mono"
        :title="name"
      >
        {{ name }}
      </p>
      <div class="absolute inset-0 flex items-center justify-center p-4 pt-8">
        <slot></slot>
      </div>
      <div
        class="absolute bottom-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-tl-lg"
      >
        <button
          :title="t.gallery.copyCode"
          @click="copyCode"
          class="h-9 w-9 inline-flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
        >
          <Check v-if="showCheckIcon" class="w-4 h-4 text-emerald-500" />
          <Code2 v-else class="w-4 h-4" />
        </button>
        <button
          :title="`${t.gallery.copyImage} (${downloadFormat.toUpperCase()})`"
          @click="copyImage"
          class="h-9 w-9 inline-flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
        >
          <Check v-if="showImageCheckIcon" class="w-4 h-4 text-emerald-500" />
          <Copy v-else class="w-4 h-4" />
        </button>
        <button
          :title="`${t.gallery.downloadIcon} (${downloadFormat.toUpperCase()})`"
          @click="downloadIcon"
          class="h-9 w-9 inline-flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
        >
          <Download class="w-4 h-4" />
        </button>
      </div>
    </div>
  </li>
</template>
