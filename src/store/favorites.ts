import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type State = { ids: string[], toggle: (id: string) => void, has: (id:string)=>boolean, clear: ()=>void }
export const useFavorites = create<State>()(persist((set,get)=>({
  ids: [],
  toggle: (id) => set(s => ({ ids: s.ids.includes(id) ? s.ids.filter(x=>x!==id) : [...s.ids, id] })),
  has: (id) => get().ids.includes(id),
  clear: () => set({ ids: [] })
}), { name: 'mira-favs' }))
