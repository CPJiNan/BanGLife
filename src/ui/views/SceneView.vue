<script lang="ts" setup>
import {computed} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {useWorldStore} from '@/stores/world'
import {useUIStore} from '@/stores/ui'
import {registries} from '@/core/registry'
import {makeGameContext} from '@/mod/api'
import {triggerEvents} from '@/core/scheduler'
import {applyEffects} from '@/core/effects'
import {getShopsByLocation} from '@/core/shop'
import {useTasksStore} from '@/stores/tasks'
import type {Action, Connection} from '@/core/types'
import {ACTION_TAG_LABELS, CONNECTION_TAG_LABELS} from '@/core/constants'

const player = usePlayerStore()
const world = useWorldStore()
const ui = useUIStore()

const location = computed(() => world.getLocation(player.state.currentLocationId))
const connections = computed(() => location.value?.connections ?? [])
const ctx = computed(() => makeGameContext())
const locationActions = computed(() =>
  world.getActionsForLocation(player.state.currentLocationId, ctx.value)
)
const locationShops = computed(() => getShopsByLocation(player.state.currentLocationId, ctx.value))

const base = import.meta.env.BASE_URL

const groupedActions = computed(() => {
  const groups: Record<string, Action[]> = {}
  for (const action of locationActions.value) {
    const tag = action.tag ?? 'other'
    if (!groups[tag]) groups[tag] = []
    groups[tag].push(action)
  }
  return groups
})

const groupedConnections = computed(() => {
  const groups: Record<string, Connection[]> = {}
  for (const conn of connections.value) {
    const tag = conn.tag ?? 'other'
    if (!groups[tag]) groups[tag] = []
    groups[tag].push(conn)
  }
  return groups
})

function showPassageById(passageId: string) {
  const passage = registries.passages.get(passageId)
  if (!passage) return
  ui.showPassage({
    text: passage.text,
    speaker: passage.speaker,
    choices: passage.choices ?? [],
  })
}

function moveTo(connection: Connection) {
  player.advanceTime(connection.duration)
  triggerEvents({type: 'time:tick', minutes: connection.duration}, makeGameContext())
  player.moveTo(connection.to)
  const evtPassageId = triggerEvents({type: 'location:enter', locationId: connection.to}, makeGameContext())
  if (evtPassageId) showPassageById(evtPassageId)
}

function isActionDisabled(action: Action): boolean {
  const context = ctx.value
  return !!action.available && !action.available(context)
}

function executeAction(action: Action) {
  const context = ctx.value
  if (action.available && !action.available(context)) return

  if (action.effects) {
    applyEffects(action.effects)
  }

  player.advanceTime(action.duration)

  const tickPassageId = triggerEvents({type: 'time:tick', minutes: action.duration}, makeGameContext())

  if (action.execute) {
    action.execute(makeGameContext())
    useTasksStore().updateTasks()
  }

  const afterPassageId = triggerEvents({type: 'action:after', actionId: action.id}, makeGameContext())

  if (action.passage) {
    showPassageById(action.passage)
  } else if (afterPassageId) {
    showPassageById(afterPassageId)
  } else if (tickPassageId) {
    showPassageById(tickPassageId)
  }
}
</script>

<template>
  <main class="flex flex-col h-full overflow-hidden">
    <div class="px-6 pt-5 pb-3 border-b border-neutral-200 bg-white shrink-0">
      <h2 class="text-xl font-bold">{{ location?.name ?? '未知地点' }}</h2>
      <p class="text-sm text-muted mt-1 leading-relaxed">{{ location?.description ?? '' }}</p>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      <div v-for="(acts, tag) in groupedActions" :key="tag">
        <div class="text-xs text-muted mb-2 font-medium">{{ ACTION_TAG_LABELS[tag] ?? tag }}</div>
        <div class="flex flex-col gap-2">
          <button
            v-for="action in acts"
            :key="action.id"
            :disabled="isActionDisabled(action)"
            class="w-full text-left rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-brand-pink hover:shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            @click="executeAction(action)"
          >
            <span class="flex items-center justify-between">
              <span class="flex items-center gap-2">
                <img v-if="action.icon" :alt="action.label" :src="`${base}icons/${action.icon}`" class="w-4 h-4"/>
                <span class="text-sm font-medium">{{ action.label }}</span>
              </span>
              <span class="text-xs text-muted tabular-nums">{{ action.duration }} 分钟</span>
            </span>
            <span v-if="action.description" class="text-xs text-muted mt-0.5">{{ action.description }}</span>
          </button>
        </div>
      </div>

      <div v-if="locationShops.length > 0">
        <div class="text-xs text-muted mb-2 font-medium">购买商品</div>
        <div class="flex flex-col gap-2">
          <button
            v-for="shop in locationShops"
            :key="shop.id"
            class="w-full text-left rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-brand-pink hover:bg-pink-50/50 transition-all"
            @click="ui.openShop(shop.id)"
          >
            <span class="flex items-center justify-between">
              <span class="flex items-center gap-2">
                <img v-if="shop.icon" :alt="shop.name" :src="`${base}icons/${shop.icon}`" class="w-4 h-4"/>
                <span class="text-sm font-medium">{{ shop.name }}</span>
              </span>
              <span class="text-xs text-muted">进入</span>
            </span>
            <span v-if="shop.description" class="block text-xs text-muted mt-0.5">{{ shop.description }}</span>
          </button>
        </div>
      </div>

      <div v-for="(conns, tag) in groupedConnections" :key="tag">
        <div class="text-xs text-muted mb-2 font-medium">{{ CONNECTION_TAG_LABELS[tag] ?? tag }}</div>
        <div class="flex flex-col gap-2">
          <button
            v-for="conn in conns"
            :key="conn.to"
            class="w-full text-left rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 hover:border-brand-pink hover:bg-pink-50/50 transition-all"
            @click="moveTo(conn)"
          >
            <span class="flex items-center justify-between">
              <span class="flex items-center gap-2">
                <img v-if="conn.icon" :alt="conn.label" :src="`${base}icons/${conn.icon}`" class="w-4 h-4"/>
                <span class="text-sm font-medium">{{ conn.label ?? conn.to }}</span>
              </span>
              <span class="text-xs text-muted tabular-nums">→ {{ conn.duration }} 分钟</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
