import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { env, requireEnv } from './_shared/env'
import { createClient } from '@supabase/supabase-js'

export const config = { path: "/api/webhook/stripe" } // Netlify routes

export const handler: Handler = async (event) => {
  try {
    const sig = (event.headers['stripe-signature'] || event.headers['Stripe-Signature']) as string
    if (!sig) return { statusCode: 400, body: 'Missing stripe-signature' }

    const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), { apiVersion: '2024-06-20' } as any)
    const whSecret = requireEnv('STRIPE_WEBHOOK_SECRET')
    const raw = Buffer.from(event.body || '')

    let evt: Stripe.Event
    try {
      evt = stripe.webhooks.constructEvent(raw, sig, whSecret)
    } catch (e:any) {
      console.error('Webhook signature failed', e.message)
      return { statusCode: 400, body: `Webhook Error: ${e.message}` }
    }

    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object as Stripe.Checkout.Session
      const line = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
      const items = line.data.map(li => ({
        title: li.description || li.price?.nickname || 'Товар',
        price: ((li.amount_subtotal ?? li.amount_total ?? 0) / 100) / (li.quantity || 1),
        qty: li.quantity || 1,
      }))
      const amount = (session.amount_total || 0) / 100
      const contact = JSON.parse((session.metadata?.contact || '{}') as string)
      const shipping = JSON.parse((session.metadata?.shipping || '{}') as string)

      // Supabase (service role)
      const supa = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'))
      const id = `MIRA-${session.id.slice(-8).toUpperCase()}`
      await supa.from('orders').insert({
        user_id: session.metadata?.user_id || null,
        items, amount, currency: (session.currency || 'eur').toUpperCase(),
        contact, shipping, status: 'paid', ext_id: session.id
      })
    }

    return { statusCode: 200, body: 'ok' }
  } catch (err:any) {
    console.error(err)
    return { statusCode: 500, body: err?.message || 'server error' }
  }
}
