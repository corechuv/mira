import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartItem = { id: string; title: string; price: number; qty: number }
type State = {
  items: CartItem[]
  add: (p: { id: string; title: string; price: any }, qty?: number) => void
  inc: (id: string) => void
  dec: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

function sanitizeItem(raw: any): CartItem | null {
  if (!raw || !raw.id || !raw.title) return null
  const price = Number(raw.price)
  const qty = Math.max(1, Math.floor(Number(raw.qty ?? 1)))
  if (!Number.isFinite(price)) return null
  return { id: String(raw.id), title: String(raw.title), price, qty }
}

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (p, qty = 1) => {
        const price = Number(p.price)
        if (!Number.isFinite(price)) return
        const q = Math.max(1, Math.floor(Number(qty) || 1))
        set((s) => {
          const idx = s.items.findIndex((x) => x.id === p.id)
          if (idx >= 0) {
            const next = [...s.items]
            next[idx] = { ...next[idx], qty: next[idx].qty + q }
            return { items: next }
          }
          return { items: [...s.items, { id: p.id, title: p.title, price, qty: q }] }
        })
      },
      inc: (id) => set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) })),
      dec: (id) =>
        set((s) => ({ items: s.items.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'mira-cart',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: any, _version) => {
        const arr = Array.isArray(persisted?.items) ? persisted.items : []
        const clean = arr.map(sanitizeItem).filter(Boolean) as CartItem[]
        return { items: clean }
      },
      partialize: (s) => ({ items: s.items }),
    }
  )
)
