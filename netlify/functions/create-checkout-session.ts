import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { env, requireEnv } from './_shared/env'

export const handler: Handler = async (event) => {
  try {
    const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), { apiVersion: '2024-06-20' } as any)
    const origin = (event.headers.origin as string) || env.SITE_URL || 'http://localhost:5173'
    const body = JSON.parse(event.body || '{}')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${origin}/checkout?success=1`,
      cancel_url: `${origin}/checkout?canceled=1`,
      currency: 'eur',
      line_items: (body.items || []).map((i: any) => ({
        quantity: i.qty || 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(Number(i.price) * 100),
          product_data: { name: i.title || 'Product' }
        }
      })),
      metadata: {
        user_id: body.user_id || '',
        contact: JSON.stringify(body.contact || {}),
        shipping: JSON.stringify(body.shipping || {})
      }
    })
    return { statusCode: 200, body: JSON.stringify({ id: session.id, url: session.url }) }
  } catch (err:any) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Stripe error' }) }
  }
}
