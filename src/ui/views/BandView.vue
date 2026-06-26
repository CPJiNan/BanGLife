<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useBandStore} from '@/stores/band'
import {useUIStore} from '@/stores/ui'
import {usePlayerStore} from '@/stores/player'
import {useStagesStore} from '@/stores/stages'
import {registries} from '@/core/registry'
import {startPerformance} from '@/core/performance'
import {applyEffects} from '@/core/effects'
import type {BandMember} from '@banglife/mod-types'
import type {Stage} from '@/core/types'

const band = useBandStore()
const ui = useUIStore()
const player = usePlayerStore()
const stages = useStagesStore()

const base = import.meta.env.BASE_URL

const editingName = ref(false)
const nameInput = ref('')
const showInvite = ref(false)

const bandName = computed(() => band.band.name || '未命名的乐队')

function getMemberName(id: string) {
  if (id === 'player') return player.state.name
  return registries.npcs.get(id)?.name ?? id
}

interface MemberSlot {
  type: 'member'
  member: BandMember
}

interface EmptySlot {
  type: 'empty'
}

type BandSlot = MemberSlot | EmptySlot

const memberSlots = computed<BandSlot[]>(() => {
  const slots: BandSlot[] = []
  for (const member of band.band.members) {
    slots.push({type: 'member', member})
  }
  while (slots.length < 6) {
    slots.push({type: 'empty'})
  }
  return slots
})

function startEditName() {
  nameInput.value = band.band.name
  editingName.value = true
}

function confirmName() {
  band.setBandName(nameInput.value)
  editingName.value = false
}

function cancelEditName() {
  editingName.value = false
}

function handleAddMember(npcId: string) {
  if (band.addMember(npcId, 'vocal', 'rhythm')) {
    showInvite.value = false
  }
}

function handleAddPlayer() {
  if (band.addMember('player', 'vocal', 'lead')) {
    showInvite.value = false
  }
}

function getMemberStats(id: string): Record<string, number> {
  if (id === 'player') return player.state.stats
  return registries.npcs.get(id)?.stats ?? {}
}

const bandScore = computed(() => {
  const members = band.band.members
  if (members.length === 0) return 0
  const totalScore = members.reduce((sum, m) => sum + (s => {
    const expression = s.expression ?? registries.stats.get('expression')?.default ?? 0
    const technique = s.technique ?? registries.stats.get('technique')?.default ?? 0
    const rhythm = s.rhythm ?? registries.stats.get('rhythm')?.default ?? 0
    const pitch = s.pitch ?? registries.stats.get('pitch')?.default ?? 0
    const ensemble = s.ensemble ?? registries.stats.get('ensemble')?.default ?? 0
    const improvisation = s.improvisation ?? registries.stats.get('improvisation')?.default ?? 0
    const instrument = s[m.instrument] ?? registries.stats.get(m.instrument)?.default ?? 0
    return ((expression + technique + rhythm + pitch + ensemble + improvisation) / 6) *
      (1 + instrument / 200) *
      (1 + (m.role === 'lead' ? (technique + expression) / 400 : (rhythm + ensemble) / 400))
  })(getMemberStats(m.id)), 0)
  const npcMembers = members.filter(m => m.id !== 'player')
  return totalScore * (1 + (npcMembers.length === 0 ? 0 : npcMembers.reduce((sum, m) => sum + (player.state.relationships[m.id]?.affection ?? 0), 0) / (npcMembers.length * 200)))
})

