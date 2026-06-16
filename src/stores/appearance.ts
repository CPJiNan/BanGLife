import {defineStore} from 'pinia'
import type {AppearanceState, GameContext, PartSelection} from '@/core/types'
import {usePlayerStore} from './player'

export interface OptionDef {
  id: string
  alias?: string
  available?: (ctx: GameContext) => boolean
}

export interface PartDef {
  id: string
  label: string
  hasColor: boolean
  styles: OptionDef[]
  colors: OptionDef[]
}

export const PARTS: PartDef[] = [
  {
    id: 'eyes',
    label: '眼睛',
    hasColor: true,
    styles: [{id: '01'}],
    colors: [
      {id: 'brown', alias: '棕色'},
    ],
  },
  {
    id: 'hair',
    label: '头发',
    hasColor: true,
    styles: [{id: '01'}],
    colors: [
      {id: 'black', alias: '黑色'},
      {id: 'milk_tea_blonde', alias: '奶茶金色'},
      {id: 'light_golden', alias: '浅金色'},
      {id: 'bright_yellow', alias: '亮黄色'},
    ],
  },
  {
    id: 'eyebrows',
    label: '眉毛',
    hasColor: false,
    styles: [{id: '01'}],
    colors: [],
  },
  {
    id: 'mouth',
    label: '嘴巴',
    hasColor: false,
    styles: [{id: '01'}],
    colors: [],
  },
  {
    id: 'nose',
    label: '鼻子',
    hasColor: false,
    styles: [{id: '01'}],
    colors: [],
  },
  {
    id: 'clothing',
    label: '服装',
    hasColor: false,
    styles: [{id: '01', alias: '羽丘女子学园校服', available: () => true}],
    colors: [],
  },
]

export const LAYERS = [
  {part: 'base', z: 1},
  {part: 'nose', z: 2},
  {part: 'mouth', z: 3},
  {part: 'eyebrows', z: 4},
  {part: 'eyes', z: 5},
  {part: 'clothing', z: 6},
  {part: 'hair', z: 7},
] as const

export const SCHOOL_CLOTHING: Record<string, string> = {
  'school.haneoka': '01',        // 羽丘女子学园校服
  'school.hanasakigawa': '',     // 暂无
  'school.tsukinomori': '',      // 暂无
}

export const DEFAULT_APPEARANCE: AppearanceState = {
  eyes: {style: '01', color: 'brown'},
  hair: {style: '01', color: 'black'},
  eyebrows: {style: '01', color: ''},
  mouth: {style: '01', color: ''},
  nose: {style: '01', color: ''},
  clothing: {style: '', color: ''},
}

export function displayName(opt: OptionDef): string {
  return opt.alias ?? opt.id
}

export function partPath(partId: string, sel: PartSelection): string {
  if (sel.color) return `${partId}/${sel.style}-${sel.color}.png`
  return `${partId}/${sel.style}.png`
}

export const useAppearanceStore = defineStore('appearance', () => {
  function getPartDef(partId: string): PartDef | undefined {
    return PARTS.find(p => p.id === partId)
  }

  function getAllParts(): string[] {
    return PARTS.map(p => p.id)
  }

  function applyAppearance(appearance: AppearanceState): void {
    const player = usePlayerStore()
    Object.assign(player.state.appearance, appearance)
  }

  return {
    getPartDef,
    getAllParts,
    applyAppearance,
  }
})
