export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
const LOCALE = import.meta.env.VITE_LOCALE ?? 'de-DE'
const CURRENCY = import.meta.env.VITE_CURRENCY ?? 'EUR'
export function toAmount(x: any): number {
  const n = Number(x)
  return Number.isFinite(n) ? n : 0
}
export function formatPrice(value: any) {
  const n = toAmount(value)
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(n)
}
