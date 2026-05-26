import type {PlayerState} from '@/core/types'
import {version} from '../../package.json' with {type: 'json'}

export const SAVE_FORMAT_VERSION = 1
export const GAME_VERSION = version

export interface SaveFile {
  magic: 'BANGLIFE_SAVE'
  formatVersion: number
  gameVersion: string
  createdAt: number
  updatedAt: number
  mods: { id: string; version: string }[]
  modData: Record<string, unknown>
  state: {
    time: number
    player: PlayerState
    tasks: Record<string, { startTime: number; progress: boolean[]; status: string }>
  }
  ui: {
    seenPassages: string[]
  }
}

export interface SaveSlot {
  slot: number
  label: string
  savedAt: number
  preview: {
    gameTime: number
    locationId: string
  }
  data: SaveFile | null
}
