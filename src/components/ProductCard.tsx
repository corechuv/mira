import { Link } from 'react-router-dom'
import { Card, CardBody } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Product } from '@/data/products'
import { useCart } from '@/store/cart'
import Price from './Price'
import Stars from './Stars'
import SmartImage from './SmartImage'
import { motion } from 'framer-motion'
import CardActions from './CardActions'

export default function ProductCard({ p }: { p: Product }) {
  const add = useCart(s => s.add)
  const hasDiscount = p.oldPrice && p.oldPrice > p.price
  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:.2}}>
      <Card className="group relative">
        <CardActions id={p.id} />
        {hasDiscount && <span className="absolute left-3 top-3 badge bg-rose-100 text-rose-700 z-10">SALE</span>}
        <Link to={`/product/${p.id}`} aria-label={p.title}>
          <SmartImage src={p.images[0]} alt={p.title} className="rounded-2xl-b-none" />
        </Link>
        <CardBody>
          <div className="mb-2 flex items-center justify-between">
            <Badge>{p.brand}</Badge>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Stars rating={p.rating} className="text-xs" />
              <span>({p.ratingCount ?? 0})</span>
            </div>
          </div>
          <Link to={`/product/${p.id}`} className="line-clamp-2 font-medium hover:underline">{p.title}</Link>
          <div className="mt-3">
            <Price price={p.price} oldPrice={p.oldPrice} />
          </div>
          <Button onClick={() => add(p)} className="mt-3 w-full">В корзину</Button>
        </CardBody>
      </Card>
    </motion.div>
  )
}
