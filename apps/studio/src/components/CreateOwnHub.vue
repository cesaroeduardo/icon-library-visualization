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

const copied = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)

const installCmd = 'npx skills add cesaroeduardo/icon-library-visualization'
const GITHUB_URL = 'https://github.com/cesaroeduardo/icon-library-visualization'

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
            ? 'Suba seus arquivos SVG para compilar uma webfont ou inspecione uma webfont que você já possui.'
            : 'Upload your SVG files to compile a webfont or inspect a webfont you already have.'
        }}
      </p>
    </div>

    <!-- Row 1: Two Primary Options Side by Side -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div class="tuff-panel flex-1 p-6 flex flex-col justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-lg font-semibold tracking-[-0.02em]">{{ t.cards.svg.title }}</h2>
            <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--muted-foreground);">
              {{ t.cards.svg.description }}
            </p>
          </div>
          <button @click="emit('select', 'svg')" class="tuff-btn-primary w-full !h-10">
            <span>{{ t.cards.svg.cta }}</span>
            <ArrowRight class="w-4 h-4" />
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
        <div class="tuff-panel flex-1 p-6 flex flex-col justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-lg font-semibold tracking-[-0.02em]">{{ t.cards.webfont.title }}</h2>
            <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--muted-foreground);">
              {{ t.cards.webfont.description }}
            </p>
          </div>
          <button @click="emit('select', 'webfont')" class="tuff-btn-secondary w-full !h-10">
            <span>{{ t.cards.webfont.cta }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Divider: "Ainda não tem seus ícones?" -->
    <div class="flex items-center gap-4 py-2">
      <div class="h-px flex-1" style="background-color: var(--border);"></div>
      <span
        class="text-xs font-medium tracking-wide px-3 py-1 rounded-full"
        style="background-color: var(--fg-tint-4); color: var(--muted-foreground);"
      >
        {{ lang === 'pt' ? 'Ainda não tem seus ícones?' : "Don't have your icons yet?" }}
      </span>
      <div class="h-px flex-1" style="background-color: var(--border);"></div>
    </div>

    <!-- Row 2: Full-Width Featured Horizontal Layout for Create My Own Icons -->
    <div class="tuff-shell">
      <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div class="flex items-center gap-2.5">
          <span
            class="h-8 w-8 rounded-xl flex items-center justify-center"
            style="background-color: color-mix(in srgb, var(--brand) 16%, transparent); color: var(--brand);"
          >
            <Sparkles class="w-4 h-4" />
          </span>
          <span class="text-xs font-semibold tracking-[-0.01em]">
            {{ t.cards.create.title }}
          </span>
        </div>
        <span class="tuff-tag">AI SKILLS · CREATE + CATALOG · 8 STYLES</span>
      </div>

      <div class="tuff-panel p-6 md:p-7">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <!-- Left: Description, Skill Downloads & Install Command -->
          <div class="lg:col-span-7 space-y-5">
            <div class="space-y-2">
              <h2 class="text-xl md:text-2xl font-semibold tracking-[-0.025em]">
                {{
                  lang === 'pt'
                    ? 'Gere e catalogue ícones originais com seu agente de IA'
                    : 'Generate & catalog original icons with your AI agent'
                }}
              </h2>
              <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--muted-foreground);">
                {{
                  lang === 'pt'
                    ? 'Instale nossas duas skills (create-icons + catalog-icons) direto do GitHub no Antigravity, Claude Code, Cursor ou Codex para desenhar SVGs alinhados ao seu design system e gerar o catalog.json com keywords.'
                    : 'Install our two skills (create-icons + catalog-icons) straight from GitHub into Antigravity, Claude Code, Cursor, or Codex to draw SVGs matched to your design system and build catalog.json with keywords.'
                }}
              </p>
              <p class="text-xs" style="color: var(--muted-foreground);">
                {{ lang === 'pt' ? 'Skill create-icons inspirada em ' : 'create-icons skill inspired by ' }}
                <a
                  href="https://x.com/banhosdev"
                  target="_blank"
                  rel="noopener"
                  class="font-medium hover:underline"
                  style="color: var(--brand);"
                >@banhosdev</a>
                (<a
                  href="https://github.com/sergiobanhos/generate-icons"
                  target="_blank"
                  rel="noopener"
                  class="font-mono text-[11px] hover:underline"
                  style="color: var(--brand);"
                >sergiobanhos/generate-icons</a>).
              </p>
            </div>

            <div class="tuff-inset px-3.5 py-2.5 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <Terminal class="w-3.5 h-3.5 shrink-0" style="color: var(--muted-foreground);" />
                <code class="font-mono text-xs truncate">$ {{ installCmd }}</code>
              </div>
              <button @click="copyInstall" class="tuff-btn-quiet !h-7 shrink-0">
                <Check v-if="copied" class="w-3.5 h-3.5" style="color: var(--positive);" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span class="text-xs">
                  {{ copied ? (lang === 'pt' ? 'Copiado' : 'Copied') : (lang === 'pt' ? 'Copiar' : 'Copy') }}
                </span>
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <a
                :href="`${GITHUB_URL}/tree/main/skills/create-icons`"
                target="_blank"
                rel="noopener"
                class="tuff-btn-secondary"
              >
                <span>skills/create-icons</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
              <a
                :href="`${GITHUB_URL}/tree/main/skills/catalog-icons`"
                target="_blank"
                rel="noopener"
                class="tuff-btn-secondary"
              >
                <span>skills/catalog-icons</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
              <a href="../#docs-skills" class="tuff-btn-quiet">
                <span>{{ lang === 'pt' ? 'Preview dos 8 estilos' : 'Preview 8 styles' }}</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- Right: Direct Dropzone for Skill-Generated SVGs -->
          <div class="lg:col-span-5">
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="(e) => { isDragging = false; handleImportFiles(e.dataTransfer?.files) }"
              @click="fileInput?.click()"
              class="tuff-inset p-7 text-center cursor-pointer transition-colors h-full min-h-[210px] flex flex-col items-center justify-center gap-3"
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
              <span
                class="h-11 w-11 rounded-2xl flex items-center justify-center"
                style="background-color: var(--fg-tint-6);"
              >
                <UploadCloud class="w-5 h-5" style="color: var(--brand);" />
              </span>
              <div class="space-y-1">
                <p class="text-xs sm:text-sm font-medium">
                  {{
                    lang === 'pt'
                      ? 'Já gerou seus ícones com a skill?'
                      : 'Already generated icons with the skill?'
                  }}
                </p>
                <p class="text-xs leading-relaxed" style="color: var(--muted-foreground);">
                  {{
                    lang === 'pt'
                      ? 'Arraste os SVGs + catalog.json (ou .zip) aqui para compilar direto na library.'
                      : 'Drop your SVGs + catalog.json (or .zip) here to compile straight into the library.'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
