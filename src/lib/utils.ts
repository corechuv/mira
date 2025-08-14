export const CURRENCY = (import.meta.env.VITE_CURRENCY || 'EUR') as string
export const LOCALE   = (import.meta.env.VITE_LOCALE   || 'de-DE') as string

/** Форматирование цены в валюте локали (по умолчанию EUR, de-DE) */
export function formatPrice(value?: number | string): string {
  const n = Number(value ?? 0)
  const safe = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe)
}

/** Скидка в процентах: old → new. Возвращает целое от 0 до 99. */
export function percentOff(oldPrice: number, newPrice: number): number {
  const oldN = Number(oldPrice)
  const newN = Number(newPrice)
  if (!Number.isFinite(oldN) || !Number.isFinite(newN) || oldN <= 0) return 0
  const pct = Math.round(100 - (newN / oldN) * 100)
  return Math.max(0, Math.min(99, pct))
}

/** Утилита склейки классов (упрощённый classnames) */
export function cn(...args: any[]): string {
  const out: string[] = []
  for (const a of args) {
    if (!a) continue
    if (typeof a === 'string') out.push(a)
    else if (Array.isArray(a)) out.push(cn(...a))
    else if (typeof a === 'object') {
      for (const [k, v] of Object.entries(a)) if (v) out.push(k)
    }
  }
  return out.join(' ')
}

/** Безопасное приведение к числу */
export function toNumber(x: any, fallback = 0): number {
  const n = Number(x)
  return Number.isFinite(n) ? n : fallback
}
