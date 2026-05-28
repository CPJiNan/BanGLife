<script lang="ts" setup>
import {useUIStore} from '@/stores/ui'

const ui = useUIStore()

function onConfirm() {
  const cb = ui.activeConfirm?.onConfirm
  ui.dismissConfirm()
  cb?.()
}

function onCancel() {
  const cb = ui.activeConfirm?.onCancel
  ui.dismissConfirm()
  cb?.()
}
</script>

<template>
  <Transition name="confirm">
    <div
      v-if="ui.activeConfirm"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/30" @click="onCancel()"/>

      <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h3 class="text-sm font-semibold text-neutral-800">{{ ui.activeConfirm.title }}</h3>

        <p v-if="ui.activeConfirm.description" class="text-xs text-muted mt-2 leading-relaxed">
          {{ ui.activeConfirm.description }}
        </p>

        <div class="flex gap-3 mt-5">
          <button
            class="flex-1 text-xs py-2 rounded-xl border border-neutral-200 text-neutral-600
                   hover:bg-neutral-50 transition-colors"
            @click="onCancel()"
          >
            取消
          </button>
          <button
            :class="ui.activeConfirm.variant === 'danger'
              ? 'border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300'
              : 'text-white hover:opacity-90'"
            :style="ui.activeConfirm.variant === 'danger'
              ? { background: '#fff5f5' }
              : { background: 'linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))' }"
            class="flex-1 text-xs py-2 rounded-xl transition-colors"
            @click="onConfirm()"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.2s ease;
}

.confirm-enter-active > div:last-child,
.confirm-leave-active > div:last-child {
  transition: transform 0.2s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-from > div:last-child,
.confirm-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
