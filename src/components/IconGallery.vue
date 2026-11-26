<script setup>
import { ref, computed, watch } from 'vue'
import {
  Search,
  SlidersHorizontal,
  Palette,
  Settings2,
  Package,
  MoreVertical,
  X,
  ArrowLeft,
  Smile,
  Plus
} from 'lucide-vue-next'
import IconCard from './IconCard.vue'
import ColoredIcon from './ColoredIcon.vue'
import { useI18n } from '@/i18n'
import { createBundleZip } from '@/utils/svgToFont'

const { t } = useI18n()

const props = defineProps({
  library: { type: Object, required: true }
})

const emit = defineEmits(['back', 'edit-svgs'])

const searchQuery = ref('')
const activeFilter = ref('all') // all | mono | color
const iconsColor = ref('rgb(133, 133, 133)')
const pureColor = ref('rgb(133, 133, 133)')
const circleColors = ref(['rgb(133, 133, 133)', 'rgb(133, 133, 133)', 'rgb(133, 133, 133)'])
const circlePositions = [
  { top: '-30%', left: '-30%' },
  { top: '20%', left: '90%' },
  { top: '80%', left: '20%' }
]
const fontSizeValues = [8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 320]
const sliderValue = ref(3) // 24px default
const selectedFontSize = ref(24)
const downloadFormat = ref('svg')
const openBottombar = ref(false)
const exporting = ref(false)

watch(pureColor, (newVal) => {
  iconsColor.value = newVal
  circleColors.value = [newVal, newVal, newVal]
})

