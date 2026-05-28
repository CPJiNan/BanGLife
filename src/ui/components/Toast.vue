<script lang="ts" setup>
import {useUIStore} from '@/stores/ui'

const ui = useUIStore()

const iconPaths: Record<string, string> = {
  success: '/icons/success.svg',
  error: '/icons/error.svg',
  warning: '/icons/warning.svg',
  info: '/icons/info.svg',
}

const barColors: Record<string, string> = {
  success: 'bg-green-400',
  error: 'bg-red-400',
  warning: 'bg-yellow-400',
  info: 'bg-blue-400',
}
</script>

<template>
  <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in ui.activeToasts"
        :key="toast.id"
        :class="[
          'flex items-center gap-3 rounded-2xl px-4 py-3 min-w-70 max-w-100 pointer-events-auto',
          'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] relative overflow-hidden',
        ]"
      >
        <img
          :src="iconPaths[toast.type ?? 'info']"
          alt=""
          class="w-5 h-5 shrink-0"/>

        <span class="flex-1 text-sm font-medium text-neutral-700 leading-snug">{{ toast.message }}</span>

        <button
          class="shrink-0 w-5 h-5 rounded-lg flex items-center justify-center text-neutral-400/60
                 hover:text-neutral-600 hover:bg-black/5 transition-all opacity-0 group-hover:opacity-100"
          style="opacity: 0.4"
          @click="ui.dismissToast(toast.id)"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-linecap="round"
               stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M18 6l-12 12"/>
            <path d="M6 6l12 12"/>
          </svg>
        </button>

        <div class="absolute bottom-0 left-0 right-0 h-0.75 bg-black/4 overflow-hidden">
          <div
            :class="['h-full w-full rounded-full origin-left', barColors[toast.type ?? 'info'] ?? 'bg-blue-500']"
            :style="{ animation: `toast-progress ${toast.duration ?? 3000}ms linear forwards` }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.25s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}

.toast-move {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>


<style>
@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
