import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/+$/,'')
const anon = process.env.VITE_SUPABASE_ANON_KEY || ''
const isLocal = /localhost|127\.0\.0\.1|:54321/.test(url)

if (!url || !anon) {
  console.error('❌ Нужно задать VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env.local')
  process.exit(1)
}
console.log('URL:', url)
console.log('Project ref:', (url.match(/^https:\/\/([a-z0-9]{20,})\.supabase\.(co|in)$/)||[])[1] || '(n/a)')
console.log('Local URL? ', isLocal ? 'YES' : 'no')

const supa = createClient(url, anon, { auth: { persistSession: false } })

try {
  const { data, error } = await supa.from('categories').select('*').limit(1)
  if (error) throw error
  console.log('✅ Подключение работает. Пример rows:', data?.length||0)
} catch (e) {
  console.error('❌ Ошибка запроса:', e.message || e)
  process.exit(2)
}
