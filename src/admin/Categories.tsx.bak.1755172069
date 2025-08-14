import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fetchCategories, buildTree, CatNode } from '@/lib/categories'

export default function CategoriesAdmin() {
  const [rows, setRows] = useState<CatNode[]>([])
  const [name, setName] = useState(''); const [slug, setSlug] = useState(''); const [parent, setParent] = useState<string>('')

  const load = async () => { setRows(await fetchCategories()) }
  useEffect(()=>{ load() }, [])

  const flat = useMemo(()=>{
    const list: { id:string; name:string }[] = []
    const walk = (n:CatNode, pfx='') => { list.push({ id:n.id, name:pfx+n.name }); (n.children||[]).forEach(c=>walk(c, pfx+'— ')) }
    (rows||[]).forEach(r=>walk(r))
    return list
  },[rows])

  async function add() {
    const { error } = await supabase.from('categories').insert({ name, slug: slug||slugify(name), parent_id: parent || null })
    if (error) alert(error.message); else { setName(''); setSlug(''); setParent(''); await load() }
  }
  async function remove(id:string) {
    if (!confirm('Удалить категорию и её подкатегории?')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert(error.message); else load()
  }
  async function rename(id:string, name:string){
    const { error } = await supabase.from('categories').update({ name }).eq('id', id); if (error) alert(error.message)
  }
  async function reslug(id:string, slug:string){
    const { error } = await supabase.from('categories').update({ slug }).eq('id', id); if (error) alert(error.message)
  }
  async function move(id:string, parent_id:string|null){
    const { error } = await supabase.from('categories').update({ parent_id }).eq('id', id); if (error) alert(error.message); else load()
  }
  async function bump(id:string, delta:number){
    // простая перестановка sort внутри одного родителя
    const { data: row } = await supabase.from('categories').select('id,parent_id,sort').eq('id', id).single()
    if(!row) return
    const { data: siblings=[] } = await supabase.from('categories').select('id,sort').eq('parent_id', row.parent_id).order('sort', { ascending:true })
    const idx = siblings.findIndex((s:any)=>s.id===id)
    const nn = idx+delta
    if (nn<0||nn>=siblings.length) return
    const a = siblings[idx], b = siblings[nn]
    await supabase.from('categories').update({ sort: b.sort }).eq('id', a.id)
    await supabase.from('categories').update({ sort: a.sort }).eq('id', b.id)
    await load()
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
            {(flat||[]).map(o=> <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
        <div className="mt-3"><button onClick={add} className="btn">Добавить</button></div>
      </div>

      <div className="mt-6">
        <Tree nodes={rows} onRemove={remove} onRename={rename} onReslug={reslug} onMove={move} onBump={bump} />
      </div>
    </div>
  )
}

function Tree({ nodes, onRemove, onRename, onReslug, onMove, onBump }:{
  nodes: CatNode[]; onRemove:(id:string)=>void; onRename:(id:string,n:string)=>void; onReslug:(id:string,s:string)=>void; onMove:(id:string,p:string|null)=>void; onBump:(id:string,d:number)=>void
}) {
  const safe = Array.isArray(nodes) ? nodes : []
  return (
    <ul className="space-y-1">
      {safe.map(n=>(
        <li key={n.id}>
          <div className="group flex flex-wrap items-center gap-2 rounded-lg px-2 py-1 hover:bg-black/5">
            <input defaultValue={n.name} onBlur={e=>onRename(n.id,e.currentTarget.value)} className="field h-8 px-2 py-1" />
            <input defaultValue={n.slug} onBlur={e=>onReslug(n.id,e.currentTarget.value)} className="field h-8 px-2 py-1" />
            <button onClick={()=>onBump(n.id,-1)} className="btn-ghost text-xs">↑</button>
            <button onClick={()=>onBump(n.id, 1)} className="btn-ghost text-xs">↓</button>
            <button onClick={()=>onRemove(n.id)} className="btn-ghost text-xs opacity-0 group-hover:opacity-100">Удалить</button>
            <select defaultValue={n.parent_id||''} onChange={e=>onMove(n.id, e.currentTarget.value||null)} className="field h-8 px-2 py-1">
              <option value="">Корень</option>
              {safe.flatMap(walkFlat).map(o=> <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          {(n.children && n.children.length>0) && <div className="ml-4 border-l border-black/10 pl-3"><Tree nodes={n.children} onRemove={onRemove} onRename={onRename} onReslug={onReslug} onMove={onMove} onBump={onBump} /></div>}
        </li>
      ))}
    </ul>
  )
}
function walkFlat(n:CatNode, pfx=''){ return [{ id:n.id, name:pfx+n.name }, ...n.children.flatMap(c=>walkFlat(c, pfx+'— '))] }
function slugify(s:string){ return s.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'') }
