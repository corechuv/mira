import { supabase } from '@/lib/supabase'
export type CategoryRow = { id: string; name: string; slug: string; parent_id: string | null; sort?: number }
export type CatNode = CategoryRow & { children: CatNode[] }
const arr = <T,>(x:any):T[] => Array.isArray(x)?x:[]
export function buildTree(rows: CategoryRow[]): CatNode[] {
  const map = new Map<string, CatNode>(); const roots: CatNode[] = []
  for (const r of arr<CategoryRow>(rows)) map.set(r.id, { ...r, children: [] })
  for (const n of map.values()) (n.parent_id && map.has(n.parent_id)) ? map.get(n.parent_id)!.children.push(n) : roots.push(n)
  const sortRec = (a:CatNode[]) => { a.sort((x,y)=>(x.sort??0)-(y.sort??0)||x.name.localeCompare(y.name)); a.forEach(c=>sortRec(c.children)) }
  sortRec(roots); return roots
}
export async function fetchCategories(): Promise<CatNode[]> {
  const { data, error, status, statusText } = await supabase.from('categories').select('id,name,slug,parent_id,sort').order('sort').order('name')
  if (error) { console.warn('categories  error', status, statusText, error.message); return [] }
  return buildTree(arr(data))
}
