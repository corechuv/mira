import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { buildTree, fetchCategories, CatNode } from '@/lib/categories'

export default function CategoriesAdmin() {
  const [rows, setRows] = useState<any[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parent, setParent] = useState<string>('')

  const load = async () => { const r = await fetchCategories(); setRows(r as any) }

  useEffect(()=>{ load() }, [])

  const flat = useMemo(()=>{
    const list: { id:string; name:string }[] = []
    function walk(n:CatNode, pfx=''){ list.push({ id:n.id, name:pfx+n.name }); n.children.forEach(c=>walk(c, pfx+'— ')) }
    rows.forEach((r:any)=>walk(r))
    return list
  },[rows])

  async function add() {
    const { data, error } = await supabase.from('categories').insert({
      name, slug: slug || slugify(name), parent_id: parent || null
    }).select().single()
    if (error) alert(error.message); else { setName(''); setSlug(''); setParent(''); await load() }
  }
  async function remove(id:string) {
    if (!confirm('Удалить категорию и её подкатегории?')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert(error.message); else load()
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Категории</h1>

      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input className="field" placeholder="Название" value={name} onChange={e=>setName(e.target.value)} />
          <input className="field" placeholder="Slug (auto)" value={slug} onChange={e=>setSlug(e.target.value)} />
          <select className="field" value={parent} onChange={e=>setParent(e.target.value)}>
            <option value="">Корень</option>
            {flat.map(o=> <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <div className="mt-3"><button onClick={add} className="btn">Добавить</button></div>
      </div>

      <div className="mt-6">
        <Tree nodes={rows as any} onRemove={remove} />
      </div>
    </div>
  )
}

function Tree({ nodes, onRemove }: { nodes: CatNode[]; onRemove: (id:string)=>void }) {
  return (
    <ul className="space-y-1">
      {nodes.map(n=>(
        <li key={n.id}>
          <div className="group flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-black/5">
            <div className="font-medium">{n.name}</div>
            <button onClick={()=>onRemove(n.id)} className="btn-ghost text-xs opacity-0 group-hover:opacity-100">Удалить</button>
          </div>
          {n.children?.length>0 && <div className="ml-4 border-l border-black/10 pl-3"><Tree nodes={n.children} onRemove={onRemove}/></div>}
        </li>
      ))}
    </ul>
  )
}

function slugify(s:string){ return s.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'') }
