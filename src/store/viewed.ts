import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type State = { ids: string[], add: (id: string) => void, list: ()=>string[], clear: ()=>void }
export const useViewed = create<State>()(persist((set,get)=>({
  ids: [],
  add: (id) => set(s => {
    const arr = [id, ...s.ids.filter(x=>x!==id)].slice(0, 12)
    return { ids: arr }
  }),
  list: () => get().ids,
  clear: () => set({ ids: [] })
}), { name: 'mira-viewed' }))
