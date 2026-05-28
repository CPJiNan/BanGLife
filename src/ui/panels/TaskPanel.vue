<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import type {TaskState} from '@/stores/tasks'
import {useTasksStore} from '@/stores/tasks'
import {usePlayerStore} from '@/stores/player'
import type {Task} from '@/core/types'

const tasksStore = useTasksStore()
const player = usePlayerStore()

const claimingId = ref<string | null>(null)

tasksStore.updateTasks()

onMounted(() => {
  tasksStore.updateTasks()
})

interface Entry {
  id: string;
  task: Task;
  state: TaskState
}

const entries = computed<Entry[]>(() => tasksStore.entries as Entry[])

async function claimReward(id: string) {
  if (claimingId.value !== null) return
  claimingId.value = id
  try {
    await tasksStore.complete(id)
  } catch (e) {
    console.error('[BanGLife] 任务奖励领取失败：', e)
  } finally {
    claimingId.value = null
  }
}

function cancelTask(id: string) {
  tasksStore.cancel(id)
}

function formatExpire(startTime: number, expireMinutes: number): string {
  const remaining = startTime + expireMinutes - player.time
  if (remaining <= 0) return '即将过期'
  const h = Math.floor(remaining / 60)
  const m = Math.floor(remaining % 60)
  if (h > 0) return `${h} 小时 ${m} 分钟`
  else return `${m} 分钟`
}

function getJobHours(entry: Entry): number {
  const key = `job:${entry.id.split('.').slice(1).join(':')}:hours`
  return (player.state.flags[key] as number) || 0
}
</script>

<template>
  <div class="flex flex-col gap-3 p-4 overflow-y-auto h-full">
    <div v-if="entries.length === 0" class="text-xs text-neutral-400 text-center py-6">
      暂无任务
    </div>

    <div
      v-for="entry in entries"
      :key="entry.id"
      class="rounded-xl border border-neutral-200 bg-white p-3"
    >
      <div class="text-sm font-medium mb-1">{{ entry.task.title }}</div>
      <p class="text-xs text-muted mb-1">{{ entry.task.description }}</p>
      <p v-if="entry.id.startsWith('job.')" class="text-xs text-brand-pink mb-2">
        已打工时长：{{ getJobHours(entry) }} 小时
      </p>

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
          v-show="entry.state.progress.every(p => p)"
          :disabled="claimingId !== null || !entry.state.progress.every(p => p)"
          class="flex-1 text-xs py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
          style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
          @click="claimReward(entry.id)"
        >
          {{ claimingId === entry.id ? '领取中...' : '领取奖励' }}
        </button>
        <button
          v-if="entry.task.cancelable"
          class="flex-1 text-xs py-1.5 rounded-lg border border-red-100 text-red-400 hover:border-red-300 transition-colors"
          @click="cancelTask(entry.id)"
        >
          取消任务
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
