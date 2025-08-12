import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { bodyBuffer, okJSON, errJSON } from './_helpers'
import { sendOrderEmail } from '../../server/email'
import { getSupabaseAdmin } from '../../server/supabaseAdmin'

const stripeKey = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2024-06-20' } as any) : null

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, body: '' }
  try {
    if (!stripe) return errJSON('Stripe not configured', 500)
    const sig = event.headers['stripe-signature'] as string
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
    const buf = bodyBuffer(event)
    const eventObj = stripe.webhooks.constructEvent(buf, sig, whSecret)

    if (eventObj.type === 'checkout.session.completed') {
      const session = eventObj.data.object as Stripe.Checkout.Session
      const line = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
      const items = line.data.map(li => ({
        title: li.description || li.price?.nickname || 'Товар',
        price: (li.amount_subtotal ?? li.amount_total ?? 0) / 100 / (li.quantity || 1),
        qty: li.quantity || 1,
      }))
      const contact = JSON.parse((session.metadata?.contact || '{}') as string)
      const shipping = JSON.parse((session.metadata?.shipping || '{}') as string)
      const amount = (session.amount_total || 0) / 100

      const supabase = getSupabaseAdmin()
      let id = `MIRA-${session.id.slice(-8).toUpperCase()}`
      if (supabase) {
        const { data, error } = await supabase.from('orders').insert({
          user_id: session.metadata?.user_id || null,
          items, amount,
          currency: (session.currency || 'rub').toUpperCase(),
          contact, shipping,
          status: 'paid'
        }).select('id').single()
        if (!error && data?.id) id = data.id
      }
      const to = session.customer_details?.email
      if (to) {
        const html = renderEmailHtml(id, items, amount, shipping?.cost || 0, true)
        await sendOrderEmail(to, `Оплата получена — заказ ${id}`, html)
      }
    }

    return okJSON({ received: true })
  } catch (e:any) {
    console.error('Webhook error', e)
    return errJSON(e.message || 'webhook error', 400)
  }
}

function renderEmailHtml(orderId: string, items: any[], amount: number, shipping: number, paid=false) {
  const rows = (items||[]).map((i:any)=>`<tr><td style="padding:6px 12px;">${i.title}</td><td style="padding:6px 12px;" align="right">× ${i.qty}</td></tr>`).join('')
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:#3e7ff5;color:#fff;padding:14px 18px;font-weight:700">Mira — подтверждение заказа</div>
    <div style="padding:16px">
      <p>Спасибо! Ваш заказ <b>${orderId}</b> ${paid ? 'оплачен' : 'создан'}.</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin-top:8px">Доставка: ${shipping} ₽</p>
      <p style="font-weight:700">Итого: ${amount} ₽</p>
    </div>
  </div>`
}
