import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Brush, Scissors, ChevronDown } from 'lucide-react'

const CATS = [
  { id: 'skincare', label: 'Уход за кожей', icon: Sparkles, desc: 'Кремы, сыворотки, SPF' },
  { id: 'makeup',  label: 'Макияж',        icon: Brush,    desc: 'Помады, тушь, палетки' },
  { id: 'haircare',label: 'Волосы',        icon: Scissors, desc: 'Шампуни, бальзамы, маски' },
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

  const go = (cat: string) => {
    setOpen(false)
    nav(`/catalog?category=${cat}`)
  }

  return (
    <div className="relative" ref={ref} onMouseLeave={()=>setOpen(false)}>
      <button
        onClick={()=>setOpen(v=>!v)}
        onMouseEnter={()=>setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:shadow transition bg-white"
        aria-haspopup="menu" aria-expanded={open}
      >
        <span>Каталог</span>
        <ChevronDown className={`h-4 w-4 transition ${open?'rotate-180':''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[680px] rounded-2xl border bg-white p-4 shadow-xl animate-in fade-in-0 zoom-in-95"
          onMouseEnter={()=>setOpen(true)}
        >
          <div className="grid grid-cols-3 gap-3">
            {CATS.map(({id,label,icon:Icon,desc})=>(
              <button
                key={id}
                onClick={()=>go(id)}
                className="group flex items-start gap-3 rounded-xl border p-3 text-left hover:shadow-md transition bg-white"
              >
                <div className="rounded-xl border bg-slate-50 p-2 group-hover:border-brand-300">
                  <Icon className="h-5 w-5 text-brand-700" />
                </div>
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-slate-500">{desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border p-3 text-sm text-slate-600">
            Популярно: <Link to="/catalog?q=spf" className="text-brand-700 hover:underline">SPF</Link>,{' '}
            <Link to="/catalog?q=hyalur" className="text-brand-700 hover:underline">гиалуроновая</Link>,{' '}
            <Link to="/catalog?q=volume" className="text-brand-700 hover:underline">объём для волос</Link>
          </div>
        </div>
      )}
    </div>
  )
}
