<script setup>
import { ref, onMounted } from 'vue'
import {
  Sun,
  Moon,
  Languages,
  Layers,
  BookOpen,
  FileType,
  FileCode2,
  ArrowLeft,
  Loader2
} from 'lucide-vue-next'
import WebfontUpload from './components/WebfontUpload.vue'
import SvgUpload from './components/SvgUpload.vue'
import IconGallery from './components/IconGallery.vue'
import { isDark, toggleTheme } from './theme'
import { useI18n } from './i18n'
import { parseUploadedWebfont } from '@icon-library/core'

const { lang, t, toggleLang } = useI18n()

const activeView = ref('gallery')
const currentLibrary = ref(null)
const savedRawSvgs = ref([])
const loadingLibrary = ref(true)

async function loadDefaultDemo() {
  loadingLibrary.value = true
  try {
    const [ttfRes, woff2Res] = await Promise.all([
      fetch('./demo/demo-icons.ttf'),
      fetch('./demo/demo-icons.woff2')
    ])
    if (!ttfRes.ok) throw new Error('Failed to load demo font')
    const ttfBuffer = await ttfRes.arrayBuffer()
    const fonts = [{ name: 'demo-icons.ttf', ext: '.ttf', buffer: ttfBuffer }]
    if (woff2Res.ok) {
      fonts.push({ name: 'demo-icons.woff2', ext: '.woff2', buffer: await woff2Res.arrayBuffer() })
    }
    currentLibrary.value = await parseUploadedWebfont({
      fonts,
      cssFiles: [],
      customFontName: 'demo-icons',
      customPrefix: 'ic'
    })
  } catch (e) {
    console.error('Failed to load default library:', e)
  } finally {
    loadingLibrary.value = false
  }
}

function handleWebfontLoaded(library) {
  currentLibrary.value = library
  savedRawSvgs.value = []
  activeView.value = 'gallery'
}

function handleSvgsBuilt({ library, rawSvgs }) {
  currentLibrary.value = library
  savedRawSvgs.value = rawSvgs
  activeView.value = 'gallery'
}

onMounted(async () => {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase()
  if (hash === 'webfont' || hash === 'svg') {
    activeView.value = hash
  }
  await loadDefaultDemo()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- TUFFUI Sticky Header -->
    <header
      class="sticky top-0 z-30 h-14 w-full backdrop-blur-md px-4 md:px-8 flex items-center justify-center"
      style="background-color: color-mix(in srgb, var(--background) 85%, transparent); border-bottom: 1px solid var(--border);"
    >
      <div class="max-w-[1472px] w-full flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <a
            href="../"
            class="tuff-btn-quiet"
            :title="lang === 'pt' ? 'Voltar ao site' : 'Back to site'"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Site' : 'Home' }}</span>
          </a>

          <button
            @click="activeView = 'gallery'"
            class="inline-flex items-center gap-2 text-sm font-semibold tracking-[-0.02em] hover:opacity-85 transition-opacity"
          >
            <span
              class="w-7 h-7 rounded-lg flex items-center justify-center"
              style="background-color: var(--surface-raised);"
            >
              <Layers class="w-3.5 h-3.5" />
            </span>
            <span class="hidden md:inline">{{ t.appName }}</span>
          </button>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            @click="activeView = activeView === 'webfont' ? 'gallery' : 'webfont'"
            class="tuff-btn-quiet"
            :class="activeView === 'webfont' ? 'tuff-btn-quiet-active' : ''"
          >
            <FileType class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ t.cards.webfont.title }}</span>
          </button>

          <button
            @click="activeView = activeView === 'svg' ? 'gallery' : 'svg'"
            class="tuff-btn-quiet"
            :class="activeView === 'svg' ? 'tuff-btn-quiet-active' : ''"
          >
            <FileCode2 class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Compilar SVGs' : 'Compile SVGs' }}</span>
          </button>

          <a href="../#docs" class="tuff-btn-quiet">
            <BookOpen class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ t.docsNav }}</span>
          </a>

          <button
            @click="toggleLang"
            class="tuff-btn-quiet"
            :title="lang === 'pt' ? 'Switch to English' : 'Mudar para Português'"
          >
            <Languages class="w-3.5 h-3.5" />
            <span class="font-mono text-xs">{{ lang === 'pt' ? 'PT' : 'EN' }}</span>
          </button>

          <button
            @click="toggleTheme"
            class="tuff-btn-quiet !w-8 !px-0"
            aria-label="Toggle theme"
          >
            <Sun v-if="isDark" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Library Area -->
    <main class="flex-1 w-full">
      <WebfontUpload
        v-if="activeView === 'webfont'"
        @back="activeView = 'gallery'"
        @loaded="handleWebfontLoaded"
      />

      <SvgUpload
        v-else-if="activeView === 'svg'"
        :initial-svgs="savedRawSvgs"
        @back="activeView = 'gallery'"
        @built="handleSvgsBuilt"
      />

      <div
        v-else-if="loadingLibrary && !currentLibrary"
        class="w-full py-24 flex items-center justify-center gap-2 text-sm"
        style="color: var(--muted-foreground);"
      >
        <Loader2 class="w-4 h-4 animate-spin" />
        <span>{{ t.demo.loading }}</span>
      </div>

      <IconGallery
        v-else-if="currentLibrary"
        :library="currentLibrary"
        @back="activeView = 'webfont'"
        @edit-svgs="activeView = 'svg'"
      />
    </main>
  </div>
</template>
