import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useCart } from '@/store/cart'
import Logo from './Logo'
import CatalogMega from './CatalogMega'

export default function Header() {
  const nav = useNavigate()
  const cart = useCart()
  const [q, setQ] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const apply = () => {
      const h = headerRef.current?.offsetHeight || 64
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    apply()
    const ro = new ResizeObserver(apply)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', apply)
    return () => { window.removeEventListener('resize', apply); ro.disconnect() }
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setMobileOpen(false)
    nav(`/catalog?q=${encodeURIComponent(q)}`)
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="shrink-0"><Logo /></Link>

        <div className="hidden md:block">
          <button className="btn-outline"
            onMouseEnter={() => setMegaOpen(true)}
            onFocus={() => setMegaOpen(true)}
            onClick={() => setMegaOpen(v => !v)}>
            Каталог
          </button>
        </div>

        <form onSubmit={submit} className="hidden flex-1 items-center md:flex">
          <input className="input w-full" placeholder="Поиск по каталогу…"
                 value={q} onChange={e=>setQ(e.target.value)} />
        </form>

        <div className="flex items-center gap-2">
          <Link to="/favorites" className="btn-ghost">Избранное</Link>
          <Link to="/compare" className="btn-ghost">Сравнить</Link>
          <Link to="/cart" className="btn-primary">Корзина ({cart.count})</Link>
          <button className="md:hidden btn-ghost" onClick={()=>setMobileOpen(true)} aria-label="Меню">Меню</button>
        </div>
      </div>

      <div className="hidden md:block">
        <CatalogMega open={megaOpen} setOpen={setMegaOpen} />
      </div>
    </header>
  )
}
