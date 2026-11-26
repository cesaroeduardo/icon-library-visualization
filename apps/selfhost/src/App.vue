<script setup>
import { computed, onMounted, ref } from 'vue'
import { FlaskConical, Languages, Library, Loader2, Moon, Sun, Upload } from 'lucide-vue-next'
import IconGallery from '@studio/components/IconGallery.vue'
import SvgUpload from '@studio/components/SvgUpload.vue'
import WebfontUpload from '@studio/components/WebfontUpload.vue'
import { useI18n } from './i18n'
import { isDark, toggleTheme } from './theme'
import { loadUserLibraryCache, saveUserLibraryCache } from '@studio/userLibraryCache.js'

const { lang, toggleLang } = useI18n()

const BASE = import.meta.env.BASE_URL
const title = import.meta.env.VITE_SELFHOST_TITLE || 'Icons'
const allowUpload = import.meta.env.VITE_SELFHOST_ALLOW_UPLOAD !== false
const logoUrl = `${BASE}brand/logo.svg`

const view = ref('gallery')
const mode = ref('built')
const builtLibrary = ref(null)
const sandboxLibrary = ref(null)
const savedRawSvgs = ref([])
const pendingWebfontFiles = ref([])
const loading = ref(true)
const loadError = ref('')
const logoSvg = ref('')

const isPt = computed(() => lang.value === 'pt')
const activeLibrary = computed(() =>
  mode.value === 'sandbox' ? sandboxLibrary.value : builtLibrary.value
)

async function fetchBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) return null
  return res.arrayBuffer()
}

async function registerFont(library, ttfBuffer) {
  if (!ttfBuffer || typeof FontFace === 'undefined') return
  try {
    const face = new FontFace(library.fontName, ttfBuffer)
    await face.load()
    document.fonts.add(face)
    library.runtimeFamily = library.fontName
  } catch (e) {
    console.warn('Failed to register webfont:', e)
    library.runtimeFamily = ''
  }
}

async function loadBuilt() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetch(`${BASE}library/manifest.json`)
    if (!res.ok) throw new Error(`manifest HTTP ${res.status}`)
    const data = await res.json()
    const fontName = data.fontName || 'icons'
    const cssFile = data.meta?.cssFile
    const fontFile = data.meta?.fontFile
    const [cssContent, catalogJson, ttfBuffer, woffBuffer, woff2Buffer] = await Promise.all([
      cssFile
        ? fetch(`${BASE}library/${cssFile}`).then((r) => (r.ok ? r.text() : ''))
        : Promise.resolve(''),
      fetch(`${BASE}library/catalog.json`).then((r) => (r.ok ? r.text() : '')),
      fontFile ? fetchBuffer(`${BASE}library/${fontFile}`) : Promise.resolve(null),
      fetchBuffer(`${BASE}library/${fontName}.woff`),
      fetchBuffer(`${BASE}library/${fontName}.woff2`)
    ])

    const library = {
      sourceType: 'selfhost',
      fontName,
      runtimeFamily: '',
      prefix: data.prefix || 'ic',
      icons: data.icons || [],
      monoCount: data.monoCount || 0,
      coloredCount: data.coloredCount || 0,
      artifacts: {
        cssContent: cssContent || null,
        catalogJson: catalogJson || null,
        ttfBuffer,
        woffBytes: woffBuffer,
        woff2Buffer
      }
    }
    await registerFont(library, ttfBuffer)
    builtLibrary.value = library
  } catch (e) {
    loadError.value = String(e.message || e)
  } finally {
    loading.value = false
  }
}

async function persistSandbox(library, rawSvgs = []) {
  sandboxLibrary.value = library
  savedRawSvgs.value = rawSvgs
  mode.value = 'sandbox'
  view.value = 'gallery'
  try {
    await saveUserLibraryCache({ library, rawSvgs })
  } catch (e) {
    console.warn('Failed to persist sandbox library:', e)
  }
}

function showBuilt() {
  mode.value = 'built'
  view.value = 'gallery'
  pendingWebfontFiles.value = []
}

function openSandboxPicker() {
  view.value = 'pick'
}

async function handleWebfontLoaded(library) {
  pendingWebfontFiles.value = []
  await persistSandbox(library, [])
}

async function handleSvgsBuilt({ library, rawSvgs }) {
  await persistSandbox(library, rawSvgs)
}

async function loadLogo() {
  try {
    const res = await fetch(logoUrl)
    if (!res.ok) return
    const text = await res.text()
    if (text.includes('<svg')) logoSvg.value = text
  } catch {
    logoSvg.value = ''
  }
}

