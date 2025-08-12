import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { X, Sparkles, Brush, Scissors, Heart, Scale, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'

const CATS = [
  { id: 'skincare', label: 'Уход за кожей', icon: Sparkles },
  { id: 'makeup',  label: 'Макияж',        icon: Brush    },
  { id: 'haircare',label: 'Волосы',        icon: Scissors },
]

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const itemsCount = useCart(s => s.items).reduce((s,i)=>s+i.qty, 0)
  const favCount = useFavorites(s=>s.ids.length)
  const cmpCount = useCompare(s=>s.ids.length)
  const nav = useNavigate()

  const goto = (path: string) => { onClose(); nav(path) }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-[360px] bg-white p-4 shadow-2xl"
            initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} exit={{x:-20, opacity:0}}
            transition={{ type:'spring', stiffness:300, damping:30 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold">Навигация</div>
              <button onClick={onClose} aria-label="Закрыть" className="rounded-lg border p-2"><X className="h-5 w-5" /></button>
            </div>

            <nav className="space-y-1">
              <button onClick={()=>goto('/catalog')} className="w-full rounded-xl border p-3 text-left">Каталог</button>
              <button onClick={()=>goto('/about')} className="w-full rounded-xl border p-3 text-left">О нас</button>
              <button onClick={()=>goto('/contact')} className="w-full rounded-xl border p-3 text-left">Контакты</button>
            </nav>

            <div className="mt-4 text-xs uppercase text-slate-500">Категории</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CATS.map(({id,label,icon:Icon})=>(
                <button key={id} onClick={()=>goto(`/catalog?category=${id}`)} className="flex items-center gap-2 rounded-xl border p-3">
                  <Icon className="h-4 w-4 text-brand-700" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
              <button onClick={()=>goto('/favorites')} className="rounded-xl border p-3">
                <Heart className="mx-auto h-5 w-5" /><div className="mt-1">{favCount}</div>
              </button>
              <button onClick={()=>goto('/compare')} className="rounded-xl border p-3">
                <Scale className="mx-auto h-5 w-5" /><div className="mt-1">{cmpCount}</div>
              </button>
              <button onClick={()=>goto('/checkout')} className="rounded-xl border p-3">
                <ShoppingBag className="mx-auto h-5 w-5" /><div className="mt-1">{itemsCount}</div>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
