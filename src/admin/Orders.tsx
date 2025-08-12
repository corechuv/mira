import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  user_id: string | null
  items: any[]
  amount: number
  currency: string
  contact: any
  shipping: any
  status: string
  ext_id?: string | null
  created_at: string
}

export default function OrdersAdmin(){
  const [list, setList] = useState<Order[]>([])
  const [status, setStatus] = useState<string>('all')

  async function load(){
    let q = supabase.from('orders').select('*').order('created_at', { ascending:false }).limit(200)
    if (status !== 'all') q = q.eq('status', status)
    const { data } = await q
    setList((data||[]) as any)
  }
  useEffect(()=>{ load() },[status])

  async function updateStatus(id:string, status:string){
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) alert(error.message); else load()
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Заказы / Оплаты</h1>
      <div className="mb-3 flex gap-2">
        {['all','new','paid','shipped','cancelled','refunded'].map(x=>(
          <button key={x} className={'btn-ghost '+(status===x?'bg-black/5':'')} onClick={()=>setStatus(x)}>{x}</button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map(o=>(
          <div key={o.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{o.id}</div>
                <div className="text-slate-500">{new Date(o.created_at).toLocaleString()}</div>
                <div className="mt-1">{o.amount.toFixed(2)} {o.currency}</div>
                <div className="mt-1 text-slate-600">Товаров: {o.items?.reduce((s:any,i:any)=>s+(i.qty||0),0)}</div>
                {o.ext_id && <a className="mt-1 inline-block text-xs text-brand-700 hover:underline" href={"https://dashboard.stripe.com/payments?search=" + encodeURIComponent(o.ext_id)} target="_blank" rel="noreferrer">Открыть в Stripe</a>}
              </div>
              <div className="text-sm">
                <div className="text-slate-500">Статус: <span className="font-medium">{o.status}</span></div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['new','paid','shipped','cancelled','refunded'].map(s=>(
                    <button key={s} className="btn-ghost" onClick={()=>updateStatus(o.id, s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {list.length===0 && <div className="text-sm text-slate-500">Нет заказов</div>}
      </div>
    </div>
  )
}
