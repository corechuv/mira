import { useMemo } from 'react'

type Props = {
  q: string
  setQ: (v: string) => void
  brand: string | undefined
  setBrand: (v: string) => void
  priceMin?: number
  priceMax?: number
  setPrice: (min?: number, max?: number) => void
  allBrands?: string[] | null
}

export default function Filters({
  q,
  setQ,
  brand,
  setBrand,
  priceMin,
  priceMax,
  setPrice,
  allBrands = [],
}: Props) {
  const brands = useMemo<string[]>(
    () =>
      Array.isArray(allBrands)
        ? Array.from(new Set(allBrands.filter(Boolean))).sort((a, b) =>
            a.localeCompare(b),
          )
        : [],
    [allBrands],
  )

  const onMin = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(e.target.value ? Number(e.target.value) : undefined, priceMax)
  const onMax = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(priceMin, e.target.value ? Number(e.target.value) : undefined)

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">Поиск</span>
        <input
          className="input w-56"
          placeholder="Название, бренд…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">Бренд</span>
        <select
          className="input w-48"
          value={brand || ''}
          onChange={(e) => setBrand(e.target.value || '')}
        >
          <option value="">Все бренды</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">Цена от</span>
          <input
            className="input w-28"
            type="number"
            min={0}
            step="0.01"
            value={priceMin ?? ''}
            onChange={onMin}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">до</span>
          <input
            className="input w-28"
            type="number"
            min={0}
            step="0.01"
            value={priceMax ?? ''}
            onChange={onMax}
          />
        </label>
      </div>
    </div>
  )
}
