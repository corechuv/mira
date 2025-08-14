import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { fetchCategories, type CatNode } from '@/lib/categories'
import { fetchProducts, type ProductRow } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Filters from '@/components/Filters'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('cat') || ''
  const sort = (params.get('sort') as 'new'|'price-asc'|'price-desc') || 'new'
  const page = Math.max(1, Number(params.get('page') || '1'))

  const [cats, setCats] = useState<CatNode[]>([])
  const [items, setItems] = useState<ProductRow[]>([])
  const [total, setTotal] = useState(0)
  const pageSize = 24
  const offset = (page - 1) * pageSize

  useEffect(() => { (async () => setCats(await fetchCategories()))() }, [])
  useEffect(() => {
    (async () => {
      const { items, total } = await fetchProducts({ q, catId: cat || undefined, sort, offset, limit: pageSize })
      setItems(items); setTotal(total)
    })()
  }, [q, cat, sort, page])

  const pages = Math.max(1, Math.ceil(total / pageSize))
  const set = (patch: Record<string,string>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k,v]) => v ? next.set(k,v) : next.delete(k))
    if (patch.page === undefined) next.delete('page')
    setParams(next, { replace: true })
  }

  return (
    <div className="container-narrow py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xl font-semibold">Каталог</div>
        <div className="flex gap-2">
          <select className="field h-9" value={sort} onChange={e => set({ sort: e.target.value, page: '1' })}>
            <option value="new">Сначала новые</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
          </select>
          <input className="field h-9" placeholder="Поиск…" value={q} onChange={e => set({ q: e.target.value, page: '1' })} />
        </div>
      </div>

      <Filters categories={cats} activeSlug={cat} onPick={(slug) => set({ cat: slug || '', page: '1' })} />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(p => <ProductCard key={p.id} product={p as any} />)}
      </div>

      {items.length === 0 && (
        <div className="mt-10 rounded-xl border border-black/10 p-6 text-center text-slate-500">
          Ничего не найдено. Измени параметры фильтра.
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2">
        <button className="btn-ghost" disabled={page<=1} onClick={()=>set({ page: String(page-1) })}>Назад</button>
        <div className="px-2 text-sm">Стр. {page}/{pages}</div>
        <button className="btn-ghost" disabled={page>=pages} onClick={()=>set({ page: String(page+1) })}>Вперёд</button>
      </div>

      <div className="mt-6 text-center text-sm text-slate-500">
        Всего товаров: {total}
      </div>
    </div>
  )
}
