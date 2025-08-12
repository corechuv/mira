import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchCategories } from '@/lib/categories'
import type { CategoryRow } from '@/lib/categories'
import { formatPrice } from '@/lib/utils'

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

  async function load(){
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending:false }).limit(200)
    setList((data||[]) as any)
    const c = await fetchCategories(); setCats(c)
  }
  useEffect(()=>{ load() },[])

  function change<K extends keyof Product>(k:K, v:Product[K]){ setForm(f=>({ ...f, [k]: v })) }

  async function save(){
    if(!form.title) return alert('Название обязательно')
    const payload = {
      ...form,
      images: JSON.stringify(form.images||[])
    }
    let err
    if (form.id) { ({ error: err } = await supabase.from('products').update(payload).eq('id', form.id)) }
    else { ({ error: err } = await supabase.from('products').insert(payload)) }
    if (err) alert(err.message); else { setForm({ slug:'', title:'', price:0, stock:0, active:true, images:[] }); load() }
  }

  async function del(id:string){
    if(!confirm('Удалить товар?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) alert(error.message); else load()
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Товары</h1>

      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="field" placeholder="Название" value={form.title} onChange={e=>change('title', e.target.value)} />
          <input className="field" placeholder="Slug (auto)" value={form.slug} onChange={e=>change('slug', e.target.value)} />
          <select className="field" value={form.category_id||''} onChange={e=>change('category_id', e.target.value||null)}>
            <option value="">Категория</option>
            {cats.filter(c=>!!c.parent_id).map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
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
          {form.id && <button onClick={()=>setForm({ slug:'', title:'', price:0, stock:0, active:true, images:[] })} className="btn-ghost">Сбросить</button>}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map(p=>(
          <div key={p.id} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{p.title}</div>
                <div className="text-sm text-slate-500">{p.slug}</div>
                <div className="mt-1 text-sm">{formatPrice(p.price)} · {p.stock} шт · {p.active?'активен':'скрыт'}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={()=>setForm({ ...p, images: (p.images as any)||[] })}>Править</button>
                <button className="btn-ghost" onClick={()=>del(p.id!)}>Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
