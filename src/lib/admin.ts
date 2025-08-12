import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'

export function useAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    async function run() {
      try {
        if (!user) { setIsAdmin(false); return }
        // profiles.role
        const { data } = await supabase.from('profiles').select('role,email').eq('id', user.id).single()
        const emails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean)
        const email = (data?.email || user.email || '').toLowerCase()
        const admin = (data?.role === 'admin') || (email && emails.includes(email))
        if (alive) setIsAdmin(!!admin)
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => { alive = false }
  }, [user])

  return { isAdmin, loading }
}
