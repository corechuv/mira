import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Review = { id:string; product_id:string; user_id:string; rating:number; text:string; status:string; created_at:string }

export default function ReviewsAdmin(){
  const [list, setList] = useState<Review[]>([])
  const [filter, setFilter] = useState<'pending'|'approved'|'rejected'|'all'>('pending')
  const [sel, setSel] = useState<Record<string,boolean>>({})

  async function load(){
    let q = supabase.from('reviews').select('*').order('created_at',{ascending:false}).limit(500)
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setList((data||[]) as any)
    setSel({})
  }
  useEffect(()=>{ load() },[filter])

  async function setStatus(id:string, status:'approved'|'rejected'){
    const { error } = await supabase.from('reviews').update({ status }).eq('id', id)
    if (error) alert(error.message); else load()
  }
  async function bulk(status:'approved'|'rejected'|'delete'){
    const ids = Object.keys(sel).filter(k=>sel[k])
    if (!ids.length) return
    if (status==='delete'){
      if(!confirm(`Удалить ${ids.length} отзыв(ов)?`)) return
      const { error } = await supabase.from('reviews').delete().in('id', ids)
      if (error) alert(error.message); else load()
    } else {
      const { error } = await supabase.from('reviews').update({ status }).in('id', ids)
      if (error) alert(error.message); else load()
    }
  }
  function toggle(id:string){ setSel(s=>({ ...s, [id]: !s[id] })) }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Отзывы</h1>
      <div className="mb-3 flex flex-wrap gap-2">
        {(['pending','approved','rejected','all'] as const).map(x=>(
          <button key={x} className={'btn-ghost '+(filter===x?'bg-black/5':'')} onClick={()=>setFilter(x)}>{x}</button>
        ))}
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={()=>bulk('approved')}>Одобрить выбранные</button>
          <button className="btn-outline" onClick={()=>bulk('rejected')}>Отклонить выбранные</button>
          <button className="btn-ghost" onClick={()=>bulk('delete')}>Удалить выбранные</button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(r=>(
          <label key={r.id} className="card grid cursor-pointer grid-cols-[auto_1fr_auto] items-start gap-3 p-4">
            <input type="checkbox" checked={!!sel[r.id]} onChange={()=>toggle(r.id)} className="mt-1" />
            <div>
              <div className="text-sm text-slate-500">{new Date(r.created_at).toLocaleString()}</div>
              <div className="mt-1 text-base">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <div className="mt-2 whitespace-pre-wrap text-[15px]">{r.text}</div>
              <div className="mt-2 text-xs text-slate-500">product_id: {r.product_id}</div>
            </div>
            <div className="flex flex-col gap-2">
              {r.status!=='approved' && <button className="btn" onClick={()=>setStatus(r.id,'approved')}>Одобрить</button>}
              {r.status!=='rejected' && <button className="btn-outline" onClick={()=>setStatus(r.id,'rejected')}>Отклонить</button>}
            </div>
          </label>
        ))}
        {list.length===0 && <div className="text-sm text-slate-500">Нет отзывов</div>}
      </div>
    </div>
  )
}
