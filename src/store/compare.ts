import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type State = { ids: string[], toggle: (id: string) => void, has: (id:string)=>boolean, clear: ()=>void }
export const useCompare = create<State>()(persist((set,get)=>({
  ids: [],
  toggle: (id) => set(s => {
    const exists = s.ids.includes(id)
    let next = exists ? s.ids.filter(x=>x!==id) : [...s.ids, id]
    if (next.length > 4) next = next.slice(0,4) // максимум 4
    return { ids: next }
  }),
  has: (id) => get().ids.includes(id),
  clear: () => set({ ids: [] })
}), { name: 'mira-compare' }))
