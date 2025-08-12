export type Review = {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

export type Variant = {
  id: string
  name: string
  price: number
  stock: number
}

export type Product = {
  id: string
  title: string
  description: string
  longDescription?: string
  price: number
  oldPrice?: number
  rating: number
  ratingCount?: number
  category: 'skincare' | 'makeup' | 'haircare'
  brand: string
  tags: string[]
  images: string[]
  stock: number
  sku: string
  volume?: string
  ingredients?: string[]
  howToUse?: string[]
  variants?: Variant[]
  reviews?: Review[]
}

export const products: Product[] = [
  {
    id: 'serum-hyaluronic-30ml',
    title: 'Сыворотка с гиалуроновой кислотой 30 мл',
    description: 'Интенсивное увлажнение и упругость кожи. Подходит для всех типов.',
    longDescription: 'Лёгкая текстура быстро впитывается, усиливает барьерные функции кожи и повышает её эластичность. Без отдушек.',
    price: 1290,
    oldPrice: 1490,
    rating: 4.7,
    ratingCount: 214,
    category: 'skincare',
    brand: 'Mira',
    tags: ['увлажнение', 'сияние', 'anti-age'],
    images: [
      'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 42,
    sku: 'MIRA-SER-HA-30',
    volume: '30 мл',
    ingredients: ['Гиалуроновая кислота 2%', 'Пантенол', 'Бетаин'],
    howToUse: ['Наносить на влажную кожу после тонера', 'Закрыть кремом'],
    variants: [
      { id: '30', name: '30 мл', price: 1290, stock: 42 },
      { id: '50', name: '50 мл', price: 1690, stock: 15 }
    ],
    reviews: [
      { id: 'r1', author: 'Анна', rating: 5, text: 'Классное увлажнение, макияж лежит лучше.', date: '2025-06-10' }
    ]
  },
  {
    id: 'cleanser-gentle-150ml',
    title: 'Деликатный гель-клензер 150 мл',
    description: 'Мягко очищает, не пересушивая. pH-сбалансированная формула.',
    longDescription: 'Подходит для ежедневного умывания утром и вечером. Не содержит SLS/SLES.',
    price: 890,
    rating: 4.5,
    ratingCount: 128,
    category: 'skincare',
    brand: 'Mira',
    tags: ['очищение', 'без сульфатов'],
    images: [
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 80,
    sku: 'MIRA-CLN-GNT-150',
    volume: '150 мл',
    ingredients: ['Кокоглюкозид', 'Бетаин', 'Экстракт ромашки'],
    howToUse: ['Смочить лицо', 'Вспенить гель и массировать 30 сек', 'Смыть тёплой водой']
  },
  {
    id: 'spf-50-light',
    title: 'Крем SPF 50 PA++++ (легкая текстура)',
    description: 'Широкий спектр защиты без белых следов. Для города и отпуска.',
    price: 1590,
    rating: 4.8,
    ratingCount: 356,
    category: 'skincare',
    brand: 'Mira',
    tags: ['spf', 'дневной уход'],
    images: [
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 35,
    sku: 'MIRA-SPF-50L',
    volume: '50 мл',
    ingredients: ['UVA/UVB фильтры', 'Витамин Е', 'Ниацинамид'],
    howToUse: ['Нанести за 15 минут до выхода', 'Обновлять каждые 2–3 часа']
  },
  {
    id: 'lipstick-matte-rose',
    title: 'Помада матовая «Rose»',
    description: 'Насыщенный цвет и комфортное матовое покрытие на весь день.',
    price: 990,
    oldPrice: 1190,
    rating: 4.6,
    ratingCount: 98,
    category: 'makeup',
    brand: 'Mira',
    tags: ['губы', 'матовая'],
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 21,
    sku: 'MIRA-LIP-ROSE',
    ingredients: ['Витамин Е', 'Масло ши'],
    howToUse: ['Нанести на подготовленные губы', 'При желании — контурный карандаш']
  },
  {
    id: 'mascara-volume-black',
    title: 'Тушь для ресниц Volume Black',
    description: 'Объем и разделение без комочков. Устойчивая формула.',
    price: 790,
    rating: 4.4,
    ratingCount: 143,
    category: 'makeup',
    brand: 'Mira',
    tags: ['ресницы', 'объем'],
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 64,
    sku: 'MIRA-MSC-VOL'
  },
  {
    id: 'shampoo-repair-250',
    title: 'Шампунь восстановление 250 мл',
    description: 'Кератиновый комплекс для гладкости и блеска волос.',
    price: 690,
    rating: 4.3,
    ratingCount: 77,
    category: 'haircare',
    brand: 'Mira',
    tags: ['восстановление', 'кератин'],
    images: [
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 58,
    sku: 'MIRA-SHM-RPR-250',
    volume: '250 мл'
  },
  {
    id: 'conditioner-nutrition-250',
    title: 'Бальзам-кондиционер питание 250 мл',
    description: 'Масла арганы и макадамии для шелковистости и легкого расчесывания.',
    price: 720,
    rating: 4.2,
    ratingCount: 65,
    category: 'haircare',
    brand: 'Mira',
    tags: ['питание', 'гладкость'],
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 77,
    sku: 'MIRA-COND-NUT-250',
    volume: '250 мл'
  },
  {
    id: 'toner-balancing-150',
    title: 'Тоник балансирующий 150 мл',
    description: 'Восстанавливает pH, уменьшает жирный блеск, с ниацинамидом.',
    price: 650,
    rating: 4.1,
    ratingCount: 51,
    category: 'skincare',
    brand: 'Mira',
    tags: ['ниацинамид', 'pH'],
    images: [
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 90,
    sku: 'MIRA-TON-BAL-150',
    volume: '150 мл'
  },
  {
    id: 'oil-cleansing-100',
    title: 'Гидрофильное масло 100 мл',
    description: 'Эффективно растворяет SPF и макияж, не забивает поры.',
    price: 1150,
    rating: 4.5,
    ratingCount: 84,
    category: 'skincare',
    brand: 'Mira',
    tags: ['двойное очищение'],
    images: [
      'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 50,
    sku: 'MIRA-OIL-CLN-100',
    volume: '100 мл'
  },
  {
    id: 'hand-cream-50',
    title: 'Крем для рук 50 мл',
    description: 'Питание и защита, быстро впитывается, без липкости.',
    price: 390,
    rating: 4.0,
    ratingCount: 120,
    category: 'skincare',
    brand: 'Mira',
    tags: ['руки', 'питание'],
    images: [
      'https://images.unsplash.com/photo-1611501275019-f6b3e12dc1f2?q=80&w=1600&auto=format&fit=crop'
    ],
    stock: 120,
    sku: 'MIRA-HAND-CRM-50',
    volume: '50 мл'
  }
]
