import { ReactNode } from 'react'
import { useAdmin } from '@/lib/admin'
import { Link } from 'react-router-dom'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdmin()
  if (loading) return <div className="container-narrow py-10 text-sm text-slate-500">Загрузка…</div>
  if (!isAdmin) {
    return (
      <div className="container-narrow py-10">
        <h1 className="text-xl font-semibold">Доступ ограничен</h1>
        <p className="mt-2 text-slate-600">У вас нет прав администратора.</p>
        <Link to="/sign-in" className="btn-outline mt-4 inline-flex">Войти</Link>
      </div>
    )
  }
  return <>{children}</>
}
