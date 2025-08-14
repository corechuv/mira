import { createClient } from '@supabase/supabase-js'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || ''
const url = rawUrl.replace(/\/+$/, '') // без хвостового /
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || ''

const isLocal = /localhost|127\.0\.0\.1|:54321/.test(url)
const refMatch = url.match(/^https:\/\/([a-z0-9]{20,})\.supabase\.(co|in)$/)

if (!url || !anon) {
  console.error('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  throw new Error('Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}
if (isLocal) {
  console.warn('[Supabase] URL выглядит локальным:', url, '— убедись, что это не local dev инстанс.')
}
if (!refMatch) {
  console.warn('[Supabase] URL не похож на прод/облачный вид *.supabase.co|in →', url)
}

export const SUPA_INFO = {
  url,
  projectRef: refMatch?.[1] || null,
  region: refMatch?.[2] || null,
  isLocal,
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
})
