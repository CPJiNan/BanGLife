<script lang="ts" setup>
import {computed} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {registries} from '@/core/registry'

const player = usePlayerStore()

const knownNPCs = computed(() => {
  const ids = Object.keys(player.state.relationships)
  return ids
    .map(id => ({id, npc: registries.npcs.get(id), rel: player.state.relationships[id]}))
    .filter(entry => entry.npc)
})

const allNPCs = computed(() => registries.npcs.getAll())

function affectionColor(val: number): string {
  if (val >= 50) return 'text-pink-500'
  if (val >= 0) return 'text-neutral-600'
  return 'text-red-500'
}
</script>

<template>
  <div class="flex flex-col gap-3 p-4 overflow-y-auto h-full">
    <div v-if="knownNPCs.length > 0" class="flex flex-col gap-2">
      <div class="text-xs text-muted font-medium">已认识</div>
      <div
        v-for="entry in knownNPCs"
        :key="entry.id"
        class="rounded-xl border border-neutral-200 bg-white p-3"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium">{{ entry.npc!.name }}</span>
          <span class="text-xs text-muted">{{ entry.id }}</span>
        </div>
        <div class="flex gap-3 text-xs">
          <div>
            <span class="text-muted">好感：</span>
            <span :class="affectionColor(entry.rel.affection)">
              {{ entry.rel.affection }}
            </span>
          </div>
          <div>
            <span class="text-muted">信任：</span>
            <span class="text-neutral-700">
              {{ entry.rel.trust }}
            </span>
          </div>
        </div>
        <div v-if="Object.keys(entry.rel.flags).length" class="flex flex-wrap gap-1 mt-1.5">
          <span
            v-for="key in Object.keys(entry.rel.flags)"
            :key="key"
            class="text-xs px-1.5 py-0.5 rounded-full bg-pink-50 text-pink-600"
          >
            {{ key }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="allNPCs.length > knownNPCs.length" class="flex flex-col gap-2">
      <div class="text-xs text-muted font-medium">尚未认识</div>
      <div class="text-xs text-neutral-400">
        还有 {{ allNPCs.length - knownNPCs.length }} 位角色等待邂逅
      </div>
    </div>

    <div v-if="allNPCs.length === 0" class="text-xs text-neutral-400 text-center py-4">
      暂无角色
    </div>
  </div>
</template>
