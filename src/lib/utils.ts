export function cn(...cls: Array<string | undefined | false>) {
  return cls.filter(Boolean).join(' ')
}

export function formatPrice(v: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v)
}
