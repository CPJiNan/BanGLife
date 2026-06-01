export type GameTime = number

export type Period =
  | 'dawn'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'evening'
  | 'night'

export interface TimeInfo {
  absolute: GameTime
  day: number
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6
  hour: number
  minute: number
  period: Period
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
}

export interface PlayerState {
  name: string
  stats: Record<string, number>
  money: number
  inventory: InventoryItem[]
  relationships: Record<string, Relationship>
  flags: Record<string, unknown>
  currentLocationId: string
  actionCooldowns: Record<string, GameTime>
}

export interface InventoryItem {
  itemId: string
  amount: number
}

export interface Relationship {
  affection: number
  flags: Record<string, boolean>
}

export interface GameContext {
  time: TimeInfo
  player: PlayerState
  locationId: string
}

export interface Effect {
  type: 'stat' | 'money' | 'item' | 'flag' | 'time' | 'location' | 'event' | 'task'
  key?: string
  value?: number | string | boolean
  chance?: number
}

export interface Connection {
  to: string
  duration: number
  label?: string
  icon?: string
  tag?: string
  condition?: (ctx: GameContext) => boolean
}

export interface GameLocation {
  id: string
  name: string
  description: string
  tags: string[]
  parent?: string
  connections: Connection[]
  openHours?: [number, number][]
  onEnter?: string
  backgroundImage?: string
  ambientSound?: string
}

export interface Action {
  id: string
  locationId?: string | string[] | '*'
  tag?: string
  label: string
  description?: string
  icon?: string
  duration: number
  available?: (ctx: GameContext) => boolean
  visible?: (ctx: GameContext) => boolean
  cost?: Effect[]
  effects?: Effect[]
  execute?: (ctx: GameContext) => void | Promise<void>
  passage?: string
  event?: string
  cooldown?: { period: 'day' | 'week' | 'once'; minutes?: number }
}

export type TriggerOn =
  | 'location:enter'
  | 'location:leave'
  | 'time:tick'
  | 'time:at'
  | 'day:start'
  | 'day:end'
  | 'action:before'
  | 'action:after'
  | 'flag:change'
  | 'stat:change'
  | 'manual'

export interface EventTrigger {
  on: TriggerOn
  location?: string | string[]
  action?: string
  timeRange?: [number, number]
  weekday?: (0 | 1 | 2 | 3 | 4 | 5 | 6)[]
  condition?: (ctx: GameContext) => boolean
  priority?: number
  once?: boolean
  weight?: number
}

export interface Choice {
  label: string
  condition?: (ctx: GameContext) => boolean
  effects: Effect[]
  nextPassage?: string
}

export interface GameEvent {
  id: string
  trigger: EventTrigger
  passage: string
  effects?: Effect[]
  choices?: Choice[]
}

export interface Item {
  id: string
  name: string
  description?: string
  icon?: string
  stackable?: boolean
  tags?: string[]
  usable?: boolean
  useEffects?: Effect[]
  consumable?: boolean | number
  droppable?: boolean
}

export interface ShopItem {
  itemId: string
  buyPrice?: number
  sellPrice?: number
  stock?: number
  discount?: number | ((ctx: GameContext) => number)
  condition?: (ctx: GameContext) => boolean
}

export interface Shop {
  id: string
  name: string
  description?: string
  icon?: string
  locationId?: string | string[]
  visible?: (ctx: GameContext) => boolean
  available?: (ctx: GameContext) => boolean
  items: ShopItem[]
}

export interface StatDef {
  id: string
  name: string
  min: number
  max: number
  default: number
  decay?: { amount: number; perMinutes: number }
  category: 'physical' | 'mental' | 'skill' | 'social'
  visible: boolean
  color?: string
}

export interface NPC {
  id: string
  name: string
}

export interface Passage {
  id: string
  text: string
  conditions?: { if: (ctx: GameContext) => boolean; text: string }[]
  speaker?: string
  choices?: Choice[]
}

export interface Target {
  title: string
  description: string
  onCheck: (ctx: GameContext) => boolean
  onProgress?: (ctx: GameContext) => number
}

export interface Task {
  id: string
  title: string
  description: string
  targets: Target[]
  rewards?: Effect[]
  cancelable?: boolean
  expire?: number
  onComplete?: (ctx: GameContext) => void
  onCancel?: (ctx: GameContext) => void
  onExpire?: (ctx: GameContext) => void
}

export interface ModManifest {
  id: string
  name: string
  version: string
  gameVersion: string
  author?: string
  description?: string
  entry: string
  dependencies?: { id: string; version: string }[]
  conflicts?: string[]
}

export interface ModAPI {
  readonly modId: string
  readonly modPath: string

  registerLocation(location: GameLocation): void

  registerAction(action: Action): void

  registerEvent(event: GameEvent): void

  registerItem(item: Item): void

  registerShop(shop: Shop): void

  registerShopItem(shopId: string, item: ShopItem): void

  registerStat(stat: StatDef): void

  registerNPC(npc: NPC): void

  registerPassage(passage: Passage): void

  registerTask(task: Task): void

  on(event: string, handler: (...args: unknown[]) => void): () => void

  emit(event: string, payload?: unknown): void

  log(msg: string, level?: 'info' | 'warn' | 'error'): void
}

export interface ModDefinition {
  onLoad?: (api: ModAPI) => void | Promise<void>
  onUnload?: (api: ModAPI) => void | Promise<void>
  onSerialize?: () => unknown
  onDeserialize?: (data: unknown) => void
}
