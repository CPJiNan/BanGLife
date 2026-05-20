import type {ModDefinition, ModManifest} from '@banglife/mod-types'
import type {Action, GameLocation, Passage, StatDef} from '@/core/types'
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
  {id: 'vocal', name: '演唱', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#FF9933'},
  {id: 'keyboard', name: '键盘', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#99CCFF'},
  {id: 'guitar', name: '吉他', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#AA88FF'},
  {id: 'bass', name: '贝斯', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#66EEBB'},
  {id: 'drums', name: '鼓', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#FFAAAA'},
  {id: 'fatigue', name: '疲劳', min: 0, max: 100, default: 0, category: 'physical', visible: true, color: '#fbbf24'},
  {id: 'stress', name: '压力', min: 0, max: 100, default: 0, category: 'mental', visible: true, color: '#FF77BB'},
]

const locations: GameLocation[] = [
  {
    id: 'home.bedroom',
    name: '卧室',
    description: '你的房间。书桌上放着乐谱，窗外是安静的住宅街。',
    tags: ['indoor', 'home', 'private'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅'},
    ],
  },
  {
    id: 'home.living',
    name: '客厅',
    description: '家里的公共区域。电视、沙发，简单而温馨。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.bedroom', duration: 1, label: '去卧室'},
      {to: 'home.bathroom', duration: 1, label: '去浴室'},
      {to: 'home.kitchen', duration: 1, label: '去厨房'},
      {to: 'city.residential_street', duration: 1, label: '出门'},
    ],
  },
  {
    id: 'home.bathroom',
    name: '浴室',
    description: '家里的浴室。白色瓷砖墙面，洗发水和沐浴露整齐地摆在架子上。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅'},
    ],
  },
  {
    id: 'home.kitchen',
    name: '厨房',
    description: '整洁的厨房。水槽里没有堆积的碗筷，冰箱里常备着牛奶和鸡蛋。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅'},
    ],
  },
  {
    id: 'city.residential_street',
    name: '住宅街',
    description: '安静的住宅区街道。两侧是整齐的楼房，偶尔有一两只猫走过。',
    tags: ['outdoor', 'city', 'residential'],
    connections: [
      {to: 'home.living', duration: 1, label: '回家'},
      {to: 'city.livehouse_circle', duration: 5, label: '去 LiveHouse CiRCLE'},
      {to: 'city.edogawa_instrument', duration: 5, label: '去江户川乐器店'},
      {to: 'city.school_street', duration: 5, label: '去学园街'},
      {to: 'city.shopping_street', duration: 5, label: '去商店街'},
    ],
  },
  {
    id: 'city.livehouse_circle',
    name: 'LiveHouse CiRCLE',
    description: '知名的 LiveHouse，经常举办各种演出。',
    tags: ['indoor', 'city', 'music', 'livehouse'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街'},
    ],
  },
  {
    id: 'city.edogawa_instrument',
    name: '江户川乐器店',
    description: '品种齐全的乐器店，从配件到专业乐器一应俱全。',
    tags: ['indoor', 'city', 'shop', 'music'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街'},
    ],
  },
  {
    id: 'city.school_street',
    name: '学园街',
    description: '连接着几所女子学园的街道，道路两旁种着行道树。',
    tags: ['outdoor', 'city', 'school'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街'},
      {to: 'school.hanasakigawa', duration: 5, label: '去花咲川女子学园'},
      {to: 'school.haneoka', duration: 5, label: '去羽丘女子学园'},
      {to: 'school.tsukinomori', duration: 5, label: '去月之森女子学园'},
      {to: 'city.walking_bridge', duration: 5, label: '去步道桥'},
    ],
  },
  {
    id: 'school.hanasakigawa',
    name: '花咲川女子学园',
    description: '校风自由的女子学园，鼓励学生发展个性，社团活动丰富多彩。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街'},
    ],
  },
  {
    id: 'school.haneoka',
    name: '羽丘女子学园',
    description: '注重升学率的女子学园，设有丰厚的奖学金制度。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街'},
    ],
  },
  {
    id: 'school.tsukinomori',
    name: '月之森女子学园',
    description: '优雅的贵族女子学园，学生们举止端庄。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街'},
    ],
  },
  {
    id: 'city.walking_bridge',
    name: '步道桥',
    description: '连接学园街和车站前的天桥，桥下是熙熙攘攘的街道。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街'},
      {to: 'city.station_front', duration: 5, label: '去车站前'},
    ],
  },
  {
    id: 'city.station_front',
    name: '车站前',
    description: '繁忙的车站前广场，人来人往。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.walking_bridge', duration: 5, label: '去步道桥'},
      {to: 'city.fast_food', duration: 5, label: '去快餐店'},
      {to: 'city.shopping_center', duration: 5, label: '去购物中心'},
      {to: 'city.livehouse_ring', duration: 5, label: '去 LiveHouse RiNG'},
      {to: 'city.university_road', duration: 5, label: '去大学路'},
    ],
  },
  {
    id: 'city.fast_food',
    name: '快餐店',
    description: '提供各种套餐的快餐店，价格实惠。',
    tags: ['indoor', 'city', 'shop', 'food'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前'},
    ],
  },
  {
    id: 'city.shopping_center',
    name: '购物中心',
    description: '大型购物中心，各种商店应有尽有。',
    tags: ['indoor', 'city', 'shop'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前'},
    ],
  },
  {
    id: 'city.livehouse_ring',
    name: 'LiveHouse RiNG',
    description: '备受瞩目的新锐 LiveHouse，集演出厅、录音室与咖啡馆于一体。',
    tags: ['indoor', 'city', 'music', 'livehouse'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前'},
    ],
  },
  {
    id: 'city.university_road',
    name: '大学路',
    description: '连接两所大学的街道，路旁散落着咖啡馆和书店。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前'},
    ],
  },
  {
    id: 'city.shopping_street',
    name: '商店街',
    description: '传统的日式商店街，有很多特色小店。',
    tags: ['outdoor', 'city', 'shop'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街'},
    ],
  },
];

const actions: Action[] = [
  {
    id: 'bedroom.climb_bed',
    label: '爬到床上',
    duration: 1,
    tag: 'daily',
    locationId: 'home.bedroom',
    passage: 'bedroom.sleep',
  },
  {
    id: 'bathroom.shower',
    label: '洗澡',
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

const definition: ModDefinition = {
  async onLoad(api) {
    for (const stat of stats) api.registerStat(stat)
    for (const location of locations) api.registerLocation(location)
    for (const action of actions) api.registerAction(action)
    for (const passage of passages) api.registerPassage(passage)
  },
}

export default {manifest, definition}
