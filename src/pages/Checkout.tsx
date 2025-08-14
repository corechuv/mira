import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/store/cart'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'

type ShippingKind = 'standard' | 'express'
type PaymentKind = 'card' | 'cod'

export default function Checkout() {
  const cart = useCart()
  const items = cart.items || []
  const [shipping, setShipping] = useState<ShippingKind>('standard')
  const [payment, setPayment] = useState<PaymentKind>('card')
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [addr, setAddr] = useState({ line1: '', city: '', postal_code: '', country: 'DE' })
  const [placing, setPlacing] = useState(false)
  const [placedId, setPlacedId] = useState<string | null>(null)

  // текущий пользователь (email подставим по возможности)
  useEffect(() => {
    let alive = true
    supabase.auth.getUser().then(({ data }) => {
      const email = data?.user?.email || ''
      if (alive && email) setContact(c => ({ ...c, email }))
    })
    return () => { alive = false }
  }, [])

  const shippingCost = shipping === 'express' ? 5.99 : 2.99
  const subtotal = useMemo(() => (items || []).reduce((s: number, it: any) => {
    const qty = Number(it.qty || 0)
    const price = Number(it.price || 0)
    return s + qty * price
  }, 0), [items])
  const total = Number((subtotal + shippingCost).toFixed(2))

  async function place() {
    if (!items.length) return
    setPlacing(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const user_id = auth?.user?.id || null

      const payload = {
        items: items.map((it: any) => ({
          id: it.id, title: it.title, price: Number(it.price || 0), qty: Number(it.qty || 1), image: it.image || it.img || null, slug: it.slug || null
        })),
        contact,
        shipping: { kind: shipping, cost: shippingCost, address: addr },
        user_id
      }

      if (payment === 'card') {
        // Stripe Checkout
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('create-checkout-session failed')
        const json = await res.json()
        if (json?.url) {
          window.location.href = json.url
          return
        }
        // если по какой-то причине URL нет — попробуем сохранить заказ локально
      }

      // наложенный или фоллбэк
      const res2 = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res2.ok) throw new Error('place-order failed')
      const j2 = await res2.json()
      setPlacedId(j2?.id || null)
      cart.clear?.()
    } catch (e: any) {
      console.warn('checkout error:', e?.message || e)
      alert('Не удалось оформить заказ. Попробуйте позже.')
    } finally {
      setPlacing(false)
    }
  }

  if (!items.length && !placedId) {
    return (
      <div className="container py-6 md:py-10">
        <div className="panel p-6 text-slate-600">
          Корзина пуста. Перейдите в <Link to="/cart" className="underline">корзину</Link> или <Link className="underline" to="/catalog">каталог</Link>.
        </div>
      </div>
    )
  }

  if (placedId) {
    return (
      <div className="container py-6 md:py-10">
        <div className="panel p-6">
          <h1 className="mb-2 text-xl md:text-2xl font-semibold">Спасибо!</h1>
          <p className="text-slate-700">Заказ <b>{placedId}</b> сохранён. Мы отправим подтверждение на почту.</p>
          <div className="mt-4">
            <Link to="/catalog" className="btn-outline">Вернуться в каталог</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 md:py-10">
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">Оформление заказа</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        {/* Форма */}
        <div className="panel p-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Имя и фамилия</label>
              <input className="input" value={contact.name} onChange={e=>setContact(c=>({...c, name:e.target.value}))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input type="email" className="input" value={contact.email} onChange={e=>setContact(c=>({...c, email:e.target.value}))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Телефон</label>
              <input className="input" value={contact.phone} onChange={e=>setContact(c=>({...c, phone:e.target.value}))} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Адрес</label>
              <input className="input" value={addr.line1} onChange={e=>setAddr(a=>({...a, line1:e.target.value}))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Город</label>
              <input className="input" value={addr.city} onChange={e=>setAddr(a=>({...a, city:e.target.value}))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Индекс</label>
              <input className="input" value={addr.postal_code} onChange={e=>setAddr(a=>({...a, postal_code:e.target.value}))} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Страна</label>
              <input className="input" value={addr.country} onChange={e=>setAddr(a=>({...a, country:e.target.value}))} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Доставка</label>
              <select className="input" value={shipping} onChange={e=>setShipping(e.target.value as ShippingKind)}>
                <option value="standard">Стандарт — 2,99 €</option>
                <option value="express">Экспресс — 5,99 €</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Оплата</label>
              <select className="input" value={payment} onChange={e=>setPayment(e.target.value as PaymentKind)}>
                <option value="card">Картой (Stripe)</option>
                <option value="cod">При получении</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Нажимая «Оформить», вы соглашаетесь с нашими <Link to="/policy" className="underline">условиями</Link>.
          </div>

          <div>
            <button className="btn-primary" onClick={place} disabled={placing || !items.length}>
              {placing ? 'Оформляем…' : 'Оформить заказ'}
            </button>
          </div>
        </div>

        {/* Сводка */}
        <aside className="panel p-4 h-max sticky top-[calc(var(--header-h,64px)+16px)]">
          <div className="mb-3 text-sm text-slate-600">Товары ({items.length})</div>
          <ul className="mb-4 space-y-2">
            {items.map((it: any) => (
              <li key={it.id} className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                  <img src={it.image || it.img || '/icons/mira.svg'} alt={it.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm">{it.title}</div>
                  <div className="text-xs text-slate-600">{Number(it.qty||1)} × {formatPrice(Number(it.price||0))}</div>
                </div>
                <div className="text-sm font-medium">{formatPrice(Number(it.qty||1) * Number(it.price||0))}</div>
              </li>
            ))}
          </ul>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Сумма</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-600">Доставка</span>
            <span className="font-medium">{formatPrice(shippingCost)}</span>
          </div>
          <div className="mt-3 border-t pt-3 flex items-center justify-between">
            <span className="font-semibold">Итого</span>
            <span className="text-lg font-semibold">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
