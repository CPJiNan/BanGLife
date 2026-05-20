import type {ModDefinition, ModManifest} from '@banglife/mod-types'
import type {Action, GameLocation, Item, Passage, Shop, StatDef} from '@/core/types'
import {GAME_VERSION} from '@/stores/save-types'

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
  {id: 'hunger', name: '饥饿', min: 0, max: 100, default: 0, category: 'physical', visible: true, color: '#FF6666'},
  {id: 'fatigue', name: '疲劳', min: 0, max: 100, default: 0, category: 'physical', visible: true, color: '#FFBB22'},
  {id: 'stress', name: '压力', min: 0, max: 100, default: 0, category: 'mental', visible: true, color: '#FF77BB'},
  {id: 'vocal', name: '演唱', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#FF9933'},
  {id: 'keyboard', name: '键盘', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#99CCFF'},
  {id: 'guitar', name: '吉他', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#AA88FF'},
  {id: 'bass', name: '贝斯', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#66EEBB'},
  {id: 'drums', name: '鼓', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#FFAAAA'},
]

const locations: GameLocation[] = [
  {
    id: 'home.bedroom',
    name: '卧室',
    description: '你的房间。书桌上放着乐谱，窗外是安静的住宅街。',
    tags: ['indoor', 'home', 'private'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅', icon: 'sofa.svg'},
    ],
  },
  {
    id: 'home.living',
    name: '客厅',
    description: '家里的公共区域。电视、沙发，简单而温馨。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.bedroom', duration: 1, label: '去卧室', icon: 'bed.svg'},
      {to: 'home.bathroom', duration: 1, label: '去浴室', icon: 'bath.svg'},
      {to: 'home.kitchen', duration: 1, label: '去厨房', icon: 'kitchen.svg'},
      {to: 'city.residential_street', duration: 1, label: '出门', icon: 'street.svg'},
    ],
  },
  {
    id: 'home.bathroom',
    name: '浴室',
    description: '家里的浴室。白色瓷砖墙面，洗发水和沐浴露整齐地摆在架子上。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅', icon: 'sofa.svg'},
    ],
  },
  {
    id: 'home.kitchen',
    name: '厨房',
    description: '整洁的厨房。水槽里没有堆积的碗筷，冰箱里常备着牛奶和鸡蛋。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅', icon: 'sofa.svg'},
    ],
  },
  {
    id: 'city.residential_street',
    name: '住宅街',
    description: '安静的住宅区街道。两侧是整齐的楼房，偶尔有一两只猫走过。',
    tags: ['outdoor', 'city', 'residential'],
    connections: [
      {to: 'home.living', duration: 1, label: '回家', icon: 'home.svg'},
      {to: 'city.livehouse_circle', duration: 5, label: '去 LiveHouse CiRCLE', icon: 'microphone.svg'},
      {to: 'city.edogawa_instrument', duration: 5, label: '去江户川乐器店', icon: 'shop.svg'},
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg'},
      {to: 'city.shopping_street', duration: 5, label: '去商店街', icon: 'street.svg'},
    ],
  },
  {
    id: 'city.livehouse_circle',
    name: 'LiveHouse CiRCLE',
    description: '知名的 LiveHouse，经常举办各种演出。',
    tags: ['indoor', 'city', 'music', 'livehouse'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg'},
    ],
  },
  {
    id: 'city.edogawa_instrument',
    name: '江户川乐器店',
    description: '品种齐全的乐器店，从配件到专业乐器一应俱全。',
    tags: ['indoor', 'city', 'shop', 'music'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg'},
    ],
  },
  {
    id: 'city.school_street',
    name: '学园街',
    description: '连接着几所女子学园的街道，道路两旁种着行道树。',
    tags: ['outdoor', 'city', 'school'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg'},
      {to: 'school.hanasakigawa', duration: 5, label: '去花咲川女子学园', icon: 'school.svg'},
      {to: 'school.haneoka', duration: 5, label: '去羽丘女子学园', icon: 'school.svg'},
      {to: 'school.tsukinomori', duration: 5, label: '去月之森女子学园', icon: 'school.svg'},
      {to: 'city.walking_bridge', duration: 5, label: '去步道桥', icon: 'bridge.svg'},
    ],
  },
  {
    id: 'school.hanasakigawa',
    name: '花咲川女子学园',
    description: '校风自由的女子学园，鼓励学生发展个性，社团活动丰富多彩。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg'},
    ],
  },
  {
    id: 'school.haneoka',
    name: '羽丘女子学园',
    description: '注重升学率的女子学园，设有丰厚的奖学金制度。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg'},
    ],
  },
  {
    id: 'school.tsukinomori',
    name: '月之森女子学园',
    description: '优雅的贵族女子学园，学生们举止端庄。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg'},
    ],
  },
  {
    id: 'city.walking_bridge',
    name: '步道桥',
    description: '连接学园街和车站前的天桥，桥下是熙熙攘攘的街道。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg'},
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg'},
    ],
  },
  {
    id: 'city.station_front',
    name: '车站前',
    description: '繁忙的车站前广场，人来人往。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.walking_bridge', duration: 5, label: '去步道桥', icon: 'bridge.svg'},
      {to: 'city.fast_food', duration: 5, label: '去快餐店', icon: 'burger.svg'},
      {to: 'city.shopping_center', duration: 5, label: '去购物中心', icon: 'shop.svg'},
      {to: 'city.livehouse_ring', duration: 5, label: '去 LiveHouse RiNG', icon: 'microphone.svg'},
      {to: 'city.university_road', duration: 5, label: '去大学路', icon: 'street.svg'},
    ],
  },
  {
    id: 'city.fast_food',
    name: '快餐店',
    description: '提供各种套餐的快餐店，价格实惠。',
    tags: ['indoor', 'city', 'shop', 'food'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg'},
    ],
  },
  {
    id: 'city.shopping_center',
    name: '购物中心',
    description: '大型购物中心，各种商店应有尽有。',
    tags: ['indoor', 'city', 'shop'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg'},
    ],
  },
  {
    id: 'city.livehouse_ring',
    name: 'LiveHouse RiNG',
    description: '备受瞩目的新锐 LiveHouse，集演出厅、录音室与咖啡馆于一体。',
    tags: ['indoor', 'city', 'music', 'livehouse'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg'},
    ],
  },
  {
    id: 'city.university_road',
    name: '大学路',
    description: '连接两所大学的街道，路旁散落着咖啡馆和书店。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg'},
    ],
  },
  {
    id: 'city.shopping_street',
    name: '商店街',
    description: '传统的日式商店街，有很多特色小店。',
    tags: ['outdoor', 'city', 'shop'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg'},
    ],
  },
];

