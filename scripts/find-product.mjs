import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

import { createClient } from '@supabase/supabase-js'
const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/+$/,'')
const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
if (!url || !anon) {
  console.error('❌ Missing env. Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}
const supa = createClient(url, anon)

const val = (process.argv[2]||'').trim()
if (!val) { console.log('Usage: node scripts/find-product.mjs <slug-or-id>'); process.exit(1) }

const looksUuid = /^[0-9a-fA-F-]{32,}$/.test(val)

async function run(){
  let q = supa.from('products').select('id,slug,title,active').limit(1)
  let r = looksUuid
    ? await q.or(`id.eq.${val},slug.eq.${val}`)
    : await q.eq('slug', val)
  console.log('\nexact:', { status: r.status, error: r.error?.message, rows: r.data })
  if (!r.data?.length) {
    const cand = Array.from(new Set([
      val,
      val.toLowerCase(),
      val.replace(/\s+/g,'-'),
      val.toLowerCase().replace(/\s+/g,'-').replace(/-+/g,'-'),
    ])).filter(Boolean)
    for (const s of cand) {
      const r2 = await supa.from('products').select('id,slug,title').eq('slug', s).limit(1)
      if (r2.data?.length) { console.log('candidate:', s, r2.data); return }
    }
    const r3 = await supa.from('products').select('id,slug,title').ilike('slug', `%${val}%`).limit(5)
    console.log('ilike:', { status: r3.status, error: r3.error?.message, rows: r3.data })
  }
}
run()
