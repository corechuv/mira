import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard(){
  const [stats, setStats] = useState<{orders:number; revenue:number; reviews:number; products:number}>({orders:0,revenue:0,reviews:0,products:0})
  useEffect(()=>{
    (async ()=>{
      const [{ count: oCount, data: orders }, { count: rCount }, { count: pCount }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head:false }).order('created_at',{ascending:false}).limit(10),
        supabase.from('reviews').select('*', { count: 'exact', head:true }),
        supabase.from('products').select('*', { count: 'exact', head:true })
      ])
      const revenue = (orders||[]).reduce((s:any,o:any)=>s+(o.amount||0),0)
      setStats({ orders: oCount||0, revenue, reviews: rCount||0, products: pCount||0 })
    })()
  },[])
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Дэшборд</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-4"><div className="text-xs text-slate-500">Заказы</div><div className="text-2xl font-bold">{stats.orders}</div></div>
        <div className="card p-4"><div className="text-xs text-slate-500">Выручка (посл.10)</div><div className="text-2xl font-bold">{stats.revenue.toFixed(2)} EUR</div></div>
        <div className="card p-4"><div className="text-xs text-slate-500">Отзывы</div><div className="text-2xl font-bold">{stats.reviews}</div></div>
        <div className="card p-4"><div className="text-xs text-slate-500">Товары</div><div className="text-2xl font-bold">{stats.products}</div></div>
      </div>
    </div>
  )
}