const actions: Action[] = [
  {
    id: 'bedroom.climb_bed',
    label: '爬到床上',
    icon: 'bed.svg',
    duration: 1,
    tag: 'daily',
    locationId: 'home.bedroom',
    passage: 'bedroom.sleep',
  },
  {
    id: 'bathroom.shower',
    label: '洗澡',
    icon: 'bath.svg',
    duration: 30,
    tag: 'daily',
    locationId: 'home.bathroom',
    passage: 'bathroom.shower',
    effects: [
      {type: 'stat', key: 'stress', value: -20},
    ],
  },
  {
    id: 'bathroom.brush_teeth',
    label: '刷牙',
    icon: 'tooth.svg',
    duration: 5,
    tag: 'daily',
    locationId: 'home.bathroom',
    passage: 'bathroom.brush_teeth',
    effects: [
      {type: 'stat', key: 'stress', value: -5},
    ],
  },
]

const passages: Passage[] = [
  {
    id: 'bedroom.sleep',
    text: '你躺在柔软的床上，感到一阵困意袭来...',
    choices: [
      {
        label: '睡 8 小时',
        effects: [
          {type: 'time', value: 480},
          {type: 'stat', key: 'fatigue', value: -50},
        ],
      },
      {
        label: '睡 7 小时',
        effects: [
          {type: 'time', value: 420},
          {type: 'stat', key: 'fatigue', value: -40},
        ],
      },
      {
        label: '睡 6 小时',
        effects: [
          {type: 'time', value: 360},
          {type: 'stat', key: 'fatigue', value: -30},
        ],
      },
      {
        label: '睡 5 小时',
        effects: [
          {type: 'time', value: 300},
          {type: 'stat', key: 'fatigue', value: -25},
        ],
      },
      {
        label: '睡 4 小时',
        effects: [
          {type: 'time', value: 240},
          {type: 'stat', key: 'fatigue', value: -20},
        ],
      },
      {
        label: '睡 3 小时',
        effects: [
          {type: 'time', value: 180},
          {type: 'stat', key: 'fatigue', value: -15},
        ],
      },
      {
        label: '睡 2 小时',
        effects: [
          {type: 'time', value: 120},
          {type: 'stat', key: 'fatigue', value: -10},
        ],
      },
      {
        label: '睡 1 小时',
        effects: [
          {type: 'time', value: 60},
          {type: 'stat', key: 'fatigue', value: -5},
        ],
      },
      {
        label: '爬下床',
        effects: [],
      },
    ],
  },
  {
    id: 'bathroom.shower',
    text: '温热的水流冲刷着身体，一天的疲惫仿佛都被冲走了。洗完澡后，整个人都轻松了许多。压力 -20。',
  },
  {
    id: 'bathroom.brush_teeth',
    text: '你认真地刷着牙，每一颗牙齿都变得干干净净。压力 -5。',
  },
]

