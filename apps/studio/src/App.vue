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

// Views inside the Icon Library app: 'gallery' | 'webfont' | 'svg'
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
    <!-- Compact Library Header -->
    <header
      class="sticky top-0 z-30 h-14 w-full bg-neutral-200/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-300/70 dark:border-neutral-800 px-4 md:px-8 flex items-center justify-center"
    >
      <div class="max-w-[1472px] w-full flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <a
            href="../"
            class="icon-btn !h-9 text-xs font-medium"
            :title="lang === 'pt' ? 'Voltar ao site' : 'Back to site'"
          >
            <ArrowLeft class="w-4 h-4" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Site' : 'Home' }}</span>
          </a>

          <button
            @click="activeView = 'gallery'"
            class="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <span
              class="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center"
            >
              <Layers class="w-3.5 h-3.5" />
            </span>
            <span class="hidden md:inline">{{ t.appName }}</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="activeView = activeView === 'webfont' ? 'gallery' : 'webfont'"
            class="icon-btn !h-9 text-xs font-medium"
            :class="activeView === 'webfont' ? '!bg-neutral-900 !text-white dark:!bg-white dark:!text-neutral-900' : ''"
          >
            <FileType class="w-4 h-4" />
            <span class="hidden sm:inline">{{ t.cards.webfont.title }}</span>
          </button>

          <button
            @click="activeView = activeView === 'svg' ? 'gallery' : 'svg'"
            class="icon-btn !h-9 text-xs font-medium"
            :class="activeView === 'svg' ? '!bg-neutral-900 !text-white dark:!bg-white dark:!text-neutral-900' : ''"
          >
            <FileCode2 class="w-4 h-4" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Compilar SVGs' : 'Compile SVGs' }}</span>
          </button>

          <a href="../#docs" class="icon-btn !h-9 text-xs font-medium">
            <BookOpen class="w-4 h-4" />
            <span class="hidden sm:inline">{{ t.docsNav }}</span>
          </a>

          <button
            @click="toggleLang"
            class="icon-btn !h-9 text-xs font-medium"
            :title="lang === 'pt' ? 'Switch to English' : 'Mudar para Português'"
          >
            <Languages class="w-4 h-4" />
            <span>{{ lang === 'pt' ? 'PT' : 'EN' }}</span>
          </button>

          <button @click="toggleTheme" class="icon-btn !h-9 !w-9 !px-0" aria-label="Toggle theme">
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
        class="w-full py-24 flex items-center justify-center gap-2 text-sm text-neutral-500"
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
