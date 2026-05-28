<script lang="ts" setup>
import {useUIStore} from '@/stores/ui'

const ui = useUIStore()

const svgPaths: Record<string, string[]> = {
  success: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M9 12l2 2l4 -4'],
  error: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M10 10l4 4m0 -4l-4 4'],
  warning: ['M12 9v4', 'M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0', 'M12 16h.01'],
  info: ['M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0', 'M12 9h.01', 'M11 12h1v4h1'],
}

const borderColors: Record<string, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-blue-500',
}

const textColors: Record<string, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in ui.toasts"
        :key="toast.id"
        :class="[
          'flex items-start gap-2.5 bg-white/95 backdrop-blur-sm rounded-lg pl-3 pr-1.5 py-2.5',
          'shadow-lg ring-1 ring-black/5 border-l-4 min-w-[240px] max-w-[340px] pointer-events-auto',
          borderColors[toast.type ?? 'info'] ?? 'border-l-blue-500',
        ]"
        @click="ui.dismissToast(toast.id)"
      >
        <svg
          :class="textColors[toast.type ?? 'info'] ?? 'text-blue-500'"
          class="w-5 h-5 shrink-0 mt-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path v-for="(d, i) in svgPaths[toast.type ?? 'info']" :key="i" :d="d" />
        </svg>

        <span class="flex-1 text-sm text-neutral-700 leading-snug">{{ toast.message }}</span>

        <button
          class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          @click.stop="ui.dismissToast(toast.id)"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
          </svg>
        </button>

        <div class="absolute bottom-0 left-4 right-3 h-0.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-neutral-300 rounded-full origin-left"
            :style="{ animation: `toast-progress ${toast.duration ?? 3000}ms linear forwards` }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

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
