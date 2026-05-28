<script lang="ts" setup>
import {useUIStore} from '@/stores/ui'

const ui = useUIStore()

function getTypeClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-blue-500'
  }
}

function getIcon(type: string) {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '!'
    default:
      return 'ℹ'
  }
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in ui.toasts"
        :key="toast.id"
        class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg border border-neutral-100 min-w-[200px] max-w-[320px]"
        @click="ui.dismissToast(toast.id)"
      >
        <span
          :class="getTypeClass(toast.type ?? 'info')"
          class="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
        >
          {{ getIcon(toast.type ?? 'info') }}
        </span>
        <span class="text-sm text-neutral-700">{{ toast.message }}</span>
        <button
          class="text-xs text-muted hover:text-neutral-500 transition-colors shrink-0"
          @click.stop="ui.dismissToast(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>