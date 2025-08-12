import { useParams, Link, useLocation } from 'react-router-dom'
import { products, Product } from '@/data/products'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Stars from '@/components/Stars'
import SmartImage from '@/components/SmartImage'
import Breadcrumbs from '@/components/Breadcrumbs'
import Price from '@/components/Price'
import { useState, useMemo, useEffect } from 'react'
import { usePageMeta } from '@/lib/meta'
import { motion, AnimatePresence } from 'framer-motion'
import { useViewed } from '@/store/viewed'
import { useFavorites } from '@/store/favorites'
import { useCompare } from '@/store/compare'
import { fetchReviews, submitReview } from '@/lib/reviews'
import { useAuth } from '@/store/auth'
import { toast } from 'sonner'

export default function ProductPage() {
  const { id } = useParams()
  const p = products.find(x => x.id === id)
  const add = useCart(s => s.add)
  const [active, setActive] = useState(0)
  const viewed = useViewed()
  const fav = useFavorites()
  const cmp = useCompare()
  const { user } = useAuth()
  const loc = useLocation()

  useEffect(() => { if (p) viewed.add(p.id); setActive(0) }, [id])
  usePageMeta({
    title: p ? `${p.title} — Mira` : 'Товар — Mira',
    description: p?.description,
    ogImage: p ? `/api/og?title=${encodeURIComponent(p.title)}&price=${p.price}&brand=${encodeURIComponent(p.brand)}` : undefined
  })

  const [rev, setRev] = useState<any[]>([])
  const [loadingRev, setLoadingRev] = useState(false)

  useEffect(() => {
    let ignore = false
    if (!p) return
    setLoadingRev(true)
    fetchReviews(p.id, user?.id).then(d => { if (!ignore) setRev(d as any[]) }).catch(()=>{}).finally(()=>setLoadingRev(false))
    return () => { ignore = true }
  }, [p?.id, user?.id])

  if (!p) return <div className="container-narrow mt-6">Товар не найден</div>
  const related = useMemo(() => products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4), [p])

  return (
    <div className="container-narrow mt-6">
      <Breadcrumbs items={[
        { label: 'Главная', to: '/' },
        { label: 'Каталог', to: '/catalog' },
        { label: humanCategory(p.category), to: `/catalog?category=${p.category}` },
        { label: p.title }
      ]} />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <SmartImage src={p.images[active]} alt={p.title} aspect="aspect-square" />
              </motion.div>
            </AnimatePresence>
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images.map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={`rounded-xl overflow-hidden border ${active===i?'border-brand-500':'border-transparent'}`} aria-label={`превью ${i+1}`}>
                  <SmartImage src={src} alt={`${p.title} превью ${i+1}`} aspect="aspect-[4/3]" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
            <Stars rating={p.rating} />
            <span>({p.ratingCount ?? 0})</span>
            <span>•</span>
            <span>{p.brand}</span>
          </div>
          <div className="mt-4"><Price price={p.price} oldPrice={p.oldPrice} /></div>
          <p className="mt-3 text-slate-700">{p.description}</p>

          {p.volume && <p className="mt-2 text-sm text-slate-600">Объём: {p.volume}</p>}
          <p className="mt-1 text-sm text-slate-600">SKU: {p.sku}</p>
          <p className="mt-1 text-sm">{p.stock > 0 ? <span className="text-emerald-700">В наличии</span> : <span className="text-rose-700">Нет в наличии</span>}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => add(p)}>Добавить в корзину</Button>
            <button onClick={()=>fav.toggle(p.id)} className={`btn btn-outline ${fav.has(p.id)?'border-rose-300 text-rose-700':''}`}>{fav.has(p.id)?'В избранном':'В избранное'}</button>
            <button onClick={()=>cmp.toggle(p.id)} className={`btn btn-outline ${cmp.has(p.id)?'border-brand-300 text-brand-700':''}`}>{cmp.has(p.id)?'В сравнении':'Сравнить'}</button>
          </div>

          {p.variants && p.variants.length > 0 && (
            <div className="mt-4 text-sm">
              <div className="font-medium mb-2">Варианты</div>
              <div className="flex flex-wrap gap-2">
                {p.variants.map(v => (
                  <span key={v.id} className="btn btn-outline px-3 py-1 text-xs">{v.name} — {formatPrice(v.price)}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border p-3 text-sm text-slate-700">
            <div className="font-medium mb-1">Доставка и оплата</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Курьер по РФ: 299–599 ₽</li>
              <li>Онлайн-оплата (Stripe) или при получении</li>
              <li>Возврат в течение 14 дней</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="details" className="prose mt-10 max-w-none prose-p:mb-2">
        {p.longDescription && <p>{p.longDescription}</p>}
        {p.ingredients && (<><h2>Состав</h2><ul>{p.ingredients.map((it,i)=><li key={i}>{it}</li>)}</ul></>)}
        {p.howToUse && (<><h2>Как использовать</h2><ol>{p.howToUse.map((it,i)=><li key={i}>{it}</li>)}</ol></>)}
        {p.tags?.length > 0 && (<><h2>Теги</h2><p>{p.tags.join(', ')}</p></>)}
      </div>

      {/* Отзывы */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Отзывы</h2>
        {loadingRev ? <p className="text-sm text-slate-600">Загрузка…</p> : (
          rev.length ? (
            <ul className="space-y-3">
              {rev.map((r:any)=>(
                <li key={r.id} className="rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.user_id ? 'Покупатель' : 'Гость'}</span>
                    <Stars rating={r.rating} />
                    <span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString('ru-RU')}</span>
                    {r.status!=='approved' && <span className="badge bg-amber-100 text-amber-700">на модерации</span>}
                  </div>
                  <p className="mt-1 text-sm">{r.text}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-600">Пока нет отзывов.</p>
        )}

        <ReviewForm productId={p.id} />
      </section>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Похожие товары</h2>
            <Link to={`/catalog?category=${p.category}`} className="text-sm text-brand-700 hover:underline">В каталог</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map(r => <RelatedCard key={r.id} p={r} />)}
          </div>
        </section>
      )}

      {/* Недавно просмотренные */}
      <RecentViewed currentId={p.id} />
    </div>
  )
}

function RecentViewed({ currentId }: { currentId: string }) {
  const { list } = useViewed()
  const ids = list().filter(id => id !== currentId).slice(0, 6)
  const items = products.filter(p => ids.includes(p.id))
  if (!items.length) return null
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold">Недавно просмотренные</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {items.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="block rounded-2xl border hover:shadow">
            <SmartImage src={p.images[0]} alt={p.title} />
            <div className="p-3 text-sm line-clamp-2">{p.title}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RelatedCard({ p }: { p: Product }) {
  return (
    <Link to={`/product/${p.id}`} className="block rounded-2xl border hover:shadow-md transition">
      <SmartImage src={p.images[0]} alt={p.title} />
      <div className="p-3">
        <div className="text-sm font-medium line-clamp-2">{p.title}</div>
        <div className="mt-1 text-sm">{formatPrice(p.price)}</div>
      </div>
    </Link>
  )
}

function humanCategory(c: Product['category']) {
  return c === 'skincare' ? 'Уход за кожей' : c === 'makeup' ? 'Макияж' : 'Волосы'
}

/* --- Форма отзыва --- */
function ReviewForm({ productId }: { productId: string }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [sending, setSending] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    try {
      await submitReview({ product_id: productId, rating, text })
      setText('')
      setRating(5)
      toast.success('Отзыв отправлен на модерацию')
    } catch(e:any) {
      toast.error(e.message || 'Не удалось отправить отзыв')
    } finally { setSending(false) }
  }

  return (
    <div className="mt-6 rounded-xl border p-3">
      <div className="font-medium mb-2">Оставить отзыв</div>
      {!user && <p className="mb-2 text-sm text-slate-600">Вы можете оставить отзыв без авторизации — он попадёт на модерацию.</p>}
      <form onSubmit={submit} className="grid gap-2">
        <label className="text-sm">Оценка:
          <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="ml-2 rounded-md border px-2 py-1 text-sm">
            {[5,4,3,2,1].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ваш отзыв" className="input min-h-[100px]" />
        <button className="btn btn-primary md:w-max" disabled={sending}>{sending?'Отправляем…':'Отправить'}</button>
      </form>
    </div>
  )
}
