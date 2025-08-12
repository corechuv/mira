import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { requireEnv } from './_shared/env'
import { sendOrderEmail } from '../../server/email'

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}')
    const supa = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'))
    const id = `MIRA-${Math.random().toString(36).slice(2,8).toUpperCase()}`
    await supa.from('orders').insert({
      user_id: body.user_id || null,
      items: body.items || [],
      amount: Number(body.amount || 0),
      currency: 'EUR',
      contact: body.contact || {},
      shipping: body.shipping || {},
      status: 'new'
    })
    // письмо клиенту
    try { await sendOrderEmail({ id, ...body, currency: 'EUR' }) } catch(e){ console.error('email failed', (e as any).message) }
    return { statusCode: 200, body: JSON.stringify({ id }) }
  } catch (err:any) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'error' }) }
  }
}
