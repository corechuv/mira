import { formatPrice } from '@/lib/utils'

export default function Price({ price, oldPrice }: { price: number; oldPrice?: number }) {
  const discount = oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0
  return (
    <div className="flex items-end gap-2">
      <div className="text-lg font-semibold">{formatPrice(price)}</div>
      {oldPrice && oldPrice > price && (
        <>
          <div className="text-sm text-slate-400 line-through">{formatPrice(oldPrice)}</div>
          <span className="badge bg-emerald-100 text-emerald-700">−{discount}%</span>
        </>
      )}
    </div>
  )
}
