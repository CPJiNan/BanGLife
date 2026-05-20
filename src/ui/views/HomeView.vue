<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {usePlayerStore} from '@/stores/player'
import {useSaveStore} from '@/stores/save'
import {useModsStore} from '@/stores/mods'
import {useWorldStore} from '@/stores/world'
import {GAME_VERSION} from '@/stores/save-types'
import {formatTime, timeToInfo} from '@/core/time'
import {MINUTES_PER_DAY} from '@/core/constants'
import TrustModal from '@/ui/modals/TrustModal.vue'

const router = useRouter()
const player = usePlayerStore()
const save = useSaveStore()
const mods = useModsStore()
const world = useWorldStore()

const tab = ref<'start' | 'saves' | 'mods'>('start')

const playerName = ref('')

const urlInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  await save.refresh()
  await mods.refresh()
})

const slots = computed(() =>
  [...save.slots].sort((a, b) => a.slot - b.slot)
)

function formatSaveDate(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function newGame() {
  player.state.name = playerName.value.trim() || ''
  router.push('/game')
}

async function loadSlot(slot: number) {
  await save.loadFromSlot(slot)
  if (!save.error) await router.push('/game')
}

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  await mods.installZip(file)
  if (fileInput.value) fileInput.value.value = ''
}

async function onUrlInstall() {
  if (!urlInput.value.trim()) return
  await mods.installUrl(urlInput.value.trim())
  urlInput.value = ''
}
</script>

<template>
  <main class="min-h-full flex items-center justify-center px-4 py-12">
    <section class="w-full max-w-lg">

      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold tracking-tight mb-1">BanGLife</h1>
        <p class="text-sm text-muted">乐队少女模拟器</p>
      </header>

      <div class="flex rounded-xl border border-neutral-200 bg-white overflow-hidden mb-4">
        <button
          v-for="t in [{ id: 'start', label: '开始' }, { id: 'saves', label: '存档' }, { id: 'mods', label: 'Mod' }]"
          :key="t.id"
          :class="tab === t.id
            ? 'bg-neutral-50 text-brand-pink font-semibold border-b-2 border-brand-pink'
            : 'text-muted hover:text-neutral-700'"
          class="flex-1 text-sm py-3 transition-colors"
          @click="tab = t.id as 'start' | 'saves' | 'mods'"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="tab === 'start'" class="flex flex-col gap-3">

        <div class="rounded-2xl bg-white border border-neutral-200 p-5">
          <h2 class="text-sm font-semibold mb-3">创建角色</h2>
          <div class="flex gap-2 mb-4">
            <input
              v-model="playerName"
              class="flex-1 text-sm border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-pink"
              maxlength="12"
              placeholder="输入角色名称"
              type="text"
              @keydown.enter="newGame"
            />
          </div>
          <button
            class="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
            @click="newGame"
          >
            开始新游戏
          </button>
        </div>

      </div>

      <div v-else-if="tab === 'saves'" class="flex flex-col gap-3">
        <div v-if="save.error" class="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
          {{ save.error }}
        </div>

        <div
          v-for="slot in slots"
          :key="slot.slot"
          class="rounded-2xl bg-white border border-neutral-200 p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-muted font-medium">{{ slot.label }}</span>
            <span class="text-xs text-neutral-400">{{ formatSaveDate(slot.savedAt) }}</span>
          </div>
          <div v-if="slot.data" class="text-xs mb-3">第 {{ Math.floor(slot.preview.gameTime / MINUTES_PER_DAY) + 1 }} 天
            {{ formatTime(timeToInfo(slot.preview.gameTime)) }} ·
            {{ world.getLocation(slot.preview.locationId)?.name ?? slot.preview.locationId }}
          </div>
          <div v-else class="text-xs text-neutral-400 mb-3">空槽位</div>
          <button
            v-if="slot.data"
            :disabled="save.busy"
            class="w-full py-1.5 text-xs rounded-lg border border-neutral-200 hover:border-brand-pink transition-colors"
            @click="loadSlot(slot.slot)"
          >
            读取并继续
          </button>
          <div v-else class="text-xs text-neutral-300 text-center py-1.5">—</div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div v-if="mods.error" class="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
          {{ mods.error }}
        </div>

        <div class="rounded-2xl bg-white border border-neutral-200 p-4 flex flex-col gap-2">
          <div class="text-xs text-muted font-medium">安装 Mod</div>
          <label
            class="flex items-center justify-center gap-2 text-xs py-2 rounded-xl border border-dashed border-neutral-300 hover:border-brand-pink cursor-pointer transition-colors">
            <span>上传 ZIP 文件</span>
            <input ref="fileInput" :disabled="mods.busy" accept=".zip" class="hidden" type="file"
                   @change="onFileChange"/>
          </label>
          <div class="flex gap-1.5">
            <input
              v-model="urlInput"
              :disabled="mods.busy"
              class="flex-1 text-xs border border-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-pink"
              placeholder="粘贴 ZIP URL..."
              type="url"
              @keydown.enter="onUrlInstall"
            />
            <button
              :disabled="mods.busy"
              class="text-xs px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-brand-pink transition-colors"
              @click="onUrlInstall"
            >
              导入
            </button>
          </div>
        </div>

        <div v-if="mods.installed.length === 0" class="text-xs text-neutral-400 text-center py-6">
          暂无已安装的用户 Mod
        </div>
        <div
          v-for="mod in mods.installed"
          :key="mod.id"
          class="rounded-2xl bg-white border border-neutral-200 p-4"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="text-sm font-medium">{{ mod.name }}</div>
              <div class="text-xs text-muted mt-0.5">{{ mod.id }} · v{{ mod.version }}</div>
              <div v-if="mod.description" class="text-xs text-muted mt-1">{{ mod.description }}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0 ml-3">
              <button
                :class="mods.isEnabled(mod.id) ? 'bg-pink-100 text-pink-700' : 'bg-neutral-100 text-neutral-500'"
                :disabled="mods.busy"
                class="text-xs px-2 py-0.5 rounded-full transition-colors"
                @click="mods.toggleEnabled(mod.id)"
              >
                {{ mods.isEnabled(mod.id) ? '已启用' : '已禁用' }}
              </button>
              <button
                :disabled="mods.busy"
                class="text-xs px-2 py-0.5 rounded-full border border-red-100 texd-400 hover:border-red-300 transition-colors"
                @click="mods.remove(mod.id)"
              >
                删除
              </button>
            </div>
          </div>
          <div v-if="mods.isLoaded(mod.id)" class="mt-2 text-xs text-green-600">● 运行中</div>
        </div>
      </div>
      <TrustModal/>

      <footer class="mt-8 text-center text-xs text-muted">
        v{{ GAME_VERSION }} · BanGLife
      </footer>
    </section>
  </main>
</template>
