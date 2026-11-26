<script setup>
import { ref, onMounted } from 'vue'
import {
  Sun,
  Moon,
  Languages,
  Layers,
  BookOpen,
  Plus,
  ArrowLeft,
  Loader2
} from 'lucide-vue-next'
import CreateOwnHub from './components/CreateOwnHub.vue'
import WebfontUpload from './components/WebfontUpload.vue'
import SvgUpload from './components/SvgUpload.vue'
import IconGallery from './components/IconGallery.vue'
import { isDark, toggleTheme } from './theme'
import { useI18n } from './i18n'
import { parseUploadedWebfont } from '@icon-library/core'

const { lang, t, toggleLang } = useI18n()

const PRESETS = [
  {
    id: 'phosphor',
    label: 'Phosphor',
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com/',
    license: 'MIT',
    jsonPath: './demo/libraries/phosphor.json'
  },
  {
    id: 'feather',
    label: 'Feather',
    name: 'Feather Icons',
    url: 'https://feathericons.com/',
    license: 'MIT',
    jsonPath: './demo/libraries/feather.json'
  },
  {
    id: 'pixelarticons',
    label: 'Pixelarticons (Free)',
    name: 'Pixelarticons (Free)',
    url: 'https://pixelarticons.com/',
    license: 'MIT',
    jsonPath: './demo/libraries/pixelarticons.json'
  },
  {
    id: 'hugeicons',
    label: 'Hugeicons (Free)',
    name: 'Hugeicons (Free)',
    url: 'https://hugeicons.com/',
    license: 'MIT (Free)',
    jsonPath: './demo/libraries/hugeicons.json'
  },
  {
    id: 'demo',
    label: 'Demo Webfont',
    name: 'Demo Webfont (WOFF2/TTF)',
    url: 'https://github.com/cesaroeduardo/icon-library-visualization',
    license: 'MIT'
  }
]

const presetCache = new Map()
const activeView = ref('gallery') // 'gallery' | 'create-own' | 'webfont' | 'svg'
const activePresetId = ref('phosphor')
const currentLibrary = ref(null)
const savedRawSvgs = ref([])
const loadingLibrary = ref(true)

async function loadPreset(presetId) {
  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0]
  activePresetId.value = preset.id
  activeView.value = 'gallery'

  if (presetCache.has(preset.id)) {
    currentLibrary.value = presetCache.get(preset.id)
    loadingLibrary.value = false
    return
  }

  loadingLibrary.value = true
  try {
    if (preset.id === 'demo') {
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
      const lib = await parseUploadedWebfont({
        fonts,
        cssFiles: [],
        customFontName: 'demo-icons',
        customPrefix: 'ic'
      })
      lib.credits = { name: preset.name, url: preset.url, license: preset.license }
      presetCache.set(preset.id, lib)
      currentLibrary.value = lib
    } else if (preset.jsonPath) {
      const res = await fetch(preset.jsonPath)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const lib = {
        sourceType: 'preset',
        fontName: data.meta?.name || preset.name,
        runtimeFamily: '',
        prefix: data.meta?.prefix || 'ic',
        icons: (data.icons || []).map((i) => ({ ...i, colored: false })),
        monoCount: (data.icons || []).length,
        coloredCount: 0,
        credits: {
          name: preset.name,
          url: preset.url,
          license: preset.license
        },
        artifacts: {
          catalogJson: JSON.stringify(
            (data.icons || []).map(({ name, icon, keywords }) => ({ name, icon, keywords })),
            null,
            2
          )
        }
      }
      presetCache.set(preset.id, lib)
      currentLibrary.value = lib
    }
  } catch (e) {
    console.error('Failed to load preset:', presetId, e)
  } finally {
    loadingLibrary.value = false
  }
}

function handleWebfontLoaded(library) {
  activePresetId.value = ''
  currentLibrary.value = library
  savedRawSvgs.value = []
  activeView.value = 'gallery'
}

function handleSvgsBuilt({ library, rawSvgs }) {
  activePresetId.value = ''
  currentLibrary.value = library
  savedRawSvgs.value = rawSvgs
  activeView.value = 'gallery'
}

function handleImportFromSkill(svgs) {
  savedRawSvgs.value = svgs
  activeView.value = 'svg'
}

onMounted(async () => {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase()
  if (hash === 'create-own') {
    activeView.value = 'create-own'
    loadPreset('phosphor').then(() => {
      activeView.value = 'create-own'
    })
    return
  }
  if (hash === 'webfont' || hash === 'svg') {
    activeView.value = hash
    loadPreset('phosphor').then(() => {
      activeView.value = hash
    })
    return
  }
  if (hash.startsWith('lib-')) {
    const target = hash.replace('lib-', '')
    await loadPreset(target)
    return
  }
  await loadPreset('phosphor')
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
            @click="activeView = activeView === 'create-own' ? 'gallery' : 'create-own'"
            class="tuff-btn-primary !h-8 text-xs"
          >
            <Plus class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Criar minha própria' : 'Create my own' }}</span>
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
      <CreateOwnHub
        v-if="activeView === 'create-own'"
        @back="activeView = 'gallery'"
        @select="(mode) => (activeView = mode)"
        @import-svgs="handleImportFromSkill"
      />

      <WebfontUpload
        v-else-if="activeView === 'webfont'"
        @back="activeView = 'create-own'"
        @loaded="handleWebfontLoaded"
      />

      <SvgUpload
        v-else-if="activeView === 'svg'"
        :initial-svgs="savedRawSvgs"
        @back="activeView = 'create-own'"
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
        :presets="PRESETS"
        :active-preset-id="activePresetId"
        @select-preset="loadPreset"
        @create-own="activeView = 'create-own'"
        @back="activeView = 'create-own'"
        @edit-svgs="activeView = 'svg'"
      />
    </main>
  </div>
</template>
