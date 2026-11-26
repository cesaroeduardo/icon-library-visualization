<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Sun,
  Moon,
  Languages,
  Layers,
  BookOpen,
  Upload,
  ArrowLeft,
  Loader2
} from 'lucide-vue-next'
import CreateOwnHub from './components/CreateOwnHub.vue'
import BrandLogo from './components/BrandLogo.vue'
import WebfontUpload from './components/WebfontUpload.vue'
import SvgUpload from './components/SvgUpload.vue'
import IconGallery from './components/IconGallery.vue'
import { isDark, toggleTheme } from './theme'
import { useI18n } from './i18n'
import { saveUserLibraryCache, loadUserLibraryCache } from './userLibraryCache'

const { lang, t, toggleLang } = useI18n()

const BASE = import.meta.env.BASE_URL

const PRESETS = [
  {
    id: 'phosphor',
    label: 'Phosphor',
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com/',
    license: 'MIT',
    styles: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    defaultStyle: 'regular',
    styleJsonTemplate: (style) => `${BASE}demo/libraries/phosphor-${style}.json`
  },
  {
    id: 'lucide',
    label: 'Lucide',
    name: 'Lucide Icons',
    url: 'https://lucide.dev/',
    license: 'ISC',
    styles: ['regular'],
    jsonPath: `${BASE}demo/libraries/lucide.json`
  },
  {
    id: 'tabler',
    label: 'Tabler',
    name: 'Tabler Icons',
    url: 'https://tabler.io/icons',
    license: 'MIT',
    styles: ['outline', 'filled'],
    defaultStyle: 'outline',
    styleJsonTemplate: (style) => `${BASE}demo/libraries/tabler-${style}.json`
  },
  {
    id: 'solar',
    label: 'Solar',
    name: 'Solar Icons',
    url: 'https://github.com/480design/Solar-Icon-Set',
    license: 'CC BY 4.0',
    styles: ['linear', 'outline', 'bold', 'bold-duotone', 'broken', 'line-duotone'],
    defaultStyle: 'linear',
    styleJsonTemplate: (style) => `${BASE}demo/libraries/solar-${style}.json`
  },
  {
    id: 'remix',
    label: 'Remix Icon',
    name: 'Remix Icon',
    url: 'https://remixicon.com/',
    license: 'Apache 2.0',
    styles: ['line', 'fill'],
    defaultStyle: 'line',
    styleJsonTemplate: (style) => `${BASE}demo/libraries/remix-${style}.json`
  },
  {
    id: 'feather',
    label: 'Feather',
    name: 'Feather Icons',
    url: 'https://feathericons.com/',
    license: 'MIT',
    styles: ['regular'],
    jsonPath: `${BASE}demo/libraries/feather.json`
  },
  {
    id: 'hugeicons',
    label: 'Hugeicons',
    name: 'Hugeicons',
    url: 'https://hugeicons.com/',
    license: 'MIT',
    styles: ['regular'],
    jsonPath: `${BASE}demo/libraries/hugeicons.json`
  },
  {
    id: 'pixelarticons',
    label: 'Pixelarticons',
    name: 'Pixelarticons',
    url: 'https://pixelarticons.com/',
    license: 'MIT',
    styles: ['regular'],
    jsonPath: `${BASE}demo/libraries/pixelarticons.json`
  }
]

const USER_LIB_ID = 'user'

const presetCache = new Map()
const activeView = ref('gallery') // 'gallery' | 'create-own' | 'webfont' | 'svg'
const activePresetId = ref('phosphor')
const activeStyle = ref('regular')
const currentLibrary = ref(null)
const userLibrary = ref(null)
const savedRawSvgs = ref([])
const pendingWebfontFiles = ref([])
const loadingLibrary = ref(true)

const galleryPresets = computed(() => {
  if (!userLibrary.value) return PRESETS
  return [
    {
      id: USER_LIB_ID,
      label: userLibrary.value.fontName || (lang.value === 'pt' ? 'Minha webfont' : 'My webfont')
    },
    ...PRESETS
  ]
})

const availableStyles = computed(() => {
  if (activePresetId.value === USER_LIB_ID) return []
  const preset = PRESETS.find((p) => p.id === activePresetId.value)
  return preset ? preset.styles : []
})

function showUserLibrary() {
  if (!userLibrary.value) return
  activePresetId.value = USER_LIB_ID
  activeStyle.value = 'regular'
  currentLibrary.value = userLibrary.value
  activeView.value = 'gallery'
  loadingLibrary.value = false
}

async function loadPreset(presetId, style) {
  if (presetId === USER_LIB_ID) {
    showUserLibrary()
    return
  }

  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0]
  const fallbackStyle = preset.defaultStyle || preset.styles[0] || 'regular'
  const resolvedStyle = style && preset.styles.includes(style) ? style : fallbackStyle
  activePresetId.value = preset.id
  activeStyle.value = resolvedStyle
  activeView.value = 'gallery'

  const cacheKey = preset.styleJsonTemplate ? `${preset.id}:${resolvedStyle}` : preset.id

  if (presetCache.has(cacheKey)) {
    currentLibrary.value = presetCache.get(cacheKey)
    loadingLibrary.value = false
    return
  }

  loadingLibrary.value = true
  try {
    const url = preset.styleJsonTemplate ? preset.styleJsonTemplate(resolvedStyle) : preset.jsonPath
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const baseIcons = (data.icons || []).map((i) => ({ ...i, colored: false }))
    const lib = {
      sourceType: 'preset',
      fontName: data.meta?.name || preset.name,
      runtimeFamily: '',
      prefix: data.meta?.prefix || 'ic',
      icons: baseIcons,
      monoCount: baseIcons.length,
      coloredCount: 0,
      credits: {
        name: preset.name,
        url: preset.url,
        license: preset.license
      },
      artifacts: {
        catalogJson: JSON.stringify(
          baseIcons.map(({ name, icon, keywords }) => ({ name, icon, keywords })),
          null,
          2
        )
      }
    }
    presetCache.set(cacheKey, lib)
    currentLibrary.value = lib
  } catch (e) {
    console.error('Failed to load preset:', presetId, e)
  } finally {
    loadingLibrary.value = false
  }
}

