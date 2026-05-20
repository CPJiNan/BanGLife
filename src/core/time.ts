import type {GameTime, Period, TimeInfo} from './types'
import {MINUTES_PER_DAY} from './constants'

export function timeToInfo(absolute: GameTime): TimeInfo {
  const totalMinutes = absolute % MINUTES_PER_DAY
  const day = Math.floor(absolute / MINUTES_PER_DAY) + 1
  const weekday = ((day - 1) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60

  return {
    absolute,
    day,
    weekday,
    hour,
    minute,
    period: getPeriod(hour),
  }
}

function getPeriod(hour: number): Period {
  if (hour >= 5 && hour < 7) return 'dawn'
  if (hour >= 7 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

export function formatTime(info: TimeInfo): string {
  const h = String(info.hour).padStart(2, '0')
  const m = String(info.minute).padStart(2, '0')
  return `${h}:${m}`
}

export function formatDate(info: TimeInfo): string {
  return `第 ${info.day} 天（周${WEEKDAYS[info.weekday]}）`
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
