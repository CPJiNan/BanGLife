<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useTasksStore} from '@/stores/tasks'
import type {TaskState} from '@/stores/tasks'
import {usePlayerStore} from '@/stores/player'
import type {Task} from '@/core/types'

const tasksStore = useTasksStore()
const player = usePlayerStore()

const claimingId = ref<string | null>(null)

// Evaluate targets during setup so the initial render already reflects
// correct progress. Avoids a second render during the CSS enter
// transition which can cause click events to be lost.
tasksStore.checkAll()

onMounted(() => {
  tasksStore.checkAll()
})

// Re-check targets and expirations on each time tick while panel is open
watch(() => player.time, () => {
  tasksStore.checkAll()
  tasksStore.checkExpirations()
})

interface Entry { id: string; task: Task; state: TaskState }

const entries = computed<Entry[]>(() => tasksStore.entries as Entry[])

function allTargetsDone(entry: Entry): boolean {
  return entry.state.progress.every(p => p)
}

async function claimReward(id: string) {
  console.log('[TaskPanel] claimReward called, id=' + id + ' claimingId=' + claimingId.value)
  if (claimingId.value !== null) return
  claimingId.value = id
  try {
    await tasksStore.complete(id)
    console.log('[TaskPanel] complete done for ' + id)
  } catch (e) {
    console.error('[TaskPanel] 领取任务奖励失败：', e)
  } finally {
    claimingId.value = null
  }
}

function abandonTask(id: string) {
  tasksStore.cancel(id)
}

function formatExpire(startTime: number, expireMinutes: number): string {
  const elapsed = player.time - startTime
  const remaining = expireMinutes - elapsed
  if (remaining <= 0) return '即将过期'
  const h = Math.floor(remaining / 60)
  const m = Math.floor(remaining % 60)
  if (h > 0) return `${h} 小时 ${m} 分钟`
  return `${m} 分钟`
}
</script>

<template>
  <div class="flex flex-col gap-3 p-4 overflow-y-auto h-full">
    <div v-if="entries.length === 0" class="text-xs text-neutral-400 text-center py-6">
      暂无进行中的任务
    </div>

    <div
      v-for="entry in entries"
      :key="entry.id"
      class="rounded-xl border border-neutral-200 bg-white p-3"
    >
      <div class="text-sm font-medium mb-1">{{ entry.task.title }}</div>
      <p class="text-xs text-muted mb-3">{{ entry.task.description }}</p>

      <div class="flex flex-col gap-1.5 mb-3">
        <div
          v-for="(target, i) in entry.task.targets"
          :key="i"
          class="flex items-start gap-2 text-xs"
        >
          <div
            :class="entry.state.progress[i]
              ? 'bg-green-100 text-green-600'
              : 'bg-neutral-100 text-neutral-300'"
            class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5"
          >
            {{ entry.state.progress[i] ? '✓' : '' }}
          </div>
          <div>
            <div
              :class="entry.state.progress[i] ? 'text-neutral-500 line-through' : 'text-neutral-700'"
            >
              {{ target.title }}
            </div>
            <div v-if="target.description" class="text-[10px] text-muted mt-0.5">
              {{ target.description }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          v-show="allTargetsDone(entry)"
          :disabled="claimingId !== null || !allTargetsDone(entry)"
          class="flex-1 text-xs py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
          style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
          @mousedown="console.log('[TaskPanel] mousedown', entry.id)"
          @mouseup="console.log('[TaskPanel] mouseup', entry.id)"
          @click="console.log('[TaskPanel] click', entry.id); claimReward(entry.id)"
        >
          {{ claimingId === entry.id ? '领取中...' : '领取奖励' }}
        </button>
        <button
          v-if="entry.task.cancelable"
          class="flex-1 text-xs py-1.5 rounded-lg border border-red-100 text-red-400 hover:border-red-300 transition-colors"
          @click="abandonTask(entry.id)"
        >
          放弃任务
        </button>
      </div>

      <div
        v-if="entry.task.expire && entry.task.expire > 0"
        class="mt-2 text-[10px] text-neutral-400"
      >
        剩余时间：{{ formatExpire(entry.state.startTime, entry.task.expire) }}
      </div>
    </div>
  </div>
</template>
