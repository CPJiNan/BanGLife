import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import {registries} from '@/core/registry'
import type {GameContext} from '@/core/types'

export const useWorldStore = defineStore('world', () => {
  const initialized = ref(false)

  const locations = computed(() => registries.locations.getAll())
  const actions = computed(() => registries.actions.getAll())

  function getLocation(id: string) {
    return registries.locations.get(id)
  }

  function getActionsForLocation(locationId: string, ctx?: GameContext) {
    return registries.actions.filter(action => {
      const locMatch = action.locationId === '*' || action.locationId === locationId ||
        (Array.isArray(action.locationId) && action.locationId.includes(locationId))
      if (!locMatch) return false
      if (!ctx) return true
      return action.visible?.(ctx) !== false && action.available?.(ctx) !== false
    })
  }

  function init() {
    initialized.value = true
  }

  return {
    initialized,
    locations,
    actions,
    getLocation,
    getActionsForLocation,
    init,
  }
})
