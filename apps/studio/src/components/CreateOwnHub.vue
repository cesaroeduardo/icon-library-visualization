<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import JSZip from 'jszip'
import {
  ArrowLeft,
  ArrowRight,
  FileCode2,
  FileType,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  UploadCloud,
  Terminal,
  Server
} from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { parseCatalogJson } from '@icon-library/core'
import AgentCanvasMini from './AgentCanvasMini.vue'

const { lang, t } = useI18n()
const emit = defineEmits(['back', 'select', 'import-svgs', 'import-webfont'])

const copied = ref(false)
const isDragging = ref(false)
const dropBusy = ref(false)
const dropError = ref('')
const dragDepth = ref(0)
const fileInput = ref(null)

const FONT_EXTS = ['.ttf', '.otf', '.woff', '.woff2']
const installCmd = 'npx skills add cesaroeduardo/icon-library-visualization'
const GITHUB_URL = 'https://github.com/cesaroeduardo/icon-library-visualization'

function isFileDrag(e) {
  return Array.from(e.dataTransfer?.types || []).includes('Files')
}

function onDragEnter(e) {
  if (!isFileDrag(e)) return
  e.preventDefault()
  dragDepth.value += 1
  isDragging.value = true
  dropError.value = ''
}

function onDragOver(e) {
  if (!isFileDrag(e)) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
  isDragging.value = true
}

function onDragLeave(e) {
  if (!isFileDrag(e)) return
  e.preventDefault()
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  if (dragDepth.value === 0) isDragging.value = false
}

async function onDrop(e) {
  e.preventDefault()
  dragDepth.value = 0
  isDragging.value = false
  await handleIncomingFiles(e.dataTransfer?.files)
}

onMounted(() => {
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('drop', onDrop)
})

onUnmounted(() => {
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('drop', onDrop)
})

async function copyInstall() {
  try {
    await navigator.clipboard.writeText(installCmd)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // ignore
  }
}

const copiedPrompt = ref(false)
const AGENT_PROMPT = {
  pt: `Clone o repositório https://github.com/cesaroeduardo/icon-library-visualization e instale as skills de ícones no meu agente com \`npx skills add cesaroeduardo/icon-library-visualization\` (create-icons + catalog-icons). Use create-icons para analisar o design system do meu projeto (tokens, fontes e ícones atuais) e gerar SVGs originais 24×24 no mesmo estilo; use catalog-icons para o catalog.json. Coloque os SVGs + catalog.json em apps/selfhost/icons/, ajuste selfhost.config.json e brand/logo.svg com o nome/logo do meu produto, rode \`pnpm --filter @icon-library/selfhost build\` e me diga como publicar apps/selfhost/dist/ (galeria self-hosted só da minha library, sem demos).`,
  en: `Clone the repository https://github.com/cesaroeduardo/icon-library-visualization and install the icon skills into my agent with \`npx skills add cesaroeduardo/icon-library-visualization\` (create-icons + catalog-icons). Use create-icons to analyze my project's design system (tokens, fonts and current icons) and generate original 24×24 SVGs in the same style; use catalog-icons for catalog.json. Put the SVGs + catalog.json into apps/selfhost/icons/, update selfhost.config.json and brand/logo.svg with my product name/logo, run \`pnpm --filter @icon-library/selfhost build\`, and tell me how to publish apps/selfhost/dist/ (a self-hosted gallery of only my library, no demos).`
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(AGENT_PROMPT[lang.value] || AGENT_PROMPT.en)
    copiedPrompt.value = true
    setTimeout(() => (copiedPrompt.value = false), 1500)
  } catch {
    // ignore
  }
}

function endsWithAny(name, exts) {
  return exts.some((ext) => name.endsWith(ext))
}

