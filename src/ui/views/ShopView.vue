<script lang="ts" setup>
import {computed} from 'vue'
import {usePlayerStore} from '@/stores/player'
import {useUIStore} from '@/stores/ui'
import {makeGameContext} from '@/mod/api'
import {registries} from '@/core/registry'
import {
  buyFromShop,
  canBuyFromShop,
  canSellToShop,
  getShopItemPrice,
  getVisibleShopItems,
  sellToShop,
} from '@/core/shop'

const ui = useUIStore()
const player = usePlayerStore()
const ctx = computed(() => makeGameContext())

const tagLabels: Record<string, string> = {}

const shop = computed(() => {
  if (!ui.activeShopId) return null
  return registries.shops.get(ui.activeShopId) ?? null
})

const shopItems = computed(() => {
  if (!shop.value) return []
  return getVisibleShopItems(shop.value, ctx.value).map(shopItem => ({
    shopItem,
    item: registries.items.get(shopItem.itemId),
  }))
})

const groupedItems = computed(() => {
  const groups: Record<string, typeof shopItems.value> = {}
  for (const entry of shopItems.value) {
    const tags = entry.item?.tags ?? []
    const key = tags[0] ?? '其他'
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
})

function buy(itemId: string) {
  const entry = shopItems.value.find(i => i.shopItem.itemId === itemId)
  if (!entry) return
  buyFromShop(entry.shopItem, ctx.value)
}

function sell(itemId: string) {
  const entry = shopItems.value.find(i => i.shopItem.itemId === itemId)
  if (!entry) return
  sellToShop(entry.shopItem, ctx.value)
}

function close() {
  ui.closeShop()
}
</script>

<template>
  <main class="h-full flex flex-col overflow-hidden bg-neutral-50">
    <div class="px-6 pt-5 pb-3 border-b border-neutral-200 bg-white shrink-0 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold">{{ shop?.name ?? '商店' }}</h2>
        <p v-if="shop?.description" class="text-sm text-muted mt-1 leading-relaxed">{{ shop.description }}</p>
      </div>
      <button class="text-xs text-muted hover:text-brand-pink transition-colors" @click="close">返回</button>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-5">
      <template v-if="shop">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted">金钱</span>
          <span class="font-semibold">¥{{ player.state.money }}</span>
        </div>

        <div v-for="(entries, tag) in groupedItems" :key="tag">
          <div class="text-xs text-muted mb-2 font-medium">{{ tagLabels[tag] ?? tag }}</div>
          <div class="grid gap-3 md:grid-cols-2">
            <div
              v-for="entry in entries"
              :key="entry.shopItem.itemId"
              class="rounded-2xl border border-neutral-200 bg-white p-4 flex flex-col gap-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-sm font-medium">{{ entry.item?.name ?? entry.shopItem.itemId }}</div>
                  <p v-if="entry.item?.description" class="text-xs text-muted mt-1">{{ entry.item.description }}</p>
                  <div v-if="entry.item?.tags?.length" class="mt-2 flex flex-wrap gap-1">
                    <span
                      v-for="tagItem in entry.item.tags"
                      :key="tagItem"
                      class="text-[10px] rounded-full bg-neutral-100 px-2 py-0.5 text-muted"
                    >
                      {{ tagLabels[tagItem] ?? tagItem }}
                    </span>
                  </div>
                </div>
                <div class="text-right text-xs text-muted">
                  <div>库存 {{ entry.shopItem.stock ?? '∞' }}</div>
                  <div v-if="getShopItemPrice(entry.shopItem, ctx, 'buy') !== null">购入
                    ¥{{ getShopItemPrice(entry.shopItem, ctx, 'buy') }}
                  </div>
                  <div v-if="getShopItemPrice(entry.shopItem, ctx, 'sell') !== null">回收
                    ¥{{ getShopItemPrice(entry.shopItem, ctx, 'sell') }}
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-if="getShopItemPrice(entry.shopItem, ctx, 'buy') !== null"
                  :disabled="!canBuyFromShop(entry.shopItem, ctx)"
                  class="rounded-xl border border-brand-pink/40 bg-pink-50 px-3 py-1.5 text-xs font-medium text-brand-pink disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="buy(entry.shopItem.itemId)"
                >
                  购买
                </button>
                <button
                  v-if="getShopItemPrice(entry.shopItem, ctx, 'sell') !== null"
                  :disabled="!canSellToShop(entry.shopItem, ctx)"
                  class="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="sell(entry.shopItem.itemId)"
                >
                  出售
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="shopItems.length === 0" class="py-10 text-center text-sm text-muted">
          暂无商品
        </div>
      </template>

      <div v-else class="py-10 text-center text-sm text-muted">
        暂无商店
      </div>
    </div>
  </main>
</template>
