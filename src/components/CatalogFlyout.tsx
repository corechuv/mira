import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CATS = [
  { id: 'skincare', label: 'Уход за кожей' },
  { id: 'makeup',   label: 'Макияж' },
  { id: 'haircare', label: 'Волосы' },
]

export default function CatalogFlyout() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const nav = useNavigate()

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const go = (cat: string) => { setOpen(false); nav(`/catalog?category=${cat}`) }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-brand-700"
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu" aria-expanded={open}
      >
        Каталог
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+10px)] z-[80] w-[640px] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5"
          onMouseEnter={() => setOpen(true)}
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Категории</div>
              <ul className="space-y-1">
                {CATS.map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => go(c.id)}
                      className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Быстрые ссылки</div>
              <ul className="space-y-1">
                <li><Link className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50" to="/catalog?q=new">Новинки</Link></li>
                <li><Link className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50" to="/catalog?sort=popular">Бестселлеры</Link></li>
                <li><Link className="block rounded-lg px-2 py-2 text-sm hover:bg-slate-50" to="/catalog?discount=1">Скидки</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