const items: Item[] = [
  {
    id: 'instrument.guitar.st_100',
    name: 'ST-100',
    description: '进口仿制吉他。固定琴桥，单双拾音器，ST琴型。手感粗糙，琴颈边缘硌手，音准稳定性较差。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_starter_10',
    name: 'BGL Starter-10',
    description: 'BGL 的入门型吉他。固定琴桥，单单双拾音器，ST琴型。做工合格，手感适中，适合新手使用。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_stage_20',
    name: 'BGL Stage-20',
    description: 'BGL 的基础型吉他。单摇琴桥，单单拾音器，TL琴型。在学生乐队中较为常见，性能均衡。 ',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_rock_v',
    name: 'BGL Rock-V',
    description: 'BGL 的进阶型吉他。大双摇琴桥，双双可切单拾音器，V字琴型。舞台存在感强，适合视觉系演出。 ',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_performance_x',
    name: 'BGL Performance-X',
    description: 'BGL 的专业型吉他。小双摇琴桥，单单单可切单单双拾音器，TL琴型。职业乐手常用的级别，二手流通价值较高。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_master_ex',
    name: 'BGL Master-EX',
    description: 'BGL 的旗舰型吉他。小双摇琴桥，双单双拾音器，LP琴型。做工精良，音色饱满，受到众多资深乐手的认可。  ',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
]

const shops: Shop[] = [
  {
    id: 'shop.edogawa_instrument',
    name: '江户川乐器店',
    icon: 'shop.svg',
    locationId: 'city.edogawa_instrument',
    items: [
      {itemId: 'instrument.guitar.st_100', buyPrice: 15000, sellPrice: 8000},
      {itemId: 'instrument.guitar.bgl_starter_10', buyPrice: 39888, sellPrice: 19888},
      {itemId: 'instrument.guitar.bgl_stage_20', buyPrice: 140000, sellPrice: 80000},
      {itemId: 'instrument.guitar.bgl_rock_v', buyPrice: 180000, sellPrice: 100000},
      {itemId: 'instrument.guitar.bgl_performance_x', buyPrice: 280000, sellPrice: 180000},
      {itemId: 'instrument.guitar.bgl_master_ex', buyPrice: 550000, sellPrice: 300000},
    ],
  },
]

const definition: ModDefinition = {
  async onLoad(api) {
    for (const stat of stats) api.registerStat(stat)
    for (const location of locations) api.registerLocation(location)
    for (const action of actions) api.registerAction(action)
    for (const passage of passages) api.registerPassage(passage)
    for (const item of items) api.registerItem(item)
    for (const shop of shops) api.registerShop(shop)
  },
}

export default {manifest, definition}
