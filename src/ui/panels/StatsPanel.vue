<script lang="ts" setup>
import {computed} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {formatDate, formatTime} from '@/core/time'
import {registries} from '@/core/registry'
import CharacterSprite from '@/ui/components/CharacterSprite.vue'

const player = usePlayerStore()

const visibleStats = computed(() => {
  const all = registries.stats.getAll().filter(stat => stat.visible)
  const grouped: Record<string, Array<{ id: string; label: string; color?: string; max: number }>> = {}
  for (const stat of all) {
    const cat = stat.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({
      id: stat.id,
      label: stat.name,
      color: stat.color,
      max: stat.max,
    })
  }
  return grouped
})

const money = computed(() => player.state.money)
const timeStr = computed(() => formatTime(player.timeInfo))
const dateStr = computed(() => formatDate(player.timeInfo))

function statValue(id: string) {
  return Math.round(player.state.stats[id] ?? 0)
}

function statMax(id: string) {
  const stat = registries.stats.get(id)
  return stat?.max ?? 100
}

function barWidth(id: string) {
  return `${Math.min(100, (statValue(id) / statMax(id)) * 100)}%`
}
</script>

<template>
  <aside class="flex flex-col gap-4 p-4 overflow-y-auto">
    <div class="rounded-xl border border-neutral-200 bg-white p-3">
      <div class="text-2xl font-bold tabular-nums">{{ timeStr }}</div>
      <div class="text-xs text-muted mt-0.5">{{ dateStr }} 东京都·丰岛区·池袋</div>
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white p-3 flex justify-center">
      <CharacterSprite :appearance="player.state.appearance"/>
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white px-3 py-2 flex items-center justify-between">
      <span class="text-xs text-muted">金钱</span>
      <span class="text-sm font-semibold">¥{{ money }}</span>
    </div>

    <div v-for="(stats, category) in visibleStats" :key="category"
         class="rounded-xl border border-neutral-200 bg-white p-3 flex flex-col gap-2">
      <div v-for="stat in stats" :key="stat.id" class="flex flex-col gap-0.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-muted">{{ stat.label }}</span>
          <span class="tabular-nums font-medium">{{ statValue(stat.id) }}</span>
        </div>
        <div class="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            :style="{ width: barWidth(stat.id), background: stat.color }"
            class="h-full rounded-full transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
