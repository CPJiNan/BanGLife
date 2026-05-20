<script lang="ts" setup>
import {ref} from 'vue'
import ModPanel from '@/ui/panels/ModPanel.vue'

const activeTab = ref<'general' | 'mods'>('general')
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex border-b border-neutral-200 shrink-0">
      <button
        :class="activeTab === 'general'
          ? 'border-b-2 border-brand-pink text-brand-pink'
          : 'text-muted hover:text-neutral-700'"
        class="flex-1 text-xs py-2 transition-colors"
        @click="activeTab = 'general'"
      >
        通用
      </button>
      <button
        :class="activeTab === 'mods'
          ? 'border-b-2 border-brand-pink text-brand-pink'
          : 'text-muted hover:text-neutral-700'"
        class="flex-1 text-xs py-2 transition-colors"
        @click="activeTab = 'mods'"
      >
        Mod 管理
      </button>
    </div>

    <div class="flex-1 overflow-hidden">
      <div v-if="activeTab === 'general'" class="p-4 flex flex-col gap-4">
      </div>
      <ModPanel v-else/>
    </div>
  </div>
</template>