function handleSelectStyle(style) {
  if (!activePresetId.value || activePresetId.value === USER_LIB_ID) return
  loadPreset(activePresetId.value, style)
}

async function persistUserLibrary(library, rawSvgs = []) {
  userLibrary.value = library
  try {
    await saveUserLibraryCache({ library, rawSvgs })
  } catch (e) {
    console.warn('Failed to persist user library:', e)
  }
}

async function handleWebfontLoaded(library) {
  savedRawSvgs.value = []
  pendingWebfontFiles.value = []
  await persistUserLibrary(library, [])
  showUserLibrary()
}

async function handleSvgsBuilt({ library, rawSvgs }) {
  savedRawSvgs.value = rawSvgs
  await persistUserLibrary(library, rawSvgs)
  showUserLibrary()
}

function handleImportFromSkill(svgs) {
  pendingWebfontFiles.value = []
  savedRawSvgs.value = svgs
  activeView.value = 'svg'
}

function handleImportWebfont(files) {
  savedRawSvgs.value = []
  pendingWebfontFiles.value = files || []
  activeView.value = 'webfont'
}

function openUploadMode(mode) {
  pendingWebfontFiles.value = []
  activeView.value = mode
}

function backToCreateOwn() {
  pendingWebfontFiles.value = []
  activeView.value = 'create-own'
}

onMounted(async () => {
  const cached = await loadUserLibraryCache()
  if (cached?.library) {
    userLibrary.value = cached.library
    savedRawSvgs.value = cached.rawSvgs || []
  }

  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase()
  if (hash === 'create-own') {
    activeView.value = 'create-own'
    loadPreset('phosphor', 'regular').then(() => {
      activeView.value = 'create-own'
    })
    return
  }
  if (hash === 'webfont' || hash === 'svg') {
    activeView.value = hash
    loadPreset('phosphor', 'regular').then(() => {
      activeView.value = hash
    })
    return
  }
  if (hash.startsWith('lib-')) {
    const target = hash.replace('lib-', '')
    await loadPreset(target, 'regular')
    return
  }
  if (userLibrary.value) {
    showUserLibrary()
    return
  }
  await loadPreset('phosphor', 'regular')
})
</script>

<template>
  <div
    aria-hidden="true"
    class="site-noise pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-overlay motion-reduce:hidden"
    :style="{ backgroundImage: `url('${BASE}noise.webp')` }"
  ></div>
  <div class="min-h-screen flex flex-col">
    <!-- TUFFUI Sticky Header -->
    <header
      class="sticky top-0 z-30 h-14 w-full backdrop-blur-md px-4 md:px-8 flex items-center justify-center"
      style="background-color: color-mix(in srgb, var(--background) 85%, transparent); border-bottom: 1px solid var(--border);"
    >
      <div class="max-w-[1472px] w-full flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <a
            href="/"
            class="tuff-btn-quiet"
            :title="lang === 'pt' ? 'Voltar ao site' : 'Back to site'"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Site' : 'Home' }}</span>
          </a>

          <button
            @click="activeView = 'gallery'"
            class="inline-flex items-center hover:opacity-90 transition-opacity"
            aria-label="Icon Library Studio"
          >
            <BrandLogo class="h-[19px] w-auto" />
          </button>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            @click="activeView = activeView === 'create-own' ? 'gallery' : 'create-own'"
            class="tuff-btn-primary !h-8 text-xs"
          >
            <Upload class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ lang === 'pt' ? 'Enviar meus ícones' : 'Upload my own icons' }}</span>
          </button>

          <a href="/#docs" class="tuff-btn-quiet">
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
        @select="openUploadMode"
        @import-svgs="handleImportFromSkill"
        @import-webfont="handleImportWebfont"
      />

      <WebfontUpload
        v-else-if="activeView === 'webfont'"
        :initial-files="pendingWebfontFiles"
        :auto-build="pendingWebfontFiles.length > 0"
        @back="backToCreateOwn"
        @loaded="handleWebfontLoaded"
      />

      <SvgUpload
        v-else-if="activeView === 'svg'"
        :initial-svgs="savedRawSvgs"
        @back="backToCreateOwn"
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
        :presets="galleryPresets"
        :active-preset-id="activePresetId"
        :available-styles="availableStyles"
        :active-style="activeStyle"
        @select-preset="(id) => loadPreset(id)"
        @select-style="handleSelectStyle"
        @create-own="activeView = 'create-own'"
        @back="activeView = 'create-own'"
        @edit-svgs="activeView = 'svg'"
      />
    </main>
  </div>
</template>
