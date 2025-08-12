import { Heart, Scale } from 'lucide-react'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'

export default function CardActions({ id }: { id: string }) {
  const fav = useFavorites()
  const cmp = useCompare()
  return (
    <div className="absolute right-2 top-2 z-10 flex gap-2">
      <button
        aria-label="Избранное" onClick={(e)=>{ e.preventDefault(); fav.toggle(id) }}
        className={`rounded-xl border bg-white/90 p-2 transition hover:bg-white ${fav.has(id)?'text-rose-600 border-rose-200':'text-slate-700'}`}>
        <Heart className="h-4 w-4" />
      </button>
      <button
        aria-label="Сравнить" onClick={(e)=>{ e.preventDefault(); cmp.toggle(id) }}
        className={`rounded-xl border bg-white/90 p-2 transition hover:bg-white ${cmp.has(id)?'text-brand-700 border-brand-200':'text-slate-700'}`}>
        <Scale className="h-4 w-4" />
      </button>
    </div>
  )
}
