import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { fetchProducts, type ProductRow } from '@/lib/products'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ProductRow[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const { items, total } = await fetchProducts({ sort: 'new', limit: 12, activeOnly: true })
        if (!alive) return
        setItems(Array.isArray(items) ? items : [])
        // total нам тут только информативно — в UI не используем
      } catch (e: any) {
        if (!alive) return
        console.warn('Home.fetchProducts error:', e?.message || e)
        setErr('Не удалось загрузить товары')
        setItems([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div className="container py-6 md:py-10">
      {/* Хиро/баннер — минималистично */}
      <section className="mb-8 rounded-2xl bg-black text-white p-6 md:p-10">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl md:text-4xl font-semibold">Mira — косметика с доставкой по Германии</h1>
          <p className="text-white/80">Новые поступления каждую неделю. Оплата Stripe. Возврат — 14 дней.</p>
          <Link to="/catalog" className="btn mt-3 inline-block bg-white text-black hover:opacity-90">
            Перейти в каталог
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold">Новые поступления</h2>
          <Link to="/catalog" className="text-sm text-slate-600 hover:underline">Смотреть всё</Link>
        </div>

        {/* Скелетоны при загрузке */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card h-[320px] animate-pulse bg-slate-100" />
            ))}
          </div>
        )}

        {/* Ошибка */}
        {!loading && err && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{err}</div>
        )}

        {/* Пусто */}
        {!loading && !err && items.length === 0 && (
          <div className="text-slate-500">Товаров пока нет. Загляните позже или откройте <Link className="underline" to="/catalog">каталог</Link>.</div>
        )}

        {/* Товары */}
        {!loading && !err && items.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
