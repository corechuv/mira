import { useEffect, useState } from 'react'
import { useCart, cartTotal } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/store/auth'
import { useLocation, useNavigate } from 'react-router-dom'

const Schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(5),
  shipping: z.enum(['standard','express']),
  payment: z.enum(['cod','card']),
  coupon: z.string().optional().or(z.literal(''))
})
type Form = z.infer<typeof Schema>
const COUPONS: Record<string, number> = { 'MIRA10': 0.10 }

export default function Checkout() {
  const cart = useCart()
  const totalItems = cartTotal(cart.items)
  const [placedId, setPlacedId] = useState<string | null>(null)
  const { user } = useAuth()
  const loc = useLocation()
  const nav = useNavigate()

  // Fallback без Stripe CLI: если вернулись с success=1 — показываем успех и чистим корзину
  useEffect(() => {
    const p = new URLSearchParams(loc.search)
    if (p.get('success') === '1') {
      cart.clear()
      setPlacedId(`PAID-${Math.random().toString(36).slice(2,8).toUpperCase()}`)
      toast.success('Оплата Stripe прошла успешно')
      nav('/checkout', { replace: true })
    } else if (p.get('canceled') === '1') {
      toast.message('Оплата отменена')
      nav('/checkout', { replace: true })
    }
  }, [loc.search])

  const { register, handleSubmit, formState:{errors, isSubmitting}, watch } = useForm<Form>({
    resolver: zodResolver(Schema),
    defaultValues: { shipping:'standard', payment:'cod' }
  })

  const shipping = watch('shipping') || 'standard'
  const payment = watch('payment') || 'cod'
  const couponCode = (watch('coupon') || '').trim().toUpperCase()
  const shippingCost = shipping === 'express' ? 5.99 : 2.99
      const id = `MIRA-${Math.random().toString(36).slice(2,8).toUpperCase()}`
      setPlacedId(id); cart.clear(); toast.warning('Заказ сохранён локально (без письма)')
    }
  }

  if (cart.items.length === 0 && !placedId) {
    return (<div className="container-narrow mt-6">
      <h1 className="mb-2 text-2xl font-semibold">Оформление заказа</h1>
      <p className="text-slate-600">Корзина пуста. Перейдите в каталог.</p>
    </div>)
  }

  if (placedId) {
    return (<div className="container-narrow mt-6 text-center">
      <h1 className="text-2xl font-semibold">Спасибо за заказ!</h1>
      <p className="mt-2 text-slate-600">Номер заказа: <strong>{placedId}</strong></p>
      <p className="mt-2">Мы отправили подтверждение на ваш email (если указан).</p>
    </div>)
  }

  return (
    <div className="container-narrow mt-6 grid gap-8 md:grid-cols-[1fr_420px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h1 className="text-2xl font-semibold">Оформление заказа</h1>
        <input className="input" placeholder="Имя и фамилия" {...register('name')} />{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        <input className="input" placeholder="Телефон" {...register('phone')} />{errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        <input className="input" placeholder="Email (для письма)" {...register('email')} />{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        <textarea className="input min-h-[120px]" placeholder="Адрес доставки" {...register('address')} />{errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="card p-3">
            <div className="font-medium mb-2">Доставка</div>
            <label className="flex items-center gap-2"><input type="radio" value="standard" {...register('shipping')} />Стандартная (299 €)</label>
            <label className="mt-1 flex items-center gap-2"><input type="radio" value="express" {...register('shipping')} />Экспресс (599 €)</label>
          </div>
          <div className="card p-3">
            <div className="font-medium mb-2">Оплата</div>
            <label className="flex items-center gap-2"><input type="radio" value="cod" {...register('payment')} />При получении</label>
            <label className="mt-1 flex items-center gap-2"><input type="radio" value="card" {...register('payment')} />Картой онлайн (Stripe)</label>
          </div>
        </div>

        <div className="grid gap-2 md:max-w-sm">
          <input className="input" placeholder="Купон (например, MIRA10)" {...register('coupon')} />
          {discount > 0 && <div className="text-sm text-emerald-700">Купон применён: −{formatPrice(discount)}</div>}
        </div>

        <button className="btn btn-primary w-full md:w-auto" disabled={isSubmitting}>{isSubmitting ? 'Оформляем…' : 'Подтвердить заказ'}</button>
      </form>

      <aside className="card p-4 h-max">
        <h2 className="mb-4 text-lg font-semibold">Ваш заказ</h2>
        <ul className="space-y-3">
          {cart.items.map(it => (
            <li key={it.product.id} className="flex items-center gap-3">
              <img src={it.product.images[0]} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="text-sm">{it.product.title}</div>
                <div className="text-xs text-slate-500">× {it.qty}</div>
              </div>
              <div className="text-sm font-medium">{formatPrice(it.product.price * it.qty)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Товары</span><span>{formatPrice(totalItems)}</span></div>
          <div className="flex justify-between"><span>Скидка</span><span>−{formatPrice(discount)}</span></div>
          <div className="flex justify-between"><span>Доставка</span><span>{formatPrice(totalItems > 0 ? shippingCost : 0)}</span></div>
        </div>
        <div className="mt-3 border-t pt-3 text-right font-semibold">Итого: {formatPrice(Math.max(0, totalItems - discount) + (totalItems > 0 ? shippingCost : 0))}</div>
      </aside>
    </div>
  )
}
