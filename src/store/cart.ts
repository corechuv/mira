import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/data/products'

export type CartItem = { product: Product; qty: number }

type CartState = {
  items: CartItem[]
  add: (product: Product, qty?: number) => void
  remove: (id: string) => void
  inc: (id: string) => void
  dec: (id: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(persist((set, get) => ({
  items: [],
  add: (product, qty = 1) => {
    const items = [...get().items]
    const i = items.findIndex(it => it.product.id === product.id)
    if (i >= 0) items[i] = { ...items[i], qty: Math.min(items[i].qty + qty, product.stock) }
    else items.push({ product, qty: Math.min(qty, product.stock) })
    set({ items })
  },
  remove: (id) => set({ items: get().items.filter(i => i.product.id !== id) }),
  inc: (id) => set({ items: get().items.map(i => i.product.id === id ? { ...i, qty: Math.min(i.qty + 1, i.product.stock) } : i) }),
  dec: (id) => set({ items: get().items.map(i => i.product.id === id ? { ...i, qty: Math.max(i.qty - 1, 1) } : i) }),
  clear: () => set({ items: [] })
}), { name: 'mira-cart' }))

export const cartTotal = (items: CartItem[]) => items.reduce((s, it) => s + it.product.price * it.qty, 0)
export const cartCount = (items: CartItem[]) => items.reduce((s, it) => s + it.qty, 0)
