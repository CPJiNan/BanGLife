import type {Action, GameEvent, GameLocation, Item, NPC, Passage, Shop, StatDef, Task} from './types'

export class Registry<T extends { id: string }> {
  private items = new Map<string, T>()
  private sources = new Map<string, string>()

  register(item: T, source = 'core'): void {
    this.items.set(item.id, item)
    this.sources.set(item.id, source)
  }

  get(id: string): T | undefined {
    return this.items.get(id)
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }

  filter(pred: (item: T) => boolean): T[] {
    return this.getAll().filter(pred)
  }

  unregister(id: string): void {
    this.items.delete(id)
    this.sources.delete(id)
  }

  sourceOf(id: string): string | undefined {
    return this.sources.get(id)
  }

  clear(): void {
    this.items.clear()
    this.sources.clear()
  }
}

export const registries = {
  locations: new Registry<GameLocation>(),
  actions: new Registry<Action>(),
  events: new Registry<GameEvent>(),
  items: new Registry<Item>(),
  shops: new Registry<Shop>(),
  stats: new Registry<StatDef>(),
  npcs: new Registry<NPC>(),
  passages: new Registry<Passage>(),
  tasks: new Registry<Task>(),
}
