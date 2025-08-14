import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/store/auth'

export default function AdminLayout() {
  const { signOut } = useAuth()
  const link = (to:string, label:string) => (
    <NavLink to={to} end className={({isActive})=> 'block rounded-xl px-3 py-2 text-sm ' + (isActive?'bg-black text-white':'hover:bg-black/5')}>
      {label}
    </NavLink>
  )
  return (
    <div className="min-h-[100svh] bg-white">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="container-narrow flex items-center justify-between py-3">
          <Link to="/" className="text-lg font-bold">Mira Admin</Link>
          <button onClick={()=>signOut()} className="btn-ghost"><LogOut className="h-5 w-5" />Выйти</button>
        </div>
      </header>
      <div className="container-narrow grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          {link('/admin','Дэшборд')}
          {link('/admin/categories','Категории')}
          {link('/admin/products','Товары')}
          {link('/admin/reviews','Отзывы')}
          {link('/admin/orders','Заказы/Оплаты')}
          {link('/admin/settings','Настройки')}
        </aside>
        <main className="pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
