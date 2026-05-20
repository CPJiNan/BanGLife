import type {GameContext} from '@/core/types'

function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((cur, key) => {
    if (cur !== null && typeof cur === 'object') {
      return (cur as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function renderPassage(text: string, ctx: GameContext): string {
  return text.replace(/\{\{([^}]+)}}/g, (_, expr: string) => {
    const trimmed = expr.trim()
    const val = resolvePath(ctx, trimmed)
    return val !== undefined && val !== null ? String(val) : `{{${trimmed}}}`
  })
}
