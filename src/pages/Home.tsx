import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true); setError(undefined)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12)
        if (error) throw error
        if (alive) setRows(data || [])
      } catch (e:any) {
        if (alive) setError(e?.message || 'Ошибка загрузки')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div className="container py-6 md:py-10">
      <h1 className="mb-4 text-xl md:text-2xl font-semibold">Новинки</h1>
      {loading && <div className="panel p-4">Загрузка…</div>}
      {error && <div className="panel p-4 text-red-600">Ошибка: {error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {(rows || []).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
