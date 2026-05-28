import type {GameTime, Period, Season, TimeInfo} from './types'
import {MINUTES_PER_DAY} from './constants'

const START_DATE = new Date(2020, 3, 1)

function getDate(day: number): Date {
  return new Date(START_DATE.getTime() + (day - 1) * MINUTES_PER_DAY * 60 * 1000)
}

function getSeason(day: number): Season {
  const month = getMonth(day)
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

function getMonth(day: number): number {
  return getDate(day).getMonth() + 1
}

function getDay(day: number): number {
  return getDate(day).getDate()
}

function getPeriod(hour: number): Period {
  if (hour >= 5 && hour < 7) return 'dawn'
  if (hour >= 7 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

export function getTimeInfo(absolute: GameTime): TimeInfo {
  const totalMinutes = absolute % MINUTES_PER_DAY
  const day = Math.floor(absolute / MINUTES_PER_DAY) + 1
  const weekday = ((day + 2) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60

  return {
    absolute,
    day,
    weekday,
    hour,
    minute,
    period: getPeriod(hour),
    season: getSeason(day),
  }
}

export function formatTime(info: TimeInfo): string {
  const h = String(info.hour).padStart(2, '0')
  const m = String(info.minute).padStart(2, '0')
  return `${h}:${m}`
}

export function formatDate(info: TimeInfo): string {
  return `${getMonth(info.day)} 月 ${getDay(info.day)} 日（周${WEEKDAYS[info.weekday]}）`
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
