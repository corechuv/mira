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
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }
/** Скидка в процентах: old→new. Возвращает целое от 0 до 99. */
export function percentOff(oldPrice: number, newPrice: number): number {
  const oldN = Number(oldPrice);
  const newN = Number(newPrice);
  if (!isFinite(oldN) || !isFinite(newN) || oldN <= 0) return 0;
  const pct = Math.round(100 - (newN / oldN) * 100);
  return Math.max(0, Math.min(99, pct));
}
).format(n)
}
