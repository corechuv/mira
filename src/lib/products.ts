import { supabase } from '@/lib/supabase'

export type ProductRow = {
  id: string
  slug: string
  title: string
  short?: string | null
  price: number
  currency: string
  stock: number
  active: boolean
  brand?: string | null
  images?: string[] | null
  specs?: Record<string, any> | null
  category_id?: string | null
  created_at?: string
}

type ListParams = {
  q?: string
  catId?: string
  sort?: 'new'|'price-asc'|'price-desc'
  offset?: number
  limit?: number
  activeOnly?: boolean
}

export async function fetchProducts(params: ListParams = {}) {
  const { q, catId, sort='new', offset=0, limit=24, activeOnly=true } = params
  let query = supabase.from('products').select('*', { count: 'exact' })
  if (activeOnly) query = query.eq('active', true)
  if (q && q.trim()) query = query.ilike('title', `%${q.trim()}%`)
  if (catId) query = query.eq('category_id', catId)

  if (sort === 'price-asc') query = query.order('price', { ascending: true })
  else if (sort === 'price-desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query
  if (error) { console.warn('fetchProducts error:', error.message); return { items: [], total: 0 } }
  return { items: (data || []) as ProductRow[], total: count || 0 }
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).limit(1)
  if (error) { console.warn('fetchProductBySlug:', error.message); return null }
  return (data && data[0]) ? (data[0] as ProductRow) : null
}

/** Универсально: ищем по slug или по id; с фолбэками и без maybeSingle() */
export async function fetchProductByParam(param: string) {
  const val = (param || '').trim()
  if (!val) return null
  const looksUuid = /^[0-9a-fA-F-]{32,}$/.test(val)

  // 1) точный id/slug с limit(1) через SDK
  try {
    let q = supabase.from('products').select('*').limit(1)
    const r = looksUuid ? await q.or(`id.eq.${val},slug.eq.${val}`) : await q.eq('slug', val)
    if (!r.error && r.data && r.data[0]) return r.data[0] as ProductRow
  } catch (e:any) { console.warn('fetch exact failed:', e?.message||e) }

  // 2) кандидаты: lower-case, пробелы -> дефисы
  const candidates = Array.from(new Set([
    val,
    val.toLowerCase(),
    val.replace(/\s+/g,'-'),
    val.toLowerCase().replace(/\s+/g,'-').replace(/-+/g,'-')
  ])).filter(Boolean)
  for (const s of candidates) {
    try {
      const r2 = await supabase.from('products').select('*').eq('slug', s).limit(1)
      if (r2.data && r2.data[0]) return r2.data[0] as ProductRow
    } catch {}
  }

  // 3) мягкий поиск slug ilike
  try {
    const r3 = await supabase.from('products').select('*').ilike('slug', `%${val}%`).limit(1)
    if (r3.data && r3.data[0]) return r3.data[0] as ProductRow
  } catch {}

  // 4) REST-фолбэк (на случай глюка SDK)
  try {
    const base = (import.meta as any).env?.VITE_SUPABASE_URL || ''
    const key  = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''
    if (base && key) {
      const baseUrl = base.replace(/\/+$/,'')
      // exact
      const u = new URL(baseUrl + '/rest/v1/products')
      u.searchParams.set('select', '*')
      if (looksUuid) u.searchParams.set('or', `slug.eq.${val},id.eq.${val}`)
      else u.searchParams.set('slug', `eq.${val}`)
      u.searchParams.set('limit', '1')
      const r = await fetch(u.toString(), { headers: { apikey: key, Authorization: `Bearer ${key}` } })
      if (r.ok) { const arr = await r.json(); if (Array.isArray(arr) && arr[0]) return arr[0] as ProductRow }
      // ilike
      const u2 = new URL(baseUrl + '/rest/v1/products')
      u2.searchParams.set('select', '*')
      u2.searchParams.set('slug', `ilike.%${val}%`)
      u2.searchParams.set('limit', '1')
      const r2 = await fetch(u2.toString(), { headers: { apikey: key, Authorization: `Bearer ${key}` } })
      if (r2.ok) { const arr2 = await r2.json(); if (Array.isArray(arr2) && arr2[0]) return arr2[0] as ProductRow }
    }
  } catch (e:any) { console.warn('REST fallback failed:', e?.message||e) }

  console.warn('[fetchProductByParam] not found for:', val)
  return null
}

export async function fetchRelated(categoryId: string | null | undefined, skipId: string, limit=8) {
  if (!categoryId) return []
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('active', true)
    .neq('id', skipId)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data || []).slice(0, limit) as ProductRow[]
}
