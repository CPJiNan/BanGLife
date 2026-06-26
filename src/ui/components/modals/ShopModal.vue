<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useUIStore} from '@/stores/ui'
import {usePlayerStore} from '@/stores/player'

const ui = useUIStore()
const player = usePlayerStore()

const amount = ref(1)

watch(() => ui.activeShopModal?.input, (input) => {
  if (input) amount.value = input.value
})

function onConfirm() {
  const cb = ui.activeShopModal?.onConfirm
  ui.dismissShopModal()
  cb?.(amount.value)
}

function onCancel() {
  const cb = ui.activeShopModal?.onCancel
  ui.dismissShopModal()
  cb?.()
}
</script>

<template>
  <Transition name="confirm">
    <div
      v-if="ui.activeShopModal"
      class="fixed inset-0 z-60 flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/30" @click="onCancel()"/>

      <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h3 class="text-sm font-semibold text-neutral-800">{{ ui.activeShopModal.title }}</h3>

        <p v-if="ui.activeShopModal.description" class="text-xs text-muted mt-2 leading-relaxed">
          {{ ui.activeShopModal.description }}
        </p>

        <div v-if="ui.activeShopModal.input" class="mt-4 flex items-center gap-2">
          <button
            :disabled="amount <= (ui.activeShopModal.input.min ?? 1)"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-sm border border-neutral-200 hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            @click="amount--"
          >−
          </button>
          <input
            v-model.number="amount"
            :max="ui.activeShopModal.input.max"
            :min="ui.activeShopModal.input.min ?? 1"
            class="flex-1 text-center text-sm border border-neutral-200 rounded-lg py-1.5 focus:outline-none focus:border-brand-pink"
            type="number"
          />
          <button
            :disabled="ui.activeShopModal.input.max !== undefined && amount >= ui.activeShopModal.input.max"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-sm border border-neutral-200 hover:border-neutral-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            @click="amount++"
          >+
          </button>
          <span v-if="ui.activeShopModal.input.label"
                class="text-xs text-muted shrink-0">{{ ui.activeShopModal.input.label }}</span>
        </div>

        <div v-if="ui.activeShopModal?.input?.price !== undefined"
             class="mt-3 flex items-center justify-between text-xs text-muted">
          <span>价格：¥{{ (ui.activeShopModal.input.price * amount).toLocaleString() }}</span>
          <span>余额：¥{{
              (ui.activeShopModal.mode === 'buy' ? player.state.money - ui.activeShopModal.input.price * amount : player.state.money + ui.activeShopModal.input.price * amount).toLocaleString()
            }}</span>
        </div>

        <div class="flex gap-3 mt-5">
          <button
            class="flex-1 text-xs py-2 rounded-xl border border-neutral-200 text-neutral-600
                   hover:bg-neutral-50 transition-colors"
            @click="onCancel()"
          >
            取消
          </button>
          <button
            :style="{ background: 'linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))' }"
            class="flex-1 text-xs py-2 rounded-xl text-white hover:opacity-90 transition-colors"
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
