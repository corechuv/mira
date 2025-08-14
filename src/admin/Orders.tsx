import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toCSV } from '@/lib/csv'

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
  const [q, setQ] = useState('') // id/email
  const [from, setFrom] = useState(''); const [to, setTo] = useState('')

  async function load(){
    let qy = supabase.from('orders').select('*').order('created_at', { ascending:false }).limit(500)
    if (status !== 'all') qy = qy.eq('status', status)
    if (q) qy = qy.or(`id.ilike.%${q}%,contact->>email.ilike.%${q}%`)
    if (from) qy = qy.gte('created_at', from)
    if (to) qy = qy.lte('created_at', to+' 23:59:59')
    const { data } = await qy
    setList((data||[]) as any)
  }
  useEffect(()=>{ load() },[status, q, from, to])

  async function updateStatus(id:string, status:string){
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) alert(error.message); else load()
  }
  function exportCSV(){
    const rows = list.map(o=>({
      id:o.id, created_at:o.created_at, amount:o.amount, currency:o.currency, status:o.status,
      email: o.contact?.email||'', name:o.contact?.name||'',
      items: (o.items||[]).map((i:any)=>`${i.title}×${i.qty}`).join(' | '),
      ext_id: o.ext_id||''
    }))
    const csv = toCSV(rows); const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='orders.csv'; a.click()
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Заказы / Оплаты</h1>

      <div className="card grid gap-3 p-4 md:grid-cols-5">
        <select className="field" value={status} onChange={e=>setStatus(e.target.value)}>
          {['all','new','paid','shipped','cancelled','refunded'].map(x=> <option key={x} value={x}>{x}</option>)}
        </select>
        <input className="field" placeholder="Поиск по ID или email" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="field" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className="field" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <button className="btn-ghost" onClick={exportCSV}>Экспорт CSV</button>
      </div>

      <div className="mt-4 space-y-3">
        {list.map(o=>(
          <div key={o.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{o.id}</div>
                <div className="text-slate-500">{new Date(o.created_at).toLocaleString()}</div>
                <div className="mt-1">{o.amount.toFixed(2)} {o.currency}</div>
                <div className="mt-1 text-slate-600">Товаров: {o.items?.reduce((s:any,i:any)=>s+(i.qty||0),0)}</div>
                <div className="mt-1 text-slate-600">{o.contact?.name} · {o.contact?.email}</div>
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
        {list.length===0 && <div className="text-sm text-slate-500">Заказов нет</div>}
      </div>
    </div>
  )
}
