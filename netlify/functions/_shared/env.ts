export const env = {
  SITE_URL: process.env.VITE_SITE_URL || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}
export function requireEnv<K extends keyof typeof env>(k: K): string {
  const v = env[k]; if(!v) throw new Error(`Missing env: ${k}`); return v
}
