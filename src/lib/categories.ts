import { supabase } from '@/lib/supabase'

export type CategoryRow = { id: string; slug: string; name: string; parent_id: string | null; sort: number }
export type CatNode = { id: string; slug: string; name: string; children: CatNode[] }

let cacheRows: CategoryRow[] | null = null

export async function fetchCategories(): Promise<CategoryRow[]> {
  if (cacheRows) return cacheRows
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id,slug,name,parent_id,sort')
      .order('parent_id', { ascending: true })
      .order('sort', { ascending: true })
      .order('name', { ascending: true })
    if (error) throw error
    cacheRows = data || []
    return cacheRows
  } catch (_e) {
    // Фолбэк на случай без БД: 3 уровня
    const r = (arr: any[]) => arr as CategoryRow[]
    cacheRows = r([
      { id: 'l1-skin', slug: 'skincare', name: 'Уход за кожей', parent_id: null, sort: 1 },
      { id: 'l1-mu', slug: 'makeup', name: 'Макияж', parent_id: null, sort: 2 },
      { id: 'l1-hair', slug: 'haircare', name: 'Волосы', parent_id: null, sort: 3 },

      { id: 'l2-cleansers', slug: 'cleansers', name: 'Очищение', parent_id: 'l1-skin', sort: 1 },
      { id: 'l2-serums', slug: 'serums', name: 'Сыворотки', parent_id: 'l1-skin', sort: 2 },
      { id: 'l2-spf', slug: 'spf', name: 'SPF', parent_id: 'l1-skin', sort: 3 },

      { id: 'l2-lips', slug: 'lips', name: 'Губы', parent_id: 'l1-mu', sort: 1 },
      { id: 'l2-eyes', slug: 'eyes', name: 'Глаза', parent_id: 'l1-mu', sort: 2 },

      { id: 'l2-shampoo', slug: 'shampoo', name: 'Шампуни', parent_id: 'l1-hair', sort: 1 },
      { id: 'l2-masks', slug: 'masks', name: 'Маски', parent_id: 'l1-hair', sort: 2 },

      { id: 'l3-gel', slug: 'gel', name: 'Гели', parent_id: 'l2-cleansers', sort: 1 },
      { id: 'l3-foam', slug: 'foam', name: 'Пенки', parent_id: 'l2-cleansers', sort: 2 },
      { id: 'l3-oil', slug: 'oil', name: 'Масла', parent_id: 'l2-cleansers', sort: 3 },

      { id: 'l3-ha', slug: 'ha', name: 'Гиалуроновые', parent_id: 'l2-serums', sort: 1 },
      { id: 'l3-nia', slug: 'niacinamide', name: 'С ниацинамидом', parent_id: 'l2-serums', sort: 2 },

      { id: 'l3-matte', slug: 'matte', name: 'Матовые', parent_id: 'l2-lips', sort: 1 },

      { id: 'l3-vol', slug: 'volumizing', name: 'Для объёма', parent_id: 'l2-shampoo', sort: 1 },
      { id: 'l3-repair', slug: 'repair', name: 'Восстановление', parent_id: 'l2-masks', sort: 1 },
    ])
    return cacheRows
  }
}

export function buildTree(rows: CategoryRow[]): CatNode[] {
  const byId = new Map<string, CatNode>()
  const roots: CatNode[] = []
  for (const r of rows) byId.set(r.id, { id: r.id, slug: r.slug, name: r.name, children: [] })
  for (const r of rows) {
    const node = byId.get(r.id)!
    if (r.parent_id) {
      const parent = byId.get(r.parent_id)
      if (parent) parent.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}
