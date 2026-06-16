<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import CharacterSprite from '@/ui/components/CharacterSprite.vue'
import {usePlayerStore} from '@/stores/player'
import {useUIStore} from '@/stores/ui'
import {makeGameContext} from '@/mod/api'
import {DEFAULT_APPEARANCE, displayName, PARTS, useAppearanceStore} from '@/stores/appearance'
import type {AppearanceState, PartSelection} from '@/core/types'

const player = usePlayerStore()
const ui = useUIStore()
const appearanceStore = useAppearanceStore()
const ctx = computed(() => makeGameContext())

const draft = ref<AppearanceState>(JSON.parse(JSON.stringify(DEFAULT_APPEARANCE)))
const activeTab = ref<string>('eyes')

const activePart = computed(() => PARTS.find(p => p.id === activeTab.value))

const currentOptions = computed(() => {
  const part = activePart.value
  if (!part) return []
  const gameCtx = ctx.value
  if (!part.hasColor) {
    return part.styles.map(s => ({
      id: s.id,
      label: displayName(s),
      selection: {style: s.id, color: ''} as PartSelection,
      locked: s.available ? !s.available(gameCtx) : false,
    }))
  }
  return part.styles.flatMap(s =>
    part.colors.map(c => ({
      id: `${s.id}-${c.id}`,
      label: `${displayName(s)} ${displayName(c)}`,
      selection: {style: s.id, color: c.id} as PartSelection,
      locked: s.available ? !s.available(gameCtx) : false,
    }))
  )
})

onMounted(() => {
  draft.value = JSON.parse(JSON.stringify(player.state.appearance))
})

function selectOption(partId: string, sel: PartSelection, locked: boolean) {
  if (locked) return
  if (partId === 'clothing' && isSelected(partId, sel)) {
    draft.value = {...draft.value, [partId]: {style: '', color: ''}}
    return
  }
  draft.value = {...draft.value, [partId]: {...sel}}
}

function isSelected(partId: string, sel: PartSelection): boolean {
  const cur = draft.value[partId]
  return cur.style === sel.style && cur.color === sel.color
}

function save() {
  appearanceStore.applyAppearance(draft.value)
  ui.showToast('外观已保存', 'success')
  ui.closeWardrobe()
}

function cancel() {
  ui.closeWardrobe()
}
</script>

<template>
  <main class="h-full flex flex-col overflow-hidden bg-neutral-50">
    <div class="px-6 pt-5 pb-3 border-b border-neutral-200 bg-white shrink-0 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-bold">衣柜</h2>
      </div>
      <button class="text-xs text-muted hover:text-brand-pink transition-colors" @click="cancel">返回</button>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <div
        class="w-72 shrink-0 bg-white border-r border-neutral-200 flex flex-col items-center justify-center gap-4 p-4">
        <CharacterSprite :appearance="draft"/>
        <div class="flex gap-2">
          <button
            class="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
            @click="save"
          >
            保存
          </button>
          <button
            class="px-6 py-2 rounded-xl text-sm font-semibold border border-neutral-200 bg-white hover:border-neutral-400 transition-colors"
            @click="cancel"
          >
            返回
          </button>
        </div>
      </div>

      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex gap-1 px-4 py-3 border-b border-neutral-200 bg-white shrink-0 flex-wrap">
          <button
            v-for="p in PARTS"
            :key="p.id"
            :class="activeTab === p.id
              ? 'bg-pink-50 text-brand-pink font-semibold'
              : 'text-muted hover:text-neutral-700'"
            class="px-4 py-1.5 rounded-lg text-sm transition-colors"
            @click="activeTab = p.id"
          >
            {{ p.label }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-4">
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="opt in currentOptions"
              :key="opt.id"
              :class="[
                opt.locked
                  ? 'border-neutral-100 bg-neutral-50 cursor-not-allowed opacity-40'
                  : isSelected(activePart!.id, opt.selection)
                    ? 'border-brand-pink bg-pink-50 ring-1 ring-brand-pink/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300',
              ]"
              class="rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all"
              @click="selectOption(activePart!.id, opt.selection, opt.locked)"
            >
              <span class="w-24 h-32 flex items-center justify-center rounded-lg overflow-hidden">
                <CharacterSprite
                  :appearance="{ ...draft, [activePart!.id]: opt.selection }"
                  :height="128"
                  :width="96"
                />
              </span>
              <span class="text-xs font-medium text-neutral-700">
                {{ opt.label }}
                <span v-if="opt.locked" class="text-[10px] text-muted">🔒</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
