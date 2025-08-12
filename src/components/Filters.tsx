import { Select } from './ui/select'
import { useMemo } from 'react'

export type Filters = { q?: string; category?: string; brand?: string; sort?: string; priceMin?: string; priceMax?: string }

export default function Filters({ value, onChange, allBrands }: { value: Filters; onChange: (v: Filters) => void; allBrands: string[] }) {
  const brands = useMemo(() => ['Все бренды', ...allBrands], [allBrands])
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
      <input className="input" placeholder="Поиск…"
        value={value.q ?? ''} onChange={e => onChange({ ...value, q: e.target.value })} />
      <Select value={value.category ?? ''} onChange={e => onChange({ ...value, category: e.target.value })}>
        <option value="">Все категории</option>
        <option value="skincare">Уход за кожей</option>
        <option value="makeup">Макияж</option>
        <option value="haircare">Волосы</option>
      </Select>
      <Select value={value.brand ?? ''} onChange={e => onChange({ ...value, brand: e.target.value })}>
        {brands.map((b,i)=><option key={i} value={i===0?'':b}>{b}</option>)}
      </Select>
      <Select value={value.sort ?? ''} onChange={e => onChange({ ...value, sort: e.target.value })}>
        <option value="">Сортировка</option>
        <option value="price-asc">Сначала дешевле</option>
        <option value="price-desc">Сначала дороже</option>
        <option value="rating-desc">По рейтингу</option>
      </Select>
      <input className="input" type="number" placeholder="Цена от" value={value.priceMin ?? ''} onChange={e => onChange({ ...value, priceMin: e.target.value })} />
      <input className="input" type="number" placeholder="Цена до" value={value.priceMax ?? ''} onChange={e => onChange({ ...value, priceMax: e.target.value })} />
    </div>
  )
}
