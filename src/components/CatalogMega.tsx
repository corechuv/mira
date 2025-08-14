import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCategoriesTree, type CategoryTreeNode } from '@/lib/categories'

export default function CatalogMega({ open, setOpen }: { open: boolean; setOpen: (v: boolean)=>void }) {
  const [tree, setTree] = useState<CategoryTreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [rootId, setRootId] = useState<string | null>(null)
  const [childId, setChildId] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const t = await fetchCategoriesTree()
        if (!alive) return
        setTree(t); setRootId(t[0]?.id || null)
      } finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [])

  const activeRoot = useMemo(() => tree.find(x => x.id === rootId) || null, [tree, rootId])
  const activeChild = useMemo(() => activeRoot?.children.find(x => x.id === childId) || null, [activeRoot, childId])

  const openNow = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(true) }
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(()=>setOpen(false), 140) }
  const goCat = (slug: string) => { setOpen(false); nav(`/catalog?cat=${encodeURIComponent(slug)}`) }

  if (!open) return null
  return (
    <div onMouseEnter={openNow} onMouseLeave={scheduleClose}
         className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-lg"
         style={{ top: `var(--header-h, 64px)` }}>
      <div className="container py-6">
        {loading ? (
          <div className="grid grid-cols-3 gap-6">{Array.from({length:3}).map((_,i)=><div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />)}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Категории</div>
              <ul className="space-y-1">
                {tree.map(r=>(
                  <li key={r.id}>
                    <button className={`w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100 ${r.id===rootId?'bg-slate-100':''}`}
                      onMouseEnter={()=>{ setRootId(r.id); setChildId(null) }}
                      onClick={()=>goCat(r.slug)}>{r.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Подкатегории</div>
              <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
                {(activeRoot?.children||[]).map(c=>(
                  <li key={c.id}>
                    <button className={`w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100 ${c.id===childId?'bg-slate-100':''}`}
                      onMouseEnter={()=>setChildId(c.id)}
                      onClick={()=>goCat(c.slug)}>{c.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Разделы</div>
              <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
                {(activeChild?.children||[]).map(g=>(
                  <li key={g.id}>
                    <button className="w-full text-left rounded-xl px-3 py-2 hover:bg-slate-100" onClick={()=>goCat(g.slug)}>{g.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