function updateFontSize() {
  window.requestAnimationFrame(() => {
    selectedFontSize.value = fontSizeValues[Number(sliderValue.value)]
  })
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
    <!-- Ambient Background Circles (from icons-gallery) -->
    <div class="w-full h-full fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        v-for="(circleColor, index) in circleColors"
        :key="index"
        class="circle"
        :style="{
          backgroundColor: circleColor,
          top: circlePositions[index].top,
          left: circlePositions[index].left
        }"
      ></div>
    </div>

    <!-- Sticky Search Bar -->
    <div
      class="w-full bg-neutral-200/80 dark:bg-neutral-900/80 backdrop-blur-md px-4 md:px-8 top-14 z-20 py-4 sticky flex justify-center border-b border-neutral-300/60 dark:border-neutral-800/80"
    >
      <div class="max-w-[1472px] w-full flex flex-wrap md:flex-nowrap gap-2.5 md:gap-3 items-center">
        <div class="relative flex-1 min-w-[220px]">
          <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            v-model="searchQuery"
            type="search"
            autofocus
            class="w-full h-11 !pl-10 text-xs"
            :placeholder="t.gallery.searchPlaceholder.replace('{count}', String(library.icons.length))"
          />
        </div>

        <!-- Filter pills (when both mono and colored exist) -->
        <div
          v-if="library.coloredCount > 0 && library.monoCount > 0"
          class="flex items-center rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-100/70 dark:bg-neutral-800/70 h-11 text-xs"
        >
          <button
            @click="activeFilter = 'all'"
            class="px-3 h-full transition-colors"
            :class="activeFilter === 'all' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : ''"
          >
            {{ t.gallery.filterAll }}
          </button>
          <button
            @click="activeFilter = 'mono'"
            class="px-3 h-full transition-colors"
            :class="activeFilter === 'mono' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : ''"
          >
            {{ t.gallery.filterMono }} ({{ library.monoCount }})
          </button>
          <button
            @click="activeFilter = 'color'"
            class="px-3 h-full transition-colors"
            :class="activeFilter === 'color' ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium' : ''"
          >
            {{ t.gallery.filterColor }} ({{ library.coloredCount }})
          </button>
        </div>

        <button
          @click="downloadBundle"
          :disabled="exporting"
          :title="t.gallery.downloadBundleHint"
          class="h-11 px-4 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
        >
          <Package class="w-4 h-4" />
          <span class="hidden sm:inline">{{ t.gallery.downloadBundle }}</span>
        </button>

        <button
          v-if="library.sourceType === 'svg-build'"
          @click="emit('edit-svgs')"
          class="icon-btn text-xs shrink-0 hidden sm:inline-flex"
        >
          <Plus class="w-4 h-4" />
          <span>{{ t.gallery.addMoreSvgs }}</span>
        </button>

        <button @click="emit('back')" class="icon-btn text-xs shrink-0 hidden sm:inline-flex">
          <ArrowLeft class="w-4 h-4" />
          <span>{{ t.gallery.newProject }}</span>
        </button>

        <button
          @click="openBottombar = !openBottombar"
          class="icon-btn !w-11 !px-0 md:hidden shrink-0"
        >
          <X v-if="openBottombar" class="w-4 h-4" />
          <MoreVertical v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col py-6 pb-16 w-full max-w-[1536px]">
      <!-- Meta bar -->
      <div class="px-4 md:px-8 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-neutral-900 dark:text-white">{{ library.fontName }}</span>
          <span class="px-2 py-0.5 rounded bg-neutral-300/60 dark:bg-neutral-800 font-mono text-[11px]">
            .{{ library.prefix }}
          </span>
          <span class="hidden sm:inline">·</span>
          <span class="hidden sm:inline">
            {{ library.sourceType === 'svg-build' ? t.gallery.sourceSvgBuild : t.gallery.sourceWebfont }}
          </span>
        </div>
        <div>
          {{
            t.gallery.iconsCount
              .replace('{shown}', String(filteredIcons.length))
              .replace('{total}', String(library.icons.length))
          }}
        </div>
      </div>

      <section class="w-full flex gap-4 md:gap-8 md:flex-row flex-col-reverse px-4 md:px-8">
        <!-- Icons Grid -->
        <div class="w-full flex flex-col gap-4">
          <ul
            v-if="filteredIcons.length > 0"
            class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2.5 md:gap-4"
          >
            <IconCard
              v-for="icon in filteredIcons"
              :key="icon.name"
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
                v-else
                class="leading-none select-none"
                :style="{
                  fontFamily: `'${library.runtimeFamily}'`,
                  fontSize: `${selectedFontSize}px`,
                  color: iconsColor
                }"
              >
                {{ icon.char }}
              </span>
            </IconCard>
          </ul>

          <div
            class="text-neutral-700 dark:text-neutral-200 opacity-60 gap-2 w-full text-center justify-center items-center min-h-28 border border-neutral-300/70 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-lg text-xs flex px-4 py-8"
          >
            <p>{{ t.gallery.notFound }}</p>
            <Smile class="w-4 h-4" />
          </div>
        </div>

        <!-- Right Controls Sidebar (Desktop) -->
        <aside class="flex-col gap-3 w-full md:w-64 md:sticky top-36 md:h-fit z-10 hidden md:flex shrink-0">
          <!-- Size Slider -->
          <div
            class="flex items-center gap-3 bg-neutral-100/70 py-2.5 border border-neutral-300/70 rounded-lg px-3 dark:bg-neutral-800/70 dark:border-neutral-700 backdrop-blur-sm"
          >
            <SlidersHorizontal class="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
            <div class="flex flex-row w-full items-center gap-2">
              <input
                type="range"
                v-model="sliderValue"
                min="0"
                max="11"
                @input="updateFontSize"
                class="w-full slider-input"
                :style="{ '--thumb-color': pureColor }"
              />
              <p class="text-neutral-500 text-xs dark:text-neutral-400 w-11 text-right font-mono">
                {{ selectedFontSize }}px
              </p>
            </div>
          </div>

          <!-- Color Picker -->
          <div
            class="flex items-center gap-3 bg-neutral-100/70 py-2.5 border border-neutral-300/70 rounded-lg px-3 dark:bg-neutral-800/70 dark:border-neutral-700 backdrop-blur-sm"
          >
            <Palette class="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
            <color-picker v-model:pureColor="pureColor" />
          </div>

          <!-- Format Switch -->
          <div
            class="flex items-center gap-3 bg-neutral-100/70 py-2.5 border border-neutral-300/70 rounded-lg px-3 dark:bg-neutral-800/70 dark:border-neutral-700 backdrop-blur-sm"
          >
            <Settings2 class="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
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
        </aside>
      </section>
    </div>

    <!-- Mobile Bottombar -->
    <div
      v-if="openBottombar"
      class="flex w-full bottom-0 fixed z-30 rounded-t-2xl md:hidden bg-neutral-100/95 dark:bg-neutral-800/95 backdrop-blur-md border-t border-neutral-300 dark:border-neutral-700 p-4 pb-6"
    >
      <div class="flex flex-col gap-3 w-full">
        <div
          class="flex items-center gap-3 bg-white/70 py-2.5 border border-neutral-200 rounded-lg px-3 dark:bg-neutral-900/60 dark:border-neutral-700"
        >
          <SlidersHorizontal class="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
          <input
            type="range"
            v-model="sliderValue"
            min="0"
            max="11"
            @input="updateFontSize"
            :style="{ '--thumb-color': pureColor }"
            class="w-full slider-input"
          />
          <p class="text-neutral-500 dark:text-neutral-400 w-11 text-right text-xs font-mono">
            {{ selectedFontSize }}px
          </p>
        </div>

        <div
          class="flex items-center gap-3 bg-white/70 py-2.5 border border-neutral-200 rounded-lg px-3 dark:bg-neutral-900/60 dark:border-neutral-700"
        >
          <Palette class="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
          <color-picker v-model:pureColor="pureColor" />
        </div>

        <div
          class="flex items-center gap-3 bg-white/70 py-2.5 border border-neutral-200 rounded-lg px-3 dark:bg-neutral-900/60 dark:border-neutral-700"
        >
          <Settings2 class="w-4 h-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
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
.circle {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(300px);
  opacity: 0.35;
  position: absolute;
}

.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 4px;
  @apply bg-neutral-300 dark:bg-neutral-700;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: grab;
  background-color: var(--thumb-color, #4a5568);
}

.slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: grab;
  border: none;
  background-color: var(--thumb-color, #4a5568);
}
</style>
