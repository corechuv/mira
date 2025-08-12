import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildTree, fetchCategories, CatNode } from '@/lib/categories'

export default function CatalogMega() {
  const [open, setOpen] = useState(false)
  const [tree, setTree] = useState<CatNode[]>([])
  const [lvl1, setLvl1] = useState<string | null>(null)
  const [lvl2, setLvl2] = useState<string | null>(null)
  const nav = useNavigate()
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => { (async () => { const rows = await fetchCategories(); setTree(buildTree(rows)) })() }, [])

  const schedule = (fn: () => void, ms: number) => { if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(fn, ms) }
  const openNow = () => setOpen(true)
  const closeNow = () => setOpen(false)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!panelRef.current || !btnRef.current) return
      const t = e.target as Node
      if (!panelRef.current.contains(t) && !btnRef.current.contains(t)) schedule(closeNow, 180)
    }
    document.addEventListener('mousemove', onDoc)
    return () => document.removeEventListener('mousemove', onDoc)
  }, [])

  const act1 = useMemo(() => tree.find(x => x.slug === lvl1) || tree[0], [tree, lvl1])
  const act2 = useMemo(() => act1?.children.find(x => x.slug === lvl2) || act1?.children[0], [act1, lvl2])

  const go = (slug: string) => { setOpen(false); nav(`/catalog?category=${slug}`) }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onMouseEnter={() => schedule(openNow, 80)}
        onFocus={() => openNow()}
        onClick={() => setOpen(v=>!v)}
        className="text-sm font-medium text-slate-900 hover:text-brand-700"
        aria-expanded={open}
      >
        Каталог
      </button>

      {open && (
        <div
          ref={panelRef}
          onMouseEnter={() => schedule(openNow, 0)}
          className="fixed left-0 right-0 z-[90] bg-white/95 backdrop-blur ring-1 ring-black/5"
          style={{ top: 'var(--header-h, 64px)' }}
          onMouseLeave={() => schedule(closeNow, 220)}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Разделы</div>
                <ul className="space-y-1">
                  {tree.map(c=>(
                    <li key={c.slug}>
                      <button
                        className={`w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50 ${act1?.slug===c.slug?'text-brand-700':''}`}
                        onMouseEnter={()=>setLvl1(c.slug)} onClick={()=>go(c.slug)}
                      >{c.name}</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-3">
                <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Категории</div>
                <ul className="space-y-1">
                  {act1?.children?.map(c=>(
                    <li key={c.slug}>
                      <button
                        className={`w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50 ${act2?.slug===c.slug?'text-brand-700':''}`}
                        onMouseEnter={()=>setLvl2(c.slug)} onClick={()=>go(c.slug)}
                      >{c.name}</button>
                    </li>
                  )) || <li className="px-2 py-2 text-sm text-slate-500">Нет подкатегорий</li>}
                </ul>
              </div>

              <div className="col-span-3">
                <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">Подкатегории</div>
                <ul className="grid grid-cols-1 gap-1">
                  {act2?.children?.map(c=>(
                    <li key={c.slug}>
                      <button
                        className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50"
                        onClick={()=>go(c.slug)}
                      >{c.name}</button>
                    </li>
                  )) || <li className="px-2 py-2 text-sm text-slate-500">Нет подкатегорий</li>}
                </ul>
              </div>

              <div className="col-span-3">
                <div className="relative h-full min-h-[180px] overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <video
                    src="/videos/mega.mp4"
                    className="h-full w-full object-cover"
                    muted loop playsInline autoPlay
                    onError={(e)=>{ (e.target as HTMLVideoElement).style.display='none'; (e.currentTarget.parentElement as HTMLElement).style.background='linear-gradient(135deg,#eef4ff,#ffffff)'; }}
                    poster="/icons/mira.png"
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500">Подборки и акции</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
