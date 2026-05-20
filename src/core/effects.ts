import type {Effect} from '@banglife/mod-types'
import {registries} from '@/core/registry'
import {giveItem, takeItem} from '@/core/inventory'
import {usePlayerStore} from '@/stores/player'

export function applyEffects(effects: Effect[]): void {
  const player = usePlayerStore()
  const state = player.state

  for (const effect of effects) {
    switch (effect.type) {
      case 'stat': {
        if (effect.key === undefined) break
        const statDef = registries.stats.get(effect.key)
        const max = statDef?.max ?? 100
        const current = state.stats[effect.key] ?? 0
        const delta = Number(effect.value ?? 0)
        state.stats[effect.key] = Math.max(statDef?.min ?? 0, Math.min(max, current + delta))
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
      case 'event': {
        break
      }
    }
  }
}
