import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {PlayerState} from '@/core/types'
import {getTimeInfo} from '@/core/time'
import {START_TIME} from '@/core/constants'
import {registries} from '@/core/registry'
import {applyEffects} from '@/core/effects'

export const usePlayerStore = defineStore('player', () => {
  const state = ref<PlayerState>({
    name: '',
    stats: {
      vocal: 20,
      expression: 20,
      pitch: 20,
      technique: 20,
      ensemble: 20,
      rhythm: 20,
      improvisation: 20,
    },
    school: 'school.haneoka',
    money: 50000,
    inventory: [],
    relationships: {},
    flags: {},
    currentLocationId: 'home.bedroom',
    appearance: {
      eyes: {style: '01', color: 'brown'},
      hair: {style: '01', color: 'black'},
      eyebrows: {style: '01', color: ''},
      mouth: {style: '01', color: ''},
      nose: {style: '01', color: ''},
    },
    band: {
      name: '',
      members: [],
    },
    liveBoost: 3,
    traits: [],
  })

  const time = ref<number>(START_TIME)
  const timeInfo = computed(() => getTimeInfo(time.value))

  function advanceTime(minutes: number): void {
    time.value += minutes
    for (const statDef of registries.stats.getAll()) {
      if (!statDef.decay || statDef.decay.amount === 0) continue
      applyEffects([{type: 'stat', key: statDef.id, value: -statDef.decay.amount / statDef.decay.perMinutes * minutes}])
    }
  }

  function setStat(id: string, value: number): void {
    state.value.stats[id] = value
  }

  function modifyStat(id: string, delta: number): void {
    const statDef = registries.stats.get(id)
    const def = statDef?.default ?? 0
    const current = state.value.stats[id] ?? def
    state.value.stats[id] = current + delta
  }

  function moveTo(locationId: string): void {
    state.value.currentLocationId = locationId
  }

  function setFlag(key: string, value: unknown): void {
    state.value.flags[key] = value
  }

  function getFlag(key: string): unknown {
    return state.value.flags[key]
  }

  function consumeLiveBoost(): void {
    if (state.value.liveBoost > 0) state.value.liveBoost -= 1
  }

  function recoverLiveBoost(): void {
    state.value.liveBoost = Math.min(3, state.value.liveBoost + 3)
  }

  return {
    state,
    time,
    timeInfo,
    advanceTime,
    setStat,
    modifyStat,
    moveTo,
    setFlag,
    getFlag,
    consumeLiveBoost,
    recoverLiveBoost,
  }
})
