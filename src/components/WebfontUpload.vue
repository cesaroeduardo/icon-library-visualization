<script setup>
import { ref } from 'vue'
import { UploadCloud, FileType, FileCode, X, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { extractFilesFromUpload, parseUploadedWebfont } from '@/utils/webfontParser'

const { t } = useI18n()
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

async function handleFiles(fileList) {
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
  } catch (e) {
    console.error(e)
    errorMsg.value = e.message || t.value.webfontUpload.errorNoFont
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
  <section class="w-full max-w-3xl mx-auto px-4 md:px-8 py-8">
    <button @click="emit('back')" class="icon-btn mb-6 text-xs">
      <ArrowLeft class="w-4 h-4" />
      <span>{{ t.backHome }}</span>
    </button>

    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
        {{ t.webfontUpload.title }}
      </h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ t.webfontUpload.subtitle }}
      </p>
    </div>

    <!-- Dropzone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
      class="cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all backdrop-blur-sm"
      :class="
        isDragging
          ? 'border-sky-500 bg-sky-500/10'
          : 'border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-500'
      "
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept=".ttf,.otf,.woff,.woff2,.css,.json,.zip"
        class="hidden"
        @change="onFileChange"
      />
      <UploadCloud class="w-10 h-10 mx-auto mb-3 text-neutral-500 dark:text-neutral-400" />
      <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
        {{ t.webfontUpload.dropTitle }}
      </p>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">
        {{ t.webfontUpload.dropHint }}
      </p>
    </div>

    <!-- Error -->
    <div
      v-if="errorMsg"
      class="mt-4 p-3.5 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/80 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
    >
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
      <span>{{ errorMsg }}</span>
    </div>

    <!-- Selected files -->
    <div
      v-if="extractedFonts.length > 0 || extractedCss.length > 0"
      class="mt-6 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm space-y-5"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {{ t.webfontUpload.filesSelected }}
        </span>
        <button @click="clearFiles" class="text-xs text-neutral-500 hover:text-red-500 inline-flex items-center gap-1">
          <X class="w-3.5 h-3.5" />
          {{ t.webfontUpload.clearFiles }}
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="(f, idx) in extractedFonts"
          :key="'f-' + idx"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
        >
          <FileType class="w-3.5 h-3.5" />
          {{ f.name }}
        </span>
        <span
          v-for="(c, idx) in extractedCss"
          :key="'c-' + idx"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
        >
          <FileCode class="w-3.5 h-3.5" />
          {{ c.name }}
        </span>
      </div>

      <div class="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
        <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0" />
        <span>{{ extractedCss.length > 0 ? t.webfontUpload.cssDetected : t.webfontUpload.noCssNote }}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            {{ t.webfontUpload.fontNameLabel }}
          </label>
          <input v-model="customFontName" type="text" class="w-full" placeholder="my-icons" />
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
            {{ t.webfontUpload.prefixLabel }}
          </label>
          <input v-model="customPrefix" type="text" class="w-full" placeholder="ic" />
        </div>
      </div>

      <button
        @click="buildLibrary"
        :disabled="loading || extractedFonts.length === 0"
        class="w-full py-3 px-4 rounded-xl font-medium text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {{ loading ? t.webfontUpload.loading : t.webfontUpload.loadBtn }}
      </button>
    </div>
  </section>
</template>
