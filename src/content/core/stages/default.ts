import type {Stage} from '@/core/types'

export const defaultStages: Stage[] = [
  {
    id: 'stage.station_busking',
    name: '车站前广场路演',
    description: '在车站前广场进行表演，提升乐队成员的即兴和技巧属性。',
    targetScore: 100,
    maxRounds: 3,
    rewards: [
      {type: 'npc_stat', key: 'band:improvisation', value: 2},
      {type: 'npc_stat', key: 'band:technique', value: 2},
      {type: 'time', value: 60},
    ],
  },
]
