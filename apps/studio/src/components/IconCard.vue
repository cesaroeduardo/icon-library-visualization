<script setup>
import { ref } from 'vue'
import { Code2, Copy, Download, Check } from 'lucide-vue-next'
import { prepareSvg } from '@icon-library/core'
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
  fontFamily: { type: String, default: '' },
  strokeWidth: { type: Number, default: null }
})

const showCheckIcon = ref(false)
const showImageCheckIcon = ref(false)

function bakedSvg(dimension) {
  return prepareSvg(props.svg, {
    color: props.color,
    dimension,
    colored: props.colored,
    strokeWidth: props.strokeWidth == null ? undefined : props.strokeWidth
  })
}

function renderGlyphToPngBlob(dimension) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = dimension
    canvas.height = dimension
    const ctx = canvas.getContext('2d')
    if (props.svg) {
      const svg = bakedSvg(dimension)
      const img = new Image()
      // data: URI is more reliable than blob: for SVG→canvas in Chromium
      const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
      img.onload = () => {
        ctx.drawImage(img, 0, 0, dimension, dimension)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('PNG encode failed'))
        }, 'image/png')
      }
      img.onerror = (e) => reject(e)
      img.src = url
    } else if (props.char && props.fontFamily) {
      ctx.fillStyle = props.color
      ctx.font = `${Math.round(dimension * 0.85)}px "${props.fontFamily}"`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(props.char, dimension / 2, dimension / 2)
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('PNG encode failed'))
      }, 'image/png')
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

/** Figma pastes SVG from text/plain; keep that as the primary representation. */
async function copySvgMarkup(svg) {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([svg], { type: 'text/plain' })
        })
      ])
      return
    }
  } catch {
    // fall through to writeText
  }
  await copyToClipboard(svg)
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
      await copySvgMarkup(bakedSvg(props.size))
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
      blob = new Blob([bakedSvg(props.size)], { type: 'image/svg+xml;charset=utf-8' })
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
  <li class="tuff-icon-card group relative rounded-2xl overflow-hidden transition-colors">
    <div class="relative min-h-36">
      <p
        class="absolute z-10 top-3 left-3.5 right-3.5 truncate text-[11px] font-mono"
        style="color: var(--muted-foreground);"
        :title="name"
      >
        {{ name }}
      </p>

      <div class="absolute inset-0 flex items-center justify-center p-4 pt-8">
        <slot></slot>
      </div>

      <!-- Hover Action Pill Bar: Copy Code, Copy Image, Download SVG/PNG -->
      <div
        class="absolute bottom-2 right-2 flex items-center gap-0.5 p-1 rounded-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150"
        style="background-color: var(--surface-raised);"
      >
        <button
          :title="t.gallery.copyCode"
          @click="copyCode"
          class="tuff-card-action h-7 w-7 rounded-full inline-flex items-center justify-center transition-colors"
        >
          <Check v-if="showCheckIcon" class="w-3.5 h-3.5" style="color: var(--positive);" />
          <Code2 v-else class="w-3.5 h-3.5" />
        </button>
        <button
          :title="`${t.gallery.copyImage} (${downloadFormat.toUpperCase()})`"
          @click="copyImage"
          class="tuff-card-action h-7 w-7 rounded-full inline-flex items-center justify-center transition-colors"
        >
          <Check v-if="showImageCheckIcon" class="w-3.5 h-3.5" style="color: var(--positive);" />
          <Copy v-else class="w-3.5 h-3.5" />
        </button>
        <button
          :title="`${t.gallery.downloadIcon} (${downloadFormat.toUpperCase()})`"
          @click="downloadIcon"
          class="tuff-card-action h-7 w-7 rounded-full inline-flex items-center justify-center transition-colors"
        >
          <Download class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.tuff-icon-card {
  background-color: var(--surface);
}
.tuff-icon-card:hover {
  background-color: var(--surface-raised);
}
.tuff-card-action {
  color: var(--muted-foreground);
}
.tuff-card-action:hover {
  background-color: var(--fg-tint-8);
  color: var(--foreground);
}
</style>
