import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchCategories } from '@/lib/categories'
import type { CategoryRow } from '@/lib/categories'
import { formatPrice } from '@/lib/utils'
import { toCSV, parseCSV } from '@/lib/csv'

type Product = {
  id?: string
  slug: string
  title: string
  short?: string
  price: number
  stock: number
  active: boolean
  brand?: string
  images?: string[]
  category_id?: string | null
}

export default function ProductsAdmin(){
  const [list, setList] = useState<Product[]>([])
  const [cats, setCats] = useState<CategoryRow[]>([])
  const [form, setForm] = useState<Product>({ slug:'', title:'', price:0, stock:0, active:true, images:[] })
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [active, setActive] = useState<'all'|'yes'|'no'>('all')
  const [page, setPage] = useState(1); const pageSize = 20
  const offset = (page-1)*pageSize

  async function load(){
    let query = supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending:false }).range(offset, offset+pageSize-1)
    if (q) query = query.ilike('title', `%${q}%`)
    if (cat) query = query.eq('category_id', cat)
    if (active!=='all') query = query.eq('active', active==='yes')
    const { data, count } = await query
    setList((data||[]) as any)
    setTotal(count||0)
    const c = await fetchCategories(); setCats(flatten(c))
  }
  const [total, setTotal] = useState(0)
  useEffect(()=>{ load() },[q,cat,active,page])

  function change<K extends keyof Product>(k:K, v:Product[K]){ setForm(f=>({ ...f, [k]: v })) }
  function resetForm(){ setForm({ slug:'', title:'', price:0, stock:0, active:true, images:[] }) }

  async function save(){
    if(!form.title) return alert('Название обязательно')
    const payload:any = { ...form, images: form.images||[] }
    let err
    if (form.id) { ({ error: err } = await supabase.from('products').update(payload).eq('id', form.id)) }
    else { ({ error: err } = await supabase.from('products').insert(payload)) }
    if (err) alert(err.message); else { resetForm(); load() }
  }
  async function del(id:string){
    if(!confirm('Удалить товар?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert(error.message); else load()
  }

  function doExport(){
    const csv = toCSV(list.map(p=>({ id:p.id, slug:p.slug, title:p.title, price:p.price, stock:p.stock, active:p.active, brand:p.brand, category_id:p.category_id, images:(p.images||[]).join('|') })))
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='products.csv'; a.click()
  }
  async function doImport(file: File){
    const text = await file.text()
    const rows = parseCSV(text)
    const payload = rows.map(r=>({
      slug: r.slug, title: r.title, price: Number(r.price||0), stock: Number(r.stock||0), active: (r.active||'true')==='true',
      brand: r.brand||null, category_id: r.category_id||null, images: (r.images||'').split('|').filter(Boolean)
    }))
    if(!confirm(`Импортировать ${payload.length} товаров?`)) return
    const { error } = await supabase.from('products').insert(payload)
    if (error) alert(error.message); else load()
  }

  const pages = Math.max(1, Math.ceil(total/pageSize))
  const catOptions = useMemo(()=>cats.filter(c=>!!c.parent_id),[cats])
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Товары</h1>

      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-6">
          <input className="field md:col-span-2" placeholder="Поиск по названию" value={q} onChange={e=>{ setPage(1); setQ(e.target.value) }} />
          <select className="field" value={cat} onChange={e=>{ setPage(1); setCat(e.target.value) }}>
            <option value="">Все категории</option>
            {catOptions.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="field" value={active} onChange={e=>{ setPage(1); setActive(e.target.value as any) }}>
            <option value="all">Статус: любые</option>
            <option value="yes">Только активные</option>
            <option value="no">Только скрытые</option>
          </select>
          <div className="flex items-center gap-2">
            <button className="btn-ghost" onClick={doExport}>Экспорт CSV</button>
            <label className="btn-ghost cursor-pointer">Импорт CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={e=>e.target.files&&doImport(e.target.files[0])} /></label>
          </div>
        </div>
      </div>

      <div className="mt-4 card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="field" placeholder="Название" value={form.title} onChange={e=>change('title', e.target.value)} />
          <input className="field" placeholder="Slug (auto)" value={form.slug} onChange={e=>change('slug', e.target.value)} />
          <select className="field" value={form.category_id||''} onChange={e=>change('category_id', e.target.value||null)}>
            <option value="">Категория</option>
            {catOptions.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="field" type="number" step="0.01" placeholder="Цена, EUR" value={form.price} onChange={e=>change('price', Number(e.target.value))} />
          <input className="field" type="number" placeholder="Склад" value={form.stock} onChange={e=>change('stock', Number(e.target.value))} />
          <input className="field" placeholder="Бренд" value={form.brand||''} onChange={e=>change('brand', e.target.value)} />
          <input className="field md:col-span-2" placeholder='Картинки через запятую (URL)' value={(form.images||[]).join(',')} onChange={e=>change('images', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.active} onChange={e=>change('active', e.target.checked)} />
            Активен
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={save} className="btn">{form.id?'Сохранить':'Создать'}</button>
          {form.id && <button onClick={resetForm} className="btn-ghost">Сбросить</button>}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map(p=>(
          <div key={p.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                {p.images && p.images[0]
                  ? <img src={p.images[0]} alt="" className="h-16 w-16 rounded-xl object-cover border border-black/10" />
                  : <div className="h-16 w-16 rounded-xl border border-dashed border-black/20 grid place-items-center text-xs text-slate-400">no img</div>}
                <div>
                  <div className="text-base font-semibold">{p.title}</div>
                  <div className="text-sm text-slate-500">{p.slug}</div>
                  <div className="mt-1 text-sm">{formatPrice(p.price)} · {p.stock} шт · {p.active?'активен':'скрыт'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={()=>setForm({ ...p, images: (p.images as any)||[] })}>Править</button>
                <button className="btn-ghost" onClick={()=>del(p.id!)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-500">Всего: {total}</div>
        <div className="flex gap-2">
          <button className="btn-ghost" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Назад</button>
          <div className="px-2 text-sm">Стр. {page}/{pages}</div>
          <button className="btn-ghost" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Вперёд</button>
        </div>
      </div>
    </div>
  )
}

function flatten(list:any[]): CategoryRow[] {
  const out: CategoryRow[] = []
  const walk = (n:any,p: number[] = []) => { out.push(n); (n.children||[]).forEach((c:any)=>walk(c, p.concat(1))) }
  (list||[]).forEach((n:any)=>walk(n))
  return out
}
