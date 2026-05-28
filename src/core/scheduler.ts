import {registries} from '@/core/registry'
import {eventBus} from '@/mod/api'
import type {GameContext, TriggerSignal} from '@/core/types'

export function triggerEvents(signal: TriggerSignal, ctx: GameContext): string | null {
  eventBus.emit(signal.type, signal)
  const candidates = registries.events.filter(evt => {
    if (evt.trigger.on !== signal.type) return false
    if (evt.trigger.condition && !evt.trigger.condition(ctx)) return false
    return true
  })
  if (candidates.length === 0) return null
  const sorted = [...candidates].sort((a, b) => (b.trigger.priority ?? 50) - (a.trigger.priority ?? 50))
  return sorted[0].passage
}
