import {del, get, keys, set} from 'idb-keyval'
import {compressToBase64, decompressFromBase64} from 'lz-string'
import type {PlayerState} from '@/core/types'
import type {SaveFile, SaveSlot} from './save-types'
import {GAME_VERSION, SAVE_FORMAT_VERSION} from './save-types'

type Migration = (save: SaveFile) => SaveFile

const migrations: Record<number, Migration> = {
  1: s => s,
  2: migrateAppearanceV2,
}

function migrateAppearanceV2(save: SaveFile): SaveFile {
  const s = JSON.parse(JSON.stringify(save)) as SaveFile
  const player = s.state.player as unknown as Record<string, unknown>
  const appearance = player['appearance']
  if (!appearance || typeof appearance !== 'object') return s

  // Check if already in new format (values are objects, not strings)
  const entries = Object.entries(appearance as Record<string, unknown>)
  if (entries.every(([, v]) => typeof v === 'object' && v !== null)) return s

  // Migrate: old format string paths → new PartSelection
  const newAppearance: Record<string, { style: string; color: string }> = {}
  for (const [part, value] of entries) {
    if (typeof value !== 'string') {
      newAppearance[part] = {style: '01', color: ''}
      continue
    }
    // Pattern: '{part}/{style}-{color}.png' or '{part}/{style}.png'
    const fileName = (value as string).replace(/\.png$/, '')
    const afterSlash = fileName.includes('/') ? fileName.split('/').pop()! : fileName
    const dashIdx = afterSlash.indexOf('-')
    if (dashIdx >= 0) {
      newAppearance[part] = {
        style: afterSlash.substring(0, dashIdx),
        color: afterSlash.substring(dashIdx + 1),
      }
    } else {
      newAppearance[part] = {
        style: afterSlash,
        color: '',
      }
    }
  }
  player['appearance'] = newAppearance
  return s
}

function migrate(save: SaveFile): SaveFile {
  let s = save
  for (let v = s.formatVersion + 1; v <= SAVE_FORMAT_VERSION; v++) {
    const fn = migrations[v]
    if (fn) s = fn(s)
    s.formatVersion = v
  }
  return s
}

function slotKey(slot: number) {
  return `save:slot:${slot}`
}

export async function writeSlot(slot: SaveSlot): Promise<void> {
  await set(slotKey(slot.slot), slot)
}

export async function readSlot(slot: number): Promise<SaveSlot | undefined> {
  const raw = await get<SaveSlot>(slotKey(slot))
  if (!raw || !raw.data) return undefined
  raw.data = migrate(raw.data)
  return raw
}

export async function deleteSlot(slot: number): Promise<void> {
  await del(slotKey(slot))
}

export async function listSlots(): Promise<SaveSlot[]> {
  const allKeys = await keys<string>()
  const saveKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('save:slot:'))
  const slots = await Promise.all(saveKeys.map(k => get<SaveSlot>(k)))
  return (slots.filter(Boolean) as SaveSlot[]).sort((a, b) => a.slot - b.slot)
}

export function exportSave(save: SaveFile): string {
  return compressToBase64(JSON.stringify(save))
}

export function importSave(encoded: string): SaveFile {
  const json = decompressFromBase64(encoded)
  if (!json) throw new Error('存档解压失败')
  const save = JSON.parse(json) as SaveFile
  if (save.magic !== 'BANGLIFE_SAVE') throw new Error('无效的 BanGLife 存档')
  return migrate(save)
}

export function buildSaveFile(
  time: number,
  player: PlayerState,
  modData: Record<string, unknown>,
  mods: { id: string; version: string }[],
  tasks: Record<string, { startTime: number; progress: boolean[]; status: string }> = {},
): SaveFile {
  const now = Date.now()
  return {
    magic: 'BANGLIFE_SAVE',
    formatVersion: SAVE_FORMAT_VERSION,
    gameVersion: GAME_VERSION,
    createdAt: now,
    updatedAt: now,
    mods,
    modData,
    state: {
      time,
      player: JSON.parse(JSON.stringify(player)),
      tasks: tasks,
    },
    ui: {seenPassages: []},
  }
}
