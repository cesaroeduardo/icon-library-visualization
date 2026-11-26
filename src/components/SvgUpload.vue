<script setup>
import { ref, computed, watch } from 'vue'
import JSZip from 'jszip'
import {
  UploadCloud,
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  Info,
  Trash2,
  Hammer,
  Plus
} from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { normalizeIconName, isColoredSvg, validateSvgFiles } from '@/utils/svgValidator'
import { compileSvgsToWebfont } from '@/utils/svgToFont'
import { parseCatalogJson } from '@/utils/catalogParser'

const { t } = useI18n()

const props = defineProps({
  initialSvgs: { type: Array, default: () => [] }
})

const emit = defineEmits(['back', 'built'])

const isDragging = ref(false)
const building = ref(false)
const errorMsg = ref('')
const svgItems = ref([...props.initialSvgs])
const catalogMap = ref(new Map())
const fontName = ref('custom-icons')
const prefix = ref('ic')
const normalizeNames = ref(true)
const autoDetectColored = ref(true)
const fileInput = ref(null)

watch(
  () => props.initialSvgs,
  (val) => {
    if (val && val.length > 0 && svgItems.value.length === 0) {
      svgItems.value = [...val]
    }
  }
)

const processedItems = computed(() => {
  const used = new Map()
  return svgItems.value.map((item) => {
    let baseName = normalizeNames.value
      ? normalizeIconName(item.fileName)
      : item.fileName.replace(/\.svg$/i, '')
    const count = used.get(baseName) || 0
    used.set(baseName, count + 1)
    const uniqueName = count > 0 ? `${baseName}-${count + 1}` : baseName
    const colored = autoDetectColored.value ? isColoredSvg(item.content) : false
    const meta =
      catalogMap.value.get(uniqueName.toLowerCase()) ||
      catalogMap.value.get(baseName.toLowerCase()) ||
      null
    return {
      ...item,
      name: uniqueName,
      colored,
      keywords: item.keywords || meta?.keywords || '',
      label: item.label || meta?.label || '',
      group: item.group || meta?.group || ''
    }
  })
})

const validation = computed(() => validateSvgFiles(svgItems.value))
const coloredCount = computed(() => processedItems.value.filter((i) => i.colored).length)
const monoCount = computed(() => processedItems.value.filter((i) => !i.colored).length)

async function handleFiles(fileList) {
  if (!fileList || fileList.length === 0) return
  errorMsg.value = ''
  const added = []

  for (const file of Array.from(fileList)) {
    const lower = file.name.toLowerCase()
    if (lower.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file)
      for (const [relPath, entry] of Object.entries(zip.files)) {
        if (entry.dir || relPath.includes('__MACOSX')) continue
        const relLower = relPath.toLowerCase()
        if (relLower.endsWith('.svg')) {
          const content = await entry.async('string')
          added.push({ fileName: relPath.split('/').pop(), content })
        } else if (relLower.endsWith('catalog.json') || relLower.endsWith('manifest.json')) {
          const text = await entry.async('string')
          const parsed = parseCatalogJson(text)
          for (const [k, v] of parsed.entries()) catalogMap.value.set(k, v)
        }
      }
    } else if (lower.endsWith('.svg')) {
      const content = await file.text()
      added.push({ fileName: file.name, content })
    } else if (lower.endsWith('.json')) {
      const text = await file.text()
      const parsed = parseCatalogJson(text)
      for (const [k, v] of parsed.entries()) catalogMap.value.set(k, v)
    }
  }

  if (added.length === 0 && catalogMap.value.size === 0) {
    errorMsg.value = t.value.svgUpload.noSvgs
    return
  }

  if (added.length > 0) {
    svgItems.value = [...svgItems.value, ...added]
  }
}

function onDrop(e) {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files)
}

function onFileChange(e) {
  handleFiles(e.target.files)
  e.target.value = ''
}

function removeItem(idx) {
  svgItems.value.splice(idx, 1)
}

function clearAll() {
  svgItems.value = []
  errorMsg.value = ''
}

async function compile() {
  if (processedItems.value.length === 0) return
  building.value = true
  errorMsg.value = ''
  try {
    const library = await compileSvgsToWebfont({
      svgItems: processedItems.value,
      fontName: fontName.value,
      prefix: prefix.value
    })
    emit('built', { library, rawSvgs: svgItems.value })
  } catch (e) {
    console.error(e)
    errorMsg.value = String(e.message || e)
  } finally {
    building.value = false
  }
}
</script>

