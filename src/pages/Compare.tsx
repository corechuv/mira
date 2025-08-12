import { useCompare } from '@/store/compare'
import { products } from '@/data/products'
import SmartImage from '@/components/SmartImage'
import { formatPrice } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function Compare() {
  const cmp = useCompare()
  const items = products.filter(p => cmp.ids.includes(p.id))
  const cols = items.length || 1
  return (
    <div className="container-narrow mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Сравнение</h1>
        {items.length>0 && <button onClick={()=>cmp.clear()} className="btn btn-outline">Очистить</button>}
      </div>
      {items.length===0 ? <p className="text-slate-600">Добавьте товары к сравнению значком «весы» ⚖</p> :
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-2">
          <tbody>
            <tr>
              {items.map(p=>(
                <td key={p.id} className="align-top">
                  <Link to={`/product/${p.id}`} className="block rounded-2xl border p-3 hover:shadow">
                    <SmartImage src={p.images[0]} alt={p.title} />
                    <div className="mt-2 font-medium line-clamp-2">{p.title}</div>
                  </Link>
                </td>
              ))}
            </tr>
            <Row label="Цена" cols={cols}>{items.map(p=>formatPrice(p.price)).join('||')}</Row>
            <Row label="Категория" cols={cols}>{items.map(p=>humanCategory(p.category)).join('||')}</Row>
            <Row label="Бренд" cols={cols}>{items.map(p=>p.brand).join('||')}</Row>
            <Row label="Объём" cols={cols}>{items.map(p=>p.volume ?? '—').join('||')}</Row>
            <Row label="Состав (ключевое)" cols={cols}>{items.map(p=>(p.ingredients?.slice(0,3).join(', ')||'—')).join('||')}</Row>
            <Row label="SKU" cols={cols}>{items.map(p=>p.sku).join('||')}</Row>
            <Row label="В наличии" cols={cols}>{items.map(p=>p.stock>0?'Да':'Нет').join('||')}</Row>
          </tbody>
        </table>
      </div>}
    </div>
  )
}

function Row({ label, cols, children }: { label: string; cols: number; children: string }) {
  const values = children.split('||')
  return (
    <tr>
      {values.map((v,i)=><td key={i} className="align-top"><div className="rounded-xl border p-3 text-sm"><div className="mb-1 text-xs text-slate-500">{i===0?label:''}</div><div>{v}</div></div></td>)}
    </tr>
  )
}

function humanCategory(c: 'skincare'|'makeup'|'haircare') {
  return c === 'skincare' ? 'Уход за кожей' : c === 'makeup' ? 'Макияж' : 'Волосы'
}
