import { ShoppingBag, User, Menu, Search, LogIn, LogOut, Package, Heart, Scale } from 'lucide-react'
import Logo from './Logo'
import { Input } from './ui/input'
import { ButtonOutline } from './ui/button'
import { useCart } from '@/store/cart'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'

export default function Header() {
  const itemsCount = useCart(s => s.items).reduce((s, i) => s + i.qty, 0)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { user, signOut } = useAuth()
  const fav = useFavorites()
  const cmp = useCompare()

  const submit = (e: React.FormEvent) => { e.preventDefault(); nav(`/catalog?q=${encodeURIComponent(q)}`) }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-narrow flex items-center gap-3 py-3">
        <button className="md:hidden btn btn-outline" aria-label="Меню">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2"><Logo /></Link>
        <form onSubmit={submit} className="ml-auto hidden w-full max-w-lg items-center gap-2 md:flex">
          <div className="relative w-full">
            <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск по каталогу" className="pl-9" />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          </div>
          <ButtonOutline type="submit">Найти</ButtonOutline>
        </form>
        <nav className="ml-auto hidden items-center gap-4 md:flex">
          <Link to="/catalog" className="text-sm hover:underline">Каталог</Link>
          <Link to="/about" className="text-sm hover:underline">О нас</Link>
          <Link to="/contact" className="text-sm hover:underline">Контакты</Link>
          {user && <Link to="/orders" className="text-sm hover:underline flex items-center gap-1"><Package className="h-4 w-4" />Заказы</Link>}
        </nav>
        <div className="ml-2 flex items-center gap-1">
          <Link to="/favorites" className="btn btn-outline" aria-label="Избранное"><Heart className="h-5 w-5" /><span className="ml-1">{fav.ids.length}</span></Link>
          <Link to="/compare" className="btn btn-outline" aria-label="Сравнение"><Scale className="h-5 w-5" /><span className="ml-1">{cmp.ids.length}</span></Link>
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline" aria-label="Профиль"><User className="h-5 w-5" /></Link>
              <button onClick={()=>signOut()} className="btn btn-outline" aria-label="Выйти"><LogOut className="h-5 w-5" /></button>
            </>
          ) : (
            <Link to="/sign-in" className="btn btn-outline" aria-label="Войти"><LogIn className="h-5 w-5" /></Link>
          )}
          <Link to="/checkout" className="btn btn-primary" aria-label="Корзина">
            <ShoppingBag className="h-5 w-5" /><span className="ml-1">{itemsCount}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
