import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type AuthState = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => {
  supabase.auth.getSession().then(({ data }) => set({ user: data.session?.user ?? null, loading: false }))
  supabase.auth.onAuthStateChange((_e, s) => set({ user: s?.user ?? null, loading: false }))
  return {
    user: null, loading: true,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signUp(email, password, name) {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) throw error
    },
    async signOut() { await supabase.auth.signOut() }
  }
})
