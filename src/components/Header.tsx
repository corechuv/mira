import { ShoppingBag, User, Menu, Search, LogIn, LogOut, Heart, Scale } from 'lucide-react'
import Logo from './Logo'
import { Input } from './ui/input'
import { useCart } from '@/store/cart'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/store/auth'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'
import CatalogMega from './CatalogMega'
import MobileMenu from './MobileMenu'

export default function Header() {
  const itemsCount = useCart(s => s.items).reduce((s, i) => s + i.qty, 0)
  const nav = useNavigate()
  const { user, signOut } = useAuth()
  const favCount = useFavorites(s=>s.ids.length)
  const cmpCount = useCompare(s=>s.ids.length)
  const [q, setQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const h = headerRef.current?.getBoundingClientRect().height || 64
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    })
    if (headerRef.current) ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  const submit = (e: React.FormEvent) => { e.preventDefault(); setMobileOpen(false); nav(\`/catalog?q=\${encodeURIComponent(q)}\`) }

  const Actions = useMemo(() => (
    <div className="ml-2 hidden items-center gap-5 md:flex text-slate-800">
      <Link to="/favorites" className="inline-flex items-center gap-1 hover:opacity-80"><Heart className="h-5 w-5" />{favCount>0 && <span className="text-xs text-slate-500">{favCount}</span>}</Link>
      <Link to="/compare" className="inline-flex items-center gap-1 hover:opacity-80"><Scale className="h-5 w-5" />{cmpCount>0 && <span className="text-xs text-slate-500">{cmpCount}</span>}</Link>
      {user ? (
        <>
          <Link to="/profile" className="inline-flex items-center hover:opacity-80" aria-label="Профиль"><User className="h-5 w-5" /></Link>
          <button onClick={()=>signOut()} className="inline-flex items-center hover:opacity-80" aria-label="Выйти"><LogOut className="h-5 w-5" /></button>
        </>
      ) : (
        <Link to="/sign-in" className="inline-flex items-center hover:opacity-80" aria-label="Войти"><LogIn className="h-5 w-5" /></Link>
      )}
      <Link to="/checkout" className="inline-flex items-center hover:opacity-80" aria-label="Корзина">
        <ShoppingBag className="h-5 w-5" />{itemsCount>0 && <span className="ml-1 text-xs text-slate-500">{itemsCount}</span>}
      </Link>
    </div>
  ), [favCount, cmpCount, itemsCount, user])

  return (
    <header ref={headerRef} className="safe-top sticky top-0 z-50 bg-white/85 backdrop-blur">
      <div className="container-narrow flex items-center gap-4 py-2">
        <button className="md:hidden rounded-pill p-2 text-slate-700 hover:bg-black/5" aria-label="Меню" onClick={()=>setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 shrink-0"><Logo /></Link>

        <nav className="ml-4 hidden items-center gap-6 text-sm md:flex">
          <CatalogMega />
        </nav>

        <form onSubmit={submit} className="ml-auto flex w-full max-w-xl items-center gap-2">
          <div className="relative w-full">
            <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск" className="pl-9" />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
          </div>
        </form>

        {Actions}
      </div>

      <MobileMenu open={mobileOpen} onClose={()=>setMobileOpen(false)} topOffset={0} />
    </header>
  )
}
