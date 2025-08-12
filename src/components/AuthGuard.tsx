import { useAuth } from '@/store/auth'
import { Navigate, useLocation } from 'react-router-dom'
export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="p-6 text-center">Загрузка…</div>
  if (!user) return <Navigate to="/sign-in" replace state={{ from: loc.pathname }} />
  return children
}
