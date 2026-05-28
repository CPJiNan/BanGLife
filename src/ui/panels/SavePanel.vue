<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useSaveStore} from '@/stores/save'
import {useWorldStore} from '@/stores/world'
import {formatTime, getTimeInfo} from '@/core/time'
import {MINUTES_PER_DAY} from '@/core/constants'

const save = useSaveStore()
const world = useWorldStore()

const showImport = ref(false)
const importText = ref('')
const importSlot = ref<number | 'new'>('new')
const exportText = ref('')
const showExport = ref(false)

onMounted(() => save.refresh())

const slots = computed(() =>
  [...save.slots].sort((a, b) => a.slot - b.slot)
)

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

async function doSave(slot: number) {
  await save.saveToSlot(slot)
}

async function doLoad(slot: number) {
  await save.loadFromSlot(slot)
}

async function doDelete(slot: number) {
  await save.deleteFromSlot(slot)
}

function doExport(slot: number) {
  const encoded = save.exportSlot(slot)
  if (!encoded) return
  exportText.value = encoded
  showExport.value = true
}

function copyExport() {
  navigator.clipboard.writeText(exportText.value)
}

async function doImport() {
  if (!importText.value.trim()) return
  if (importSlot.value === 'new') {
    await save.createEmptySlot()
    await save.refresh()
    const maxSlot = Math.max(...save.slots.filter(s => s.slot > 0).map(s => s.slot), 0)
    await save.importFromString(importText.value.trim(), maxSlot)
  } else {
    await save.importFromString(importText.value.trim(), importSlot.value)
  }
  if (!save.error) {
    showImport.value = false
    importText.value = ''
    importSlot.value = 'new'
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 overflow-y-auto h-full">
    <div v-if="save.error" class="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
      {{ save.error }}
    </div>

    <div
      v-for="slot in slots"
      :key="slot.slot"
      class="rounded-xl border border-neutral-200 bg-white p-3"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-muted font-medium">{{ slot.label }}</span>
        <span class="text-xs text-neutral-400">{{ formatDate(slot.savedAt) }}</span>
      </div>
      <div v-if="slot.data" class="text-xs mb-2">第 {{ Math.floor(slot.preview.gameTime / MINUTES_PER_DAY) + 1 }} 天
        {{ formatTime(getTimeInfo(slot.preview.gameTime)) }} ·
        {{ world.getLocation(slot.preview.locationId)?.name ?? slot.preview.locationId }}
      </div>
      <div v-else class="text-xs text-neutral-400 mb-2">空槽位</div>
      <div class="flex gap-1.5">
        <button
          :disabled="save.busy"
          class="flex-1 text-xs py-1.5 rounded-lg border border-neutral-200 hover:border-brand-pink transition-colors"
          @click="doSave(slot.slot)"
        >
          {{ slot.data ? '覆盖' : '保存' }}
        </button>
        <button
          v-if="slot.data"
          :disabled="save.busy"
          class="flex-1 text-xs py-1.5 rounded-lg border border-neutral-200 hover:border-brand-pink transition-colors"
          @click="doLoad(slot.slot)"
        >
          读取
        </button>
        <button
          v-if="slot.data"
          :disabled="save.busy"
          class="flex-1 text-xs py-1.5 rounded-lg border border-neutral-200 hover:border-brand-pink transition-colors"
          @click="doExport(slot.slot)"
        >
          导出
        </button>
        <button
          :disabled="save.busy"
          class="flex-1 text-xs py-1.5 rounded-lg border border-red-100 text-red-400 hover:border-red-300 transition-colors"
          @click="doDelete(slot.slot)"
        >
          删除
        </button>
      </div>
    </div>

    <div v-if="showExport" class="rounded-xl border border-neutral-200 bg-white p-3 flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div class="text-xs text-muted font-medium">存档字符串</div>
        <button class="text-xs text-brand-pink" @click="copyExport">复制</button>
      </div>
      <textarea
        :value="exportText"
        class="w-full text-xs border border-neutral-200 rounded-lg p-2 resize-none bg-neutral-50"
        readonly
        rows="3"
      />
      <button class="text-xs text-muted hover:text-brand-pink" @click="showExport = false">关闭</button>
    </div>

    <div v-if="showImport" class="rounded-xl border border-neutral-200 bg-white p-3 flex flex-col gap-2">
      <div class="text-xs text-muted font-medium">导入存档</div>
      <textarea
        v-model="importText"
        class="w-full text-xs border border-neutral-200 rounded-lg p-2 resize-none focus:outline-none focus:border-brand-pink"
        placeholder="粘贴存档字符串..."
        rows="3"
      />
      <div class="flex items-center gap-2">
        <label class="text-xs text-muted">导入到槽位</label>
        <select v-model="importSlot" class="text-xs border border-neutral-200 rounded px-1 py-0.5">
          <option v-for="slot in slots" :key="slot.slot" :value="slot.slot">{{ slot.label }}</option>
          <option value="new">+ 新建存档槽位</option>
        </select>
        <button
          :disabled="save.busy"
          class="ml-auto text-xs px-3 py-1 rounded-lg text-white transition-opacity hover:opacity-90"
          style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
          @click="doImport"
        >
          导入
        </button>
      </div>
    </div>

    <button
      :disabled="save.busy"
      class="w-full text-xs py-2 rounded-xl text-white transition-opacity hover:opacity-90"
      style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
      @click="save.createEmptySlot()"
    >
      + 新建存档槽位
    </button>

    <div class="flex justify-center">
      <button
        class="text-xs text-muted hover:text-brand-pink transition-colors"
        @click="showImport = !showImport"
      >
        导入存档
      </button>
    </div>
  </div>
</template>