<template>
  <section class="w-full max-w-5xl mx-auto px-4 md:px-8 py-8">
    <button @click="emit('back')" class="icon-btn mb-6 text-xs">
      <ArrowLeft class="w-4 h-4" />
      <span>{{ t.backHome }}</span>
    </button>

    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
        {{ t.svgUpload.title }}
      </h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ t.svgUpload.subtitle }}
      </p>
    </div>

    <!-- Dropzone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
      class="cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-10 text-center transition-all backdrop-blur-sm"
      :class="
        isDragging
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-500'
      "
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept=".svg,.zip,.json"
        class="hidden"
        @change="onFileChange"
      />
      <UploadCloud class="w-10 h-10 mx-auto mb-3 text-neutral-500 dark:text-neutral-400" />
      <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
        {{ t.svgUpload.dropTitle }}
      </p>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        {{ t.svgUpload.dropHint }}
      </p>
    </div>

    <div
      v-if="errorMsg"
      class="mt-4 p-3.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/80 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
    >
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{{ errorMsg }}</span>
    </div>

    <div v-if="svgItems.length > 0" class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Config & Validation -->
      <div class="lg:col-span-1 space-y-4">
        <div
          class="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm space-y-4"
        >
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/60">
              <div class="text-lg font-bold">{{ svgItems.length }}</div>
              <div class="text-[11px] text-neutral-500">{{ t.svgUpload.readyCount }}</div>
            </div>
            <div class="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/60">
              <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ monoCount }}</div>
              <div class="text-[11px] text-neutral-500">{{ t.svgUpload.monoCount }}</div>
            </div>
            <div class="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/60">
              <div class="text-lg font-bold text-violet-600 dark:text-violet-400">{{ coloredCount }}</div>
              <div class="text-[11px] text-neutral-500">{{ t.svgUpload.coloredCount }}</div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              {{ t.svgUpload.fontNameLabel }}
            </label>
            <input v-model="fontName" type="text" class="w-full" placeholder="custom-icons" />
          </div>

          <div>
            <label class="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
              {{ t.svgUpload.prefixLabel }}
            </label>
            <input v-model="prefix" type="text" class="w-full" placeholder="ic" />
          </div>

          <label class="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input type="checkbox" v-model="normalizeNames" class="mt-0.5 rounded" />
            <span>{{ t.svgUpload.normalizeNames }}</span>
          </label>

          <label class="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input type="checkbox" v-model="autoDetectColored" class="mt-0.5 rounded" />
            <span>{{ t.svgUpload.coloredMode }}</span>
          </label>

          <button
            @click="compile"
            :disabled="building || svgItems.length === 0"
            class="w-full py-3 px-4 rounded-xl font-medium text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center justify-center gap-2"
          >
            <Hammer class="w-4 h-4" />
            <span>{{ building ? t.svgUpload.building : t.svgUpload.buildBtn }}</span>
          </button>
        </div>

        <!-- Validation summary -->
        <div
          class="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm space-y-3"
        >
          <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {{ t.svgUpload.validationTitle }}
          </h3>
          <div class="flex items-center gap-4 text-xs">
            <span class="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
              <AlertCircle class="w-3.5 h-3.5" /> {{ validation.errorCount }} {{ t.svgUpload.errors }}
            </span>
            <span class="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle class="w-3.5 h-3.5" /> {{ validation.warnCount }} {{ t.svgUpload.warnings }}
            </span>
            <span class="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
              <Info class="w-3.5 h-3.5" /> {{ validation.infoCount }} {{ t.svgUpload.info }}
            </span>
          </div>

          <div
            v-if="validation.errorCount + validation.warnCount > 0"
            class="max-h-40 overflow-y-auto space-y-1.5 text-[11px] font-mono pr-1"
          >
            <div
              v-for="(item, idx) in [
                ...validation.issues.placeholder,
                ...validation.issues.noPath
              ]"
              :key="'e-' + idx"
              class="text-red-600 dark:text-red-400 truncate"
              :title="`${item.file}: ${item.detail}`"
            >
              ✕ {{ item.file }} — {{ item.detail }}
            </div>
            <div
              v-for="(item, idx) in [
                ...validation.issues.stroke,
                ...validation.issues.fillBlack,
                ...validation.issues.clipPath,
                ...validation.issues.nonSquareViewBox,
                ...validation.issues.filenameSpace
              ]"
              :key="'w-' + idx"
              class="text-amber-600 dark:text-amber-400 truncate"
              :title="`${item.file}: ${item.detail}`"
            >
              ⚠ {{ item.file }} — {{ item.detail }}
            </div>
          </div>
        </div>
      </div>

      <!-- Right: SVG Preview Grid -->
      <div class="lg:col-span-2">
        <div
          class="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <button @click="fileInput?.click()" class="icon-btn !h-9 text-xs">
              <Plus class="w-3.5 h-3.5" />
              <span>{{ t.svgUpload.addMore }}</span>
            </button>
            <button
              @click="clearAll"
              class="text-xs text-neutral-500 hover:text-red-500 inline-flex items-center gap-1"
            >
              <Trash2 class="w-3.5 h-3.5" />
              {{ t.svgUpload.clearAll }}
            </button>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            <div
              v-for="(item, idx) in processedItems"
              :key="item.name + idx"
              class="relative group rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/60 p-3 flex flex-col items-center justify-center gap-2"
            >
              <button
                @click="removeItem(idx)"
                class="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
              <span
                v-if="item.colored"
                class="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-violet-500"
                title="Colored SVG"
              ></span>
              <div
                class="w-8 h-8 flex items-center justify-center text-neutral-800 dark:text-neutral-200 [&>svg]:w-7 [&>svg]:h-7"
                v-html="item.content"
              ></div>
              <span class="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate w-full text-center">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
