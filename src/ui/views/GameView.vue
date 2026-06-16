<script lang="ts" setup>
import StatsPanel from '@/ui/panels/StatsPanel.vue'
import SocialPanel from '@/ui/panels/SocialPanel.vue'
import TaskPanel from '@/ui/panels/TaskPanel.vue'
import SavePanel from '@/ui/panels/SavePanel.vue'
import OptionsPanel from '@/ui/panels/OptionsPanel.vue'
import InventoryPanel from '@/ui/panels/InventoryPanel.vue'
import SceneView from '@/ui/views/SceneView.vue'
import ShopView from '@/ui/views/ShopView.vue'
import AppearanceView from '@/ui/views/AppearanceView.vue'
import {useUIStore} from '@/stores/ui'
import {useTasksStore} from '@/stores/tasks'
import PassageOverlay from '@/ui/components/overlays/PassageOverlay.vue'

import {computed, ref, watch} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {useWorldStore} from '@/stores/world'
import {formatDate, formatTime} from '@/core/time'

type PanelId = 'stats' | 'social' | 'tasks' | 'inventory' | 'save' | 'options'

const activePanel = ref<PanelId | null>(null)
const mobilePanel = ref<PanelId | null>(null)

const player = usePlayerStore()
const world = useWorldStore()
const ui = useUIStore()
const tasks = useTasksStore()

watch(() => player.time, () => {
  tasks.updateTasks()
  tasks.expireTasks()
})

const timeStr = computed(() => formatTime(player.timeInfo))
const dateStr = computed(() => formatDate(player.timeInfo))
const locationName = computed(() => world.getLocation(player.state.currentLocationId)?.name ?? '')

const base = import.meta.env.BASE_URL

const sidebarTopButtons: { id: PanelId; label: string; icon: string }[] = [
  {id: 'stats', label: '属性', icon: `${base}icons/stats.svg`},
  {id: 'social', label: '社交', icon: `${base}icons/social.svg`},
  {id: 'tasks', label: '任务', icon: `${base}icons/task.svg`},
  {id: 'inventory', label: '背包', icon: `${base}icons/inventory.svg`},
]

const sidebarBottomButtons: { id: PanelId; label: string; icon: string }[] = [
  {id: 'save', label: '存档', icon: `${base}icons/save.svg`},
  {id: 'options', label: '选项', icon: `${base}icons/options.svg`},
]

const sidebarButtons = [...sidebarTopButtons, ...sidebarBottomButtons]

function togglePanel(id: PanelId) {
  activePanel.value = activePanel.value === id ? null : id
}

function toggleMobilePanel(id: PanelId) {
  mobilePanel.value = mobilePanel.value === id ? null : id
}
</script>

