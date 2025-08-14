import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Row = { id:string; name:string; slug:string; parent_id:string|null; sort:number|null }

function buildTree(rows: Row[]) {
  const byParent: Record<string, Row[]> = {}
  for (const r of rows) {
    const key = r.parent_id || 'root'
    ;(byParent[key] ||= []).push(r)
  }
  const attach = (parentId: string|null) => (byParent[parentId||'root']||[]).map(r => ({
    ...r,
    children: attach(r.id)
  }))
  return attach(null)
}

export default function CategoriesAdmin() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|undefined>()

  useEffect(() => {
    let alive = true
    ;(async()=>{
      setLoading(true); setError(undefined)
      try {
        const { data, error } = await supabase.from('categories').select('id,name,slug,parent_id,sort').order('sort',{ascending:true}).order('name',{ascending:true})
        if (error) throw error
        if (alive) setRows((data||[]) as Row[])
      } catch(e:any) {
        if (alive) setError(e?.message||'Ошибка загрузки')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return ()=>{ alive=false }
  }, [])

  const tree = useMemo(()=>buildTree(rows||[]), [rows])

  return (
    <div className="p-4">
      <h1 className="mb-3 text-xl font-semibold">Категории</h1>
      {loading && <div className="panel p-4">Загрузка…</div>}
      {error && <div className="panel p-4 text-red-600">Ошибка: {error}</div>}
      {!loading && !error && (
        <div className="panel p-4">
          {tree.length === 0 ? (
            <div className="text-slate-600">Нет категорий. Импортируйте категории SQL-скриптом из supabase/categories.sql и обновите страницу.</div>
          ) : (
            <ul className="space-y-1">
              {tree.map(node => <Node key={node.id} node={node} level={0} />)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function Node({ node, level }:{ node:any; level:number }) {
  const pad = { paddingLeft: `${level*14}px` }
  return (
    <li>
      <div className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-slate-50" style={pad}>
        <div className="min-w-0">
          <div className="truncate font-medium">{node.name}</div>
          <div className="truncate text-xs text-slate-500">/{node.slug}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">sort: {node.sort ?? 0}</span>
          <span className="chip">{(node.children||[]).length} подкат.</span>
        </div>
      </div>
      {(node.children||[]).length>0 && (
        <ul className="space-y-1">
          {(node.children||[]).map((c:any)=> <Node key={c.id} node={c} level={level+1} />)}
        </ul>
      )}
    </li>
  )
}
