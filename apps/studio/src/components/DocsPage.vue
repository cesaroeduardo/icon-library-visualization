<script setup>
import { ref, computed } from 'vue'
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Check,
  Info,
  Lightbulb,
  Eye,
  FileCode2,
  ChevronRight
} from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { docsContent } from '@/docsContent'

const { lang, t } = useI18n()
const emit = defineEmits(['back', 'open-demo', 'go-svg'])

const doc = computed(() => docsContent[lang.value] || docsContent.pt)
const activeSection = ref('overview')
const copiedId = ref('')

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(`doc-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function copyCode(id, text) {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = ''
    }, 1500)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8">
    <!-- Top Back + Quick Actions -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <button @click="emit('back')" class="icon-btn text-xs">
        <ArrowLeft class="w-4 h-4" />
        <span>{{ t.backHome }}</span>
      </button>

      <div class="flex items-center gap-2">
        <button @click="emit('open-demo')" class="icon-btn !h-9 text-xs">
          <Eye class="w-3.5 h-3.5" />
          <span>{{ doc.tryDemo }}</span>
        </button>
        <button
          @click="emit('go-svg')"
          class="h-9 px-3.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <FileCode2 class="w-3.5 h-3.5" />
          <span>{{ doc.goUploadSvg }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
      <!-- Left Sidebar Navigation (Standard Docs Layout) -->
      <aside class="lg:sticky lg:top-20 space-y-4">
        <div
          class="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-sm"
        >
          <div
            class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 px-2"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span>{{ doc.onThisPage }}</span>
          </div>
          <nav class="flex flex-col gap-1">
            <button
              v-for="sec in doc.sections"
              :key="sec.id"
              @click="scrollToSection(sec.id)"
              class="text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2"
              :class="
                activeSection === sec.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60'
              "
            >
              <span class="truncate">{{ sec.nav }}</span>
              <ChevronRight class="w-3.5 h-3.5 shrink-0 opacity-60" />
            </button>
          </nav>
        </div>
      </aside>

      <!-- Main Documentation Article -->
      <article
        class="min-w-0 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white/75 dark:bg-neutral-800/60 backdrop-blur-sm p-6 md:p-10 space-y-12"
      >
        <!-- Hero Header -->
        <header class="border-b border-neutral-200 dark:border-neutral-700 pb-8">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 mb-3"
          >
            <BookOpen class="w-3 h-3" />
            {{ doc.badge }}
          </span>
          <h1 class="text-2xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            {{ doc.title }}
          </h1>
          <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
            {{ doc.subtitle }}
          </p>
        </header>

        <!-- Sections -->
        <section
          v-for="sec in doc.sections"
          :key="sec.id"
          :id="`doc-${sec.id}`"
          class="scroll-mt-24 space-y-5 pb-10 border-b border-neutral-200/80 dark:border-neutral-700/70 last:border-b-0 last:pb-0"
        >
          <div>
            <h2 class="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              {{ sec.title }}
            </h2>
            <p class="text-sm md:text-[15px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {{ sec.lead }}
            </p>
          </div>

          <p
            v-for="(p, idx) in sec.paragraphs"
            :key="'p-' + idx"
            class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            {{ p }}
          </p>

          <!-- Callout -->
          <div
            v-if="sec.callout"
            class="p-4 rounded-xl border flex items-start gap-3 text-xs md:text-sm leading-relaxed"
            :class="
              sec.callout.type === 'tip'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-200'
            "
          >
            <Lightbulb v-if="sec.callout.type === 'tip'" class="w-4 h-4 shrink-0 mt-0.5" />
            <Info v-else class="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div class="font-semibold mb-0.5">{{ sec.callout.title }}</div>
              <p class="opacity-90">{{ sec.callout.body }}</p>
            </div>
          </div>

          <!-- Bullets -->
          <ul v-if="sec.bullets" class="space-y-2 pl-5 list-disc text-sm text-neutral-700 dark:text-neutral-300">
            <li v-for="(b, idx) in sec.bullets" :key="'b-' + idx" class="leading-relaxed">
              {{ b }}
            </li>
          </ul>

          <!-- Table -->
          <div
            v-if="sec.table"
            class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700"
          >
            <table class="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr class="bg-neutral-100/90 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-700">
                  <th
                    v-for="(h, hi) in sec.table.headers"
                    :key="hi"
                    class="py-2.5 px-3.5 font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700/80">
                <tr
                  v-for="(row, ri) in sec.table.rows"
                  :key="ri"
                  class="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40"
                >
                  <td
                    v-for="(cell, ci) in row"
                    :key="ci"
                    class="py-2.5 px-3.5 text-neutral-700 dark:text-neutral-300 align-top"
                    :class="ci === 0 ? 'font-medium text-neutral-900 dark:text-white whitespace-nowrap' : ''"
                  >
                    {{ cell }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Code block -->
          <div
            v-if="sec.code"
            class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-900 text-neutral-100 overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-[11px] text-neutral-400"
            >
              <span>{{ sec.codeTitle }}</span>
              <button
                @click="copyCode(sec.id, sec.code)"
                class="inline-flex items-center gap-1 hover:text-white transition-colors"
              >
                <Check v-if="copiedId === sec.id" class="w-3.5 h-3.5 text-emerald-400" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedId === sec.id ? doc.copied : doc.copy }}</span>
              </button>
            </div>
            <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed"><code>{{ sec.code }}</code></pre>
          </div>

          <!-- Extra block (e.g., catalog.json example) -->
          <div v-if="sec.extraTitle" class="space-y-3 pt-2">
            <h3 class="text-base font-semibold text-neutral-900 dark:text-white">
              {{ sec.extraTitle }}
            </h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {{ sec.extraBody }}
            </p>
            <div
              v-if="sec.extraCode"
              class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-900 text-neutral-100 overflow-hidden"
            >
              <div
                class="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-[11px] text-neutral-400"
              >
                <span>catalog.json</span>
                <button
                  @click="copyCode(sec.id + '-extra', sec.extraCode)"
                  class="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Check v-if="copiedId === sec.id + '-extra'" class="w-3.5 h-3.5 text-emerald-400" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedId === sec.id + '-extra' ? doc.copied : doc.copy }}</span>
                </button>
              </div>
              <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed"><code>{{ sec.extraCode }}</code></pre>
            </div>
          </div>

          <!-- Subsections -->
          <div v-if="sec.subsections" class="space-y-6 pt-1">
            <div
              v-for="(sub, si) in sec.subsections"
              :key="si"
              class="space-y-2.5 pl-4 border-l-2 border-neutral-200 dark:border-neutral-700"
            >
              <h3 class="text-base font-semibold text-neutral-900 dark:text-white">
                {{ sub.title }}
              </h3>
              <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {{ sub.body }}
              </p>
              <ul
                v-if="sub.bullets"
                class="space-y-1.5 pl-5 list-disc text-sm text-neutral-700 dark:text-neutral-300"
              >
                <li v-for="(sb, sbi) in sub.bullets" :key="sbi" class="leading-relaxed">
                  {{ sb }}
                </li>
              </ul>
              <div
                v-if="sub.code"
                class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-900 text-neutral-100 overflow-hidden mt-2"
              >
                <div
                  class="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-[11px] text-neutral-400"
                >
                  <span>{{ sub.title }}</span>
                  <button
                    @click="copyCode(`${sec.id}-${si}`, sub.code)"
                    class="inline-flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Check v-if="copiedId === `${sec.id}-${si}`" class="w-3.5 h-3.5 text-emerald-400" />
                    <Copy v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedId === `${sec.id}-${si}` ? doc.copied : doc.copy }}</span>
                  </button>
                </div>
                <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed"><code>{{ sub.code }}</code></pre>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>
