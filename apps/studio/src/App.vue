<script setup>
import { ref, onMounted } from 'vue'
import { Sun, Moon, Languages, Layers, Eye, Loader2, BookOpen } from 'lucide-vue-next'
import HomeSelector from './components/HomeSelector.vue'
import WebfontUpload from './components/WebfontUpload.vue'
import SvgUpload from './components/SvgUpload.vue'
import CreateIconsGuide from './components/CreateIconsGuide.vue'
import IconGallery from './components/IconGallery.vue'
import { isDark, toggleTheme } from './theme'
import { useI18n } from './i18n'
import { parseUploadedWebfont } from '@icon-library/core'

const { lang, t, toggleLang } = useI18n()

// Views: 'home' | 'webfont' | 'svg' | 'create' | 'gallery'
const activeView = ref('home')
const currentLibrary = ref(null)
const savedRawSvgs = ref([])
const loadingDemo = ref(false)

async function openDemo() {
  if (loadingDemo.value) return
  loadingDemo.value = true
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
    const library = await parseUploadedWebfont({
      fonts,
      cssFiles: [],
      customFontName: 'demo-icons',
      customPrefix: 'ic'
    })
    currentLibrary.value = library
    savedRawSvgs.value = []
    activeView.value = 'gallery'
  } catch (e) {
    console.error('Failed to open demo:', e)
  } finally {
    loadingDemo.value = false
  }
}

function handleSelectMode(mode) {
  activeView.value = mode
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

function handleImportFromSkill(svgs) {
  savedRawSvgs.value = svgs
  activeView.value = 'svg'
}

function goHome() {
  activeView.value = 'home'
}

onMounted(() => {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase()
  if (hash === 'webfont' || hash === 'svg' || hash === 'create') {
    activeView.value = hash
  } else if (hash === 'demo') {
    openDemo()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Global Header -->
    <header
      class="sticky top-0 z-30 h-14 w-full bg-neutral-200/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-300/70 dark:border-neutral-800 px-4 md:px-8 flex items-center justify-center"
    >
      <div class="max-w-[1472px] w-full flex items-center justify-between gap-4">
        <button
          @click="goHome"
          class="inline-flex items-center gap-2.5 text-sm font-semibold text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          <span
            class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center"
          >
            <Layers class="w-4 h-4" />
          </span>
          <span>{{ t.appName }}</span>
        </button>

        <div class="flex items-center gap-2">
          <a
            href="../#docs"
            class="icon-btn !h-9 text-xs font-medium"
          >
            <BookOpen class="w-4 h-4" />
            <span>{{ t.docsNav }}</span>
          </a>

          <button
            @click="openDemo"
            :disabled="loadingDemo"
            class="icon-btn !h-9 text-xs font-medium"
          >
            <Loader2 v-if="loadingDemo" class="w-4 h-4 animate-spin" />
            <Eye v-else class="w-4 h-4" />
            <span>{{ t.demo.navBtn }}</span>
          </button>

          <button
            @click="toggleLang"
            class="icon-btn !h-9 text-xs font-medium"
            :title="lang === 'pt' ? 'Switch to English' : 'Mudar para Português'"
          >
            <Languages class="w-4 h-4" />
            <span>{{ lang === 'pt' ? 'PT-BR' : 'EN' }}</span>
          </button>

          <button @click="toggleTheme" class="icon-btn !h-9 !w-9 !px-0" aria-label="Toggle theme">
            <Sun v-if="isDark" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main View -->
    <main class="flex-1 w-full">
      <HomeSelector
        v-if="activeView === 'home'"
        :loading-demo="loadingDemo"
        @select="handleSelectMode"
        @open-demo="openDemo"
      />

      <WebfontUpload
        v-else-if="activeView === 'webfont'"
        @back="goHome"
        @loaded="handleWebfontLoaded"
      />

      <SvgUpload
        v-else-if="activeView === 'svg'"
        :initial-svgs="savedRawSvgs"
        @back="goHome"
        @built="handleSvgsBuilt"
      />

      <CreateIconsGuide
        v-else-if="activeView === 'create'"
        @back="goHome"
        @import-svgs="handleImportFromSkill"
      />

      <IconGallery
        v-else-if="activeView === 'gallery' && currentLibrary"
        :library="currentLibrary"
        @back="goHome"
        @edit-svgs="activeView = 'svg'"
      />
    </main>
  </div>
</template>
