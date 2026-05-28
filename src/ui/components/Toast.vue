<script lang="ts" setup>
import {useUIStore} from '@/stores/ui'

const ui = useUIStore()

const iconPaths: Record<string, string> = {
  success: '/icons/success.svg',
  error: '/icons/error.svg',
  warning: '/icons/warning.svg',
  info: '/icons/info.svg',
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
        v-for="toast in ui.activeToasts"
        :key="toast.id"
        :class="[
          'flex items-start gap-2.5 bg-white/95 backdrop-blur-sm rounded-lg pl-3 pr-1.5 py-2.5',
          'shadow-lg ring-1 ring-black/5 border-l-4 min-w-[240px] max-w-[340px] pointer-events-auto',
          borderColors[toast.type ?? 'info'] ?? 'border-l-blue-500',
        ]"
        @click="ui.dismissToast(toast.id)"
      >
        <img
          :class="textColors[toast.type ?? 'info'] ?? 'text-blue-500'"
          :src="iconPaths[toast.type ?? 'info']"
          class="w-5 h-5 shrink-0 mt-0.5"
        />

        <span class="flex-1 text-sm text-neutral-700 leading-snug">{{ toast.message }}</span>

        <button
          class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          @click.stop="ui.dismissToast(toast.id)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 6l-12 12"/>
            <path d="M6 6l12 12"/>
          </svg>
        </button>

        <div class="absolute bottom-0 left-4 right-3 h-0.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            :style="{ animation: `toast-progress ${toast.duration ?? 3000}ms linear forwards` }"
            class="h-full bg-neutral-300 rounded-full origin-left"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
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
