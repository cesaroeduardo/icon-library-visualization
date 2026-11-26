<script setup>
import { ref } from 'vue'
import JSZip from 'jszip'
import {
  ArrowLeft,
  ArrowRight,
  FileCode2,
  FileType,
  Sparkles,
  Download,
  ExternalLink,
  Copy,
  Check,
  UploadCloud,
  Terminal
} from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { parseCatalogJson } from '@icon-library/core'

const { lang, t } = useI18n()
const emit = defineEmits(['back', 'select', 'import-svgs'])

const showSkillPanel = ref(false)
const copied = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)

const installCmd = 'unzip create-icons.zip -d .agents/skills/ && unzip catalog-icons.zip -d .agents/skills/'

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installCmd)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // ignore
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
          svgs.push({ fileName: relPath.split('/').pop(), content: await entry.async('string') })
        } else if (relLower.endsWith('catalog.json') || relLower.endsWith('manifest.json')) {
          const parsed = parseCatalogJson(await entry.async('string'))
          for (const [k, v] of parsed.entries()) metaMap.set(k, v)
        }
      }
    } else if (lower.endsWith('.svg')) {
      svgs.push({ fileName: file.name, content: await file.text() })
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
</script>

<template>
  <section class="w-full max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
    <button @click="emit('back')" class="tuff-btn-quiet">
      <ArrowLeft class="w-3.5 h-3.5" />
      <span>{{ lang === 'pt' ? 'Voltar para a Library' : 'Back to Library' }}</span>
    </button>

    <div class="max-w-2xl space-y-2">
      <span class="tuff-tag">ICON LIBRARY STUDIO</span>
      <h1 class="text-3xl md:text-4xl font-semibold tracking-[-0.03em]">
        {{ lang === 'pt' ? 'Crie a sua própria Icon Library' : 'Create your own Icon Library' }}
      </h1>
      <p class="text-sm leading-relaxed" style="color: var(--muted-foreground);">
        {{
          lang === 'pt'
            ? 'Escolha como deseja começar: suba arquivos SVG para compilar uma webfont, inspecione uma webfont existente ou use nossas skills de IA para desenhar e catalogar seus próprios ícones.'
            : 'Choose how to get started: upload SVG files to compile a webfont, inspect an existing webfont, or use our AI skills to draw and catalog your own icons.'
        }}
      </p>
    </div>

    <!-- 3 Studio Options -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Option 1: Upload SVGs -->
      <div class="tuff-shell flex flex-col">
        <div class="flex items-center justify-between px-3 py-2">
          <span
            class="h-9 w-9 rounded-xl flex items-center justify-center"
            style="background-color: var(--fg-tint-6);"
          >
            <FileCode2 class="w-4 h-4" />
          </span>
          <span class="tuff-tag">SVG → WOFF/TTF</span>
        </div>
        <div class="tuff-panel flex-1 p-5 flex flex-col justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-base font-semibold tracking-[-0.02em]">{{ t.cards.svg.title }}</h2>
            <p class="text-xs leading-relaxed" style="color: var(--muted-foreground);">
              {{ t.cards.svg.description }}
            </p>
          </div>
          <button @click="emit('select', 'svg')" class="tuff-btn-primary w-full">
            <span>{{ t.cards.svg.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Option 2: Upload Webfont -->
      <div class="tuff-shell flex flex-col">
        <div class="flex items-center justify-between px-3 py-2">
          <span
            class="h-9 w-9 rounded-xl flex items-center justify-center"
            style="background-color: var(--fg-tint-6);"
          >
            <FileType class="w-4 h-4" />
          </span>
          <span class="tuff-tag">WOFF2 · TTF · CSS</span>
        </div>
        <div class="tuff-panel flex-1 p-5 flex flex-col justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-base font-semibold tracking-[-0.02em]">{{ t.cards.webfont.title }}</h2>
            <p class="text-xs leading-relaxed" style="color: var(--muted-foreground);">
              {{ t.cards.webfont.description }}
            </p>
          </div>
          <button @click="emit('select', 'webfont')" class="tuff-btn-secondary w-full">
            <span>{{ t.cards.webfont.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Option 3: Create with AI Skill -->
      <div class="tuff-shell flex flex-col">
        <div class="flex items-center justify-between px-3 py-2">
          <span
            class="h-9 w-9 rounded-xl flex items-center justify-center"
            style="background-color: var(--fg-tint-6);"
          >
            <Sparkles class="w-4 h-4" />
          </span>
          <span class="tuff-tag">CREATE + CATALOG</span>
        </div>
        <div class="tuff-panel flex-1 p-5 flex flex-col justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-base font-semibold tracking-[-0.02em]">{{ t.cards.create.title }}</h2>
            <p class="text-xs leading-relaxed" style="color: var(--muted-foreground);">
              {{ t.cards.create.description }}
            </p>
          </div>
          <button @click="showSkillPanel = !showSkillPanel" class="tuff-btn-secondary w-full">
            <span>{{ lang === 'pt' ? 'Usar Skills de IA' : 'Use AI Skills' }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Expanded AI Skill Instructions & Direct SVG Import -->
    <div v-if="showSkillPanel" class="tuff-shell">
      <div class="tuff-panel p-6 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold tracking-[-0.02em]">
              {{ lang === 'pt' ? 'Skills de Criação & Catalogação' : 'Icon Creation & Cataloging Skills' }}
            </h3>
            <p class="text-xs mt-0.5" style="color: var(--muted-foreground);">
              {{
                lang === 'pt'
                  ? 'Baixe as skills, gere os SVGs + catalog.json no seu agente e importe direto aqui.'
                  : 'Download the skills, generate SVGs + catalog.json in your agent, and import them right here.'
              }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <a href="./skills/create-icons.zip" download="create-icons.zip" class="tuff-btn-primary">
              <Download class="w-3.5 h-3.5" />
              <span>create-icons.zip</span>
            </a>
            <a href="./skills/catalog-icons.zip" download="catalog-icons.zip" class="tuff-btn-secondary">
              <Download class="w-3.5 h-3.5" />
              <span>catalog-icons.zip</span>
            </a>
            <a href="./style-gallery.html" target="_blank" rel="noopener" class="tuff-btn-quiet">
              <span>{{ lang === 'pt' ? '8 estilos' : '8 styles' }}</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div class="tuff-inset p-3 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <Terminal class="w-3.5 h-3.5 shrink-0" style="color: var(--muted-foreground);" />
            <code class="font-mono text-xs truncate">{{ installCmd }}</code>
          </div>
          <button @click="copyInstall" class="tuff-btn-quiet !h-7 shrink-0">
            <Check v-if="copied" class="w-3.5 h-3.5" style="color: var(--positive);" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span class="text-xs">{{ copied ? (lang === 'pt' ? 'Copiado' : 'Copied') : (lang === 'pt' ? 'Copiar' : 'Copy') }}</span>
          </button>
        </div>

        <div
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="(e) => { isDragging = false; handleImportFiles(e.dataTransfer?.files) }"
          @click="fileInput?.click()"
          class="tuff-inset p-6 text-center cursor-pointer transition-colors"
          :style="isDragging ? 'background-color: var(--surface-raised);' : ''"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".svg,.zip,.json"
            class="hidden"
            @change="(e) => { handleImportFiles(e.target.files); e.target.value = '' }"
          />
          <UploadCloud class="w-7 h-7 mx-auto mb-2" style="color: var(--muted-foreground);" />
          <p class="text-xs font-medium">
            {{
              lang === 'pt'
                ? 'Já gerou seus ícones? Arraste os SVGs + catalog.json (ou .zip) aqui para compilar'
                : 'Already generated your icons? Drop SVGs + catalog.json (or .zip) here to compile'
            }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
