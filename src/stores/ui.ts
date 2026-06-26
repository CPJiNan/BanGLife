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

export interface ConfirmState {
  title: string
  description?: string
  variant?: 'default' | 'danger'
  onConfirm: (qty?: number) => void
  onCancel?: () => void
  input?: {label?: string; value: number; min?: number; max?: number; price?: number}
}

export const useUIStore = defineStore('ui', () => {
  const activePassage = ref<ActivePassage | null>(null)
  const activeShopId = ref<string | null>(null)
  const activeToasts = ref<Toast[]>([])
  const activeConfirm = ref<ConfirmState | null>(null)
  const activeWardrobe = ref<boolean>(false)
  const activeMap = ref<boolean>(false)
  const activeNPCId = ref<string | null>(null)
  const activeBand = ref<boolean>(false)
  const activePerformance = ref<boolean>(false)

  function showPassage(passage: ActivePassage): void {
    activeNPCId.value = null
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
    activeToasts.value.push(toast)

    setTimeout(() => {
      const index = activeToasts.value.findIndex(t => t.id === id)
      if (index > -1) activeToasts.value.splice(index, 1)
    }, duration)

    return id
  }

  function dismissToast(id: string): void {
    const index = activeToasts.value.findIndex(t => t.id === id)
    if (index > -1) activeToasts.value.splice(index, 1)
  }

  function showConfirm(state: ConfirmState): void {
    activeConfirm.value = state
  }

  function dismissConfirm(): void {
    activeConfirm.value = null
  }

  function openWardrobe(): void {
    activeWardrobe.value = true
  }

  function closeWardrobe(): void {
    activeWardrobe.value = false
  }

  function openMap(): void {
    activeMap.value = true
  }

  function closeMap(): void {
    activeMap.value = false
  }

  function openNPC(npcId: string): void {
    activeNPCId.value = npcId
  }

  function closeNPC(): void {
    activeNPCId.value = null
  }

  function openBand(): void {
    activeBand.value = true
  }

  function closeBand(): void {
    activeBand.value = false
  }

  function openPerformance(): void {
    activePerformance.value = true
  }

  function closePerformance(): void {
    activePerformance.value = false
  }

  return {
    activePassage,
    activeShopId,
    activeToasts,
    activeConfirm,
    activeWardrobe,
    activeMap,
    activeNPCId,
    activeBand,
    activePerformance,
    showPassage,
    dismissPassage,
    openShop,
    closeShop,
    showToast,
    dismissToast,
    showConfirm,
    dismissConfirm,
    openWardrobe,
    closeWardrobe,
    openMap,
    closeMap,
    openNPC,
    closeNPC,
    openBand,
    closeBand,
    openPerformance,
    closePerformance,
  }
})
