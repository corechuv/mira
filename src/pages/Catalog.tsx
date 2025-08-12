import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import Filters, { Filters as TFilters } from '@/components/Filters'
import { products } from '@/data/products'
import { useSearchParams } from 'react-router-dom'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [f, setF] = useState<TFilters>({ q: params.get('q') ?? undefined, category: params.get('category') ?? undefined })

  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [])
  const filtered = useMemo(() => {
    let list = products.slice()
    if (f.q) list = list.filter(p => p.title.toLowerCase().includes(f.q!.toLowerCase()))
    if (f.category) list = list.filter(p => p.category === f.category)
    if (f.brand) list = list.filter(p => p.brand === f.brand)
    if (f.priceMin) list = list.filter(p => p.price >= Number(f.priceMin))
    if (f.priceMax) list = list.filter(p => p.price <= Number(f.priceMax))
    if (f.sort === 'price-asc') list = list.sort((a,b)=> a.price - b.price)
    if (f.sort === 'price-desc') list = list.sort((a,b)=> b.price - a.price)
    if (f.sort === 'rating-desc') list = list.sort((a,b)=> b.rating - a.rating)
    return list
  }, [f])

  return (
    <div className="container-narrow mt-6">
      <h1 className="mb-4 text-2xl font-semibold">Каталог</h1>
      <Filters value={f} onChange={v => { setF(v); setParams(p => { if(v.q) p.set('q', v.q); else p.delete('q'); if(v.category) p.set('category', v.category); else p.delete('category'); return p }) }} allBrands={brands} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  )
}
