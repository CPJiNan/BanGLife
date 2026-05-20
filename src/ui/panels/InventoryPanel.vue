<script lang="ts" setup>
import {computed} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {registries} from '@/core/registry'
import {applyEffects} from '@/core/effects'
import {dropItem, useItem} from '@/core/inventory'

const player = usePlayerStore()

const inventory = computed(() => player.state.inventory)

const tagLabels: Record<string, string> = {}

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
  useItem(itemId, applyEffects)
}

function handleDrop(itemId: string) {
  dropItem(itemId, 1)
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 overflow-y-auto h-full">
    <div v-if="entries.length === 0" class="text-xs text-neutral-400 text-center py-4">
      暂无物品
    </div>

    <div v-else class="flex flex-col gap-5">
      <div v-for="(group, tag) in groupedEntries" :key="tag">
        <div class="text-xs text-muted mb-2 font-medium">{{ tagLabels[tag] ?? tag }}</div>
        <div class="flex flex-col gap-2">
          <div
            v-for="entry in group"
            :key="entry.itemId"
            class="rounded-xl border border-neutral-200 bg-white p-3"
          >
            <div class="flex items-start justify-between gap-3 mb-1">
              <div>
                <span class="text-sm font-medium">{{ entry.item?.name ?? entry.itemId }}</span>
                <div v-if="entry.item?.tags?.length" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="itemTag in entry.item.tags"
                    :key="itemTag"
                    class="text-[10px] rounded-full bg-neutral-100 px-2 py-0.5 text-muted"
                  >
                    {{ tagLabels[itemTag] ?? itemTag }}
                  </span>
                </div>
              </div>
              <span class="text-xs text-muted shrink-0">x{{ entry.amount }}</span>
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
                v-if="entry.item?.droppable !== false"
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
