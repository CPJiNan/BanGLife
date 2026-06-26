import type {Effect} from '@banglife/mod-types'
import {registries} from '@/core/registry'
import {giveItem, takeItem} from '@/core/inventory'
import {usePlayerStore} from '@/stores/player'
import {useTasksStore} from '@/stores/tasks'
import {useUIStore} from '@/stores/ui'
import {makeGameContext} from '@/mod/api'

function applyNpcStat(targetId: string, statId: string, amount: number): void {
  const statDef = registries.stats.get(statId)
  const max = statDef?.max ?? 100
  const min = statDef?.min ?? 0
  const def = statDef?.default ?? 0

  if (targetId === 'player') {
    const player = usePlayerStore()
    const current = player.state.stats[statId] ?? def
    player.state.stats[statId] = Math.max(min, Math.min(max, current + amount))
  } else {
    const npc = registries.npcs.get(targetId)
    if (npc && npc.stats) {
      const current = npc.stats[statId] ?? def
      npc.stats[statId] = Math.max(min, Math.min(max, current + amount))
    }
  }
}

export function applyEffects(effects: Effect[]): void {
  const player = usePlayerStore()
  const state = player.state

  for (const effect of effects) {
    switch (effect.type) {
      case 'stat': {
        if (effect.key === undefined) break
        const statDef = registries.stats.get(effect.key)
        const max = statDef?.max ?? 100
        const def = statDef?.default ?? 0
        const current = state.stats[effect.key] ?? def
        const delta = Number(effect.value ?? 0)
        state.stats[effect.key] = Math.max(statDef?.min ?? 0, Math.min(max, current + delta))
        break
      }
      case 'npc_stat': {
        if (effect.key === undefined) break
        const amount = Number(effect.value ?? 0)
        const parts = effect.key.split(':')
        if (parts.length !== 2) break
        const targetId = parts[0]
        const statId = parts[1]
        if (targetId === 'band') {
          for (const member of state.band.members) {
            applyNpcStat(member.id, statId, amount)
          }
        } else applyNpcStat(targetId, statId, amount)
        break
      }
      case 'flag': {
        if (effect.key !== undefined) {
          state.flags[effect.key] = effect.value
        }
        break
      }
      case 'money': {
        state.money = Math.max(0, state.money + Number(effect.value ?? 0))
        break
      }
      case 'item': {
        if (effect.key === undefined) break
        const amount = Number(effect.value ?? 1)
        if (amount > 0) giveItem(effect.key, amount)
        else if (amount < 0) takeItem(effect.key, Math.abs(amount))
        break
      }
      case 'time': {
        const minutes = Number(effect.value ?? 0)
        if (minutes > 0) player.advanceTime(minutes)
        break
      }
      case 'location': {
        if (typeof effect.value === 'string') {
          player.moveTo(effect.value)
        }
        break
      }
      case 'passage': {
        if (typeof effect.key !== 'string') break
        const passage = registries.passages.get(effect.key)
        if (passage) {
          useUIStore().showPassage({
            text: passage.text,
            speaker: passage.speaker,
            choices: passage.choices ?? [],
          })
        }
        break
      }
      case 'task': {
        if (effect.key !== undefined) {
          useTasksStore().activate(effect.key)
        }
        break
      }
      case 'affection': {
        if (effect.key === undefined) break
        if (!state.relationships[effect.key]) state.relationships[effect.key] = {affection: 0, flags: {}}
        state.relationships[effect.key].affection += Number(effect.value ?? 0)
        break
      }
      case 'script': {
        if (typeof effect.value !== 'function') break
        try {
          effect.value(makeGameContext())
        } catch (e) {
          console.warn('[BanGLife] 脚本效果执行失败：', e)
        }
        break
      }
    }
  }
}
