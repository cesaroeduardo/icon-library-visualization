<script setup>
import { computed } from 'vue'
import { prepareSvg } from '@icon-library/core'

const props = defineProps({
  svg: { type: String, required: true },
  size: { type: Number, required: true }
})

const sizedSvg = computed(() =>
  prepareSvg(props.svg, { dimension: props.size, colored: true })
)
</script>

<template>
  <span
    class="inline-flex items-center justify-center leading-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
    v-html="sizedSvg"
  ></span>
</template>
