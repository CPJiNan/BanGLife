<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useModsStore} from '@/stores/mods'
import InstallModal from '@/ui/components/modals/InstallModal.vue'

const mods = useModsStore()
const urlInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => mods.refresh())

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
  <div class="flex flex-col gap-4 p-4 overflow-y-auto h-full">
    <div v-if="mods.error" class="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
      {{ mods.error }}
    </div>

    <div class="rounded-xl border border-neutral-200 bg-white p-3 flex flex-col gap-2">
      <div class="text-xs text-muted font-medium">安装 Mod</div>

      <label
        class="flex items-center justify-center gap-2 text-xs py-2 rounded-lg border border-dashed border-neutral-300 hover:border-brand-pink cursor-pointer transition-colors"
      >
        <span>上传 ZIP 文件</span>
        <input
          ref="fileInput"
          :disabled="mods.busy"
          accept=".zip"
          class="hidden"
          type="file"
          @change="onFileChange"
        />
      </label>

      <div class="flex gap-1.5">
        <input
          v-model="urlInput"
          :disabled="mods.busy"
          class="flex-1 text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-pink"
          placeholder="粘贴 ZIP URL..."
          type="url"
          @keydown.enter="onUrlInstall"
        />
        <button
          :disabled="mods.busy"
          class="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-brand-pink transition-colors"
          @click="onUrlInstall"
        >
          导入
        </button>
      </div>
    </div>

    <div v-if="mods.installed.length === 0" class="text-xs text-neutral-400 text-center py-4">
      暂无已安装的用户 Mod
    </div>

    <div
      v-for="mod in mods.installed"
      :key="mod.id"
      class="rounded-xl border border-neutral-200 bg-white p-3"
    >
      <div class="flex items-start justify-between mb-1">
        <div>
          <div class="text-sm font-medium">{{ mod.name }}</div>
          <div class="text-xs text-muted">{{ mod.id }} · v{{ mod.version }}</div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 ml-2">
          <button
            :class="mods.isEnabled(mod.id)
              ? 'bg-pink-100 text-pink-700'
              : 'bg-neutral-100 text-neutral-500'"
            :disabled="mods.busy"
            class="text-xs px-2 py-0.5 rounded-full transition-colors"
            @click="mods.toggleEnabled(mod.id)"
          >
            {{ mods.isEnabled(mod.id) ? '已启用' : '已禁用' }}
          </button>
          <button
            :disabled="mods.busy"
            class="text-xs px-2 py-0.5 rounded-full border border-red-100 text-red-400 hover:border-red-300 transition-colors"
            @click="mods.remove(mod.id)"
          >
            删除
          </button>
        </div>
      </div>
      <div v-if="mod.description" class="text-xs text-muted">{{ mod.description }}</div>
      <div v-if="mod.author" class="text-xs text-neutral-400 mt-0.5">作者：{{ mod.author }}</div>
      <div v-if="mods.isEnabled(mod.id)" class="mt-1.5 text-xs text-green-600">● 运行中</div>
    </div>
  </div>
  <InstallModal/>
</template>
