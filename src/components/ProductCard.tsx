import { Link } from 'react-router-dom'
import { useCart } from '@/store/cart'
import { useFavorites } from '@/store/favorites'
import { formatPrice, percentOff } from '@/lib/utils'

type P = { product: any }

export default function ProductCard({ product }: P) {
  const cart = useCart()
  const fav = useFavorites()

  const id = product?.id
  const slug = product?.slug || id
  const title = product?.title || 'Товар'
  const img = product?.image || product?.img || '/icons/mira.svg'
  const price = Number(product?.price || 0)
  const old = Number(product?.oldPrice ?? product?.old_price ?? 0)
  const discount = old > price ? percentOff(old, price) : 0

  const added = !!(fav?.ids || []).includes(id)

  const addToCart = () => cart.add?.({ id, slug, title, price, qty: 1, image: img })
  const toggleFav = () => fav.toggle?.(id)

  return (
    <div className="card group">
      <Link to={`/product/${encodeURIComponent(slug)}`} className="block aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100">
        <img src={img} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      </Link>
      <div className="mt-2 space-y-1">
        <Link to={`/product/${encodeURIComponent(slug)}`} className="line-clamp-2 text-sm font-medium hover:underline">
          {title}
        </Link>
        <div className="flex items-baseline gap-2">
          <div className="text-base font-semibold">{formatPrice(price)}</div>
          {old > price && <div className="text-sm text-slate-500 line-through">{formatPrice(old)}</div>}
          {discount > 0 && <span className="chip -ml-1">-{discount}%</span>}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary flex-1" onClick={addToCart}>В корзину</button>
          <button aria-label="Избранное" className={`chip ${added ? 'bg-black text-white' : ''}`} onClick={toggleFav}>❤</button>
        </div>
      </div>
    </div>
  )
}
