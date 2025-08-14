import { Link } from 'react-router-dom'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/cart'

export default function ProductCard({ product }: { product: any }) {
  const { add } = useCart()
  const p = product || {}
  const title = p.title || 'Товар'
  const img = p.image || p.img || '/icons/mira.svg'
  const priceNum = Number(p.price || 0)
  const href = `/product/${encodeURIComponent(p.slug || p.id || '')}`

  const handleAdd = () => p.id && add(p, 1)

  return (
    <div className="card overflow-hidden p-0">
      <Link to={href} className="block" state={{ product }}>
        <div className="aspect-square w-full overflow-hidden">
          <img src={img} alt={title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]" loading="lazy" />
        </div>
      </Link>
      <div className="space-y-2 p-3">
        <Link to={href} className="line-clamp-2 text-[15px] font-medium leading-snug" state={{ product }}>{title}</Link>
        <div className="flex items-baseline gap-2">
          <div className="text-base font-semibold">{formatPrice(priceNum)}</div>
        </div>
        <button className="btn-primary w-full" onClick={handleAdd} disabled={!p.id}>В корзину</button>
      </div>
    </div>
  )
}
