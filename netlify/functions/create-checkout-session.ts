import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { handleOptions, okJSON, errJSON, getBaseUrl } from './_helpers'

const stripeKey = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2024-06-20' } as any) : null

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions()
  try {
    if (!stripe) return errJSON('Stripe not configured (STRIPE_SECRET_KEY missing)', 500)
    const body = JSON.parse(event.body || '{}')
    const { items, contact, shipping, user_id } = body
    if (!Array.isArray(items) || !items.length) return errJSON('Empty items', 400)

    const line_items = items.map((it:any)=>({
      quantity: it.qty,
      price_data: { currency: 'eur', product_data: { name: it.title }, unit_amount: Math.round(it.price * 100) }
    }))
    const base = getBaseUrl(event)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${base}/checkout?success=1`,
      cancel_url: `${base}/checkout?canceled=1`,
      allow_promotion_codes: true,
      customer_email: contact?.email,
      metadata: { user_id: user_id || '', contact: JSON.stringify(contact||{}), shipping: JSON.stringify(shipping||{}) }
    })
    return okJSON({ url: session.url })
  } catch (e:any) {
    console.error(e); return errJSON(e.message || 'stripe error', 500)
  }
}
