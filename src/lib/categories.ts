import { supabase } from '@/lib/supabase'

export type CategoryRow = {
  id: string
  slug: string
  name: string
  parent_id: string | null
  sort?: number | null
}

export type CategoryTreeNode = CategoryRow & { children: CategoryTreeNode[] }

/** Плоский список категорий (id, slug, name, parent_id, sort) */
export async function fetchCategoriesFlat(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id,slug,name,parent_id,sort')
    .order('sort', { ascending: true })
    .order('name', { ascending: true })
  if (error) {
    console.warn('fetchCategoriesFlat:', error.message)
    return []
  }
  return (data || []) as CategoryRow[]
}

/** СОВМЕСТИМОСТЬ: старое имя, которое ждут существующие компоненты */
export async function fetchCategories(): Promise<CategoryRow[]> {
  return fetchCategoriesFlat()
}

/** Строим дерево из плоского списка */
export function makeCategoryTree(rows: CategoryRow[]): CategoryTreeNode[] {
  const byId = new Map<string, CategoryTreeNode>()
  const roots: CategoryTreeNode[] = []
  for (const r of rows) byId.set(r.id, { ...r, children: [] })
  for (const r of rows) {
    const n = byId.get(r.id)!
    const pid = r.parent_id
    if (pid && byId.has(pid)) byId.get(pid)!.children.push(n)
    else roots.push(n)
  }
  // опционально: сортировка по sort/name уже сделана запросом
  return roots
}

/** Дерево категорий, готовое к показу в мегаменю */
export async function fetchCategoriesTree(): Promise<CategoryTreeNode[]> {
  const rows = await fetchCategoriesFlat()
  return makeCategoryTree(rows)
}

/** Резолв id по slug/id (если это UUID — возвращаем как есть) */
export async function resolveCategoryId(slugOrId: string): Promise<string | null> {
  const v = (slugOrId || '').trim()
  if (!v) return null
  if (/^[0-9a-fA-F-]{32,}$/.test(v)) return v
  const { data, error } = await supabase.from('categories').select('id').eq('slug', v).limit(1)
  if (error) return null
  return data?.[0]?.id || null
}

/** Карта детей: parent_id -> [id, id, ...] */
export function buildChildrenMap(rows: CategoryRow[]) {
  const map = new Map<string, string[]>()
  for (const r of rows) {
    const pid = r.parent_id || 'root'
    if (!map.has(pid)) map.set(pid, [])
    map.get(pid)!.push(r.id)
  }
  return map
}

/** Собираем все потомки (включая корень) */
export function collectDescendantIds(rootId: string, cmap: Map<string, string[]>) {
  const acc: string[] = [rootId]
  const stack = [rootId]
  while (stack.length) {
    const id = stack.pop()!
    const kids = cmap.get(id) || []
    for (const k of kids) { acc.push(k); stack.push(k) }
  }
  return Array.from(new Set(acc))
}

/** Выбранная категория + все её потомки (список id) */
export async function resolveCategoryAndDescendants(slugOrId: string) {
  const rootId = await resolveCategoryId(slugOrId)
  if (!rootId) return []
  const flat = await fetchCategoriesFlat()
  const cmap = buildChildrenMap(flat)
  return collectDescendantIds(rootId, cmap)
}
