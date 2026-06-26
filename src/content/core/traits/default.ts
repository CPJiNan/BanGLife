import type {Trait} from '@/core/types'

export const defaultTraits: Trait[] = [
  {
    id: 'trait.1',
    description: '初始演唱技能 +10',
    effects: [{type: 'stat', key: 'vocal', value: 10}],
  },
  {
    id: 'trait.2',
    description: '初始键盘技能 +20',
    effects: [{type: 'stat', key: 'keyboard', value: 20}],
  },
  {
    id: 'trait.3',
    description: '初始吉他技能 +20',
    effects: [{type: 'stat', key: 'guitar', value: 20}],
  },
  {
    id: 'trait.4',
    description: '初始贝斯技能 +20',
    effects: [{type: 'stat', key: 'bass', value: 20}],
  },
  {
    id: 'trait.5',
    description: '初始鼓技能 +20',
    effects: [{type: 'stat', key: 'drum', value: 20}],
  },
  {
    id: 'trait.6',
    description: '初始金钱 +30000',
    effects: [{type: 'stat', key: 'money', value: 30000}],
  },
  {
    id: 'trait.7',
    description: '初始表达属性 +20',
    effects: [{type: 'stat', key: 'expression', value: 20}],
  },
  {
    id: 'trait.8',
    description: '初始音感属性 +20',
    effects: [{type: 'stat', key: 'pitch', value: 20}],
  },
  {
    id: 'trait.9',
    description: '初始技巧属性 +20',
    effects: [{type: 'stat', key: 'technique', value: 20}],
  },
  {
    id: 'trait.10',
    description: '初始合奏属性 +20',
    effects: [{type: 'stat', key: 'ensemble', value: 20}],
  },
  {
    id: 'trait.11',
    description: '初始节奏属性 +20',
    effects: [{type: 'stat', key: 'rhythm', value: 20}],
  },
  {
    id: 'trait.12',
    description: '初始即兴属性 +20',
    effects: [{type: 'stat', key: 'improvisation', value: 20}],
  },
  {
    id: 'trait.13',
    description: '初始知识属性 +20',
    effects: [{type: 'stat', key: 'knowledge', value: 20}],
  },
]
