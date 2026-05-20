import type {GameContext, Shop, ShopItem} from '@banglife/mod-types'
import {registries} from '@/core/registry'
import {getItemAmount, giveItem, takeItem} from '@/core/inventory'
import {usePlayerStore} from '@/stores/player'

export function getShopsByLocation(locationId: string, ctx: GameContext): Shop[] {
  return registries.shops.filter(shop => {
    const loc = shop.locationId
    const locMatch = loc === undefined || loc === locationId || (Array.isArray(loc) && loc.includes(locationId))
    if (!locMatch) return false
    return shop.visible?.(ctx) !== false && shop.available?.(ctx) !== false
  })
}

export function getVisibleShopItems(shop: Shop, ctx: GameContext): ShopItem[] {
  return shop.items.filter(item => item.condition?.(ctx) !== false)
}

export function getShopItemPrice(item: ShopItem, ctx: GameContext, mode: 'buy' | 'sell'): number | null {
  const basePrice = mode === 'buy' ? item.buyPrice : item.sellPrice
  if (basePrice === undefined) return null

  const discount = typeof item.discount === 'function' ? item.discount(ctx) : item.discount ?? 0
  const clampedDiscount = Math.min(1, Math.max(0, discount))
  const multiplier = mode === 'buy' ? 1 - clampedDiscount : 1
  return Math.max(0, Math.round(basePrice * multiplier))
}

export function canBuyFromShop(shopItem: ShopItem, ctx: GameContext): boolean {
  const {state} = usePlayerStore()
  if (shopItem.condition?.(ctx) === false) return false
  if (shopItem.stock !== undefined && shopItem.stock <= 0) return false
  const price = getShopItemPrice(shopItem, ctx, 'buy')
  return price !== null && state.money >= price
}

export function buyFromShop(shopItem: ShopItem, ctx: GameContext): boolean {
  const {state} = usePlayerStore()
  if (!canBuyFromShop(shopItem, ctx)) return false
  const price = getShopItemPrice(shopItem, ctx, 'buy')
  if (price === null) return false

  state.money = Math.max(0, state.money - price)
  giveItem(shopItem.itemId, 1)
  if (shopItem.stock !== undefined) shopItem.stock -= 1
  return true
}

export function canSellToShop(shopItem: ShopItem, ctx: GameContext): boolean {
  if (shopItem.condition?.(ctx) === false) return false
  if (getShopItemPrice(shopItem, ctx, 'sell') === null) return false
  return getItemAmount(shopItem.itemId) > 0
}

export function sellToShop(shopItem: ShopItem, ctx: GameContext): boolean {
  const {state} = usePlayerStore()
  if (!canSellToShop(shopItem, ctx)) return false
  const price = getShopItemPrice(shopItem, ctx, 'sell')
  if (price === null || !takeItem(shopItem.itemId, 1)) return false

  state.money += price
  if (shopItem.stock !== undefined) shopItem.stock += 1
  return true
}
