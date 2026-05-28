import type {Action, Passage, Task} from '@/core/types'
import {useTasksStore} from '@/stores/tasks'

// ─── helpers ─────────────────────────────────────────────────

const durations = [
  {h: 1, min: 60, label: '1 小时'},
  {h: 2, min: 120, label: '2 小时'},
  {h: 4, min: 240, label: '4 小时'},
  {h: 8, min: 480, label: '8 小时'},
]

function makeWorkActions(storeKey: string, locationId: string): Action[] {
  return durations.map(d => ({
    id: `job.${storeKey}.work_${d.h}h`,
    label: `打工 ${d.label}`,
    icon: 'coffee.svg',
    duration: d.min,
    tag: 'job',
    locationId,
    available: (ctx: any) => {
      const state = useTasksStore().tasks[`job.${storeKey}`]
      if (!state || state.status !== 'active') return false
      return ctx.time.absolute < state.startTime + 10080
    },
    execute: (ctx: any) => {
      const hoursKey = `job:${storeKey}:hours`
      ctx.player.flags[hoursKey] = (ctx.player.flags[hoursKey] || 0) + d.h
      useTasksStore().updateTasks()
    },
    passage: `job.${storeKey}.work_done`,
  }))
}

function makeApplyAction(storeKey: string, locationId: string, icon: string): Action {
  return {
    id: `job.${storeKey}.apply`,
    label: '申请打工',
    icon,
    duration: 0,
    tag: 'job',
    locationId,
    available: () => !useTasksStore().tasks[`job.${storeKey}`]?.status,
    execute: (ctx: any) => {
      useTasksStore().activate(`job.${storeKey}`)
      ctx.player.flags[`job:${storeKey}:start`] = ctx.time.absolute
    },
    passage: `job.${storeKey}.activated`,
  }
}

// ─── actions ────────────────────────────────────────────────

export const jobActions: Action[] = [
  {
    id: 'job.yamabuki.info',
    label: '了解打工规则',
    icon: 'bread.svg',
    duration: 0,
    tag: 'job',
    locationId: 'city.yamabuki_bakery',
    passage: 'job.yamabuki.info',
  },
  {
    id: 'job.yamabuki.work',
    label: '打工',
    icon: 'bread.svg',
    duration: 0,
    tag: 'job',
    locationId: 'city.yamabuki_bakery',
    passage: 'job.yamabuki.work',
  },
  {
    id: 'job.hanasawa.info',
    label: '了解打工规则',
    icon: 'coffee.svg',
    duration: 0,
    tag: 'job',
    locationId: 'city.hanasawa_cafe',
    passage: 'job.hanasawa.info',
  },
  makeApplyAction('hanasawa', 'city.hanasawa_cafe', 'coffee.svg'),
  ...makeWorkActions('hanasawa', 'city.hanasawa_cafe'),
  {
    id: 'job.ring.info',
    label: '了解打工规则',
    icon: 'coffee.svg',
    duration: 0,
    tag: 'job',
    locationId: 'city.ring_cafe',
    passage: 'job.ring.info',
  },
  makeApplyAction('ring', 'city.ring_cafe', 'coffee.svg'),
  ...makeWorkActions('ring', 'city.ring_cafe'),
]

// ─── passages ───────────────────────────────────────────────

const yamabukiWorkPassage: Passage = {
  id: 'job.yamabuki.work',
  text: '选择一个工作时长：',
  choices: [
    ...durations.map(d => ({
      label: `${d.label}（+${d.h * 1200} 円）`,
      effects: [
        {type: 'money' as const, value: d.h * 1200},
        {type: 'time' as const, value: d.min},
      ],
      nextPassage: 'job.yamabuki.work_done',
    })),
    {label: '再考虑一下', effects: []},
  ],
}

