import type {BandMember, PerformanceStrategy, StrategyContext} from '@banglife/mod-types'
import {registries} from '@/core/registry'
import {usePlayerStore} from '@/stores/player'
import {usePerformanceStore} from '@/stores/performance'
import {useUIStore} from '@/stores/ui'

export interface RoundResult {
  round: number
  memberResults: Record<string, {
    strategyId: string
    score: number
    fever: number
    description?: string
  }>
  totalScore: number
  currentFever: number
  currentScore: number
}

export interface StartPerformanceOptions {
  name: string
  targetScore: number
  maxRounds: number
  onSuccess: () => void
  onFailure: () => void
}

function getMemberStats(memberId: string): Record<string, number> {
  if (memberId === 'player') return usePlayerStore().state.stats
  return registries.npcs.get(memberId)?.stats ?? {}
}

function getMemberName(memberId: string): string {
  if (memberId === 'player') return usePlayerStore().state.name
  return registries.npcs.get(memberId)?.name ?? memberId
}

function computeBaseScore(member: BandMember, stats: Record<string, number>): number {
  const expression = stats.expression ?? registries.stats.get('expression')?.default ?? 0
  const technique = stats.technique ?? registries.stats.get('technique')?.default ?? 0
  const rhythm = stats.rhythm ?? registries.stats.get('rhythm')?.default ?? 0
  const pitch = stats.pitch ?? registries.stats.get('pitch')?.default ?? 0
  const ensemble = stats.ensemble ?? registries.stats.get('ensemble')?.default ?? 0
  const improvisation = stats.improvisation ?? registries.stats.get('improvisation')?.default ?? 0

  return (expression + technique + rhythm + pitch + ensemble + improvisation) / 6 *
    (1 + (stats[member.instrument] ?? registries.stats.get(member.instrument)?.default ?? 0) / 200) * (1 + (member.role === 'lead' ? ((technique + expression) / 400) : ((rhythm + ensemble) / 400))) *
    (1 + (member.id !== 'player' ? (usePlayerStore().state.relationships[member.id]?.affection ?? 0) : 0) / 200)
}

export function startPerformance(options: StartPerformanceOptions): void {
  const player = usePlayerStore()
  if (player.state.band.members.length === 0) return

  const strategies: Record<string, string> = {}
  for (const member of player.state.band.members) strategies[member.id] = 'default'

  usePerformanceStore().startSession({
    name: options.name,
    currentScore: 0,
    targetScore: options.targetScore,
    currentFever: 50,
    currentRound: 1,
    maxRounds: options.maxRounds,
    roundHistory: [],
    strategies: strategies,
    onSuccess: options.onSuccess,
    onFailure: options.onFailure,
  })

  useUIStore().openPerformance()
}

export function resolveRound(): RoundResult {
  const session = usePerformanceStore().session!
  const members = usePlayerStore().state.band.members

  const memberResults: RoundResult['memberResults'] = {}
  let totalScore = 0
  let totalFever = 0

  for (const member of members) {
    const stats = getMemberStats(member.id)
    const strategyId = session.strategies[member.id] ?? 'default'
    const strategy = registries.strategies.get(strategyId)

    const ctx: StrategyContext = {
      member: member,
      memberStats: stats,
      currentRound: session.currentRound,
      maxRounds: session.maxRounds,
      currentFever: session.currentFever,
      bandMembers: members,
    }

    const baseContribution = computeBaseScore(member, stats) / session.maxRounds * (0.85 + Math.random() * 0.3)
    const result = strategy ? strategy.resolve(ctx) : {score: baseContribution, fever: 0}

    memberResults[member.id] = {
      strategyId: strategyId,
      score: result.score,
      fever: result.fever,
      description: result.description,
    }

    totalScore += result.score
    totalFever += result.fever
  }

  totalScore *= 0.7 + (session.currentFever / 100) * 0.6
  const currentFever = Math.max(0, Math.min(100, session.currentFever + totalFever))

  const roundResult: RoundResult = {
    round: session.currentRound,
    memberResults: memberResults,
    totalScore: totalScore,
    currentFever: currentFever,
    currentScore: session.currentScore + totalScore,
  }

  usePerformanceStore().applyRoundResult(roundResult)

  return roundResult
}

export function getPerformanceStatus(): 'success' | 'failure' | 'ongoing' {
  const session = usePerformanceStore().session!
  if (session.currentScore >= session.targetScore) return 'success'
  if (session.currentRound > session.maxRounds) return 'failure'
  return 'ongoing'
}

export function endPerformance(result: 'success' | 'failure'): void {
  const performance = usePerformanceStore()
  const session = performance.session!

  if (result === 'success') session.onSuccess()
  else session.onFailure()

  performance.endSession()
  useUIStore().closePerformance()
}

export function getAvailableStrategies(member: BandMember, round: number, maxRounds: number, fever: number): PerformanceStrategy[] {
  const ctx: StrategyContext = {
    member: member,
    memberStats: getMemberStats(member.id),
    currentRound: round,
    maxRounds: maxRounds,
    currentFever: fever,
    bandMembers: usePlayerStore().state.band.members,
  }

  return registries.strategies.getAll().filter(s => s.available(ctx))
}

export {getMemberName, getMemberStats, computeBaseScore}
