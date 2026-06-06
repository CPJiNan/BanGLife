<script lang="ts" setup>
import {ref} from 'vue'
import {displayName} from '@/stores/appearance'
import type {PartDef, OptionDef} from '@/stores/appearance'
import type {PartSelection} from '@/core/types'

const props = defineProps<{
  part: PartDef
  modelValue: PartSelection
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PartSelection]
}>()

const expandedStyle = ref(false)
const expandedColor = ref(false)

function selectStyle(opt: OptionDef) {
  emit('update:modelValue', {...props.modelValue, style: opt.id})
  expandedStyle.value = false
}

function selectColor(opt: OptionDef) {
  emit('update:modelValue', {...props.modelValue, color: opt.id})
  expandedColor.value = false
}

function prevStyle() {
  const idx = props.part.styles.findIndex(s => s.id === props.modelValue.style)
  const prev = idx <= 0 ? props.part.styles.length - 1 : idx - 1
  emit('update:modelValue', {...props.modelValue, style: props.part.styles[prev].id})
}

function nextStyle() {
  const idx = props.part.styles.findIndex(s => s.id === props.modelValue.style)
  const next = idx >= props.part.styles.length - 1 ? 0 : idx + 1
  emit('update:modelValue', {...props.modelValue, style: props.part.styles[next].id})
}

function currentStyleLabel(): string {
  const s = props.part.styles.find(s => s.id === props.modelValue.style)
  return s ? displayName(s) : props.modelValue.style
}

function prevColor() {
  const idx = props.part.colors.findIndex(c => c.id === props.modelValue.color)
  const prev = idx <= 0 ? props.part.colors.length - 1 : idx - 1
  emit('update:modelValue', {...props.modelValue, color: props.part.colors[prev].id})
}

function nextColor() {
  const idx = props.part.colors.findIndex(c => c.id === props.modelValue.color)
  const next = idx >= props.part.colors.length - 1 ? 0 : idx + 1
  emit('update:modelValue', {...props.modelValue, color: props.part.colors[next].id})
}

function currentColorLabel(): string {
  const c = props.part.colors.find(c => c.id === props.modelValue.color)
  return c ? displayName(c) : props.modelValue.color
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- 样式行 -->
    <div class="relative flex items-center gap-2">
      <span class="text-xs text-muted shrink-0 w-8">样式</span>
      <button
        class="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-muted hover:bg-neutral-100 hover:text-neutral-600 transition-colors shrink-0"
        @click="prevStyle"
      >
        ◀
      </button>
      <button
        class="flex-1 text-xs text-center py-1 border-b border-dashed border-neutral-300 cursor-pointer hover:border-brand-pink hover:text-brand-pink transition-colors"
        @click="expandedStyle = !expandedStyle"
      >
        {{ currentStyleLabel() }}
      </button>
      <button
        class="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-muted hover:bg-neutral-100 hover:text-neutral-600 transition-colors shrink-0"
        @click="nextStyle"
      >
        ▶
      </button>
      <!-- 下拉列表 -->
      <div
        v-if="expandedStyle"
        class="absolute top-full left-12 right-0 mt-1 z-10 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
      >
        <button
          v-for="opt in part.styles"
          :key="opt.id"
          :class="modelValue.style === opt.id ? 'bg-pink-50 text-brand-pink' : 'text-neutral-600 hover:bg-neutral-50'"
          class="w-full text-left text-xs px-3 py-2 transition-colors"
          @click="selectStyle(opt)"
        >
          {{ displayName(opt) }}
        </button>
      </div>
    </div>

    <!-- 颜色行 -->
    <div v-if="part.hasColor" class="relative flex items-center gap-2">
      <span class="text-xs text-muted shrink-0 w-8">颜色</span>
      <button
        class="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-muted hover:bg-neutral-100 hover:text-neutral-600 transition-colors shrink-0"
        @click="prevColor"
      >
        ◀
      </button>
      <button
        class="flex-1 text-xs text-center py-1 border-b border-dashed border-neutral-300 cursor-pointer hover:border-brand-pink hover:text-brand-pink transition-colors"
        @click="expandedColor = !expandedColor"
      >
        {{ currentColorLabel() }}
      </button>
      <button
        class="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-muted hover:bg-neutral-100 hover:text-neutral-600 transition-colors shrink-0"
        @click="nextColor"
      >
        ▶
      </button>
      <!-- 下拉列表 -->
      <div
        v-if="expandedColor"
        class="absolute top-full left-12 right-0 mt-1 z-10 max-h-40 overflow-y-auto bg-white border border-neutral-200 rounded-xl shadow-lg"
      >
        <button
          v-for="opt in part.colors"
          :key="opt.id"
          :class="modelValue.color === opt.id ? 'bg-pink-50 text-brand-pink' : 'text-neutral-600 hover:bg-neutral-50'"
          class="w-full text-left text-xs px-3 py-2 transition-colors"
          @click="selectColor(opt)"
        >
          {{ displayName(opt) }}
        </button>
      </div>
    </div>
  </div>
</template>
