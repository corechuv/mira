import { useState, useMemo } from 'react'
import { useCart } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

type ShippingType = 'standard' | 'express'
type PaymentType = 'card' | 'cod'

const COUPONS: Record<string, number> = { MIRA10: 0.1 }

export default function Checkout() {
  const { user } = useAuth()
  const items = useCart(s => s.items)
  const clear = useCart(s => s.clear)

  const [shipping, setShipping] = useState<ShippingType>('standard')
  const [payment, setPayment] = useState<PaymentType>('card')
  const [coupon, setCoupon] = useState('')
  const [contact, setContact] = useState({ name: '', email: user?.email || '', phone: '' })
  const [address, setAddress] = useState({ line1: '', city: '', zip: '' })
  const [placedId, setPlacedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  )
  const shippingCost = shipping === 'express' ? 5.99 : 2.99
  const discount = useMemo(() => {
    const code = coupon.trim().toUpperCase()
    const rate = COUPONS[code] || 0
    return Math.round((totalItems * rate) * 100) / 100
  }, [coupon, totalItems])

  const total = Math.max(0, Math.round(((totalItems + shippingCost) - discount) * 100) / 100)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) return toast.error('Корзина пуста')
    if (!contact.email) return toast.error('Укажите e-mail')

    setLoading(true)
    try {
      const payload = {
        items: items.map(i => ({ title: i.title, price: i.price, qty: i.qty })),
        contact: { ...contact, address },
        shipping: { type: shipping, cost: shippingCost },
        user_id: user?.id || null
      }

      if (payment === 'card') {
        const r = await fetch('/api/create-checkout-session', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || 'Stripe error')
        if (data?.url) {
          window.location.href = data.url
          return
        }
        throw new Error('Session URL not found')
      } else {
        const r = await fetch('/api/place-order', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, amount: total })
        })
        const data = await r.json()
        if (!r.ok) throw new Error(data?.error || 'Order error')
        setPlacedId(data.id || 'MIRA-' + Math.random().toString(36).slice(2,8).toUpperCase())
        clear()
        toast.success('Bestellung aufgegeben')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Fehler beim Bestellen')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !placedId) {
    return <div className="container-narrow mt-10 text-center text-slate-700">Корзина пуста</div>
  }

  if (placedId) {
    return (
      <div className="container-narrow mt-10 text-center">
        <h1 className="text-2xl font-semibold">Спасибо!</h1>
        <p className="mt-2 text-slate-700">Ваш заказ <b>{placedId}</b> принят.</p>
      </div>
    )
  }

  return (
    <div className="container-narrow mt-6">
      <h1 className="text-2xl font-semibold">Оформление заказа</h1>

      <form onSubmit={onSubmit} className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Контакты */}
        <section className="md:col-span-2 rounded-2xl border p-4">
          <h2 className="mb-3 text-lg font-medium">Контакты</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={contact.name} onChange={e=>setContact({...contact, name:e.target.value})} placeholder="Имя" />
            <Input value={contact.email} onChange={e=>setContact({...contact, email:e.target.value})} placeholder="E-Mail" type="email" />
            <Input value={contact.phone} onChange={e=>setContact({...contact, phone:e.target.value})} placeholder="Телефон" />
            <Input value={address.line1} onChange={e=>setAddress({...address, line1:e.target.value})} placeholder="Адрес" />
            <Input value={address.city} onChange={e=>setAddress({...address, city:e.target.value})} placeholder="Город" />
            <Input value={address.zip} onChange={e=>setAddress({...address, zip:e.target.value})} placeholder="PLZ" />
          </div>

          <h2 className="mt-6 mb-2 text-lg font-medium">Доставка</h2>
          <div className="flex flex-wrap gap-3">
            <label className={`btn btn-outline ${shipping==='standard'?'border-brand-300 text-brand-700':''}`}>
              <input type="radio" className="sr-only" checked={shipping==='standard'} onChange={()=>setShipping('standard')} /> Standard — {formatPrice(2.99)}
            </label>
            <label className={`btn btn-outline ${shipping==='express'?'border-brand-300 text-brand-700':''}`}>
              <input type="radio" className="sr-only" checked={shipping==='express'} onChange={()=>setShipping('express')} /> Express — {formatPrice(5.99)}
            </label>
          </div>

          <h2 className="mt-6 mb-2 text-lg font-medium">Оплата</h2>
          <div className="flex flex-wrap gap-3">
            <label className={`btn btn-outline ${payment==='card'?'border-brand-300 text-brand-700':''}`}>
              <input type="radio" className="sr-only" checked={payment==='card'} onChange={()=>setPayment('card')} /> Karte (Stripe)
            </label>
            <label className={`btn btn-outline ${payment==='cod'?'border-brand-300 text-brand-700':''}`}>
              <input type="radio" className="sr-only" checked={payment==='cod'} onChange={()=>setPayment('cod')} /> Zahlung bei Lieferung
            </label>
          </div>
        </section>

        {/* Сводка */}
        <aside className="rounded-2xl border p-4">
          <h2 className="mb-3 text-lg font-medium">Сводка</h2>
          <ul className="space-y-2 text-sm">
            {items.map(i=>(
              <li key={i.id} className="flex justify-between">
                <span className="line-clamp-1">{i.title} × {i.qty}</span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
            <li className="flex justify-between pt-2 border-t">
              <span>Доставка ({shipping==='express'?'Express':'Standard'})</span>
              <span>{formatPrice(shippingCost)}</span>
            </li>
            <li className="flex justify-between">
              <span>Скидка</span>
              <span>-{formatPrice(discount)}</span>
            </li>
            <li className="flex justify-between font-semibold pt-2 border-t">
              <span>Итого</span>
              <span>{formatPrice(total)}</span>
            </li>
          </ul>

          <div className="mt-4 flex gap-2">
            <Input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Купон (например, MIRA10)" />
            <button type="button" className="btn btn-outline" onClick={()=>setCoupon(coupon.trim().toUpperCase())}>ОК</button>
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? 'Обработка…' : payment==='card' ? 'Оплатить' : 'Оформить'}
          </Button>
          <p className="mt-2 text-xs text-slate-500">Alle Preise inkl. MwSt.</p>
        </aside>
      </form>
    </div>
  )
}
