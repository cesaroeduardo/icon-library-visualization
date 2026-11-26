<script setup>
import { ref, watch, onMounted } from 'vue'
import { UploadCloud, FileType, FileCode, X, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { extractFilesFromUpload, parseUploadedWebfont } from '@icon-library/core'

const { t } = useI18n()

const props = defineProps({
  initialFiles: { type: Array, default: () => [] },
  autoBuild: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'loaded'])

const isDragging = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const extractedFonts = ref([])
const extractedCss = ref([])
const extractedJson = ref([])
const customFontName = ref('')
const customPrefix = ref('')
const fileInput = ref(null)
const seeded = ref(false)

async function handleFiles(fileList, { autoBuild = false } = {}) {
  if (!fileList || fileList.length === 0) return
  errorMsg.value = ''
  try {
    const { fonts, cssFiles, jsonFiles } = await extractFilesFromUpload(fileList)
    if (fonts.length === 0 && cssFiles.length === 0 && jsonFiles.length === 0) {
      errorMsg.value = t.value.webfontUpload.errorNoFont
      return
    }
    extractedFonts.value = [...extractedFonts.value, ...fonts]
    extractedCss.value = [...extractedCss.value, ...cssFiles]
    extractedJson.value = [...extractedJson.value, ...jsonFiles]
    if (!customFontName.value && fonts[0]) {
      customFontName.value = fonts[0].name.replace(/\.[^.]+$/, '')
    }
    if (autoBuild && extractedFonts.value.length > 0) {
      await buildLibrary()
    }
  } catch (e) {
    console.error(e)
    errorMsg.value = e.message || t.value.webfontUpload.errorNoFont
  }
}

async function seedFromInitial() {
  if (seeded.value || !props.initialFiles?.length) return
  seeded.value = true
  await handleFiles(props.initialFiles, { autoBuild: props.autoBuild })
}

onMounted(seedFromInitial)
watch(
  () => props.initialFiles,
  () => {
    if (!seeded.value) seedFromInitial()
  }
)

function onDrop(e) {
  isDragging.value = false
  handleFiles(e.dataTransfer?.files)
}

function onFileChange(e) {
  handleFiles(e.target.files)
  e.target.value = ''
}

function clearFiles() {
  extractedFonts.value = []
  extractedCss.value = []
  extractedJson.value = []
  errorMsg.value = ''
}

async function buildLibrary() {
  if (extractedFonts.value.length === 0) {
    errorMsg.value = t.value.webfontUpload.errorNoFont
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const library = await parseUploadedWebfont({
      fonts: extractedFonts.value,
      cssFiles: extractedCss.value,
      jsonFiles: extractedJson.value,
      customFontName: customFontName.value,
      customPrefix: customPrefix.value
    })
    if (library.notice === 'WOFF2_WITHOUT_CSS') {
      errorMsg.value = t.value.webfontUpload.errorWoff2Notice
      loading.value = false
      return
    }
    emit('loaded', library)
  } catch (e) {
    console.error(e)
    errorMsg.value = e.message === 'NO_FONT_FILE' ? t.value.webfontUpload.errorNoFont : String(e.message || e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="w-full max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
    <button @click="emit('back')" class="tuff-btn-quiet">
      <ArrowLeft class="w-3.5 h-3.5" />
      <span>{{ t.backHome }}</span>
    </button>

    <div>
      <h1 class="text-2xl md:text-3xl font-semibold tracking-[-0.03em] mb-1.5">
        {{ t.webfontUpload.title }}
      </h1>
      <p class="text-sm" style="color: var(--muted-foreground);">
        {{ t.webfontUpload.subtitle }}
      </p>
    </div>

    <!-- Dropzone inside TUFFUI Shell -> Panel -->
    <div class="tuff-shell">
      <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        @click="fileInput?.click()"
        class="tuff-panel cursor-pointer p-10 text-center transition-colors"
        :style="isDragging ? 'background-color: var(--surface-raised);' : ''"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".ttf,.otf,.woff,.woff2,.css,.json,.zip"
          class="hidden"
          @change="onFileChange"
        />
        <UploadCloud class="w-9 h-9 mx-auto mb-3" style="color: var(--muted-foreground);" />
        <p class="text-sm font-medium mb-1">
          {{ t.webfontUpload.dropTitle }}
        </p>
        <p class="text-xs" style="color: var(--muted-foreground);">
          {{ t.webfontUpload.dropHint }}
        </p>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="errorMsg"
      class="rounded-2xl p-4 text-xs flex items-start gap-2.5"
      style="background-color: color-mix(in srgb, var(--negative) 14%, transparent); color: var(--negative);"
    >
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Selected files -->
    <div v-if="extractedFonts.length > 0 || extractedCss.length > 0" class="tuff-shell">
      <div class="tuff-panel p-5 space-y-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium uppercase tracking-wider" style="color: var(--muted-foreground);">
            {{ t.webfontUpload.filesSelected }}
          </span>
          <button @click="clearFiles" class="tuff-btn-quiet !h-7 text-xs">
            <X class="w-3.5 h-3.5" />
            {{ t.webfontUpload.clearFiles }}
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="(f, idx) in extractedFonts"
            :key="'f-' + idx"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
            style="background-color: color-mix(in srgb, var(--brand) 15%, transparent); color: var(--brand);"
          >
            <FileType class="w-3.5 h-3.5" />
            {{ f.name }}
          </span>
          <span
            v-for="(c, idx) in extractedCss"
            :key="'c-' + idx"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
            style="background-color: color-mix(in srgb, var(--positive) 15%, transparent); color: var(--positive);"
          >
            <FileCode class="w-3.5 h-3.5" />
            {{ c.name }}
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs" style="color: var(--muted-foreground);">
          <CheckCircle2 class="w-4 h-4 shrink-0" style="color: var(--positive);" />
          <span>{{ extractedCss.length > 0 ? t.webfontUpload.cssDetected : t.webfontUpload.noCssNote }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--muted-foreground);">
              {{ t.webfontUpload.fontNameLabel }}
            </label>
            <input v-model="customFontName" type="text" class="tuff-input w-full" placeholder="my-icons" />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1.5" style="color: var(--muted-foreground);">
              {{ t.webfontUpload.prefixLabel }}
            </label>
            <input v-model="customPrefix" type="text" class="tuff-input w-full" placeholder="ic" />
          </div>
        </div>

        <button
          @click="buildLibrary"
          :disabled="loading || extractedFonts.length === 0"
          class="tuff-btn-primary w-full !h-10 text-sm"
        >
          {{ loading ? t.webfontUpload.loading : t.webfontUpload.loadBtn }}
        </button>
      </div>
    </div>
  </section>
</template>
