import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {Choice} from '@banglife/mod-types'

export interface ActivePassage {
  text: string
  speaker?: string
  choices: Choice[]
}

export interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const useUIStore = defineStore('ui', () => {
  const activePassage = ref<ActivePassage | null>(null)
  const activeShopId = ref<string | null>(null)
  const toasts = ref<Toast[]>([])

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

  function showToast(message: string, type: Toast['type'] = 'info', duration = 3000): string {
    const id = `toast-${Date.now()}`
    const toast: Toast = {id, message, type, duration}
    toasts.value.push(toast)

    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index > -1) toasts.value.splice(index, 1)
    }, duration)

    return id
  }

  function dismissToast(id: string): void {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) toasts.value.splice(index, 1)
  }

  return {
    activePassage,
    activeShopId,
    toasts,
    showPassage,
    dismissPassage,
    openShop,
    closeShop,
    showToast,
    dismissToast,
  }
})
