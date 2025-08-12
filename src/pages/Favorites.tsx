import { useFavorites } from '@/store/favorites'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'

export default function Favorites() {
  const fav = useFavorites()
  const list = products.filter(p => fav.ids.includes(p.id))
  return (
    <div className="container-narrow mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Избранное</h1>
        {list.length>0 && <button onClick={()=>fav.clear()} className="btn btn-outline">Очистить</button>}
      </div>
      {list.length===0 ? <p className="text-slate-600">Пусто. Добавляйте товары в избранное сердечком ❤</p> :
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>}
    </div>
  )
}
