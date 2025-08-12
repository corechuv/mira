import { Sheet, SheetBody, SheetFooter, SheetHeader } from './ui/sheet'
import { useCart, cartTotal } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, inc, dec, remove } = useCart()
  const total = cartTotal(items)
  return (
    <Sheet open={open} onClose={onClose}>
      <SheetHeader title="Корзина" />
      <SheetBody>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Корзина пуста.</p>
        ) : (
          <ul className="space-y-4">
            {items.map(it => (
              <li key={it.product.id} className="flex gap-3">
                <img src={it.product.images[0]} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{it.product.title}</div>
                  <div className="text-sm text-slate-500">{formatPrice(it.product.price)} × {it.qty}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <button onClick={() => dec(it.product.id)} className="btn btn-outline px-2 py-1">−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => inc(it.product.id)} className="btn btn-outline px-2 py-1">+</button>
                    <button onClick={() => remove(it.product.id)} className="ml-3 text-slate-500 underline">Удалить</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetBody>
      <SheetFooter>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Итого: {formatPrice(total)}</div>
          <Link to="/checkout" className="btn btn-primary" onClick={onClose}>Оформить</Link>
        </div>
      </SheetFooter>
    </Sheet>
  )
}
