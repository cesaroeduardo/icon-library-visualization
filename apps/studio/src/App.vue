<script setup>
import { ref, computed, onMounted } from 'vue'
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

const { lang, t, toggleLang } = useI18n()

const STROKE_WEIGHTS = {
  feather: { thin: '1.25', light: '1.5', regular: '2', bold: '2.6' },
  hugeicons: { thin: '1', light: '1.25', regular: '1.5', bold: '2.2' }
}

const PRESETS = [
  {
    id: 'phosphor',
    label: 'Phosphor',
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com/',
    license: 'MIT',
    styles: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    styleJsonTemplate: (style) => `./demo/libraries/phosphor-${style}.json`
  },
  {
    id: 'feather',
    label: 'Feather',
    name: 'Feather Icons',
    url: 'https://feathericons.com/',
    license: 'MIT',
    styles: ['thin', 'light', 'regular', 'bold'],
    jsonPath: './demo/libraries/feather.json'
  },
  {
    id: 'pixelarticons',
    label: 'Pixelarticons',
    name: 'Pixelarticons',
    url: 'https://pixelarticons.com/',
    license: 'MIT',
    styles: ['regular'],
    jsonPath: './demo/libraries/pixelarticons.json'
  },
  {
    id: 'hugeicons',
    label: 'Hugeicons',
    name: 'Hugeicons',
    url: 'https://hugeicons.com/',
    license: 'MIT',
    styles: ['thin', 'light', 'regular', 'bold'],
    jsonPath: './demo/libraries/hugeicons.json'
  }
]

const presetCache = new Map()
const activeView = ref('gallery') // 'gallery' | 'create-own' | 'webfont' | 'svg'
const activePresetId = ref('phosphor')
const activeStyle = ref('regular')
const currentLibrary = ref(null)
const savedRawSvgs = ref([])
const loadingLibrary = ref(true)

const availableStyles = computed(() => {
  const preset = PRESETS.find((p) => p.id === activePresetId.value)
  return preset ? preset.styles : []
})

function applyStrokeStyle(icons, presetId, style) {
  const map = STROKE_WEIGHTS[presetId]
  if (!map || !map[style]) return icons
  const sw = map[style]
  return icons.map((icon) => {
    if (!icon.svg) return icon
    const updatedSvg = icon.svg.includes('stroke-width=')
      ? icon.svg.replace(/stroke-width="[^"]*"/g, `stroke-width="${sw}"`)
      : icon.svg.replace('<svg', `<svg stroke-width="${sw}"`)
    return { ...icon, svg: updatedSvg }
  })
}

async function loadPreset(presetId, style = 'regular') {
  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0]
  const resolvedStyle = preset.styles.includes(style) ? style : 'regular'
  activePresetId.value = preset.id
  activeStyle.value = resolvedStyle
  activeView.value = 'gallery'

  const cacheKey = preset.styleJsonTemplate ? `${preset.id}:${resolvedStyle}` : preset.id

  if (presetCache.has(cacheKey)) {
    const baseLib = presetCache.get(cacheKey)
    if (STROKE_WEIGHTS[preset.id]) {
      currentLibrary.value = {
        ...baseLib,
        icons: applyStrokeStyle(baseLib.icons, preset.id, resolvedStyle)
      }
    } else {
      currentLibrary.value = baseLib
    }
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
    currentLibrary.value = STROKE_WEIGHTS[preset.id]
      ? { ...lib, icons: applyStrokeStyle(lib.icons, preset.id, resolvedStyle) }
      : lib
  } catch (e) {
    console.error('Failed to load preset:', presetId, e)
  } finally {
    loadingLibrary.value = false
  }
}

function handleSelectStyle(style) {
  if (!activePresetId.value) return
  loadPreset(activePresetId.value, style)
}

function handleWebfontLoaded(library) {
  activePresetId.value = ''
  activeStyle.value = 'regular'
  currentLibrary.value = library
  savedRawSvgs.value = []
  activeView.value = 'gallery'
}

function handleSvgsBuilt({ library, rawSvgs }) {
  activePresetId.value = ''
  activeStyle.value = 'regular'
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
  await loadPreset('phosphor', 'regular')
})
</script>

<template>
  <div
    aria-hidden="true"
    class="site-noise pointer-events-none fixed inset-0 z-40 opacity-10 mix-blend-overlay motion-reduce:hidden"
    style="background-image: url('./noise.webp');"
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
        :available-styles="availableStyles"
        :active-style="activeStyle"
        @select-preset="(id) => loadPreset(id, 'regular')"
        @select-style="handleSelectStyle"
        @create-own="activeView = 'create-own'"
        @back="activeView = 'create-own'"
        @edit-svgs="activeView = 'svg'"
      />
    </main>
  </div>
</template>
