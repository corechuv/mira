import type { Handler } from '@netlify/functions'
import { json } from './_shared/json'

export const handler: Handler = async () => {
  const envKeys = [
    'VITE_SITE_URL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ]
  const env = Object.fromEntries(envKeys.map(k => [k, process.env[k] ? '✔︎ set' : '✖ not set']))
  return json(200, { ok: true, env })
}
