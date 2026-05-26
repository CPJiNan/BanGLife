import type {
  Action,
  GameEvent,
  GameLocation,
  Item,
  ModAPI,
  ModDefinition,
  ModManifest,
  NPC,
  Passage,
  Shop,
  ShopItem,
  StatDef,
  Task,
} from '@banglife/mod-types'
import type {GameContext} from '@/core/types'
import type {Registry} from '@/core/registry'
import {registries} from '@/core/registry'
import {usePlayerStore} from '@/stores/player'

type UndoOp =
  | { type: 'unregister'; registry: keyof typeof registries; id: string }
  | { type: 'unregister-shop-item'; shopId: string; itemId: string; idx: number }
  | { type: 'off'; unsub: () => void }

type EventHandler = (...args: unknown[]) => void

class EventBus {
  private handlers = new Map<string, Set<EventHandler>>()

  on(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(handler)
    return () => this.handlers.get(event)?.delete(handler)
  }

  emit(event: string, payload?: unknown): void {
    this.handlers.get(event)?.forEach(h => h(payload))
    this.handlers.get('*')?.forEach(h => h(event, payload))
  }
}

export const eventBus = new EventBus()

interface LoadedMod {
  manifest: ModManifest
  definition: ModDefinition
  api: ModAPI
}

export function createModAPI(manifest: ModManifest): ModAPI {
  const modId = manifest.id
  const undoStack: UndoOp[] = []

  function track(op: UndoOp) {
    undoStack.push(op)
  }

  function reg<T extends { id: string }>(
    key: keyof typeof registries,
    item: T,
  ) {
    ;(registries[key] as unknown as Registry<T>).register(item, modId)
    track({type: 'unregister', registry: key, id: item.id})
  }

  const api: ModAPI = {
      get modId() {
        return modId
      },
      get modPath() {
        return ''
      },

      registerLocation: (location: GameLocation) => reg('locations', location),
      registerAction: (action: Action) => reg('actions', action),
      registerEvent: (event: GameEvent) => reg('events', event),
      registerItem: (item: Item) => reg('items', item),
      registerShop: (shop: Shop) => reg('shops', shop),
      registerShopItem(shopId: string, item: ShopItem) {
        const shop = registries.shops.get(shopId)
        if (!shop) {
          api.log(`未找到商店 ${shopId}`, 'warn')
          return
        }
        const idx = shop.items.length
        shop.items.push(item)
        track({type: 'unregister-shop-item', shopId, itemId: item.itemId, idx})
      },
      registerStat: (stat: StatDef) => reg('stats', stat),
      registerNPC: (npc: NPC) => reg('npcs', npc),
      registerPassage: (passage: Passage) => reg('passages', passage),
      registerTask: (task: Task) => reg('tasks', task),

      on(event: string, handler: (...args: unknown[]) => void) {
        const unsub = eventBus.on(event, handler)
        track({type: 'off', unsub})
        return unsub
      },

      emit(event: string, payload?: unknown) {
        eventBus.emit(event, payload)
      },

      log(msg: string, level: 'info' | 'warn' | 'error' = 'info') {
        const prefix = `[Mod:${modId}]`
        if (level === 'error') console.error(prefix, msg)
        else if (level === 'warn') console.warn(prefix, msg)
        else console.info(prefix, msg)
      },
    }

  ;(api as unknown as { _unload: () => void })._unload = () => {
    for (const op of [...undoStack].reverse()) {
      if (op.type === 'unregister') registries[op.registry].unregister(op.id)
      else if (op.type === 'unregister-shop-item') {
        const shop = registries.shops.get(op.shopId)
        if (shop) shop.items.splice(op.idx, 1)
      } else if (op.type === 'off') op.unsub()
    }
    undoStack.length = 0
  }

  return api
}

const loadedMods = new Map<string, LoadedMod>()

export function getLoadedMods(): LoadedMod[] {
  return Array.from(loadedMods.values())
}

export function getLoadedMod(id: string): LoadedMod | undefined {
  return loadedMods.get(id)
}

function topoSort(mods: { manifest: ModManifest; definition: ModDefinition }[]): typeof mods {
  const map = new Map(mods.map(mod => [mod.manifest.id, mod]))
  const visited = new Set<string>()
  const result: typeof mods = []

  function visit(id: string, stack: Set<string>) {
    if (visited.has(id)) return
    if (stack.has(id)) throw new Error(`[ModLoader] Mod 存在循环依赖：${[...stack, id].join(' → ')}`)
    stack.add(id)
    const mod = map.get(id)
    if (!mod) throw new Error(`[ModLoader] 未找到 Mod ${id}`)
    for (const dep of mod.manifest.dependencies ?? []) {
      visit(dep.id, new Set(stack))
    }
    visited.add(id)
    result.push(mod)
  }

  for (const mod of mods) visit(mod.manifest.id, new Set())
  return result
}

export async function loadBundled(
  mods: { manifest: ModManifest; definition: ModDefinition }[],
): Promise<void> {
  const sorted = topoSort(mods)
  for (const {manifest, definition} of sorted) {
    if (loadedMods.has(manifest.id)) {
      console.warn(`[ModLoader] 已加载 Mod ${manifest.id}，跳过加载`)
      continue
    }
    const api = createModAPI(manifest)
    await definition.onLoad?.(api)
    loadedMods.set(manifest.id, {manifest, definition, api})
    console.info(`[ModLoader] 已加载 Mod ${manifest.id} v${manifest.version}`)
  }
}

export async function unloadMod(id: string): Promise<void> {
  const loaded = loadedMods.get(id)
  if (!loaded) return
  await loaded.definition.onUnload?.(loaded.api)
  ;(loaded.api as unknown as { _unload: () => void })._unload()
  loadedMods.delete(id)
}

export function makeGameContext(): GameContext {
  const player = usePlayerStore()
  return {
    time: player.timeInfo,
    player: player.state,
    locationId: player.state.currentLocationId,
  }
}
