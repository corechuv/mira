import { ShoppingBag, User, Menu, Search, LogIn, LogOut, Package, Heart, Scale } from 'lucide-react'
import Logo from './Logo'
import { Input } from './ui/input'
import { ButtonOutline } from './ui/button'
import { useCart } from '@/store/cart'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'
import CatalogFlyout from './CatalogFlyout'
import MobileMenu from './MobileMenu'

export default function Header() {
  const itemsCount = useCart(s => s.items).reduce((s, i) => s + i.qty, 0)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { user, signOut } = useAuth()
  const fav = useFavorites()
  const cmp = useCompare()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const submit = (e: React.FormEvent) => { e.preventDefault(); setMobileOpen(false); nav(`/catalog?q=${encodeURIComponent(q)}`) }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Верхняя полоска */}
      <div className="border-b">
        <div className="container-narrow flex items-center gap-3 py-2">
          <button className="md:hidden rounded-xl border p-2" aria-label="Меню" onClick={()=>setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo />
          </Link>

          {/* Поиск (md+) */}
          <form onSubmit={submit} className="ml-auto hidden w-full max-w-xl items-center gap-2 md:flex">
            <div className="relative w-full">
              <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск по каталогу" className="pl-9" />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            </div>
            <ButtonOutline type="submit">Найти</ButtonOutline>
          </form>

          {/* Действия */}
          <div className="ml-2 hidden items-center gap-1 md:flex">
            <Link to="/favorites" className="rounded-xl border px-3 py-2 text-sm" aria-label="Избранное">
              <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" />{fav.ids.length}</span>
            </Link>
            <Link to="/compare" className="rounded-xl border px-3 py-2 text-sm" aria-label="Сравнение">
              <span className="inline-flex items-center gap-1"><Scale className="h-4 w-4" />{cmp.ids.length}</span>
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="rounded-xl border px-3 py-2 text-sm flex items-center gap-1"><Package className="h-4 w-4" />Заказы</Link>
                <Link to="/profile" className="rounded-xl border px-3 py-2" aria-label="Профиль"><User className="h-5 w-5" /></Link>
                <button onClick={()=>signOut()} className="rounded-xl border px-3 py-2" aria-label="Выйти"><LogOut className="h-5 w-5" /></button>
              </>
            ) : (
              <Link to="/sign-in" className="rounded-xl border px-3 py-2" aria-label="Войти"><LogIn className="h-5 w-5" /></Link>
            )}
            <Link to="/checkout" className="rounded-xl border bg-brand-600 px-3 py-2 text-white hover:bg-brand-700 transition" aria-label="Корзина">
              <span className="inline-flex items-center gap-2"><ShoppingBag className="h-5 w-5" /><span className="text-sm">{itemsCount}</span></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Нижняя нав-полоса */}
      <div className="border-b bg-white">
        <div className="container-narrow flex items-center gap-3 py-2">
          <div className="hidden md:block">
            <CatalogFlyout />
          </div>
          <nav className="ml-auto hidden items-center gap-6 text-sm md:flex">
            <Link to="/catalog" className="hover:underline">Каталог</Link>
            <Link to="/about" className="hover:underline">О нас</Link>
            <Link to="/contact" className="hover:underline">Контакты</Link>
          </nav>

          {/* Поиск на мобильных */}
          <form onSubmit={submit} className="ml-auto flex w-full items-center gap-2 md:hidden">
            <div className="relative w-full">
              <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск" className="pl-9" />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            </div>
          </form>
        </div>
      </div>

      {/* Мобильное меню */}
      <MobileMenu open={mobileOpen} onClose={()=>setMobileOpen(false)} />
    </header>
  )
}
