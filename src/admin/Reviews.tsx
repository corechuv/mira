import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Review = { id:string; product_id:string; user_id:string; rating:number; text:string; status:string; created_at:string }

export default function ReviewsAdmin(){
  const [list, setList] = useState<Review[]>([])
  const [filter, setFilter] = useState<'pending'|'approved'|'rejected'|'all'>('pending')

  async function load(){
    let q = supabase.from('reviews').select('*').order('created_at',{ascending:false}).limit(200)
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setList((data||[]) as any)
  }
  useEffect(()=>{ load() },[filter])

  async function setStatus(id:string, status:'approved'|'rejected'){
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
    if (error) alert(error.message); else load()
  }

  async function remove(id:string){
    if(!confirm('Удалить отзыв?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) alert(error.message); else load()
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Отзывы</h1>
      <div className="mb-3 flex gap-2">
        {(['pending','approved','rejected','all'] as const).map(x=>(
          <button key={x} className={'btn-ghost '+(filter===x?'bg-black/5':'')} onClick={()=>setFilter(x)}>{x}</button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map(r=>(
          <div key={r.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-500">{new Date(r.created_at).toLocaleString()}</div>
                <div className="mt-1 text-base">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                <div className="mt-2 whitespace-pre-wrap text-[15px]">{r.text}</div>
                <div className="mt-2 text-xs text-slate-500">product_id: {r.product_id}</div>
              </div>
              <div className="flex gap-2">
                {r.status!=='approved' && <button className="btn" onClick={()=>setStatus(r.id,'approved')}>Одобрить</button>}
                {r.status!=='rejected' && <button className="btn-outline" onClick={()=>setStatus(r.id,'rejected')}>Отклонить</button>}
                <button className="btn-ghost" onClick={()=>remove(r.id)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
        {list.length===0 && <div className="text-sm text-slate-500">Нет отзывов</div>}
      </div>
    </div>
  )
}
