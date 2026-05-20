import {registries} from '@/core/registry'
import type {GameContext, TriggerSignal} from '@/core/types'

export function triggerEvents(signal: TriggerSignal, ctx: GameContext): string | null {
  const candidates = registries.events.filter(evt => {
    if (evt.trigger.on !== signal.type) return false
    if (evt.trigger.condition && !evt.trigger.condition(ctx)) return false
    if (signal.type === 'location:enter' && evt.trigger.location) {
      const locs = Array.isArray(evt.trigger.location) ? evt.trigger.location : [evt.trigger.location]
      if (!locs.includes(signal.locationId)) return false
    }
    return true
  })
  if (candidates.length === 0) return null
  const sorted = [...candidates].sort((a, b) => (b.trigger.priority ?? 50) - (a.trigger.priority ?? 50))
  return sorted[0].passage
}