<template>
  <div class="h-full hidden md:flex overflow-hidden">
    <aside class="w-14 shrink-0 bg-white border-r border-neutral-200 flex flex-col items-center py-3 gap-1">
      <button
        v-for="btn in sidebarTopButtons"
        :key="btn.id"
        :class="activePanel === btn.id
          ? 'bg-pink-50 text-brand-pink'
          : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'"
        class="w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors relative"
        @click="togglePanel(btn.id)"
      >
        <img :alt="btn.label" :src="btn.icon" class="w-4 h-4"/>
        <span class="text-[9px] mt-0.5 leading-none">{{ btn.label }}</span>
        <span
          v-if="btn.id === 'tasks' && tasks.hasCompletedTasks"
          class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
        />
      </button>
      <div class="flex-1"></div>
      <button
        v-for="btn in sidebarBottomButtons"
        :key="btn.id"
        :class="activePanel === btn.id
          ? 'bg-pink-50 text-brand-pink'
          : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'"
        class="w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-colors relative"
        @click="togglePanel(btn.id)"
      >
        <img :alt="btn.label" :src="btn.icon" class="w-4 h-4"/>
        <span class="text-[9px] mt-0.5 leading-none">{{ btn.label }}</span>
      </button>

    </aside>

    <Transition name="panel-slide">
      <div
        v-if="activePanel"
        class="w-72 shrink-0 bg-white border-r border-neutral-200 flex flex-col overflow-hidden shadow-lg z-10"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
          <h2 class="text-sm font-semibold">
            {{ sidebarButtons.find(b => b.id === activePanel)?.label }}
          </h2>
          <button
            class="text-xs text-muted hover:text-brand-pink transition-colors"
            @click="activePanel = null"
          >
            ✕
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <StatsPanel v-if="activePanel === 'stats'"/>
          <SocialPanel v-else-if="activePanel === 'social'"/>
          <TaskPanel v-else-if="activePanel === 'tasks'"/>
          <InventoryPanel v-else-if="activePanel === 'inventory'"/>
          <SavePanel v-else-if="activePanel === 'save'"/>
          <OptionsPanel v-else-if="activePanel === 'options'"/>
        </div>
      </div>
    </Transition>

    <div class="flex-1 overflow-hidden bg-neutral-50">
      <AppearanceView v-if="ui.activeWardrobe"/>
      <ShopView v-else-if="ui.activeShopId"/>
      <SceneView v-else/>
    </div>

    <PassageOverlay/>
  </div>

  <div class="h-full flex flex-col md:hidden overflow-hidden">
    <header class="shrink-0 bg-white border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
      <div>
        <div class="text-sm font-bold tabular-nums">{{ timeStr }}</div>
        <div class="text-xs text-muted">{{ dateStr }} · {{ locationName }}</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold">¥{{ player.state.money }}</span>
      </div>
    </header>

    <div class="flex-1 overflow-hidden bg-neutral-50">
      <AppearanceView v-if="ui.activeWardrobe"/>
      <ShopView v-else-if="ui.activeShopId"/>
      <SceneView v-else/>
    </div>

    <nav class="shrink-0 bg-white border-t border-neutral-200 flex safe-bottom">
      <button
        v-for="btn in sidebarButtons"
        :key="btn.id"
        :class="mobilePanel === btn.id ? 'text-brand-pink' : 'text-muted'"
        class="flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors relative"
        @click="toggleMobilePanel(btn.id)"
      >
        <img :alt="btn.label" :src="btn.icon" class="w-4 h-4"/>
        <span class="text-[10px]">{{ btn.label }}</span>
        <span
          v-if="btn.id === 'tasks' && tasks.hasCompletedTasks"
          class="absolute top-1.5 right-1/2 translate-x-3 w-2 h-2 bg-red-500 rounded-full"
        />
      </button>
    </nav>

    <Transition name="mobile-panel">
      <div
        v-if="mobilePanel"
        class="fixed inset-0 z-40 bg-white flex flex-col"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
          <h2 class="text-sm font-semibold">
            {{ sidebarButtons.find(b => b.id === mobilePanel)?.label }}
          </h2>
          <button
            class="text-xs text-muted hover:text-brand-pink transition-colors"
            @click="mobilePanel = null"
          >
            关闭
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <StatsPanel v-if="mobilePanel === 'stats'"/>
          <SocialPanel v-else-if="mobilePanel === 'social'"/>
          <TaskPanel v-else-if="mobilePanel === 'tasks'"/>
          <InventoryPanel v-else-if="mobilePanel === 'inventory'"/>
          <SavePanel v-else-if="mobilePanel === 'save'"/>
          <OptionsPanel v-else-if="mobilePanel === 'options'"/>
        </div>
      </div>
    </Transition>

    <PassageOverlay/>
  </div>
</template>

<style scoped>
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.12s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-to,
.panel-slide-leave-from {
  opacity: 1;
}

.mobile-panel-enter-active,
.mobile-panel-leave-active {
  transition: transform 0.25s ease;
}

.mobile-panel-enter-from,
.mobile-panel-leave-to {
  transform: translateY(100%);
}
</style>
