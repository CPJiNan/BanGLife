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

export interface ConfirmModalState {
  title: string
  description?: string
  variant?: 'default' | 'danger'
  onConfirm: () => void
  onCancel?: () => void
}

export interface ShopModalState {
  title: string
  description?: string
  onConfirm: (qty: number) => void
  onCancel?: () => void
  mode: 'buy' | 'sell'
  input: { label?: string; value: number; min?: number; max?: number; price?: number }
}

export const useUIStore = defineStore('ui', () => {
  const activePassage = ref<ActivePassage | null>(null)
  const activeShopId = ref<string | null>(null)
  const activeToasts = ref<Toast[]>([])
  const activeConfirmModal = ref<ConfirmModalState | null>(null)
  const activeShopModal = ref<ShopModalState | null>(null)
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

  function showConfirmModal(state: ConfirmModalState): void {
    activeConfirmModal.value = state
  }

  function dismissConfirmModal(): void {
    activeConfirmModal.value = null
  }

  function showShopModal(state: ShopModalState): void {
    activeShopModal.value = state
  }

  function dismissShopModal(): void {
    activeShopModal.value = null
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
    activeConfirmModal,
    activeShopModal,
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
    showConfirmModal,
    dismissConfirmModal,
    showShopModal,
    dismissShopModal,
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
