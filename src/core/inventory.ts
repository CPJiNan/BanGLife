import type {Effect, Item} from '@banglife/mod-types'
import {registries} from '@/core/registry'
import {usePlayerStore} from '@/stores/player'

export function getItemAmount(itemId: string): number {
  const {state} = usePlayerStore()
  const item = registries.items.get(itemId)

  if (item?.stackable === false) return state.inventory.filter(i => i.itemId === itemId).length
  else return state.inventory.find(i => i.itemId === itemId)?.amount ?? 0
}

export function giveItem(itemId: string, amount = 1): void {
  if (!Number.isFinite(amount) || amount <= 0) return
  const {state} = usePlayerStore()
  const item = registries.items.get(itemId)

  if (item?.stackable !== false) {
    const existing = state.inventory.find(i => i.itemId === itemId)
    if (existing) {
      existing.amount += amount
      return
    }
    state.inventory.push({itemId, amount})
  } else {
    for (let i = 0; i < amount; i++) {
      state.inventory.push({itemId, amount: 1})
    }
  }
}

export function takeItem(itemId: string, amount = 1): boolean {
  if (!Number.isFinite(amount) || amount <= 0) return false
  const {state} = usePlayerStore()
  const item = registries.items.get(itemId)

  if (item?.stackable === false) {
    for (let i = 0; i < amount; i++) {
      const index = state.inventory.findIndex(inv => inv.itemId === itemId)
      if (index < 0) return false
      state.inventory.splice(index, 1)
    }
    return true
  }

  const index = state.inventory.findIndex(i => i.itemId === itemId)
  if (index < 0) return false

  const entry = state.inventory[index]
  if (entry.amount < amount) return false

  entry.amount -= amount
  if (entry.amount <= 0) state.inventory.splice(index, 1)
  return true
}

export function dropItem(itemId: string, amount = 1): boolean {
  const item = registries.items.get(itemId)
  if (item?.droppable === false) return false
  return takeItem(itemId, amount)
}

export function canUseItem(item: Item | undefined): boolean {
  if (!item?.usable || !item.useEffects || item.useEffects.length === 0) return false
  return getItemAmount(item.id) > 0
}

export function useItem(
  itemId: string,
  applyItemEffects: (effects: Effect[]) => void,
): boolean {
  const item = registries.items.get(itemId)
  if (!canUseItem(item) || !item?.useEffects) return false

  const consume = item.consumable ?? true
  const consumeAmount = consume === true ? 1 : consume === false ? 0 : consume
  if (consumeAmount > 0 && getItemAmount(itemId) < consumeAmount) return false

  applyItemEffects(item.useEffects)

  if (consumeAmount > 0) return takeItem(itemId, consumeAmount)
  return true
}


