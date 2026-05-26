import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {SaveSlot} from './save-types'
import {buildSaveFile, deleteSlot, exportSave, importSave, listSlots, readSlot, writeSlot,} from './save-storage'
import {getLoadedMods} from '@/mod/api'
import {usePlayerStore} from './player'
import {useTasksStore} from './tasks'

export const useSaveStore = defineStore('save', () => {
  const slots = ref<SaveSlot[]>([])
  const busy = ref(false)
  const error = ref<string | null>(null)

  async function refresh(): Promise<void> {
    slots.value = await listSlots()
  }

  function buildModData(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    for (const mod of getLoadedMods()) {
      const result = mod.definition.onSerialize?.()
      if (result !== undefined) data[mod.manifest.id] = result
    }
    return data
  }

  function buildModList() {
    return getLoadedMods().map(m => ({id: m.manifest.id, version: m.manifest.version}))
  }

  async function saveToSlot(slot: number, label?: string): Promise<void> {
    busy.value = true
    error.value = null
    try {
      const player = usePlayerStore()
      const tasksStore = useTasksStore()
      const saveFile = buildSaveFile(
        player.time,
        player.state,
        buildModData(),
        buildModList(),
        tasksStore.serialize(),
      )
      const saveSlot: SaveSlot = {
        slot,
        label: label ?? `存档 ${slot}`,
        savedAt: Date.now(),
        preview: {
          gameTime: player.time,
          locationId: player.state.currentLocationId,
        },
        data: saveFile,
      }
      await writeSlot(saveSlot)
      await refresh()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '存档失败'
    } finally {
      busy.value = false
    }
  }

  async function loadFromSlot(slot: number): Promise<void> {
    busy.value = true
    error.value = null
    try {
      const saved = await readSlot(slot)
      if (!saved || !saved.data) {
        error.value = `存档槽 ${slot} 为空`
        return
      }
      const player = usePlayerStore()
      player.time = saved.data.state.time
      Object.assign(player.state, saved.data.state.player)
      if (saved.data.state.tasks) {
        useTasksStore().deserialize(saved.data.state.tasks)
      }
      for (const mod of getLoadedMods()) {
        const modData = saved.data.modData[mod.manifest.id]
        if (modData !== undefined) mod.definition.onDeserialize?.(modData)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '读档失败'
    } finally {
      busy.value = false
    }
  }

  async function deleteFromSlot(slot: number): Promise<void> {
    await deleteSlot(slot)
    await refresh()
  }

  function exportSlot(slot: number): string | null {
    const s = slots.value.find(s => s.slot === slot)
    if (!s || !s.data) return null
    return exportSave(s.data)
  }

  async function importFromString(encoded: string, slot: number): Promise<void> {
    busy.value = true
    error.value = null
    try {
      const saveFile = importSave(encoded)
      const saveSlot: SaveSlot = {
        slot,
        label: `存档 ${slot}`,
        savedAt: Date.now(),
        preview: {
          gameTime: saveFile.state.time,
          locationId: saveFile.state.player.currentLocationId,
        },
        data: saveFile,
      }
      await writeSlot(saveSlot)
      await refresh()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '导入失败'
    } finally {
      busy.value = false
    }
  }

  async function createEmptySlot(label?: string): Promise<void> {
    const maxSlot = Math.max(...slots.value.filter(s => s.slot > 0).map(s => s.slot), 0)
    const newSlot = maxSlot + 1
    const emptySlot: SaveSlot = {
      slot: newSlot,
      label: label ?? `存档 ${newSlot}`,
      savedAt: Date.now(),
      preview: {
        gameTime: 0,
        locationId: '',
      },
      data: null as any,
    }
    await writeSlot(emptySlot)
    await refresh()
  }

  return {
    slots,
    busy,
    error,
    refresh,
    saveToSlot,
    loadFromSlot,
    deleteFromSlot,
    exportSlot,
    importFromString,
    createEmptySlot,
  }
})
