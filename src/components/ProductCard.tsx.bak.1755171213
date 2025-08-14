import { Link } from 'react-router-dom'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

type Props = { product: any }

export default function ProductCard({ product }: Props) {
  if (!product) return null
  const cart = useCart()
  const title: string = product.title ?? 'Без названия'
  const slug: string = product.slug ?? ''
  const id: string | undefined = product.id
  const href = slug ? `/product/${encodeURIComponent(slug)}` : (id ? `/product/${id}` : '#')

  const imgs: string[] = Array.isArray(product.images) ? product.images : []
  const img = imgs[0] || 'https://placehold.co/600x600/png?text=Mira'
  const priceNum = Number(product.price ?? 0)

  const handleAdd = () => {
    cart.add({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: priceNum || 0,
      image: img,
      qty: 1,
    })
  }

  return (
    <div className="card overflow-hidden p-0">
      <Link to={href} className="block" state={{ product }}>
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={img}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="space-y-2 p-3">
        <Link to={href} className="line-clamp-2 text-[15px] font-medium leading-snug" state={{ product }}>
          {title}
        </Link>

        <div className="flex items-baseline gap-2">
          <div className="text-base font-semibold">{formatPrice(priceNum)}</div>
        </div>

        <button className="btn w-full" onClick={handleAdd} disabled={!product.id}>
          В корзину
        </button>
      </div>
    </div>
  )
}
