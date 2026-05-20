import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {Choice} from '@banglife/mod-types'

export interface ActivePassage {
  text: string
  speaker?: string
  choices: Choice[]
}

export const useUIStore = defineStore('ui', () => {
  const activePassage = ref<ActivePassage | null>(null)
  const activeShopId = ref<string | null>(null)

  function showPassage(passage: ActivePassage): void {
    activePassage.value = passage
  }

  function dismissPassage(): void {
    activePassage.value = null
  }

  function openShop(shopId: string): void {
    activeShopId.value = shopId
  }

  function closeShop(): void {
    activeShopId.value = null
  }

  return {activePassage, activeShopId, showPassage, dismissPassage, openShop, closeShop}
})
