import { useEffect, useState } from 'react'
import { fetchCategories, CatNode } from '@/lib/categories'
import { Link } from 'react-router-dom'

const A = (p: any) => <a {...p} className={'inline-block px-2 py-1 rounded-lg hover:bg-black/5 ' + (p.className || '')} />

export default function CatalogMega() {
  const [tree, setTree] = useState<CatNode[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => { (async () => setTree(await fetchCategories()))() }, [])

  const level1 = Array.isArray(tree) ? tree : []

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button" className="btn-ghost">Каталог</button>

      {open && (
        <div className="absolute left-1/2 z-40 mt-2 w-[min(1100px,90vw)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-4 shadow-soft">
          <div className="grid gap-4 md:grid-cols-3">
            {/* L1 */}
            <div className="space-y-1">
              {level1.map(l1 => (
                <div key={l1.id}>
                  <Link to={`/catalog?cat=${l1.slug}`} className="font-semibold hover:underline">{l1.name}</Link>
                </div>
              ))}
            </div>

            {/* L2 */}
            <div className="space-y-2">
              {level1.flatMap(l1 => (l1.children || [])).slice(0, 12).map(l2 => (
                <div key={l2.id}>
                  <Link to={`/catalog?cat=${l2.slug}`} className="hover:underline">{l2.name}</Link>
                </div>
              ))}
            </div>

            {/* L3 */}
            <div className="space-y-2">
              {level1.flatMap(l1 => (l1.children || [])).flatMap(l2 => (l2.children || [])).slice(0, 18).map(l3 => (
                <A key={l3.id} href={`/catalog?cat=${l3.slug}`}>{l3.name}</A>
              ))}
            </div>
          </div>
          {level1.length === 0 && (
            <div className="text-sm text-slate-500">Категории пока не добавлены</div>
          )}
        </div>
      )}
    </div>
  )
}
