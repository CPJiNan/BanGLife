<script lang="ts" setup>
import {computed} from 'vue'
import {useUIStore} from '@/stores/ui'
import {makeGameContext} from '@/mod/api'
import {renderPassage} from '@/core/template'
import {registries} from '@/core/registry'
import {applyEffects} from '@/core/effects'

const ui = useUIStore()

const passage = computed(() => ui.activePassage)

const renderedText = computed(() => {
  if (!passage.value) return ''
  return renderPassage(passage.value.text, makeGameContext())
})

const choiceAvailable = computed(() => {
  if (!passage.value) return []
  const ctx = makeGameContext()
  return passage.value.choices.map(c =>
    c.condition ? c.condition(ctx) : true
  )
})

function pickChoice(index: number) {
  if (!choiceAvailable.value[index]) return
  const choice = passage.value?.choices[index]
  if (!choice) {
    ui.dismissPassage();
    return
  }

  applyEffects(choice.effects)

  const nextId = choice.nextPassage
  if (nextId) {
    const next = registries.passages.get(nextId)
    if (next) {
      ui.showPassage({text: next.text, speaker: next.speaker, choices: next.choices ?? []})
      return
    }
  }
  ui.dismissPassage()
}
</script>

<template>
  <Transition name="passage-fade">
    <div
      v-if="passage"
      class="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
    >
      <div class="absolute inset-0" @click="ui.dismissPassage()"></div>
      <div
        class="relative w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-xl p-6"
      >
        <div v-if="passage.speaker" class="text-xs font-semibold text-brand-pink mb-2">
          {{ passage.speaker }}
        </div>

        <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ renderedText }}</p>

        <div v-if="passage.choices.length > 0" class="mt-4 flex flex-col gap-2">
          <template v-for="(choice, i) in passage.choices" :key="i">
            <button
              v-if="choiceAvailable[i]"
              class="w-full text-left text-sm px-4 py-2.5 rounded-xl border border-neutral-200 hover:border-brand-pink hover:bg-pink-50 transition-all"
              @click="pickChoice(i)"
            >
              {{ choice.label }}
            </button>
          </template>
        </div>

        <button
          v-else
          class="mt-4 text-xs text-muted hover:text-brand-pink transition-colors"
          @click="ui.dismissPassage()"
        >
          继续 →
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.passage-fade-enter-active,
.passage-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.passage-fade-enter-from,
.passage-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
