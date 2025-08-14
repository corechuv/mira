import 'dotenv/config'
const url = (process.env.VITE_SUPABASE_URL||'').replace(/\/+$/,'')
const key = process.env.VITE_SUPABASE_ANON_KEY||''
if(!url || !key){ console.error('❌ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY не заданы'); process.exit(1) }

async function probe(path){
  const r = await fetch(url + path, { headers: { apikey:key, Authorization:`Bearer ${key}` }})
  const text = await r.text()
  console.log(`\n== ${path} → ${r.status}`)
  try { console.log(JSON.parse(text)) } catch { console.log(text) }
}

await probe('/rest/v1/categories?select=*')
await probe('/rest/v1/products?select=*&limit=1')
await probe('/rest/v1/reviews?select=*&limit=1')
await probe('/rest/v1/orders?select=*&limit=1')
await probe('/rest/v1/profiles?select=role,email&limit=1')
