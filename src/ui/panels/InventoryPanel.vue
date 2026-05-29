<script lang="ts" setup>
import {computed} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {useUIStore} from '@/stores/ui'
import {registries} from '@/core/registry'
import {applyEffects} from '@/core/effects'
import {dropItem, useItem} from '@/core/inventory'
import {ITEM_TAG_LABELS} from '@/core/constants'

const player = usePlayerStore()
const ui = useUIStore()

const inventory = computed(() => player.state.inventory)

const base = import.meta.env.BASE_URL

const entries = computed(() => {
  return inventory.value.map(inv => ({
    ...inv,
    item: registries.items.get(inv.itemId),
  }))
})

const groupedEntries = computed(() => {
  const groups: Record<string, typeof entries.value> = {}
  for (const entry of entries.value) {
    const tags = entry.item?.tags ?? []
    const groupKey = tags[0] ?? '其他'
    if (!groups[groupKey]) groups[groupKey] = []
    groups[groupKey].push(entry)
  }
  return groups
})

function handleUse(itemId: string) {
  const entry = entries.value.find(e => e.itemId === itemId)
  if (!entry) return

  const itemName = entry.item?.name ?? itemId

  ui.showConfirm({
    title: '使用物品',
    description: `确定要使用 ${itemName} 吗？`,
    onConfirm: () => {
      useItem(itemId, applyEffects)
    }
  })
}

function handleDrop(itemId: string) {
  const entry = entries.value.find(e => e.itemId === itemId)
  if (!entry) return

  const itemName = entry.item?.name ?? itemId

  ui.showConfirm({
    title: '丢弃物品',
    description: `确定要丢弃 ${itemName} 吗？`,
    variant: 'danger',
    onConfirm: () => {
      dropItem(itemId, 1)
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 overflow-y-auto h-full">
    <div v-if="entries.length === 0" class="text-xs text-neutral-400 text-center py-4">
      暂无物品
    </div>

    <div v-else class="flex flex-col gap-5">
      <div v-for="(group, tag) in groupedEntries" :key="tag">
        <div class="text-xs text-muted mb-2 font-medium">{{ ITEM_TAG_LABELS[tag] ?? tag }}</div>
        <div class="flex flex-col gap-2">
          <div
            v-for="entry in group"
            :key="entry.itemId"
            class="rounded-xl border border-neutral-200 bg-white p-3"
          >
            <div class="flex items-start gap-3 mb-1">
              <img
                v-if="entry.item?.icon"
                :alt="entry.item.name"
                :src="`${base}icons/${entry.item.icon}`"
                class="w-6 h-6 shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-sm font-medium truncate">{{ entry.item?.name ?? entry.itemId }}</span>
                  <span class="text-xs text-muted shrink-0">x{{ entry.amount }}</span>
                </div>
                <div v-if="entry.item?.tags?.length" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="itemTag in entry.item.tags"
                    :key="itemTag"
                    class="text-[10px] rounded-full bg-neutral-100 px-2 py-0.5 text-muted"
                  >
                    {{ ITEM_TAG_LABELS[itemTag] ?? itemTag }}
                  </span>
                </div>
              </div>
            </div>

            <p v-if="entry.item?.description" class="text-xs text-muted mb-2">
              {{ entry.item.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <button
                v-if="entry.item?.usable"
                class="rounded-lg border border-brand-pink/40 bg-pink-50 px-3 py-1.5 text-xs font-medium text-brand-pink hover:bg-pink-100 transition-colors"
                @click="handleUse(entry.itemId)"
              >
                使用
              </button>
              <button
                v-if="entry.item?.droppable === true"
                class="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-brand-pink hover:text-brand-pink transition-colors"
                @click="handleDrop(entry.itemId)"
              >
                丢弃
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
