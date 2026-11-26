<script setup>
import { computed } from 'vue'

const props = defineProps({
  svg: { type: String, required: true },
  size: { type: Number, required: true }
})

const sizedSvg = computed(() => {
  let raw = props.svg || ''
  if (!raw.includes('viewBox')) {
    const origW = (raw.match(/width="([^"]*)"/) || [])[1] || '24'
    const origH = (raw.match(/height="([^"]*)"/) || [])[1] || '24'
    raw = raw.replace('<svg', `<svg viewBox="0 0 ${origW} ${origH}"`)
  }
  raw = raw.replace(/\s*(width|height)="[^"]*"/g, '')
  return raw.replace('<svg', `<svg width="${props.size}" height="${props.size}"`)
})
</script>

<template>
  <span
    class="inline-flex items-center justify-center leading-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
    v-html="sizedSvg"
  ></span>
</template>