async function classifyUpload(fileList) {
  let hasSvg = false
  let hasFont = false
  let hasCss = false

  for (const file of Array.from(fileList)) {
    const lower = file.name.toLowerCase()
    if (lower.endsWith('.svg')) {
      hasSvg = true
      continue
    }
    if (endsWithAny(lower, FONT_EXTS)) {
      hasFont = true
      continue
    }
    if (lower.endsWith('.css')) {
      hasCss = true
      continue
    }
    if (!lower.endsWith('.zip')) continue

    const zip = await JSZip.loadAsync(file)
    for (const [relPath, entry] of Object.entries(zip.files)) {
      if (entry.dir || relPath.includes('__MACOSX')) continue
      const relLower = relPath.toLowerCase()
      if (relLower.endsWith('.svg')) hasSvg = true
      if (endsWithAny(relLower, FONT_EXTS)) hasFont = true
      if (relLower.endsWith('.css')) hasCss = true
    }
  }

  // Font packages win even if the zip also ships SVGs (compiled bundles).
  if (hasFont || (hasCss && !hasSvg)) return 'webfont'
  if (hasSvg) return 'svg'
  return null
}

async function buildSvgPayload(fileList) {
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
  return svgs.map((item) => {
    const base = item.fileName.replace(/\.svg$/i, '').toLowerCase()
    const meta = metaMap.get(base)
    return meta ? { ...item, keywords: meta.keywords, label: meta.label, group: meta.group } : item
  })
}

async function handleIncomingFiles(fileList) {
  if (!fileList || fileList.length === 0 || dropBusy.value) return
  dropBusy.value = true
  dropError.value = ''
  try {
    const kind = await classifyUpload(fileList)
    if (kind === 'webfont') {
      emit('import-webfont', Array.from(fileList))
      return
    }
    if (kind === 'svg') {
      const enriched = await buildSvgPayload(fileList)
      if (enriched.length === 0) {
        dropError.value =
          lang.value === 'pt'
            ? 'Nenhum SVG encontrado nos arquivos enviados.'
            : 'No SVG files found in the upload.'
        return
      }
      emit('import-svgs', enriched)
      return
    }
    dropError.value =
      lang.value === 'pt'
        ? 'Envie .svg, .zip com SVGs, ou uma webfont (.ttf, .otf, .woff, .woff2, .css).'
        : 'Drop .svg, a .zip with SVGs, or a webfont (.ttf, .otf, .woff, .woff2, .css).'
  } catch (e) {
    console.error(e)
    dropError.value =
      lang.value === 'pt'
        ? 'Não foi possível ler os arquivos. Tente novamente.'
        : 'Could not read those files. Please try again.'
  } finally {
    dropBusy.value = false
  }
}

async function handleImportFiles(fileList) {
  await handleIncomingFiles(fileList)
}
</script>

