import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { fetchProductByParam, fetchRelated, type ProductRow } from '@/lib/products'
import { useCart } from '@/store/cart'
import Stars from '@/components/Stars'
import ProductCard from '@/components/ProductCard'
import { formatPrice } from '@/lib/utils'

export default function Product() {
  const params = useParams()
  const rawParam = decodeURIComponent((params.slug as string) || (params.id as string) || '')
  const location = useLocation() as any
  const stateProduct: ProductRow | null = location?.state?.product || null

  const [loading, setLoading] = useState(true)
  const [p, setP] = useState<ProductRow | null>(null)
  const [rel, setRel] = useState<ProductRow[]>([])
  const [qty, setQty] = useState(1)
  const cart = useCart()

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        // 0) если товар пришёл из state — используем сразу
        if (stateProduct) {
          setP(stateProduct)
          setRel(await fetchRelated(stateProduct.category_id || null, stateProduct.id))
          return
        }
        // 1) универсальный поиск
        const prod = await fetchProductByParam(rawParam)
        if (!prod) console.warn('[Product] not found by param:', rawParam)
        setP(prod)
        if (prod) setRel(await fetchRelated(prod.category_id || null, prod.id))
      } finally {
        setLoading(false)
      }
    })()
  }, [rawParam, stateProduct?.id])

  const img = useMemo(() => {
    const imgs = (p?.images && Array.isArray(p.images)) ? p.images : []
    return imgs[0] || 'https://placehold.co/1200x1200/png?text=Mira'
  }, [p?.images])

  if (loading) return <div className="container-narrow py-10 text-slate-500">Загрузка…</div>
  if (!p) return <div className="container-narrow py-10 text-slate-500">Товар не найден.</div>

  const addToCart = () => {
    cart.add({
      id: p.id, slug: p.slug, title: p.title,
      price: Number(p.price) || 0, image: img, qty
    })
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white">
          <img src={img} alt={p.title} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">{p.title}</h1>
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold">{formatPrice(p.price)}</div>
            <Stars value={4.6} />
          </div>

          {p.short && <p className="text-slate-600">{p.short}</p>}

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Количество</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)||1))}
              className="input w-24 text-center"
            />
            <button className="btn" onClick={addToCart}>В корзину</button>
          </div>
        </div>
      </div>

      {rel.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Похожие товары</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {rel.map(r => <ProductCard key={r.id} product={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