const bandRank = computed(() => ['G', 'G+', 'F', 'F+', 'E', 'E+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'S+', 'SS', 'SS+', 'SSS', 'SSS+'][Math.min(19, Math.floor(bandScore.value * 19 / 2000))] ?? 'G')

function handleRemoveMember(npcId: string) {
  ui.showConfirmModal({
    title: '移除成员',
    description: `确定要将该成员从乐队中移除吗？`,
    variant: 'danger',
    onConfirm: () => {
      band.removeMember(npcId)
    },
  })
}

function handleReserve(stage: Stage) {
  if (!stages.isUnlocked(stage)) return
  if (band.band.members.length === 0) return
  if (player.state.liveBoost <= 0) return
  startPerformance({
    name: stage.name,
    targetScore: stage.targetScore,
    maxRounds: stage.maxRounds,
    onSuccess: () => {
      player.consumeLiveBoost()
      stages.completeStage(stage.id)
      if (stage.rewards?.length) applyEffects(stage.rewards)
      ui.showToast(`演出 ${stage.name} 已完成`, 'success')
    },
    onFailure: () => {
      ui.showToast(`演出 ${stage.name} 未达标`, 'warning')
    },
  })
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-neutral-50">
    <div class="max-w-12xl mx-auto p-6 flex flex-col gap-6">
      <div class="rounded-xl border border-neutral-200 bg-white p-3">
        <div class="flex items-center gap-2">
          <img :src="`${base}icons/microphone.svg`" alt="乐队" class="w-4 h-4"/>
          <div v-if="!editingName" class="flex items-center gap-2">
            <h1 class="text-lg font-bold">{{ bandName }}</h1>
            <button
              class="text-xs text-muted hover:text-brand-pink transition-colors"
              @click="startEditName"
            >
              <img :src="`${base}icons/edit.svg`" alt="编辑" class="w-3.5 h-3.5"/>
            </button>
            <span :title="`${Math.round(bandScore)}`" class="text-lg font-black text-brand-pink">{{ bandRank }}</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <input
              v-model="nameInput"
              class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:border-brand-pink"
              placeholder="输入乐队名称"
              @keydown.enter="confirmName"
              @keydown.esc="cancelEditName"
            />
            <button
              class="text-xs font-medium text-brand-pink hover:underline"
              @click="confirmName"
            >
              确定
            </button>
            <button
              class="text-xs text-muted hover:underline"
              @click="cancelEditName"
            >
              取消
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-neutral-200 bg-white p-4">
        <div class="flex items-center gap-2 mb-3">
          <img :src="`${base}icons/character.svg`" alt="成员" class="w-4 h-4"/>
          <span class="text-xs text-muted font-medium">成员 ({{ band.band.members.length }}/6)</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <template v-for="(slot, idx) in memberSlots" :key="idx">
            <div
              v-if="slot.type === 'member'"
              class="rounded-xl border border-neutral-200 bg-white p-2 flex flex-col gap-1.5 h-24"
            >
              <div class="flex items-center gap-1">
                <img :src="`${base}icons/character.svg`" alt="" class="w-3.5 h-3.5 shrink-0"/>
                <span class="text-xs font-medium truncate flex-1">{{ getMemberName(slot.member.id) }}</span>
                <button
                  class="text-[10px] text-muted hover:text-red-500 transition-colors"
                  @click="handleRemoveMember(slot.member.id)"
                >
                  ✕
                </button>
              </div>
              <select
                :value="slot.member.instrument"
                class="text-xs rounded-md border border-neutral-200 px-2 py-1 bg-white focus:outline-none focus:border-brand-pink w-full"
                @change="band.updateMember(slot.member.id, {instrument: ($event.target as HTMLSelectElement).value})"
              >
                <option v-for="inst in registries.stats.getAll().filter(s => s.category === 'instrument')"
                        :key="inst.id" :value="inst.id">
                  {{ inst.name }}
                </option>
              </select>
              <select
                :value="slot.member.role"
                class="text-xs rounded-md border border-neutral-200 px-2 py-1 bg-white focus:outline-none focus:border-brand-pink w-full"
                @change="band.updateMember(slot.member.id, {role: ($event.target as HTMLSelectElement).value as 'lead' | 'rhythm'})"
              >
                <option value="lead">主音</option>
                <option value="rhythm">节奏</option>
              </select>
            </div>
            <button
              v-else
              :disabled="band.band.members.length >= 6"
              class="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-3 flex flex-col items-center justify-center text-muted hover:border-brand-pink hover:text-brand-pink transition-colors disabled:opacity-40 disabled:cursor-not-allowed h-24"
              @click="showInvite = !showInvite"
            >
              <span class="text-xl">+</span>
            </button>
          </template>
        </div>
      </div>

      <div v-if="showInvite" class="rounded-xl border border-neutral-200 bg-white p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-xs text-muted font-medium">邀请</div>
          <button
            class="text-xs text-muted hover:text-brand-pink transition-colors"
            @click="showInvite = false"
          >
            关闭
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-if="!band.band.members.some(m => m.id === 'player')"
            class="rounded-xl border border-neutral-200 bg-white p-3 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <img :src="`${base}icons/character.svg`" alt="" class="w-4 h-4"/>
              <span class="text-sm font-medium">{{ player.state.name }}</span>
            </div>
            <button
              class="rounded-lg border border-brand-pink/40 bg-pink-50 px-3 py-1.5 text-xs font-medium text-brand-pink hover:bg-pink-100 transition-colors"
              @click="handleAddPlayer"
            >
              加入
            </button>
          </div>
          <div
            v-for="npc in band.availableNPCs"
            :key="npc.id"
            class="rounded-xl border border-neutral-200 bg-white p-3 flex items-center justify-between"
          >
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <img :src="`${base}icons/character.svg`" alt="" class="w-4 h-4"/>
                <span class="text-sm font-medium">{{ npc.name }}</span>
              </div>
              <span class="text-[10px] text-muted">好感度 {{
                  player.state.relationships[npc.id]?.affection ?? 0
                }}</span>
            </div>
            <button
              class="rounded-lg border border-brand-pink/40 bg-pink-50 px-3 py-1.5 text-xs font-medium text-brand-pink hover:bg-pink-100 transition-colors"
              @click="handleAddMember(npc.id)"
            >
              邀请
            </button>
          </div>
          <div v-if="band.availableNPCs.length === 0 && band.band.members.some(m => m.id === 'player')"
               class="text-xs text-neutral-400 text-center py-2">
            暂无可邀请的角色
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-neutral-200 bg-white p-4">
        <div class="flex items-center gap-2 mb-3">
          <img :src="`${base}icons/theater.svg`" alt="日程" class="w-4 h-4"/>
          <span class="text-xs text-muted font-medium">演出日程</span>
          <span class="text-xs text-muted ml-auto">Live Boost {{ player.state.liveBoost }} / 3</span>
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="stage in stages.stages"
            :key="stage.id"
            :class="[
              'rounded-xl border bg-white p-4 transition-all',
              stages.isCompleted(stage.id) ? 'border-neutral-200' : stages.isUnlocked(stage) ? 'border-neutral-200' : 'border-neutral-200 opacity-60',
            ]"
          >
            <div class="flex items-start gap-3 flex-wrap">
              <div
                :class="[
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                  stages.isCompleted(stage.id) ? 'bg-green-50'
                    : stages.isUnlocked(stage) ? 'bg-pink-50'
                    : 'bg-neutral-100',
                ]"
              >
                <img
                  v-if="stages.isCompleted(stage.id) || stages.isUnlocked(stage)"
                  :src="`${base}icons/${stage.icon ?? 'theater.svg'}`"
                  alt=""
                  class="w-4 h-4"
                />
                <img v-else :src="`${base}icons/info.svg`" alt="锁定" class="w-4 h-4 opacity-50"/>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-bold">{{ stage.name }}</span>
                  <span
                    v-if="stages.isCompleted(stage.id)"
                    class="text-[10px] font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5"
                  >
                    已完成
                  </span>
                  <span
                    v-else-if="!stages.isUnlocked(stage)"
                    class="text-[10px] font-medium text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5"
                  >
                    未解锁
                  </span>
                  <span
                    v-else
                    class="text-[10px] font-medium text-brand-pink bg-pink-50 rounded-full px-2 py-0.5"
                  >
                    可预约
                  </span>
                </div>
                <p class="text-xs text-muted mt-1 leading-relaxed">{{ stage.description }}</p>

                <div class="flex items-center gap-3 mt-2 text-[11px] text-muted">
                  <span>目标得分 {{ stage.targetScore }}</span>
                  <span>{{ stage.maxRounds }} 回合</span>
                </div>
              </div>

              <button
                v-if="!stages.isUnlocked(stage)"
                class="text-xs rounded-lg bg-neutral-100 text-neutral-400 px-4 py-1.5 cursor-not-allowed"
                disabled
              >
                预约演出
              </button>
              <button
                v-else
                :disabled="band.band.members.length === 0 || player.state.liveBoost <= 0"
                class="text-xs rounded-lg bg-brand-pink text-white px-4 py-1.5 font-medium hover:bg-brand-pink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleReserve(stage)"
              >
                预约演出
              </button>
            </div>
          </div>

          <div v-if="stages.stages.length === 0" class="text-xs text-neutral-400 text-center py-4">
            暂无可预约的演出
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
