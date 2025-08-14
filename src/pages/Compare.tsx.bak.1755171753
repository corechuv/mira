import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { useCompare } from '@/store/compare'
import { supabase } from '@/lib/supabase'
import { fetchProductsByIds, type ProductRow } from '@/lib/products'

function isUUID(v: string) {
  return /^[0-9a-fA-F-]{32,}$/.test(v || '')
}

export default function Compare() {
  const { ids = [], remove, clear } = useCompare() as { ids: string[]; remove: (id:string)=>void; clear: ()=>void }
  const [items, setItems] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const byIdKeys = ids.filter(isUUID)
        const bySlugKeys = ids.filter(x => !isUUID(x))

        const [byId, bySlugResp] = await Promise.all([
          fetchProductsByIds(byIdKeys),
          bySlugKeys.length
            ? supabase.from('products').select('*').in('slug', bySlugKeys)
            : Promise.resolve({ data: [] as any[] })
        ])

        const bySlug = ((bySlugResp as any).data || []) as ProductRow[]
        const all = [...byId, ...bySlug]

        // Соберём в исходном порядке ids (находим по id или slug)
        const ordered: ProductRow[] = ids.map(k => all.find(p => p.id === k || p.slug === k)!).filter(Boolean) as ProductRow[]
        if (alive) setItems(ordered)
      } catch (e) {
        console.warn('Compare.load error:', (e as any)?.message || e)
        if (alive) setItems([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [ids])

  if ((ids || []).length === 0) {
    return (
      <div className="container py-6">
        <div className="panel p-6 text-slate-600">
          Список сравнения пуст. Перейдите в <Link to="/catalog" className="underline">каталог</Link>.
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Сравнение</h1>
        <button className="btn-ghost" onClick={clear}>Очистить</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: ids.length || 4 }).map((_, i) => (
            <div key={i} className="card h-[320px] animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map(p => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button className="absolute right-2 top-2 chip" onClick={() => remove(p.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
