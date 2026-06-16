<script lang="ts" setup>
import type {AppearanceState} from '@/core/types'
import {LAYERS, partPath} from '@/stores/appearance'

const props = withDefaults(defineProps<{
  appearance: AppearanceState
  width?: number
  height?: number
}>(), {
  width: 192,
  height: 256,
})

const base = import.meta.env.BASE_URL

function layerSrc(part: string): string {
  if (part === 'base') return `${base}characters/base.png`
  const sel = props.appearance[part]
  if (!sel || !sel.style) return ''
  return `${base}characters/${partPath(part, sel)}`
}
</script>

<template>
  <div
    :style="{ width: `${width}px`, height: `${height}px` }"
    class="relative overflow-hidden"
  >
    <img
      v-for="layer in LAYERS"
      v-show="layerSrc(layer.part)"
      :key="layer.part"
      :alt="layer.part"
      :src="layerSrc(layer.part)"
      :style="{ zIndex: layer.z }"
      class="absolute inset-0 w-full h-full object-contain"
      style="image-rendering: pixelated"
    />
  </div>
</template>
