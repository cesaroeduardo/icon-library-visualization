<script setup>
import { ref } from 'vue'
import JSZip from 'jszip'
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Sparkles,
  UploadCloud,
  ExternalLink,
  Terminal,
  CheckCircle2
} from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { parseCatalogJson } from '@icon-library/core'

const { t } = useI18n()
const emit = defineEmits(['back', 'import-svgs'])

const copiedKey = ref('')
const isDragging = ref(false)
const fileInput = ref(null)

const installCommands = [
  {
    key: 'antigravity',
    label: 'Antigravity (project skill)',
    cmd: 'unzip create-icons.zip -d .agents/skills/'
  },
  {
    key: 'claude',
    label: 'Claude Code (global or project)',
    cmd: 'unzip create-icons.zip -d ~/.claude/skills/'
  },
  {
    key: 'cursor',
    label: 'Cursor / Other SKILL.md agents',
    cmd: 'unzip create-icons.zip -d .cursor/skills/'
  }
]

async function copyText(key, text) {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = ''
    }, 1500)
  } catch (e) {
    console.error(e)
  }
}

async function handleImportFiles(fileList) {
  if (!fileList || fileList.length === 0) return
  const svgs = []
  const metaMap = new Map()
  for (const file of Array.from(fileList)) {
    const lower = file.name.toLowerCase()
    if (lower.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file)
      for (const [relPath, entry] of Object.entries(zip.files)) {
        if (entry.dir || relPath.includes('__MACOSX')) continue
        const relLower = relPath.toLowerCase()
        if (relLower.endsWith('.svg')) {
          const content = await entry.async('string')
          svgs.push({ fileName: relPath.split('/').pop(), content })
        } else if (relLower.endsWith('catalog.json') || relLower.endsWith('manifest.json')) {
          const parsed = parseCatalogJson(await entry.async('string'))
          for (const [k, v] of parsed.entries()) metaMap.set(k, v)
        }
      }
    } else if (lower.endsWith('.svg')) {
      const content = await file.text()
      svgs.push({ fileName: file.name, content })
    } else if (lower.endsWith('.json')) {
      const parsed = parseCatalogJson(await file.text())
      for (const [k, v] of parsed.entries()) metaMap.set(k, v)
    }
  }
  if (svgs.length > 0) {
    const enriched = svgs.map((item) => {
      const base = item.fileName.replace(/\.svg$/i, '').toLowerCase()
      const meta = metaMap.get(base)
      return meta ? { ...item, keywords: meta.keywords, label: meta.label, group: meta.group } : item
    })
    emit('import-svgs', enriched)
  }
}

function onDrop(e) {
  isDragging.value = false
  handleImportFiles(e.dataTransfer?.files)
}

function onFileChange(e) {
  handleImportFiles(e.target.files)
  e.target.value = ''
}
</script>

<template>
  <section class="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <button @click="emit('back')" class="icon-btn text-xs">
        <ArrowLeft class="w-4 h-4" />
        <span>{{ t.backHome }}</span>
      </button>

      <div class="flex flex-wrap items-center gap-2.5">
        <a
          href="./skills/create-icons.zip"
          download="create-icons.zip"
          class="h-11 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Download class="w-4 h-4" />
          <span>{{ t.createSkill.downloadZip }}</span>
        </a>
        <button
          @click="fileInput?.click()"
          class="h-11 px-4 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300 font-medium text-xs inline-flex items-center gap-2 hover:bg-violet-500/20 transition-colors"
        >
          <UploadCloud class="w-4 h-4" />
          <span>{{ t.createSkill.importGenerated }}</span>
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="max-w-3xl">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 mb-3"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>SKILL.md · Python 3.8+ (stdlib only) · MIT</span>
      </div>
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
        {{ t.createSkill.title }}
      </h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {{ t.createSkill.subtitle }}
      </p>
    </div>

    <!-- Steps Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Step 1 -->
      <div
        class="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm space-y-4"
      >
        <h2 class="text-base font-semibold text-neutral-900 dark:text-white">
          {{ t.createSkill.step1Title }}
        </h2>
        <p class="text-xs text-neutral-600 dark:text-neutral-400">
          {{ t.createSkill.step1Desc }}
        </p>

        <div class="space-y-2.5">
          <div
            v-for="item in installCommands"
            :key="item.key"
            class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-900/70 p-3"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Terminal class="w-3 h-3" /> {{ item.label }}
              </span>
              <button
                @click="copyText(item.key, item.cmd)"
                class="text-[11px] text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white inline-flex items-center gap-1"
              >
                <Check v-if="copiedKey === item.key" class="w-3 h-3 text-emerald-500" />
                <Copy v-else class="w-3 h-3" />
                <span>{{ copiedKey === item.key ? t.createSkill.copied : t.createSkill.copy }}</span>
              </button>
            </div>
            <code class="text-xs font-mono text-neutral-800 dark:text-neutral-200 break-all">
              {{ item.cmd }}
            </code>
          </div>
        </div>
      </div>

      <!-- Step 2 & 3 -->
      <div
        class="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm space-y-5"
      >
        <div class="space-y-2.5">
          <h2 class="text-base font-semibold text-neutral-900 dark:text-white">
            {{ t.createSkill.step2Title }}
          </h2>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            {{ t.createSkill.step2Desc }}
          </p>
          <div
            class="relative rounded-xl border border-violet-500/25 bg-violet-500/5 p-3.5 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed"
          >
            <p class="pr-16 italic">"{{ t.createSkill.promptExample }}"</p>
            <button
              @click="copyText('prompt', t.createSkill.promptExample)"
              class="absolute top-3 right-3 text-[11px] px-2 py-1 rounded-md bg-white/80 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 inline-flex items-center gap-1"
            >
              <Check v-if="copiedKey === 'prompt'" class="w-3 h-3 text-emerald-500" />
              <Copy v-else class="w-3 h-3" />
              <span>{{ copiedKey === 'prompt' ? t.createSkill.copied : t.createSkill.copy }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <h2 class="text-base font-semibold text-neutral-900 dark:text-white">
            {{ t.createSkill.step3Title }}
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(line, i) in t.createSkill.step3Items"
              :key="i"
              class="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{{ line }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Step 4: Direct Import Dropzone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
      class="cursor-pointer rounded-2xl border-2 border-dashed p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all backdrop-blur-sm"
      :class="
        isDragging
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-neutral-300 dark:border-neutral-700 bg-white/60 dark:bg-neutral-800/50 hover:border-violet-400'
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
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0"
        >
          <UploadCloud class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">
            {{ t.createSkill.step4Title }}
          </h3>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {{ t.createSkill.importHint }}
          </p>
        </div>
      </div>
      <span
        class="shrink-0 px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
      >
        {{ t.createSkill.importGenerated }}
      </span>
    </div>

    <!-- Embedded 8 Starter Styles Gallery -->
    <div
      class="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm overflow-hidden"
    >
      <div
        class="p-5 border-b border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h2 class="text-base font-semibold text-neutral-900 dark:text-white">
            {{ t.createSkill.galleryTitle }}
          </h2>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {{ t.createSkill.gallerySubtitle }}
          </p>
        </div>
        <a
          href="./style-gallery.html"
          target="_blank"
          rel="noopener"
          class="icon-btn !h-9 text-xs"
        >
          <span>{{ t.createSkill.openFullGallery }}</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
      <iframe
        src="./style-gallery.html"
        title="8 Starter Icon Styles"
        class="w-full h-[540px] bg-white border-0"
      ></iframe>
    </div>
  </section>
</template>