onMounted(async () => {
  await loadLogo()
  const cached = await loadUserLibraryCache()
  if (cached?.library) {
    sandboxLibrary.value = cached.library
    savedRawSvgs.value = cached.rawSvgs || []
  }
  await loadBuilt()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="sticky top-0 z-30 h-14 w-full backdrop-blur-md px-4 md:px-8 flex items-center justify-center"
      style="background-color: color-mix(in srgb, var(--background) 85%, transparent); border-bottom: 1px solid var(--border);"
    >
      <div class="max-w-[1472px] w-full flex items-center justify-between gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
          @click="showBuilt"
        >
          <span
            v-if="logoSvg"
            class="brand-logo inline-flex items-center h-7 max-w-[200px] [&_svg]:h-7 [&_svg]:w-auto"
            style="color: var(--foreground);"
            role="img"
            :aria-label="title"
            v-html="logoSvg"
          ></span>
          <span v-else class="text-sm font-semibold tracking-[-0.02em] truncate">{{ title }}</span>
        </button>

        <div class="flex items-center gap-1.5">
          <button
            v-if="allowUpload"
            type="button"
            class="tuff-btn-primary !h-8 text-xs"
            @click="openSandboxPicker"
          >
            <Upload class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ isPt ? 'Experimentar upload' : 'Try upload' }}</span>
          </button>

          <button
            type="button"
            class="tuff-btn-quiet"
            :title="isPt ? 'Switch to English' : 'Mudar para Português'"
            @click="toggleLang"
          >
            <Languages class="w-3.5 h-3.5" />
            <span class="font-mono text-xs">{{ isPt ? 'PT' : 'EN' }}</span>
          </button>

          <button type="button" class="tuff-btn-quiet !w-8 !px-0" aria-label="Toggle theme" @click="toggleTheme">
            <Sun v-if="isDark" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full">
      <section
        v-if="view === 'pick'"
        class="w-full max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-6"
      >
        <button type="button" class="tuff-btn-quiet" @click="showBuilt">
          <Library class="w-3.5 h-3.5" />
          <span>{{ isPt ? 'Voltar à biblioteca' : 'Back to library' }}</span>
        </button>

        <div>
          <h1 class="text-2xl md:text-3xl font-semibold tracking-[-0.03em] mb-1.5">
            {{ isPt ? 'Experimentar no navegador' : 'Try it in the browser' }}
          </h1>
          <p class="text-sm" style="color: var(--muted-foreground);">
            {{
              isPt
                ? 'O upload fica só neste navegador. Ele não altera a pasta icons/ — pra publicar um ícone novo, coloque o SVG lá e rode o build de novo.'
                : 'Uploads stay in this browser only. They do not change the icons/ folder — to publish a new icon, add the SVG there and rebuild.'
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button type="button" class="tuff-shell text-left" @click="view = 'svg'">
            <div class="tuff-panel p-5 space-y-2">
              <Upload class="w-5 h-5" />
              <h2 class="text-base font-semibold tracking-[-0.02em]">
                {{ isPt ? 'SVGs' : 'SVGs' }}
              </h2>
              <p class="text-xs" style="color: var(--muted-foreground);">
                {{ isPt ? 'Compilar SVGs numa webfont de teste.' : 'Compile SVGs into a test webfont.' }}
              </p>
            </div>
          </button>
          <button type="button" class="tuff-shell text-left" @click="view = 'webfont'">
            <div class="tuff-panel p-5 space-y-2">
              <FlaskConical class="w-5 h-5" />
              <h2 class="text-base font-semibold tracking-[-0.02em]">Webfont</h2>
              <p class="text-xs" style="color: var(--muted-foreground);">
                {{ isPt ? 'Inspecionar um .woff, .ttf ou .zip.' : 'Inspect a .woff, .ttf, or .zip.' }}
              </p>
            </div>
          </button>
        </div>
      </section>

      <WebfontUpload
        v-else-if="view === 'webfont'"
        :initial-files="pendingWebfontFiles"
        :auto-build="pendingWebfontFiles.length > 0"
        @back="view = 'pick'"
        @loaded="handleWebfontLoaded"
      />

      <SvgUpload
        v-else-if="view === 'svg'"
        :key="savedRawSvgs.length"
        :initial-svgs="mode === 'sandbox' ? savedRawSvgs : []"
        @back="view = 'pick'"
        @built="handleSvgsBuilt"
      />

      <div
        v-else-if="loading && !activeLibrary"
        class="w-full py-24 flex items-center justify-center gap-2 text-sm"
        style="color: var(--muted-foreground);"
      >
        <Loader2 class="w-4 h-4 animate-spin" />
        <span>{{ isPt ? 'Carregando biblioteca...' : 'Loading library...' }}</span>
      </div>

      <div v-else-if="loadError && !activeLibrary" class="w-full max-w-xl mx-auto px-4 py-16 text-sm">
        <p class="font-medium mb-1">{{ isPt ? 'Não achei a biblioteca buildada.' : 'Built library not found.' }}</p>
        <p style="color: var(--muted-foreground);">
          {{
            isPt
              ? 'Rode o build com SVGs em icons/. O catalog.json nessa pasta é opcional.'
              : 'Run the build with SVGs in icons/. catalog.json in that folder is optional.'
          }}
        </p>
      </div>

      <template v-else-if="activeLibrary">
        <div
          v-if="mode === 'sandbox'"
          class="w-full px-4 md:px-8 pt-4 flex justify-center"
        >
          <div
            class="max-w-[1472px] w-full tuff-inset px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
            style="color: var(--muted-foreground);"
          >
            <span class="inline-flex items-center gap-1.5">
              <FlaskConical class="w-3.5 h-3.5" />
              {{
                isPt
                  ? 'Sandbox local — não entra no deploy. A fonte da verdade continua sendo icons/.'
                  : 'Local sandbox — not part of the deploy. icons/ is still the source of truth.'
              }}
            </span>
            <button type="button" class="tuff-btn-quiet !h-7 text-xs" @click="showBuilt">
              <Library class="w-3.5 h-3.5" />
              <span>{{ isPt ? 'Ver biblioteca publicada' : 'View published library' }}</span>
            </button>
          </div>
        </div>

        <div
          v-else-if="allowUpload && sandboxLibrary"
          class="w-full px-4 md:px-8 pt-4 flex justify-center"
        >
          <div class="max-w-[1472px] w-full flex justify-end">
            <button type="button" class="tuff-btn-quiet !h-7 text-xs" @click="mode = 'sandbox'">
              <FlaskConical class="w-3.5 h-3.5" />
              <span>{{ isPt ? 'Voltar ao sandbox' : 'Back to sandbox' }}</span>
            </button>
          </div>
        </div>

        <IconGallery
          :library="activeLibrary"
          @edit-svgs="view = 'svg'"
          @back="showBuilt"
        />
      </template>
    </main>
  </div>
</template>
