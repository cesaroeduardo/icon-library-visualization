<script setup>
import { FileType, FileCode2, Sparkles, ArrowRight, Eye, Loader2 } from 'lucide-vue-next'
import { useI18n } from '@/i18n'

const { t } = useI18n()

defineProps({
  loadingDemo: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'open-demo'])

const options = [
  {
    id: 'webfont',
    icon: FileType,
    accent: 'from-sky-500/20 to-indigo-500/20 border-sky-500/30 text-sky-600 dark:text-sky-400'
  },
  {
    id: 'svg',
    icon: FileCode2,
    accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'create',
    icon: Sparkles,
    accent: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400'
  }
]
</script>

<template>
  <section class="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <span
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-neutral-800/70 border border-neutral-300/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 mb-4"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        {{ t.badgeStatic }}
      </span>
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
        {{ t.homeTitle }}
      </h1>
      <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {{ t.homeSubtitle }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
      <button
        v-for="opt in options"
        :key="opt.id"
        @click="emit('select', opt.id)"
        class="group text-left flex flex-col justify-between p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md hover:bg-white/95 dark:hover:bg-neutral-800/95 hover:border-neutral-400 dark:hover:border-neutral-500 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div>
          <div class="flex items-center justify-between mb-5">
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br border flex items-center justify-center"
              :class="opt.accent"
            >
              <component :is="opt.icon" class="w-6 h-6" />
            </div>
            <span
              class="text-[11px] font-medium px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900/70 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
            >
              {{ t.cards[opt.id].badge }}
            </span>
          </div>

          <h2 class="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            {{ t.cards[opt.id].title }}
          </h2>
          <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {{ t.cards[opt.id].description }}
          </p>
        </div>

        <div
          class="mt-6 pt-4 border-t border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          <span>{{ t.cards[opt.id].cta }}</span>
          <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>

    <!-- Interactive Gallery Demo Banner -->
    <div
      class="mt-8 p-6 md:p-7 rounded-2xl border border-neutral-300/80 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
    >
      <div class="space-y-1.5 max-w-2xl">
        <span
          class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400"
        >
          <Eye class="w-3.5 h-3.5" />
          {{ t.demo.bannerBadge }}
        </span>
        <h3 class="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
          {{ t.demo.bannerTitle }}
        </h3>
        <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {{ t.demo.bannerDesc }}
        </p>
      </div>

      <button
        @click="emit('open-demo')"
        :disabled="loadingDemo"
        class="shrink-0 h-11 px-5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        <Loader2 v-if="loadingDemo" class="w-4 h-4 animate-spin" />
        <Eye v-else class="w-4 h-4" />
        <span>{{ loadingDemo ? t.demo.loading : t.demo.cta }}</span>
      </button>
    </div>
  </section>
</template>
