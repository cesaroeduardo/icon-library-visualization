<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Search,
  SlidersHorizontal,
  Palette,
  Settings2,
  Package,
  MoreVertical,
  X,
  Smile,
  Plus,
  ExternalLink,
  Sparkles
} from 'lucide-vue-next'
import IconCard from './IconCard.vue'
import ColoredIcon from './ColoredIcon.vue'
import { useI18n } from '@/i18n'
import { isDark } from '@/theme'
import { createBundleZip, prepareSvg } from '@icon-library/core'

const { lang, t } = useI18n()

const props = defineProps({
  library: { type: Object, required: true },
  presets: { type: Array, default: () => [] },
  activePresetId: { type: String, default: '' },
  availableStyles: { type: Array, default: () => [] },
  activeStyle: { type: String, default: 'regular' }
})

const emit = defineEmits(['back', 'edit-svgs', 'select-preset', 'select-style', 'create-own'])

function readSearchFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get('q') || ''
  } catch {
    return ''
  }
}

function syncSearchToUrl(value) {
  const url = new URL(window.location.href)
  const trimmed = value.trim()
  if (trimmed) {
    url.searchParams.set('q', trimmed)
  } else {
    url.searchParams.delete('q')
  }
  const next = `${url.pathname}${url.search}${url.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next !== current) {
    window.history.replaceState(null, '', next)
  }
}

const searchQuery = ref(readSearchFromUrl())
const activeFilter = ref('all')
const defaultColor = () => (isDark.value ? '#f5f5f5' : '#161618')
const iconsColor = ref(defaultColor())
const pureColor = ref(defaultColor())
const userPickedColor = ref(false)
const fontSizeValues = [8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 320]
const sliderValue = ref(3) // 24px default
const selectedFontSize = ref(24)
const downloadFormat = ref('svg')
const openBottombar = ref(false)
const exporting = ref(false)

onMounted(() => {
  const fromUrl = readSearchFromUrl()
  if (fromUrl && fromUrl !== searchQuery.value) {
    searchQuery.value = fromUrl
  }
  syncSearchToUrl(searchQuery.value)
})

watch(searchQuery, (value) => {
  syncSearchToUrl(value)
})

watch(pureColor, (newVal) => {
  iconsColor.value = newVal
  if (newVal !== '#f5f5f5' && newVal !== '#161618') {
    userPickedColor.value = true
  }
})

watch(isDark, () => {
  if (!userPickedColor.value) {
    const c = defaultColor()
    pureColor.value = c
    iconsColor.value = c
  }
})

function updateFontSize() {
  window.requestAnimationFrame(() => {
    selectedFontSize.value = fontSizeValues[Number(sliderValue.value)]
  })
}

function renderPresetSvg(rawSvg, size) {
  return prepareSvg(rawSvg || '', { dimension: size, colored: true })
}

const filteredIcons = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return props.library.icons.filter((icon) => {
    if (activeFilter.value === 'mono' && icon.colored) return false
    if (activeFilter.value === 'color' && !icon.colored) return false
    if (!q) return true
    return (
      icon.name.toLowerCase().includes(q) ||
      (icon.keywords && icon.keywords.toLowerCase().includes(q))
    )
  })
})

async function downloadBundle() {
  exporting.value = true
  try {
    const blob = await createBundleZip(props.library)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.library.fontName}-icon-library.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Failed to export bundle:', e)
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full relative">
    <!-- Sticky TUFFUI Search Bar -->
    <div
      class="w-full backdrop-blur-md px-4 md:px-8 top-14 z-20 py-3.5 sticky flex justify-center"
      style="background-color: color-mix(in srgb, var(--background) 88%, transparent); border-bottom: 1px solid var(--border);"
    >
      <div class="max-w-[1472px] w-full flex flex-wrap md:flex-nowrap gap-2.5 items-center">
        <div class="relative flex-1 min-w-[220px]">
          <Search
            class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style="color: var(--muted-foreground);"
          />
          <input
            v-model="searchQuery"
            type="text"
            autofocus
            class="tuff-input w-full !pl-10 !pr-9"
            :placeholder="t.gallery.searchPlaceholder.replace('{count}', String(library.icons.length))"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            aria-label="Clear"
            class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full inline-flex items-center justify-center"
            style="color: var(--muted-foreground);"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Filter pills when both mono and colored exist -->
        <div
          v-if="library.coloredCount > 0 && library.monoCount > 0"
          class="inline-flex items-center rounded-full p-0.5 text-xs"
          style="background-color: var(--fg-tint-6);"
        >
          <button
            @click="activeFilter = 'all'"
            class="px-3 h-7 rounded-full font-medium transition-colors"
            :style="activeFilter === 'all' ? 'background-color: var(--surface-raised); color: var(--foreground);' : 'color: var(--muted-foreground);'"
          >
            {{ t.gallery.filterAll }}
          </button>
          <button
            @click="activeFilter = 'mono'"
            class="px-3 h-7 rounded-full font-medium transition-colors"
            :style="activeFilter === 'mono' ? 'background-color: var(--surface-raised); color: var(--foreground);' : 'color: var(--muted-foreground);'"
          >
            {{ t.gallery.filterMono }} ({{ library.monoCount }})
          </button>
          <button
            @click="activeFilter = 'color'"
            class="px-3 h-7 rounded-full font-medium transition-colors"
            :style="activeFilter === 'color' ? 'background-color: var(--surface-raised); color: var(--foreground);' : 'color: var(--muted-foreground);'"
          >
            {{ t.gallery.filterColor }} ({{ library.coloredCount }})
          </button>
        </div>

        <button
          @click="downloadBundle"
          :disabled="exporting"
          :title="t.gallery.downloadBundleHint"
          class="tuff-btn-primary shrink-0"
        >
          <Package class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ t.gallery.downloadBundle }}</span>
        </button>

        <button
          v-if="library.sourceType === 'svg-build'"
          @click="emit('edit-svgs')"
          class="tuff-btn-secondary shrink-0 hidden sm:inline-flex"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>{{ t.gallery.addMoreSvgs }}</span>
        </button>

        <button
          @click="openBottombar = !openBottombar"
          class="tuff-btn-quiet !w-9 !h-9 !px-0 md:hidden shrink-0"
        >
          <X v-if="openBottombar" class="w-4 h-4" />
          <MoreVertical v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col py-6 pb-16 w-full max-w-[1536px]">
      <!-- Library Switcher Pills -->
      <div
        v-if="presets.length > 0"
        class="px-4 md:px-8 mb-5 flex flex-wrap items-center justify-between gap-2"
      >
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="preset in presets"
            :key="preset.id"
            @click="emit('select-preset', preset.id)"
            class="h-8 px-3.5 rounded-full text-xs font-medium transition-colors"
            :style="
              activePresetId === preset.id
                ? 'background-color: var(--foreground); color: var(--background);'
                : 'background-color: var(--fg-tint-6); color: var(--muted-foreground);'
            "
          >
            {{ preset.label }}
          </button>
        </div>

        <div
          class="font-mono text-xs"
          style="color: var(--muted-foreground);"
        >
          {{
            t.gallery.iconsCount
              .replace('{shown}', String(filteredIcons.length))
              .replace('{total}', String(library.icons.length))
          }}
        </div>
      </div>

      <!-- Library Credits Strip right below the library selector -->
      <div v-if="library.credits" class="px-4 md:px-8 mb-5">
        <div
          class="tuff-inset px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
          style="color: var(--muted-foreground);"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span>
              {{ lang === 'pt' ? 'Créditos:' : 'Credits:' }}
              <strong class="font-medium" style="color: var(--foreground);">
                {{ library.credits.name }}
              </strong>
            </span>
            <span class="tuff-tag">{{ library.credits.license }}</span>
          </div>
          <a
            :href="library.credits.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-medium hover:underline"
            style="color: var(--brand);"
          >
            <span>{{ lang === 'pt' ? 'Visitar site oficial' : 'Visit official site' }}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <section class="w-full flex gap-5 md:gap-7 md:flex-row flex-col-reverse px-4 md:px-8">
        <!-- Icons Grid -->
        <div class="w-full flex flex-col gap-4">
          <ul
            v-if="filteredIcons.length > 0"
            class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2.5 md:gap-3"
          >
            <IconCard
              v-for="icon in filteredIcons"
              :key="`${library.fontName}-${activeStyle}-${icon.name}`"
              :name="icon.name"
              :keywords="icon.keywords"
              :icon="icon.icon"
              :color="iconsColor"
              :size="selectedFontSize"
              :download-format="downloadFormat"
              :svg="icon.svg"
              :colored="icon.colored"
              :char="icon.char"
              :font-family="library.runtimeFamily"
            >
              <ColoredIcon
                v-if="icon.colored"
                :svg="icon.svg"
                :size="selectedFontSize"
              />
              <span
                v-else-if="icon.char && library.runtimeFamily"
                class="leading-none select-none"
                :style="{
                  fontFamily: `'${library.runtimeFamily}'`,
                  fontSize: `${selectedFontSize}px`,
                  color: iconsColor
                }"
              >
                {{ icon.char }}
              </span>
              <span
                v-else-if="icon.svg"
                class="inline-flex items-center justify-center leading-none"
                :style="{
                  width: `${selectedFontSize}px`,
                  height: `${selectedFontSize}px`,
                  color: iconsColor
                }"
                v-html="renderPresetSvg(icon.svg, selectedFontSize)"
              ></span>
            </IconCard>
          </ul>

          <div
            v-if="filteredIcons.length === 0"
            class="tuff-shell w-full"
          >
            <div
              class="tuff-panel gap-2 w-full text-center justify-center items-center min-h-24 text-xs flex px-4 py-8"
              style="color: var(--muted-foreground);"
            >
              <p>{{ t.gallery.notFound }}</p>
              <Smile class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Right Controls Sidebar (TUFFUI Shell -> Panel -> Inset) -->
        <aside class="w-full md:w-64 md:sticky top-36 md:h-fit z-10 hidden md:block shrink-0">
          <div class="tuff-shell space-y-1.5">
            <div class="tuff-panel p-3.5 space-y-3">
              <!-- Size Slider -->
              <div class="tuff-inset p-3 space-y-2">
                <div class="flex items-center justify-between text-xs" style="color: var(--muted-foreground);">
                  <span class="inline-flex items-center gap-1.5 font-medium">
                    <SlidersHorizontal class="w-3.5 h-3.5" />
                    {{ t.gallery.size }}
                  </span>
                  <span class="font-mono" style="color: var(--foreground);">{{ selectedFontSize }}px</span>
                </div>
                <input
                  type="range"
                  v-model="sliderValue"
                  min="0"
                  max="11"
                  @input="updateFontSize"
                  class="w-full slider-input"
                  :style="{ '--thumb-color': pureColor }"
                />
              </div>

              <!-- Color Picker -->
              <div class="tuff-inset p-3 space-y-2">
                <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--muted-foreground);">
                  <Palette class="w-3.5 h-3.5" />
                  <span>{{ t.gallery.color }}</span>
                </div>
                <color-picker v-model:pureColor="pureColor" />
              </div>

              <!-- Icon Style / Weight Selector -->
              <div v-if="availableStyles.length > 1" class="tuff-inset p-3 space-y-2">
                <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--muted-foreground);">
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>{{ lang === 'pt' ? 'Estilo' : 'Style' }}</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    v-for="st in availableStyles"
                    :key="st"
                    @click="emit('select-style', st)"
                    class="h-7 px-2.5 rounded-full text-[11px] font-medium capitalize transition-colors truncate"
                    :style="
                      activeStyle === st
                        ? 'background-color: var(--surface-raised); color: var(--foreground);'
                        : 'background-color: var(--fg-tint-4); color: var(--muted-foreground);'
                    "
                  >
                    {{ st.replace(/-/g, ' ') }}
                  </button>
                </div>
              </div>

              <!-- Format Switch -->
              <div class="tuff-inset p-3 space-y-2">
                <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--muted-foreground);">
                  <Settings2 class="w-3.5 h-3.5" />
                  <span>{{ t.gallery.format }}</span>
                </div>
                <div class="radio-group">
                  <label class="w-full">
                    <input type="radio" value="png" class="radio" v-model="downloadFormat" />
                    <div class="radio-container">.png</div>
                  </label>
                  <label class="w-full">
                    <input type="radio" value="svg" class="radio" v-model="downloadFormat" />
                    <div class="radio-container">.svg</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>

    <!-- Mobile Bottombar (TUFFUI) -->
    <div
      v-if="openBottombar"
      class="flex w-full bottom-0 fixed z-30 rounded-t-3xl md:hidden p-3 pb-6"
      style="background-color: var(--surface);"
    >
      <div class="tuff-panel p-4 flex flex-col gap-3 w-full">
        <div class="tuff-inset p-3 flex items-center gap-3">
          <SlidersHorizontal class="w-4 h-4 shrink-0" style="color: var(--muted-foreground);" />
          <input
            type="range"
            v-model="sliderValue"
            min="0"
            max="11"
            @input="updateFontSize"
            :style="{ '--thumb-color': pureColor }"
            class="w-full slider-input"
          />
          <p class="w-11 text-right text-xs font-mono">{{ selectedFontSize }}px</p>
        </div>

        <div class="tuff-inset p-3 flex items-center gap-3">
          <Palette class="w-4 h-4 shrink-0" style="color: var(--muted-foreground);" />
          <color-picker v-model:pureColor="pureColor" />
        </div>

        <div v-if="availableStyles.length > 1" class="tuff-inset p-3 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--muted-foreground);">
            <Sparkles class="w-3.5 h-3.5" />
            <span>{{ lang === 'pt' ? 'Estilo' : 'Style' }}</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="st in availableStyles"
              :key="st"
              @click="emit('select-style', st)"
              class="h-7 px-3 rounded-full text-xs font-medium capitalize transition-colors"
              :style="
                activeStyle === st
                  ? 'background-color: var(--surface-raised); color: var(--foreground);'
                  : 'background-color: var(--fg-tint-4); color: var(--muted-foreground);'
              "
            >
              {{ st }}
            </button>
          </div>
        </div>

        <div class="tuff-inset p-3 flex items-center gap-3">
          <Settings2 class="w-4 h-4 shrink-0" style="color: var(--muted-foreground);" />
          <div class="radio-group">
            <label class="w-full">
              <input type="radio" value="png" class="radio" v-model="downloadFormat" />
              <div class="radio-container">.png</div>
            </label>
            <label class="w-full">
              <input type="radio" value="svg" class="radio" v-model="downloadFormat" />
              <div class="radio-container">.svg</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background-color: var(--fg-tint-10);
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: grab;
  background-color: var(--thumb-color, var(--brand));
  border: 2px solid var(--surface-inset);
}

.slider-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: grab;
  border: 2px solid var(--surface-inset);
  background-color: var(--thumb-color, var(--brand));
}
</style>
