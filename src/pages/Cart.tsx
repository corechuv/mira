import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const nav = useNavigate()
  const cart = useCart()
  const items = cart.items || []

  const totals = useMemo(() => {
    const subtotal = (items || []).reduce((s: number, it: any) => {
      const qty = Number(it.qty || 0)
      const price = Number(it.price || 0)
      return s + qty * price
    }, 0)
    return { subtotal, shipping: 0, total: subtotal }
  }, [items])

  const setQty = (id: string, q: number) => {
    const qty = Math.max(1, Math.min(99, Number(q) || 1))
    cart.setQty?.(id, qty)
  }

  if (!items.length) {
    return (
      <div className="container py-6 md:py-10">
        <div className="panel p-6 text-slate-600">
          Корзина пуста. Перейдите в <Link to="/catalog" className="underline">каталог</Link>.
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10">
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">Корзина</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Список */}
        <div className="panel p-3 md:p-4">
          <ul className="divide-y">
            {items.map((it: any) => (
              <li key={it.id} className="flex items-center gap-3 py-3">
                <Link to={`/product/${encodeURIComponent(it.slug || it.id)}`} className="block h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                  <img src={it.image || it.img || '/icons/mira.svg'} alt={it.title} className="h-full w-full object-cover" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={`/product/${encodeURIComponent(it.slug || it.id)}`} className="line-clamp-2 font-medium hover:underline">
                    {it.title}
                  </Link>
                  <div className="mt-1 text-sm text-slate-600">{formatPrice(Number(it.price || 0))}</div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={Number(it.qty || 1)}
                    onChange={e => setQty(it.id, Number(e.target.value))}
                    className="input w-20 text-center"
                  />
                  <button className="chip" onClick={() => cart.remove?.(it.id)}>×</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between text-sm text-slate-600">
            <button className="btn-ghost" onClick={() => cart.clear?.()}>Очистить корзину</button>
            <Link to="/catalog" className="nav-link">Продолжить покупки</Link>
          </div>
        </div>

        {/* Сводка */}
        <aside className="panel p-4 h-max sticky top-[calc(var(--header-h,64px)+16px)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-slate-600">Товаров</span>
            <span className="font-medium">{items.length}</span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-slate-600">Сумма</span>
            <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-slate-600">Доставка</span>
            <span className="font-medium">Будет рассчитана</span>
          </div>
          <button className="btn-primary w-full" onClick={() => nav('/checkout')}>
            Перейти к оформлению
          </button>
        </aside>
      </div>
    </div>
  )
}
