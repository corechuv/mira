import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'
import { formatPrice } from '@/lib/utils'

type Order = { id: string; amount: number; currency: string; created_at: string; status: string; items: any[] }

export default function Orders(){
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (!ignore) {
        if (error) console.error(error)
        setOrders((data as any[]) ?? [])
        setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [])

  if (loading) return <div className="container-narrow mt-6">Загрузка…</div>
  return (
    <div className="container-narrow mt-6">
      <h1 className="text-2xl font-semibold mb-4">Мои заказы</h1>
      {orders.length === 0 ? <p className="text-slate-600">Пока нет заказов.</p> : (
        <ul className="grid gap-3">
          {orders.map(o => (
            <li key={o.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Заказ #{o.id.slice(0,8)}</div>
                <div className="text-sm text-slate-600">{new Date(o.created_at).toLocaleString('ru-RU')}</div>
              </div>
              <div className="mt-2 text-sm">Статус: <span className="badge">{o.status}</span></div>
              <div className="mt-2 font-semibold">Сумма: {formatPrice(o.amount)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
