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

async function loadPreset(presetId, style) {
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 508 61"
              fill="none"
              class="h-6 w-auto"
              :style="{ color: isDark ? '#F7EDDB' : 'var(--foreground)' }"
              role="img"
              aria-label="Icon Library Studio"
            >
              <use fill="currentColor" href="#studio-logo-a" />
              <mask
                id="studio-logo-b"
                width="294"
                height="45"
                x="3"
                y="9.473"
                fill="#000"
                maskUnits="userSpaceOnUse"
              >
                <path fill="#fff" d="M3 9.473h294v45H3z" />
                <use href="#studio-logo-a" />
              </mask>
              <path
                stroke="currentColor"
                stroke-width="1.022"
                d="M13.045 17.744q-1.575 0-2.654-.99-1.035-1.035-1.035-2.52 0-1.483 1.035-2.473 1.08-.99 2.654-.99 1.62 0 2.654.99 1.08.99 1.08 2.474t-1.08 2.519q-1.035.99-2.654.99Zm-8.952 25.73v-4.139h7.018v-12.55q0-1.485-1.44-1.485H4.723v-4.138h5.803q2.79 0 4.048 1.305 1.305 1.26 1.305 4.048v12.82h7.017v4.138zm36.688.54q-3.103 0-5.577-1.44-2.43-1.44-3.824-4.049-1.394-2.653-1.394-6.207t1.394-6.163q1.44-2.61 3.869-4.048 2.428-1.485 5.532-1.485 4.274 0 6.883 2.16 2.655 2.114 3.373 5.847h-4.993a4.44 4.44 0 0 0-1.844-2.564q-1.35-.945-3.464-.944-1.53 0-2.923.81-1.35.81-2.205 2.428-.81 1.575-.81 3.959 0 2.34.81 3.958.855 1.62 2.205 2.474 1.395.81 2.923.81 2.16 0 3.464-.945t1.844-2.609h4.993q-.9 3.69-3.508 5.848-2.61 2.16-6.748 2.16Zm26.657 0q-3.193 0-5.712-1.44-2.52-1.44-3.959-4.049-1.44-2.653-1.44-6.207t1.44-6.163q1.44-2.655 3.959-4.093 2.519-1.44 5.757-1.44 3.24 0 5.713 1.44 2.52 1.44 3.914 4.093 1.44 2.61 1.44 6.163t-1.44 6.207q-1.44 2.61-3.959 4.049-2.474 1.44-5.713 1.44Zm0-4.544q1.71 0 3.15-.765t2.293-2.339q.9-1.62.9-4.048 0-2.475-.9-4.049-.855-1.575-2.294-2.339-1.395-.765-3.104-.764-1.71 0-3.148.764-1.44.765-2.34 2.34-.855 1.573-.854 4.048 0 3.688 1.844 5.443 1.89 1.71 4.453 1.709Zm16.986 4.003v-22.31h4.139l.404 3.328h.225q.9-1.62 2.79-2.744 1.888-1.125 4.362-1.125 4.095 0 6.163 2.474 2.07 2.475 2.069 7.288v13.09h-4.768V30.967q0-2.788-1.17-4.318t-3.688-1.53q-2.475 0-4.138 1.665-1.62 1.665-1.62 4.813v11.875zm26.522 0v-4.138h7.467V16.709q0-1.484-1.439-1.484h-5.398v-4.139h6.253q2.608 0 3.958 1.394 1.395 1.35 1.394 3.959v22.896h7.512v4.138zm36.958-25.73q-1.574 0-2.654-.99-1.034-1.033-1.034-2.518t1.034-2.474q1.08-.99 2.654-.99 1.62 0 2.654.99 1.08.99 1.08 2.474t-1.08 2.519q-1.035.99-2.654.99Zm-8.951 25.73v-4.138h7.017v-12.55q0-1.485-1.44-1.485h-4.948v-4.138h5.803q2.789 0 4.049 1.305 1.304 1.26 1.304 4.048v12.82h7.017v4.138zm37.587.54q-2.473 0-4.183-.99a6.9 6.9 0 0 1-2.564-2.833h-.27l-.405 3.283h-4.093V11.086h4.768v12.955q.81-1.35 2.564-2.384 1.755-1.035 4.183-1.035 2.79 0 4.993 1.35 2.205 1.305 3.464 3.913 1.305 2.61 1.305 6.433t-1.305 6.432q-1.26 2.61-3.464 3.959-2.203 1.305-4.993 1.304Zm-.989-4.543q2.564 0 4.228-1.754 1.71-1.8 1.709-5.353 0-3.6-1.709-5.398-1.664-1.8-4.228-1.8t-4.274 1.8q-1.664 1.755-1.664 5.353 0 3.553 1.664 5.353 1.71 1.8 4.274 1.799Zm16.716 4.003v-4.138h5.442v-12.55q0-1.485-1.439-1.485h-3.554v-4.138h5.353q1.845 0 3.014 1.08 1.17 1.035 1.17 2.924v.54h.225q.494-2.52 2.114-3.78 1.664-1.304 4.813-1.304h3.464v5.038h-4.859q-2.653 0-4.093 1.845t-1.439 4.408v7.422h6.927v4.138zm34.978.54q-2.653 0-4.453-.9-1.799-.945-2.699-2.474a6.77 6.77 0 0 1-.899-3.418q0-3.285 2.384-5.128 2.429-1.844 6.837-1.844h5.758v-.495q0-5.038-4.679-5.038-1.934 0-3.283.854-1.305.81-1.755 2.654h-4.768q.36-3.509 3.014-5.532 2.7-2.07 6.792-2.07 4.948 0 7.198 2.43 2.249 2.428 2.249 6.702v13.72h-4.049l-.404-3.284h-.315a10.1 10.1 0 0 1-2.474 2.699q-1.485 1.125-4.454 1.124Zm.9-4.003q2.924 0 4.363-1.755 1.485-1.8 1.62-4.543h-5.218q-2.565 0-3.644.855-1.034.81-1.034 2.294 0 1.485 1.034 2.34 1.08.809 2.879.809Zm18.065 3.463v-4.138h5.443v-12.55q0-1.485-1.439-1.485h-3.554v-4.138h5.353q1.844 0 3.014 1.08 1.17 1.035 1.169 2.924v.54h.225q.495-2.52 2.115-3.78 1.663-1.304 4.813-1.304h3.463v5.038h-4.858q-2.654 0-4.093 1.845t-1.44 4.408v7.422h6.928v4.138zm29.941 9.897 5.308-11.74h-1.305l-8.681-20.468h5.173l6.657 16.329 7.062-16.329h4.994l-14.17 32.208z"
                mask="url(#studio-logo-b)"
              />
              <rect
                width="195.362"
                height="56.362"
                x="309.668"
                y="2.181"
                stroke="var(--brand)"
                stroke-width="4.362"
                rx="8.724"
              />
              <path
                fill="var(--brand)"
                d="M341.145 43.097q-4.409 0-7.017-2.07-2.61-2.068-2.969-5.487h4.903q.27 1.575 1.574 2.564 1.35.99 3.554.99 2.114 0 3.239-.855 1.169-.9 1.169-2.07 0-1.71-1.394-2.339-1.35-.63-4.004-.944-2.294-.27-4.183-1.035-1.845-.81-2.924-2.16-1.08-1.393-1.08-3.463 0-2.923 2.294-4.723t6.388-1.8 6.342 1.845q2.25 1.845 2.609 5.038h-4.588q-.18-1.35-1.394-2.114-1.215-.81-3.014-.81-1.845 0-2.924.72-1.08.675-1.079 1.8 0 2.428 5.218 2.968 2.473.27 4.408.945 1.934.63 3.059 2.024 1.124 1.35 1.124 3.823a5.7 5.7 0 0 1-1.169 3.644q-1.17 1.62-3.284 2.564-2.07.945-4.858.945m28.771-.54q-3.284 0-5.218-1.575-1.934-1.62-1.934-5.712V24.294h-5.623v-4.048h3.329q2.294 0 2.699-2.25l.674-3.598h3.689v5.848h8.816v4.048h-8.816V35.18q0 1.755.765 2.474.809.675 2.744.674h5.217v4.229zm22.114.54q-4.048 0-6.163-2.474-2.069-2.52-2.069-7.288v-13.09h4.768v12.506q0 2.743 1.17 4.318 1.214 1.53 3.688 1.53t4.139-1.665q1.664-1.665 1.664-4.813V20.246h4.768v22.31h-4.138l-.405-3.328h-.225q-.9 1.62-2.789 2.744t-4.408 1.125m27.286 0q-2.788 0-4.993-1.305-2.204-1.35-3.508-3.958-1.26-2.61-1.26-6.433t1.305-6.432q1.304-2.61 3.508-3.914 2.25-1.35 4.993-1.35 2.565 0 4.229.99 1.664.945 2.474 2.43V10.17h4.768v32.387h-4.093l-.405-3.284h-.27a6.97 6.97 0 0 1-2.564 2.789q-1.62 1.035-4.184 1.035m.99-4.544q2.564 0 4.228-1.799 1.71-1.8 1.71-5.353 0-3.598-1.71-5.353-1.664-1.8-4.228-1.799-2.564 0-4.273 1.8-1.665 1.799-1.665 5.397 0 3.554 1.665 5.353 1.709 1.755 4.273 1.754m26.297-21.726q-1.574 0-2.654-.99-1.034-1.035-1.034-2.519t1.034-2.474q1.08-.99 2.654-.99 1.62 0 2.654.99 1.08.99 1.08 2.474t-1.08 2.52q-1.035.989-2.654.989m-8.951 25.73v-4.139h7.017v-12.55q0-1.484-1.44-1.484h-4.948v-4.138h5.803q2.789 0 4.049 1.304 1.304 1.26 1.304 4.049v12.82h7.017v4.138zm35.923.54q-3.193 0-5.713-1.44t-3.958-4.048q-1.44-2.655-1.44-6.208t1.44-6.162q1.439-2.655 3.958-4.094t5.758-1.44 5.713 1.44q2.519 1.44 3.913 4.094 1.44 2.609 1.44 6.162 0 3.555-1.44 6.208-1.439 2.61-3.958 4.048-2.475 1.44-5.713 1.44m0-4.544q1.71 0 3.149-.764 1.439-.765 2.294-2.34.9-1.618.9-4.048 0-2.475-.9-4.048-.855-1.575-2.294-2.34-1.394-.765-3.104-.764-1.71 0-3.149.765t-2.339 2.339q-.855 1.575-.855 4.048 0 3.69 1.845 5.443 1.889 1.71 4.453 1.71"
              />
              <defs>
                <path
                  id="studio-logo-a"
                  d="M13.045 17.744q-1.575 0-2.654-.99-1.035-1.035-1.035-2.52 0-1.483 1.035-2.473 1.08-.99 2.654-.99 1.62 0 2.654.99 1.08.99 1.08 2.474t-1.08 2.519q-1.035.99-2.654.99m-8.952 25.73v-4.139h7.018v-12.55q0-1.485-1.44-1.485H4.723v-4.138h5.803q2.79 0 4.048 1.305 1.305 1.26 1.305 4.048v12.82h7.017v4.138zm36.688.54q-3.103 0-5.577-1.44-2.43-1.44-3.824-4.049-1.394-2.653-1.394-6.207t1.394-6.163q1.44-2.61 3.869-4.048 2.428-1.485 5.532-1.485 4.274 0 6.883 2.16 2.655 2.114 3.373 5.847h-4.993a4.44 4.44 0 0 0-1.844-2.564q-1.35-.945-3.464-.944-1.53 0-2.923.81-1.35.809-2.205 2.428-.81 1.575-.81 3.959 0 2.34.81 3.958.855 1.62 2.205 2.474 1.395.81 2.923.81 2.16 0 3.464-.945t1.844-2.609h4.993q-.9 3.69-3.508 5.848-2.61 2.16-6.748 2.16m26.657 0q-3.193 0-5.712-1.44-2.52-1.44-3.959-4.049-1.44-2.653-1.44-6.207t1.44-6.163q1.44-2.655 3.959-4.093 2.519-1.44 5.757-1.44 3.24 0 5.713 1.44 2.52 1.44 3.914 4.093 1.44 2.61 1.44 6.163t-1.44 6.207q-1.44 2.61-3.959 4.049-2.474 1.44-5.713 1.44m0-4.544q1.71 0 3.15-.765t2.293-2.339q.9-1.62.9-4.048 0-2.475-.9-4.049-.855-1.575-2.294-2.339-1.395-.765-3.104-.764-1.71 0-3.148.764-1.44.765-2.34 2.34-.855 1.573-.854 4.048 0 3.688 1.844 5.443 1.89 1.71 4.453 1.709m16.986 4.003v-22.31h4.139l.404 3.328h.225q.9-1.62 2.79-2.744 1.888-1.125 4.362-1.125 4.095 0 6.163 2.474 2.07 2.475 2.069 7.288v13.09h-4.768V30.967q0-2.788-1.17-4.318t-3.688-1.53q-2.475 0-4.138 1.665-1.62 1.665-1.62 4.813v11.875zm26.522 0v-4.138h7.467V16.709q0-1.484-1.439-1.484h-5.398v-4.139h6.253q2.608 0 3.958 1.394 1.395 1.35 1.394 3.959v22.896h7.512v4.138zm36.958-25.73q-1.574 0-2.654-.99-1.034-1.033-1.034-2.518t1.034-2.474q1.08-.99 2.654-.99 1.62 0 2.654.99 1.08.99 1.08 2.474t-1.08 2.519q-1.035.99-2.654.99m-8.951 25.73v-4.138h7.017v-12.55q0-1.485-1.44-1.485h-4.948v-4.138h5.803q2.789 0 4.049 1.305 1.304 1.26 1.304 4.048v12.82h7.017v4.138zm37.587.54q-2.473 0-4.183-.99a6.9 6.9 0 0 1-2.564-2.833h-.27l-.405 3.283h-4.093V11.086h4.768v12.955q.81-1.35 2.564-2.384 1.755-1.035 4.183-1.035 2.79 0 4.993 1.35 2.205 1.305 3.464 3.913 1.305 2.61 1.305 6.433t-1.305 6.432q-1.26 2.61-3.464 3.959-2.203 1.305-4.993 1.304m-.989-4.543q2.564 0 4.228-1.754 1.71-1.8 1.709-5.353 0-3.6-1.709-5.398-1.664-1.8-4.228-1.8t-4.274 1.8q-1.664 1.755-1.664 5.353 0 3.553 1.664 5.353 1.71 1.8 4.274 1.799m16.716 4.003v-4.138h5.442v-12.55q0-1.485-1.439-1.485h-3.554v-4.138h5.353q1.845 0 3.014 1.08 1.17 1.035 1.17 2.924v.54h.225q.494-2.52 2.114-3.78 1.664-1.304 4.813-1.304h3.464v5.038h-4.859q-2.653 0-4.093 1.845t-1.439 4.408v7.422h6.927v4.138zm34.978.54q-2.653 0-4.453-.9-1.799-.945-2.699-2.474-.9-1.575-.9-3.418 0-3.285 2.385-5.128 2.429-1.844 6.837-1.844h5.758v-.495q0-5.038-4.679-5.038-1.934 0-3.283.854-1.305.81-1.755 2.654h-4.768q.36-3.509 3.014-5.532 2.7-2.07 6.792-2.07 4.948 0 7.198 2.43 2.249 2.428 2.249 6.702v13.72h-4.049l-.404-3.284h-.315a10.1 10.1 0 0 1-2.474 2.699q-1.485 1.125-4.454 1.124m.9-4.003q2.924 0 4.363-1.755 1.485-1.8 1.62-4.543h-5.218q-2.565 0-3.644.855-1.034.81-1.034 2.294 0 1.485 1.034 2.34 1.08.809 2.879.809m18.065 3.463v-4.138h5.443v-12.55q0-1.485-1.439-1.485h-3.554v-4.138h5.353q1.844 0 3.014 1.08 1.17 1.035 1.169 2.924v.54h.225q.495-2.52 2.115-3.78 1.663-1.304 4.813-1.304h3.463v5.038h-4.858q-2.654 0-4.093 1.845t-1.44 4.408v7.422h6.928v4.138zm29.941 9.897 5.308-11.74h-1.305l-8.681-20.468h5.173l6.657 16.329 7.062-16.329h4.994l-14.17 32.208z"
                />
              </defs>
            </svg>
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
        @select-preset="(id) => loadPreset(id)"
        @select-style="handleSelectStyle"
        @create-own="activeView = 'create-own'"
        @back="activeView = 'create-own'"
        @edit-svgs="activeView = 'svg'"
      />
    </main>
  </div>
</template>
