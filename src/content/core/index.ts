import type {ModDefinition, ModManifest, PerformanceStrategy} from '@banglife/mod-types'
import type {Action, GameLocation, Item, NPC, Passage, Shop, Stage, StatDef, Task, Trait} from '@/core/types'
import {GAME_VERSION} from '@/stores/save-types'
import {schoolActions, schoolLocations, schoolPassages} from './locations/school.ts'
import {homeActions, homeLocations, homePassages} from './locations/home.ts'
import {cityLocations} from './locations/city.ts'
import {livehouseCircleLocations} from './locations/livehouse_circle.ts'
import {
  edogawaInstrumentItems,
  edogawaInstrumentLocations,
  edogawaInstrumentShops
} from './locations/edogawa_instrument.ts'
import {fastFoodItems, fastFoodLocations, fastFoodShops} from './locations/fast_food.ts'
import {shoppingCenterLocations} from './locations/shopping_center.ts'
import {
  livehouseRingActions,
  livehouseRingItems,
  livehouseRingLocations,
  livehouseRingPassages,
  livehouseRingShops,
  livehouseRingTasks,
} from './locations/livehouse_ring.ts'
import {
  yamabukiBakeryActions,
  yamabukiBakeryItems,
  yamabukiBakeryLocations,
  yamabukiBakeryPassages,
  yamabukiBakeryShops,
} from './locations/yamabuki_bakery.ts'
import {
  hanasawaCafeActions,
  hanasawaCafeItems,
  hanasawaCafeLocations,
  hanasawaCafePassages,
  hanasawaCafeShops,
  hanasawaCafeTasks,
} from './locations/hanasawa_cafe.ts'
import {ririko, ririkoActions, ririkoPassages} from './npcs/ririko.ts'
import {tsugumi, tsugumiActions, tsugumiPassages} from './npcs/tsugumi.ts'
import {saya, sayaActions, sayaPassages} from './npcs/saya.ts'
import {anon} from './npcs/anon.ts'
import {tomori} from './npcs/tomori.ts'
import {taki} from './npcs/taki.ts'
import {rana} from './npcs/rana.ts'
import {soyo} from './npcs/soyo.ts'
import {defaultStrategies} from './strategies/default.ts'
import {defaultStages} from './stages/default.ts'
import {defaultTraits} from './traits/default.ts'

const manifest: ModManifest = {
  id: 'banglife.core',
  name: 'BanGLife Core',
  version: GAME_VERSION,
  gameVersion: `>=${GAME_VERSION}`,
  author: 'BanGLife',
  description: 'BanGLife 核心 Mod',
  entry: 'index.ts',
}

const stats: StatDef[] = [
  {
    id: 'hunger',
    name: '饥饿',
    min: 0,
    max: 100,
    default: 0,
    category: 'physical',
    visible: true,
    color: '#FF6666',
    decay: {amount: -5, perMinutes: 60}
  },
  {id: 'fatigue', name: '疲劳', min: 0, max: 100, default: 0, category: 'physical', visible: true, color: '#FFBB22'},
  {id: 'knowledge', name: '知识', min: 0, max: 100, default: 0, category: 'mental', visible: true, color: '#66DDFF'},
  {id: 'stress', name: '压力', min: 0, max: 100, default: 0, category: 'mental', visible: true, color: '#FF77BB'},
  {id: 'vocal', name: '演唱', min: 0, max: 100, default: 20, category: 'instrument', visible: true, color: '#FF9933'},
  {id: 'keyboard', name: '键盘', min: 0, max: 100, default: 0, category: 'instrument', visible: true, color: '#99CCFF'},
  {id: 'guitar', name: '吉他', min: 0, max: 100, default: 0, category: 'instrument', visible: true, color: '#AA88FF'},
  {id: 'bass', name: '贝斯', min: 0, max: 100, default: 0, category: 'instrument', visible: true, color: '#66EEBB'},
  {id: 'drum', name: '鼓', min: 0, max: 100, default: 0, category: 'instrument', visible: true, color: '#FFAAAA'},
  {
    id: 'expression',
    name: '表达',
    min: 0,
    max: 100,
    default: 20,
    category: 'performance',
    visible: false,
    color: '#FF6699'
  },
  {
    id: 'technique',
    name: '技巧',
    min: 0,
    max: 100,
    default: 20,
    category: 'performance',
    visible: false,
    color: '#99CCFF'
  },
  {
    id: 'rhythm',
    name: '节奏',
    min: 0,
    max: 100,
    default: 20,
    category: 'performance',
    visible: false,
    color: '#FFCC44'
  },
  {
    id: 'pitch',
    name: '音感',
    min: 0,
    max: 100,
    default: 20,
    category: 'performance',
    visible: false,
    color: '#88DDAA'
  },
  {
    id: 'ensemble',
    name: '合奏',
    min: 0,
    max: 100,
    default: 20,
    category: 'performance',
    visible: false,
    color: '#CC99FF'
  },
  {
    id: 'improvisation',
    name: '即兴',
    min: 0,
    max: 100,
    default: 20,
    category: 'performance',
    visible: false,
    color: '#FFAA66'
  },
]

const locations: GameLocation[] = [
  ...homeLocations,
  ...cityLocations,
  ...livehouseCircleLocations,
  ...edogawaInstrumentLocations,
  ...fastFoodLocations,
  ...shoppingCenterLocations,
  ...livehouseRingLocations,
  ...yamabukiBakeryLocations,
  ...hanasawaCafeLocations,
  ...schoolLocations,
]

const actions: Action[] = [
  ...homeActions,
  ...schoolActions,
  ...livehouseRingActions,
  ...hanasawaCafeActions,
  ...yamabukiBakeryActions,
  ...ririkoActions,
  ...tsugumiActions,
  ...sayaActions,
]

const passages: Passage[] = [
  ...homePassages,
  ...schoolPassages,
  ...livehouseRingPassages,
  ...hanasawaCafePassages,
  ...yamabukiBakeryPassages,
  ...ririkoPassages,
  ...tsugumiPassages,
  ...sayaPassages,
]

const items: Item[] = [
  ...edogawaInstrumentItems,
  ...yamabukiBakeryItems,
  ...hanasawaCafeItems,
  ...livehouseRingItems,
  ...fastFoodItems,
]

const shops: Shop[] = [
  ...edogawaInstrumentShops,
  ...yamabukiBakeryShops,
  ...hanasawaCafeShops,
  ...livehouseRingShops,
  ...fastFoodShops,
]

const npcs: NPC[] = [
  ririko,
  tsugumi,
  saya,
  anon,
  tomori,
  taki,
  rana,
  soyo,
]

const tasks: Task[] = [
  ...livehouseRingTasks,
  ...hanasawaCafeTasks,
]

const strategies: PerformanceStrategy[] = [
  ...defaultStrategies,
]

const stages: Stage[] = [
  ...defaultStages,
]

const traits: Trait[] = [
  ...defaultTraits,
]

const definition: ModDefinition = {
  async onLoad(api) {
    for (const stat of stats) api.registerStat(stat)
    for (const location of locations) api.registerLocation(location)
    for (const action of actions) api.registerAction(action)
    for (const passage of passages) api.registerPassage(passage)
    for (const npc of npcs) api.registerNPC(npc)
    for (const item of items) api.registerItem(item)
    for (const shop of shops) api.registerShop(shop)
    for (const task of tasks) api.registerTask(task)
    for (const strategy of strategies) api.registerStrategy(strategy)
    for (const stage of stages) api.registerStage(stage)
    for (const trait of traits) api.registerTrait(trait)
  },
}

export default {manifest, definition}
