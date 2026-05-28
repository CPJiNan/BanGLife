<script lang="ts" setup>
import {useModsStore} from '@/stores/mods'

const mods = useModsStore()
</script>

<template>
  <Transition>
    <div
      v-if="mods.pendingInstall"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-200"
    >
      <div class="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
        <h3 class="text-base font-bold mb-2">Mod 安装须知</h3>
        <p class="text-xs text-muted leading-relaxed mb-4">
          此 Mod 可执行任意 JavaScript 代码，包括文件访问、网络请求、存档修改等操作。<br/>
          仅安装可信来源的 Mod。
        </p>
        <div class="rounded-lg bg-neutral-50 border border-neutral-200 p-3 mb-4 text-xs space-y-1">
          <div><span class="text-muted">Mod 名称：</span>{{ mods.pendingInstall.manifest.name }}</div>
          <div><span class="text-muted">ID：</span>{{ mods.pendingInstall.manifest.id }}</div>
          <div v-if="mods.pendingInstall.manifest.author">
            <span class="text-muted">作者：</span>{{ mods.pendingInstall.manifest.author }}
          </div>
          <div><span class="text-muted">来源：</span>{{ mods.pendingInstall.source }}</div>
        </div>
        <div class="flex gap-2">
          <button
            class="flex-1 text-sm py-2 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-colors"
            @click="mods.cancelInstall()"
          >
            取消
          </button>
          <button
            class="flex-1 text-sm py-2 rounded-xl text-white transition-opacity hover:opacity-90"
            style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-purple))"
            @click="mods.confirmInstall(mods.pendingInstall!.manifest)"
          >
            安装
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