export const jobPassages: Passage[] = [
  {
    id: 'job.yamabuki.info',
    text: '山吹面包房正在招募兼职员工。\n\n规则：\n· 时薪 1,200 円\n· 最低出勤 1 小时\n· 薪资次结，出勤灵活',
    choices: [{label: '关闭', effects: []}],
  },
  yamabukiWorkPassage,
  {id: 'job.yamabuki.work_done', text: '工作完成！薪水已发放。'},
  {
    id: 'job.hanasawa.info',
    text: '羽泽咖啡店正在招募兼职员工。\n\n规则：\n· 时薪 1,300 円\n· 最低出勤 2 小时/周\n· 薪资周结（申请后 7 天可结算）\n· 结算期限 14 天\n· 每周工作满 10 小时额外奖励 3,000 円',
    choices: [{label: '关闭', effects: []}],
  },
  {
    id: 'job.hanasawa.activated',
    text: '你成功申请了羽泽咖啡店的打工！打开任务面板查看进度，7 天后可结算薪资。',
  },
  {id: 'job.hanasawa.work_done', text: '工作完成！本次出勤已记录。'},
  {
    id: 'job.ring.info',
    text: 'RiNG 咖啡厅正在招募兼职员工。\n\n规则：\n· 时薪 1,400 円\n· 最低出勤 2 小时/周\n· 薪资周结（申请后 7 天可结算）\n· 结算期限 14 天\n· 每周工作不足 10 小时将扣除 3,000 円',
    choices: [{label: '关闭', effects: []}],
  },
  {
    id: 'job.ring.activated',
    text: '你成功申请了 RiNG 咖啡厅的打工！打开任务面板查看进度，7 天后可结算薪资。',
  },
  {id: 'job.ring.work_done', text: '工作完成！本次出勤已记录。'},
]

// ─── tasks ──────────────────────────────────────────────────

export const jobTasks: Task[] = [
  {
    id: 'job.hanasawa',
    title: '羽泽咖啡店 打工',
    description: '时薪 1,300 円/小时 · 周结 · 满 10 小时额外奖励 3,000 円',
    targets: [
      {
        title: '累计工作时长达到 2 小时',
        description: '满足最低出勤要求',
        onCheck: (ctx) => (ctx.player.flags['job:hanasawa:hours'] as number || 0) >= 2,
      },
      {
        title: '距申请日已满 7 天',
        description: '满 7 天后可结算薪资',
        onCheck: (ctx) => {
          const start = ctx.player.flags['job:hanasawa:start'] as number || 0
          return start !== 0 && ctx.time.absolute - start >= 10080
        },
      },
    ],
    rewards: [],
    cancelable: true,
    expire: 30240,
    onComplete(ctx) {
      const hours = (ctx.player.flags['job:hanasawa:hours'] as number) || 0
      const bonus = hours >= 10 ? 3000 : 0
      ctx.player.money += hours * 1300 + bonus
      delete ctx.player.flags['job:hanasawa:hours']
      delete ctx.player.flags['job:hanasawa:start']
    },
    onCancel(ctx) {
      delete ctx.player.flags['job:hanasawa:hours']
      delete ctx.player.flags['job:hanasawa:start']
    },
    onExpire(ctx) {
      delete ctx.player.flags['job:hanasawa:hours']
      delete ctx.player.flags['job:hanasawa:start']
    },
  },
  {
    id: 'job.ring',
    title: 'RiNG 咖啡厅 打工',
    description: '时薪 1,400 円/小时 · 周结 · 不足 10 小时扣除 3,000 円',
    targets: [
      {
        title: '累计工作时长达到 2 小时',
        description: '满足最低出勤要求',
        onCheck: (ctx) => (ctx.player.flags['job:ring:hours'] as number || 0) >= 2,
      },
      {
        title: '距申请日已满 7 天',
        description: '满 7 天后可结算薪资',
        onCheck: (ctx) => {
          const start = ctx.player.flags['job:ring:start'] as number || 0
          return start !== 0 && ctx.time.absolute - start >= 10080
        },
      },
    ],
    rewards: [],
    cancelable: true,
    expire: 30240,
    onComplete(ctx) {
      const hours = (ctx.player.flags['job:ring:hours'] as number) || 0
      const penalty = hours < 10 ? 3000 : 0
      ctx.player.money = Math.max(0, ctx.player.money + hours * 1400 - penalty)
      delete ctx.player.flags['job:ring:hours']
      delete ctx.player.flags['job:ring:start']
    },
    onCancel(ctx) {
      const hours = (ctx.player.flags['job:ring:hours'] as number) || 0
      if (hours > 0 && hours < 10) {
        ctx.player.money = Math.max(0, ctx.player.money - 3000)
      }
      delete ctx.player.flags['job:ring:hours']
      delete ctx.player.flags['job:ring:start']
    },
    onExpire(ctx) {
      const hours = (ctx.player.flags['job:ring:hours'] as number) || 0
      if (hours > 0 && hours < 10) {
        ctx.player.money = Math.max(0, ctx.player.money - 3000)
      }
      delete ctx.player.flags['job:ring:hours']
      delete ctx.player.flags['job:ring:start']
    },
  },
]
