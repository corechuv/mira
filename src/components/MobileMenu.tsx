import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/store/cart'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'

const CATS = [
  { id: 'skincare', label: 'Уход за кожей' },
  { id: 'makeup',   label: 'Макияж' },
  { id: 'haircare', label: 'Волосы' },
]

export default function MobileMenu({ open, onClose, topOffset = 0 }: { open: boolean; onClose: ()=>void; topOffset?: number }) {
  const itemsCount = useCart(s => s.items).reduce((s,i)=>s+i.qty, 0)
  const favCount = useFavorites(s=>s.ids.length)
  const cmpCount = useCompare(s=>s.ids.length)
  const nav = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.documentElement.classList.toggle('no-scroll', open)
    if (open) window.addEventListener('keydown', onKey)
    return () => { document.documentElement.classList.remove('no-scroll'); window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  const goto = (path: string) => { onClose(); nav(path) }

  const styleBlock = { top: `var(--header-h, ${topOffset}px)`, height: `calc(100svh - var(--header-h, ${topOffset}px))` } as React.CSSProperties

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[95] bg-black/40"
            style={styleBlock}
            onClick={onClose}
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-[100] w-[86%] max-w-[360px] bg-white p-4 shadow-2xl overflow-y-auto overscroll-contain"
            style={styleBlock}
            initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} exit={{x:-20, opacity:0}}
            transition={{ type:'spring', stiffness:300, damping:30 }}
          >
            <nav className="space-y-2">
              <button onClick={()=>goto('/catalog')} className="w-full rounded-lg px-2 py-2 text-left text-[15px] hover:bg-slate-50">Каталог</button>
              <button onClick={()=>goto('/about')} className="w-full rounded-lg px-2 py-2 text-left text-[15px] hover:bg-slate-50">О нас</button>
              <button onClick={()=>goto('/contact')} className="w-full rounded-lg px-2 py-2 text-left text-[15px] hover:bg-slate-50">Контакты</button>
            </nav>

            <div className="mt-4 text-xs uppercase tracking-wide text-slate-500">Категории</div>
            <div className="mt-1 grid grid-cols-1">
              {CATS.map(({id,label})=>(
                <button key={id} onClick={()=>goto(`/catalog?category=${id}`)} className="rounded-lg px-2 py-2 text-left text-[15px] hover:bg-slate-50">
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 text-center text-sm">
              <button onClick={()=>goto('/favorites')} className="rounded-lg px-2 py-2 hover:bg-slate-50">Избранное <div className="text-xs text-slate-500">{favCount}</div></button>
              <button onClick={()=>goto('/compare')} className="rounded-lg px-2 py-2 hover:bg-slate-50">Сравнение <div className="text-xs text-slate-500">{cmpCount}</div></button>
              <button onClick={()=>goto('/checkout')} className="rounded-lg px-2 py-2 hover:bg-slate-50">Корзина <div className="text-xs text-slate-500">{itemsCount}</div></button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
