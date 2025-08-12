export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
const LOCALE = import.meta.env.VITE_LOCALE ?? 'de-DE'
const CURRENCY = import.meta.env.VITE_CURRENCY ?? 'EUR'
export function formatPrice(value: number) {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(value)
}
