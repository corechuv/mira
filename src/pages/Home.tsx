import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

export default function Home() {
  const featured = products.slice(0, 6)
  return (
    <>
      <section className="container-narrow mt-6 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold md:text-4xl">Mira — естественная красота каждый день</h1>
          <p className="mt-3 text-slate-600">Надежные формулы, приятные текстуры и реальные результаты.</p>
          <div className="mt-5 flex gap-3">
            <Link to="/catalog" className="btn btn-primary">В каталог</Link>
            <Link to="/about" className="btn btn-outline">Узнать больше</Link>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop" alt="Hero" className="h-72 w-full rounded-2xl object-cover md:h-full" />
      </section>

      <section className="container-narrow mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Хиты недели</h2>
          <Link to="/catalog" className="text-sm text-brand-700 hover:underline">Смотреть всё</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  )
}
