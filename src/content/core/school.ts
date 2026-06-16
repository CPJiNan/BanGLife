import type {Action, Passage} from '@/core/types'
import {registries} from '@/core/registry'

const SCHOOLS = ['school.hanasakigawa', 'school.haneoka', 'school.tsukinomori']

function inWindow(hour: number, minStart: number, minEnd: number, ctx: any): boolean {
  if (ctx.time.hour !== hour) return false
  return ctx.time.minute >= minStart && ctx.time.minute <= minEnd
}

function lessonAvailable(period: number, hour: number, minStart: number, minEnd: number): (ctx: any) => boolean {
  return (ctx) => {
    if (ctx.time.weekday < 1 || ctx.time.weekday > 5) return false
    if (!inWindow(hour, minStart, minEnd, ctx)) return false
    return ctx.player.flags[`school:lesson:${period}`] !== ctx.time.day
  }
}

function setLessonDone(period: number): (ctx: any) => void {
  return (ctx) => {
    ctx.player.flags[`school:lesson:${period}`] = ctx.time.day
  }
}

// ─── academic (periods 1–3) ─────────────────────────────────

const academicEffects = [
  {type: 'stat' as const, key: 'stress', value: -5},
  {type: 'stat' as const, key: 'wisdom', value: 3},
]

function makeAcademicAction(period: number, hour: number, minStart: number, minEnd: number, label: string, id: string): Action {
  return {
    id,
    label,
    icon: 'school.svg',
    duration: 50,
    tag: 'school',
    locationId: SCHOOLS,
    available: lessonAvailable(period, hour, minStart, minEnd),
    effects: academicEffects,
    execute: setLessonDone(period),
    passage: `school.lesson.academic`,
  }
}

// ─── music (period 4, Mon/Wed/Fri) ──────────────────────────

const musicAction: Action = {
  id: 'school.lesson.4_music',
  label: '上音乐课',
  icon: 'school.svg',
  duration: 50,
  tag: 'school',
  locationId: SCHOOLS,
  available: (ctx) => {
    const w = ctx.time.weekday
    if (w !== 1 && w !== 3 && w !== 5) return false
    if (!inWindow(14, 0, 20, ctx)) return false
    return ctx.player.flags['school:lesson:4'] !== ctx.time.day
  },
  effects: [],
  execute: (ctx) => {
    ctx.player.flags['school:lesson:4'] = ctx.time.day
    const skills = ['vocal', 'keyboard', 'guitar', 'bass', 'drum']
    const skill = skills[Math.floor(Math.random() * skills.length)]
    const statDef = registries.stats.get(skill)
    const max = statDef?.max ?? 100
    ctx.player.stats[skill] = Math.min(max, (ctx.player.stats[skill] || 0) + 3)
  },
  passage: `school.lesson.music`,
}

// ─── sports (period 4, Tue/Thu) ──────────────────────────────

const sportsAction: Action = {
  id: 'school.lesson.4_sports',
  label: '上体育课',
  icon: 'school.svg',
  duration: 50,
  tag: 'school',
  locationId: SCHOOLS,
  available: (ctx) => {
    const w = ctx.time.weekday
    if (w !== 2 && w !== 4) return false
    if (!inWindow(14, 0, 20, ctx)) return false
    return ctx.player.flags['school:lesson:4'] !== ctx.time.day
  },
  effects: [
    {type: 'stat' as const, key: 'fatigue', value: 10},
    {type: 'stat' as const, key: 'stress', value: -10},
  ],
  execute: setLessonDone(4),
  passage: `school.lesson.sports`,
}

// ─── exports ────────────────────────────────────────────────

export const schoolActions: Action[] = [
  makeAcademicAction(1, 8, 30, 50, '上学科课', 'school.lesson.1'),
  makeAcademicAction(2, 9, 30, 50, '上学科课', 'school.lesson.2'),
  makeAcademicAction(3, 13, 0, 20, '上学科课', 'school.lesson.3'),
  musicAction,
  sportsAction,
]

export const schoolPassages: Passage[] = [
  {id: 'school.lesson.academic', text: '你在教室里认真听讲，完成了本节课的学习内容。智慧 +3，压力 -5。'},
  {id: 'school.lesson.sports', text: '你在体育馆挥洒汗水，完成了体能训练。疲劳 +10，压力 -10。'},
  {id: 'school.lesson.music', text: '你在音乐教室里练习乐器，乐感得到了提升。乐器技能 +3。'},
]
