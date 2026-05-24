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
  {id: 'drum', name: '鼓', min: 0, max: 100, default: 0, category: 'skill', visible: true, color: '#FFAAAA'},
]

const locations: GameLocation[] = [
  {
    id: 'home.bedroom',
    name: '卧室',
    description: '你的房间。书桌上放着乐谱，窗外是安静的住宅街。',
    tags: ['indoor', 'home', 'private'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅', icon: 'sofa.svg', tag: 'place'},
    ],
  },
  {
    id: 'home.living',
    name: '客厅',
    description: '家里的公共区域。电视、沙发，简单而温馨。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.bedroom', duration: 1, label: '去卧室', icon: 'bed.svg', tag: 'place'},
      {to: 'home.bathroom', duration: 1, label: '去浴室', icon: 'bath.svg', tag: 'place'},
      {to: 'home.kitchen', duration: 1, label: '去厨房', icon: 'kitchen.svg', tag: 'place'},
      {to: 'city.residential_street', duration: 1, label: '出门', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'home.bathroom',
    name: '浴室',
    description: '家里的浴室。白色瓷砖墙面，洗发水和沐浴露整齐地摆在架子上。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅', icon: 'sofa.svg', tag: 'place'},
    ],
  },
  {
    id: 'home.kitchen',
    name: '厨房',
    description: '整洁的厨房。水槽里没有堆积的碗筷，冰箱里常备着牛奶和鸡蛋。',
    tags: ['indoor', 'home'],
    connections: [
      {to: 'home.living', duration: 1, label: '去客厅', icon: 'sofa.svg', tag: 'place'},
    ],
  },
  {
    id: 'city.residential_street',
    name: '住宅街',
    description: '安静的住宅区街道。两侧是整齐的楼房，偶尔有一两只猫走过。',
    tags: ['outdoor', 'city', 'residential'],
    connections: [
      {to: 'home.living', duration: 1, label: '回家', icon: 'home.svg', tag: 'place'},
      {to: 'city.livehouse_circle', duration: 5, label: '去 LiveHouse CiRCLE', icon: 'microphone.svg', tag: 'place'},
      {to: 'city.edogawa_instrument', duration: 5, label: '去江户川乐器店', icon: 'shop.svg', tag: 'place'},
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg', tag: 'area'},
      {to: 'city.shopping_street', duration: 5, label: '去商店街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.livehouse_circle',
    name: 'LiveHouse CiRCLE',
    description: '知名的 LiveHouse，经常举办各种演出。',
    tags: ['indoor', 'city', 'music', 'livehouse'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.edogawa_instrument',
    name: '江户川乐器店',
    description: '品种齐全的乐器店，从配件到专业乐器一应俱全。',
    tags: ['indoor', 'city', 'shop', 'music'],
    connections: [
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.school_street',
    name: '学园街',
    description: '连接着几所女子学园的街道，道路两旁种着行道树。',
    tags: ['outdoor', 'city', 'school'],
    connections: [
      {to: 'school.hanasakigawa', duration: 5, label: '去花咲川女子学园', icon: 'school.svg', tag: 'place'},
      {to: 'school.haneoka', duration: 5, label: '去羽丘女子学园', icon: 'school.svg', tag: 'place'},
      {to: 'school.tsukinomori', duration: 5, label: '去月之森女子学园', icon: 'school.svg', tag: 'place'},
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg', tag: 'area'},
      {to: 'city.walking_bridge', duration: 5, label: '去步道桥', icon: 'bridge.svg', tag: 'area'},
    ],
  },
  {
    id: 'school.hanasakigawa',
    name: '花咲川女子学园',
    description: '校风自由的女子学园，鼓励学生发展个性，社团活动丰富多彩。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'school.haneoka',
    name: '羽丘女子学园',
    description: '注重升学率的女子学园，设有丰厚的奖学金制度。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'school.tsukinomori',
    name: '月之森女子学园',
    description: '优雅的贵族女子学园，学生们举止端庄。',
    tags: ['outdoor', 'school'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.walking_bridge',
    name: '步道桥',
    description: '连接学园街和车站前的天桥，桥下是熙熙攘攘的街道。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.school_street', duration: 5, label: '去学园街', icon: 'street.svg', tag: 'area'},
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.station_front',
    name: '车站前',
    description: '繁忙的车站前广场，人来人往。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.fast_food', duration: 5, label: '去快餐店', icon: 'burger.svg', tag: 'place'},
      {to: 'city.shopping_center', duration: 5, label: '去购物中心', icon: 'shop.svg', tag: 'place'},
      {to: 'city.livehouse_ring', duration: 5, label: '去 LiveHouse RiNG', icon: 'microphone.svg', tag: 'place'},
      {to: 'city.walking_bridge', duration: 5, label: '去步道桥', icon: 'bridge.svg', tag: 'area'},
      {to: 'city.university_road', duration: 5, label: '去大学路', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.fast_food',
    name: '快餐店',
    description: '提供各种套餐的快餐店，价格实惠。',
    tags: ['indoor', 'city', 'shop', 'food'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.shopping_center',
    name: '购物中心',
    description: '大型购物中心，各种商店应有尽有。',
    tags: ['indoor', 'city', 'shop'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.livehouse_ring',
    name: 'LiveHouse RiNG',
    description: '备受瞩目的新锐 LiveHouse，集演出厅、录音室与咖啡馆于一体。',
    tags: ['indoor', 'city', 'music', 'livehouse'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.university_road',
    name: '大学路',
    description: '连接两所大学的街道，路旁散落着咖啡馆和书店。',
    tags: ['outdoor', 'city'],
    connections: [
      {to: 'city.station_front', duration: 5, label: '去车站前', icon: 'fountain.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.shopping_street',
    name: '商店街',
    description: '传统的日式商店街，有很多特色小店。',
    tags: ['outdoor', 'city', 'shop'],
    connections: [
      {to: 'city.yamabuki_bakery', duration: 1, label: '去山吹面包房', icon: 'bread.svg', tag: 'place'},
      {to: 'city.residential_street', duration: 5, label: '去住宅街', icon: 'street.svg', tag: 'area'},
    ],
  },
  {
    id: 'city.yamabuki_bakery',
    name: '山吹面包房',
    description: '商店街内的面包房。玻璃柜台内陈列着各式各样的面包，空气中弥漫着黄油与焦糖混合的甜香。',
    tags: ['indoor', 'city', 'shop', 'food'],
    connections: [
      {to: 'city.shopping_street', duration: 1, label: '去商店街', icon: 'street.svg', tag: 'area'},
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
    description: 'BGL 的入门型吉他。固定琴桥，单单双拾音器，ST琴型。做工合格，手感适中，适合初学者日常练习。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_stage_20',
    name: 'BGL Stage-20',
    description: 'BGL 的基础型吉他。单摇琴桥，单单拾音器，TL琴型。在学生乐队中较为常见，性能均衡。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_rock_v',
    name: 'BGL Rock-V',
    description: 'BGL 的进阶型吉他。大双摇琴桥，双双可切单拾音器，V字琴型。舞台存在感强，适合视觉系演出。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_performer_x',
    name: 'BGL Performer-X',
    description: 'BGL 的专业型吉他。小双摇琴桥，单单单可切单单双拾音器，TL琴型。职业乐手常用的级别，二手流通价值较高。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.guitar.bgl_master_ex',
    name: 'BGL Master-EX',
    description: 'BGL 的旗舰型吉他。小双摇琴桥，双单双拾音器，LP琴型。做工精良，音色饱满，受到众多资深吉他手的认可。',
    tags: ['guitar', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.keyboard.p_61',
    name: 'P-61',
    description: '进口仿制键盘。61键，无合成功能，塑料按键。手感生硬，键噪明显，动态响应较差。',
    tags: ['keyboard', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.keyboard.bgl_neo_610',
    name: 'BGL Neo-610',
    description: 'BGL 的入门型键盘。61键，基本音色，半配重按键。做工合格，键感适中，适合初学者日常练习。',
    tags: ['keyboard', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.keyboard.bgl_fusion_610',
    name: 'BGL Fusion-610',
    description: 'BGL 的基础型键盘。61键，合成音色，半配重按键。在学生乐队中较为常见，音色覆盖较为均衡。',
    tags: ['keyboard', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.keyboard.bgl_vanguard_490',
    name: 'BGL Vanguard-490',
    description: 'BGL 的进阶型键盘。49键，合成音色，半配重按键，配有琴头控制器。便携性强，适合移动演出和视觉系舞台。',
    tags: ['keyboard', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.keyboard.bgl_apex_760',
    name: 'BGL Apex-760',
    description: 'BGL 的专业型键盘。76键，编程音色，全配重按键。职业乐手常用的级别，音色编辑能力强，二手流通价值较高。',
    tags: ['keyboard', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.keyboard.bgl_ultimate_880',
    name: 'BGL Ultimate-880',
    description: 'BGL 的旗舰型键盘。88键，编程音色，全配重按键。做工精良，手感细腻，动态表现优秀，受到众多资深键盘手的认可。',
    tags: ['keyboard', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.bass.pb_100',
    name: 'PB-100',
    description: '进口仿制贝斯。4弦，P型贝斯。做工粗糙，手感生硬，品丝边缘刮手，音准稳定性较差。',
    tags: ['bass', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.bass.bgl_base_b4',
    name: 'BGL Base-B4',
    description: 'BGL 的入门型贝斯。4弦，JP型贝斯。做工合格，手感适中，适合初学者日常练习。',
    tags: ['bass', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.bass.bgl_core_b4',
    name: 'BGL Core-B4',
    description: 'BGL 的基础型贝斯。4弦，J型贝斯。音色清晰明亮，适合爵士及日摇风格。在学生乐队中较为常见，性能均衡。',
    tags: ['bass', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.bass.bgl_groove_b4',
    name: 'BGL Groove-B4',
    description: 'BGL 的进阶型贝斯。4弦，P型贝斯。音色沉稳，低频饱满，适合乐队合奏。',
    tags: ['bass', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.bass.bgl_virtuoso_b4',
    name: 'BGL Virtuoso-B4',
    description: 'BGL 的专业型贝斯。4弦，JP型贝斯。职业乐手常用的级别，二手流通价值较高。',
    tags: ['bass', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.bass.bgl_maestro_b5',
    name: 'BGL Maestro-B5',
    description: 'BGL 的旗舰型贝斯。5弦，JP型贝斯。做工精良，音色饱满，动态表现优秀，受到众多资深贝斯手的认可。',
    tags: ['bass', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.drum.e_65',
    name: 'E-65',
    description: '进口仿制电子鼓。65mm打击垫，基础音色，塑料支架。手感生硬，动态响应较差。',
    tags: ['drum', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.drum.bgl_entry_d5',
    name: 'BGL Entry-D5',
    description: 'BGL 的入门型鼓组。基础五鼓配置，做工合格，手感适中，适合初学者日常练习。',
    tags: ['drum', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.drum.bgl_standard_d5',
    name: 'BGL Standard-D5',
    description: 'BGL 的基础型鼓组。完整五鼓配置，音色均衡，在学生乐队中较为常见，性能稳定。',
    tags: ['drum', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.drum.bgl_advanced_d5',
    name: 'BGL Advanced-D5',
    description: 'BGL 的进阶型鼓组。完整鼓组加爵士鼓组，舞台存在感强，适合摇滚及视觉系演出。',
    tags: ['drum', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.drum.bgl_elite_d5',
    name: 'BGL Elite-D5',
    description: 'BGL 的专业型鼓组。完整鼓组加拓展鼓组，职业鼓手常用的级别，二手流通价值较高。',
    tags: ['drum', 'instrument'],
    stackable: false,
  },
  {
    id: 'instrument.drum.bgl_summit_d5',
    name: 'BGL Summit-D5',
    description: 'BGL 的旗舰型鼓组。完整鼓组加拓展鼓组，做工精良，音色饱满，动态表现优秀，受到众多资深鼓手的认可。',
    tags: ['drum', 'instrument'],
    stackable: false,
  },
  {
    id: 'food.yamabuki_bakery.chocolate_croissant',
    name: '巧克力牛角包',
    description: '人气产品。层层酥皮包裹巧克力内馅，加热后呈现半流心质地，甜度适中。食用后：饥饿 -30，压力 -10。',
    tags: ['food', 'consumable'],
    stackable: true,
    usable: true,
    droppable: true,
    consumable: true,
    useEffects: [
      {type: 'stat', key: 'hunger', value: -30},
      {type: 'stat', key: 'stress', value: -10},
    ],
  },
  {
    id: 'food.yamabuki_bakery.cream_roll',
    name: '奶油蛋卷',
    description: '质地松软，内馅为卡仕达奶油，表面撒有薄层糖粉。食用后：饥饿 -25，压力 -8。',
    tags: ['food', 'consumable'],
    stackable: true,
    usable: true,
    droppable: true,
    consumable: true,
    useEffects: [
      {type: 'stat', key: 'hunger', value: -25},
      {type: 'stat', key: 'stress', value: -8},
    ],
  },
  {
    id: 'food.yamabuki_bakery.croquette_bread',
    name: '可乐饼面包',
    description: '炸制可乐饼夹入软面包中，淋有中浓酱汁，外层面包松软，内里酥脆。食用后：饥饿 -35，疲劳 -15。',
    tags: ['food', 'consumable'],
    stackable: true,
    usable: true,
    droppable: true,
    consumable: true,
    useEffects: [
      {type: 'stat', key: 'hunger', value: -35},
      {type: 'stat', key: 'fatigue', value: -15},
    ],
  },
  {
    id: 'food.yamabuki_bakery.sliced_bread',
    name: '切片面包',
    description: '一袋六片装方形吐司，质地柔软，适合日常备餐。食用后：饥饿 -20，疲劳 -10。',
    tags: ['food', 'consumable'],
    stackable: true,
    usable: true,
    droppable: true,
    consumable: true,
    useEffects: [
      {type: 'stat', key: 'hunger', value: -20},
      {type: 'stat', key: 'fatigue', value: -10},
    ],
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
      {itemId: 'instrument.guitar.bgl_performer_x', buyPrice: 280000, sellPrice: 180000},
      {itemId: 'instrument.guitar.bgl_master_ex', buyPrice: 550000, sellPrice: 300000},
      {itemId: 'instrument.keyboard.p_61', buyPrice: 15000, sellPrice: 8000},
      {itemId: 'instrument.keyboard.bgl_neo_610', buyPrice: 57800, sellPrice: 28000},
      {itemId: 'instrument.keyboard.bgl_fusion_610', buyPrice: 89000, sellPrice: 45000},
      {itemId: 'instrument.keyboard.bgl_vanguard_490', buyPrice: 145000, sellPrice: 70000},
      {itemId: 'instrument.keyboard.bgl_apex_760', buyPrice: 273000, sellPrice: 130000},
      {itemId: 'instrument.keyboard.bgl_ultimate_880', buyPrice: 455000, sellPrice: 228000},
      {itemId: 'instrument.bass.pb_100', buyPrice: 15000, sellPrice: 8000},
      {itemId: 'instrument.bass.bgl_base_b4', buyPrice: 39888, sellPrice: 20000},
      {itemId: 'instrument.bass.bgl_core_b4', buyPrice: 140000, sellPrice: 70000},
      {itemId: 'instrument.bass.bgl_groove_b4', buyPrice: 165000, sellPrice: 83000},
      {itemId: 'instrument.bass.bgl_virtuoso_b4', buyPrice: 280000, sellPrice: 140000},
      {itemId: 'instrument.bass.bgl_maestro_b5', buyPrice: 550000, sellPrice: 275000},
      {itemId: 'instrument.drum.e_65', buyPrice: 67000, sellPrice: 35000},
      {itemId: 'instrument.drum.bgl_entry_d5', buyPrice: 76300, sellPrice: 38000},
      {itemId: 'instrument.drum.bgl_standard_d5', buyPrice: 140000, sellPrice: 80000},
      {itemId: 'instrument.drum.bgl_advanced_d5', buyPrice: 210700, sellPrice: 100000},
      {itemId: 'instrument.drum.bgl_elite_d5', buyPrice: 299000, sellPrice: 150000},
      {itemId: 'instrument.drum.bgl_summit_d5', buyPrice: 693000, sellPrice: 350000},
    ],
  },
  {
    id: 'shop.yamabuki_bakery',
    name: '山吹面包房',
    icon: 'bread.svg',
    locationId: 'city.yamabuki_bakery',
    items: [
      {itemId: 'food.yamabuki_bakery.chocolate_croissant', buyPrice: 380},
      {itemId: 'food.yamabuki_bakery.cream_roll', buyPrice: 320},
      {itemId: 'food.yamabuki_bakery.croquette_bread', buyPrice: 350},
      {itemId: 'food.yamabuki_bakery.sliced_bread', buyPrice: 280},
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
