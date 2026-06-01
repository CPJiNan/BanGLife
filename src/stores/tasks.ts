import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {registries} from '@/core/registry'
import {makeGameContext} from '@/mod/api'
import type {Task} from '@/core/types'
import {useUIStore} from './ui'

export interface TaskState {
  startTime: number
  progress: boolean[]
  status: 'active' | 'completed' | 'cancelled' | 'expired'
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Record<string, TaskState>>({})

  function activate(taskId: string): void {
    const task = registries.tasks.get(taskId)
    if (!task) return
    const ctx = makeGameContext()
    tasks.value[taskId] = {
      startTime: ctx.time.absolute,
      progress: new Array(task.targets.length).fill(false),
      status: 'active',
    }
  }

  async function complete(taskId: string): Promise<void> {
    const state = tasks.value[taskId]
    if (!state || state.status !== 'active') return
    const task = registries.tasks.get(taskId)
    if (!task) return
    if (!state.progress.every(p => p)) return
    state.status = 'completed'
    const ctx = makeGameContext()
    try {
      if (task.rewards && task.rewards.length > 0) {
        const {applyEffects} = await import('@/core/effects')
        applyEffects(task.rewards)
      }
      task.onComplete?.(ctx)
    } finally {
      delete tasks.value[taskId]
    }
  }

  function cancel(taskId: string): void {
    const state = tasks.value[taskId]
    if (!state || state.status !== 'active') return
    const task = registries.tasks.get(taskId)
    if (!task) return
    if (task.cancelable !== true) return

    state.status = 'cancelled'
    const ctx = makeGameContext()
    task.onCancel?.(ctx)
    delete tasks.value[taskId]
  }

  function updateTasks(): void {
    const ctx = makeGameContext()
    for (const [id, state] of Object.entries(tasks.value)) {
      if (state.status !== 'active') continue
      const task = registries.tasks.get(id)
      if (!task) continue
      for (let i = 0; i < task.targets.length; i++) {
        if (!state.progress[i]) state.progress[i] = task.targets[i].onCheck(ctx)
      }
    }
  }

  function expireTasks(): void {
    const ctx = makeGameContext()
    const now = ctx.time.absolute
    const ui = useUIStore()
    for (const [id, state] of Object.entries(tasks.value)) {
      if (state.status !== 'active') continue
      const task = registries.tasks.get(id)
      if (!task) {
        delete tasks.value[id]
        continue
      }
      if (!task.expire || task.expire <= 0) continue
      if (now >= state.startTime + task.expire) {
        state.status = 'expired'
        ui.showToast(`任务 ${task.title} 已过期`, 'warning')
        const onExpire = task.onExpire ?? task.onCancel
        onExpire?.(ctx)
        delete tasks.value[id]
      }
    }
  }

  const entries = computed(() => {
    return Object.entries(tasks.value)
      .filter(([, s]) => s.status === 'active')
      .map(([id, state]) => ({
        id,
        task: registries.tasks.get(id),
        state,
      }))
      .filter((e): e is { id: string; task: Task; state: TaskState } => e.task !== undefined)
  })

  const hasCompletedTasks = computed(() => {
    return entries.value.some(e => e.state.progress.every(p => p))
  })

  function serialize(): Record<string, { startTime: number; progress: boolean[]; status: string }> {
    const result: Record<string, { startTime: number; progress: boolean[]; status: string }> = {}
    for (const [id, state] of Object.entries(tasks.value)) {
      if (!registries.tasks.get(id)) continue
      result[id] = {
        startTime: state.startTime,
        progress: [...state.progress],
        status: state.status,
      }
    }
    return result
  }

  function deserialize(data: Record<string, { startTime: number; progress: boolean[]; status: string }>): void {
    tasks.value = {}
    const validStatuses = new Set(['active', 'completed', 'cancelled', 'expired'])
    for (const [id, state] of Object.entries(data)) {
      const status = validStatuses.has(state.status)
        ? (state.status as TaskState['status'])
        : 'cancelled'
      tasks.value[id] = {
        startTime: state.startTime,
        progress: [...state.progress],
        status,
      }
    }
  }

  return {
    tasks,
    entries,
    activate,
    complete,
    cancel,
    updateTasks,
    expireTasks,
    hasCompletedTasks,
    serialize,
    deserialize,
  }
})
