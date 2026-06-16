import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {PlayerState} from '@/core/types'
import {getTimeInfo} from '@/core/time'
import {START_TIME} from '@/core/constants'
import {registries} from '@/core/registry'

export const usePlayerStore = defineStore('player', () => {
  const state = ref<PlayerState>({
    name: '',
    stats: {
      vocal: 0,
      keyboard: 0,
      guitar: 0,
      bass: 0,
      drum: 0,
    },
    money: 50000,
    inventory: [],
    relationships: {},
    flags: {},
    school: 'school.haneoka',
    currentLocationId: 'home.bedroom',
    actionCooldowns: {},
    appearance: {
      eyes: {style: '01', color: 'brown'},
      hair: {style: '01', color: 'black'},
      eyebrows: {style: '01', color: ''},
      mouth: {style: '01', color: ''},
      nose: {style: '01', color: ''},
    },
  })

  const time = ref<number>(START_TIME)
  const timeInfo = computed(() => getTimeInfo(time.value))

  function advanceTime(minutes: number): void {
    time.value += minutes
    applyStatDecay(minutes)
  }

  function applyStatDecay(minutes: number): void {
    const s = state.value.stats
    for (const statDef of registries.stats.getAll()) {
      if (!statDef.decay || statDef.decay.amount === 0) continue
      const rate = statDef.decay.amount / statDef.decay.perMinutes
      s[statDef.id] = Math.max(statDef.min, (s[statDef.id] ?? statDef.default) - rate * minutes)
    }
    if ((s['hunger'] ?? 0) < 20) {
      s['energy'] = Math.max(0, (s['energy'] ?? 0) - minutes / 60)
    }
  }

  function setStat(id: string, value: number): void {
    state.value.stats[id] = value
  }

  function modifyStat(id: string, delta: number): void {
    const current = state.value.stats[id] ?? 0
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
  }
})