<template>
  <section class="relative w-full max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
    <Teleport to="body">
      <div
        v-if="isDragging || dropBusy"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
        style="background-color: color-mix(in srgb, var(--background) 72%, transparent); backdrop-filter: blur(6px);"
      >
        <div
          class="tuff-shell max-w-md w-full pointer-events-none"
          style="box-shadow: 0 24px 80px color-mix(in srgb, var(--foreground) 18%, transparent);"
        >
          <div class="tuff-panel px-8 py-10 text-center space-y-3">
            <span
              class="mx-auto h-12 w-12 rounded-2xl flex items-center justify-center"
              style="background-color: color-mix(in srgb, var(--brand) 16%, transparent); color: var(--brand);"
            >
              <UploadCloud class="w-6 h-6" :class="dropBusy ? 'animate-pulse' : ''" />
            </span>
            <p class="text-base font-semibold tracking-[-0.02em]">
              {{
                dropBusy
                  ? (lang === 'pt' ? 'Reconhecendo arquivos…' : 'Recognizing files…')
                  : (lang === 'pt' ? 'Solte para importar' : 'Drop to import')
              }}
            </p>
            <p class="text-xs leading-relaxed" style="color: var(--muted-foreground);">
              {{
                lang === 'pt'
                  ? 'SVG, .zip ou webfont (.ttf / .otf / .woff / .woff2 / .css). Avançamos automático para a compilação.'
                  : 'SVG, .zip, or webfont (.ttf / .otf / .woff / .woff2 / .css). We route you straight to compilation.'
              }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>

    <button @click="emit('back')" class="tuff-btn-quiet">
      <ArrowLeft class="w-3.5 h-3.5" />
      <span>{{ lang === 'pt' ? 'Voltar para a Library' : 'Back to Library' }}</span>
    </button>

    <div class="max-w-2xl space-y-2">
      <h1 class="text-3xl md:text-4xl font-semibold tracking-[-0.03em]">
        {{ lang === 'pt' ? 'Crie a sua própria Icon Library' : 'Create your own Icon Library' }}
      </h1>
      <p class="text-sm leading-relaxed" style="color: var(--muted-foreground);">
        {{
          lang === 'pt'
            ? 'Arraste .svg, .zip ou webfont em qualquer lugar desta página. Reconhecemos o tipo e avançamos para a compilação. Ou escolha uma opção abaixo.'
            : 'Drop .svg, .zip, or a webfont anywhere on this page. We detect the type and advance to compilation. Or pick an option below.'
        }}
      </p>
      <p
        v-if="dropError"
        class="text-xs rounded-xl px-3 py-2"
        style="background-color: color-mix(in srgb, var(--negative) 14%, transparent); color: var(--negative);"
      >
        {{ dropError }}
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

    <!-- Self-host: only your library -->
    <div class="tuff-shell">
      <div class="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div class="flex items-center gap-2.5">
          <span
            class="h-8 w-8 rounded-xl flex items-center justify-center"
            style="background-color: color-mix(in srgb, var(--brand) 16%, transparent); color: var(--brand);"
          >
            <Server class="w-4 h-4" />
          </span>
          <span class="text-xs font-semibold tracking-[-0.01em]">
            {{ lang === 'pt' ? 'Self-host facilitado' : 'Facilitated self-host' }}
          </span>
        </div>
        <span class="tuff-tag">apps/selfhost</span>
      </div>

      <div class="tuff-panel p-6 md:p-7 space-y-5">
        <div class="space-y-2 max-w-3xl">
          <h2 class="text-xl md:text-2xl font-semibold tracking-[-0.025em]">
            {{
              lang === 'pt'
                ? 'Hospede a galeria só com os seus ícones'
                : 'Host a gallery with only your icons'
            }}
          </h2>
          <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--muted-foreground);">
            {{
              lang === 'pt'
                ? 'Quer um site só da sua library, sem demos de terceiros? Coloque os SVGs na pasta icons/, troque a logo, rode o build e publique. catalog.json é opcional: melhora a busca, mas não é obrigatório.'
                : 'Want a site with only your library, with no third-party demos? Drop SVGs in the icons/ folder, swap the logo, run the build, and publish. catalog.json is optional: it improves search, but you can skip it.'
            }}
          </p>
        </div>

        <ul class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs" style="color: var(--muted-foreground);">
          <li class="tuff-inset px-3 py-2.5">
            <strong class="block font-medium mb-0.5" style="color: var(--foreground);">
              {{ lang === 'pt' ? '1. Coloque os SVGs' : '1. Add your SVGs' }}
            </strong>
            icons/ · catalog.json {{ lang === 'pt' ? 'opcional' : 'optional' }}
          </li>
          <li class="tuff-inset px-3 py-2.5">
            <strong class="block font-medium mb-0.5" style="color: var(--foreground);">
              {{ lang === 'pt' ? '2. Troque a logo' : '2. Swap the logo' }}
            </strong>
            brand/logo.svg · selfhost.config.json
          </li>
          <li class="tuff-inset px-3 py-2.5">
            <strong class="block font-medium mb-0.5" style="color: var(--foreground);">
              {{ lang === 'pt' ? '3. Build e publique' : '3. Build & publish' }}
            </strong>
            pnpm --filter @icon-library/selfhost build
          </li>
        </ul>

        <div class="flex flex-wrap items-center gap-2">
          <a
            :href="`${GITHUB_URL}/tree/main/apps/selfhost`"
            target="_blank"
            rel="noopener"
            class="tuff-btn-primary !h-10"
          >
            <span>{{ lang === 'pt' ? 'Abrir apps/selfhost' : 'Open apps/selfhost' }}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
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
      <div class="flex flex-wrap items-center gap-2 px-3 py-2">
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
      </div>

      <div class="tuff-panel p-6 md:p-7 space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <!-- Left: Description, Skill Install Command & Links -->
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
              <a href="/#docs-skills" class="tuff-btn-quiet">
                <span>{{ lang === 'pt' ? 'Preview dos 8 estilos' : 'Preview 8 styles' }}</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- Right: Animated Claude Agent Drawing Canvas -->
          <div class="lg:col-span-5">
            <AgentCanvasMini :lang="lang" />
          </div>
        </div>

        <div class="space-y-2">
          <!-- Copyable AI Agent Prompt Banner -->
          <div class="tuff-inset px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3.5 min-w-0">
              <span
                class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style="background-color: var(--fg-tint-6);"
              >
                <Sparkles class="w-5 h-5" style="color: var(--brand);" />
              </span>
              <div class="text-left min-w-0">
                <p class="text-xs sm:text-sm font-medium">
                  {{ lang === 'pt' ? 'Quer que o agente faça tudo?' : 'Want your agent to do it all?' }}
                </p>
                <p class="text-xs" style="color: var(--muted-foreground);">
                  {{
                    lang === 'pt'
                      ? 'Copie o prompt: ele gera os ícones, coloca em apps/selfhost/icons/ e prepara o build self-hosted.'
                      : 'Copy the prompt: it generates icons, puts them in apps/selfhost/icons/, and prepares the self-hosted build.'
                  }}
                </p>
              </div>
            </div>
            <button @click="copyPrompt" class="tuff-btn-secondary shrink-0">
              <Check v-if="copiedPrompt" class="w-3.5 h-3.5" style="color: var(--positive);" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>
                {{
                  copiedPrompt
                    ? (lang === 'pt' ? 'Prompt copiado' : 'Prompt copied')
                    : (lang === 'pt' ? 'Copiar prompt' : 'Copy prompt')
                }}
              </span>
            </button>
          </div>

          <!-- Bottom: Direct picker (page-wide drop also works) -->
          <div
            @click="fileInput?.click()"
            class="tuff-inset px-5 py-4 cursor-pointer transition-colors flex flex-col sm:flex-row items-center justify-between gap-4"
            :style="isDragging ? 'background-color: var(--surface-raised);' : ''"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".svg,.zip,.json,.ttf,.otf,.woff,.woff2,.css"
              class="hidden"
              @change="(e) => { handleImportFiles(e.target.files); e.target.value = '' }"
            />
            <div class="flex items-center gap-3.5">
              <span
                class="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                style="background-color: var(--fg-tint-6);"
              >
                <UploadCloud class="w-5 h-5" style="color: var(--brand);" />
              </span>
              <div class="text-left">
                <p class="text-xs sm:text-sm font-medium">
                  {{
                    lang === 'pt'
                      ? 'Já tem SVGs, .zip ou webfont?'
                      : 'Already have SVGs, a .zip, or a webfont?'
                  }}
                </p>
                <p class="text-xs" style="color: var(--muted-foreground);">
                  {{
                    lang === 'pt'
                      ? 'Solte em qualquer lugar desta página (ou clique aqui). Reconhecemos e avançamos para a compilação.'
                      : 'Drop anywhere on this page (or click here). We detect the type and advance to compilation.'
                  }}
                </p>
              </div>
            </div>
            <span class="tuff-btn-secondary shrink-0">
              {{ lang === 'pt' ? 'Escolher arquivos' : 'Choose files' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
