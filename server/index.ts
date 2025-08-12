import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import Stripe from 'stripe'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { sendOrderEmail } from './email.js'
import { getSupabaseAdmin } from './supabaseAdmin.js'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })

const stripeSecret = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' } as any) : null

const app = express()
app.set('trust proxy', 1)

// Helmet (безопасные заголовки)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// Gzip/deflate
app.use(compression())

// Строгий CORS: читаем из CORS_ORIGIN (через запятую) или FALLBACK_SITE
{
  const allowedEnv = (process.env.CORS_ORIGIN || process.env.VITE_SITE_URL || 'http://localhost:5173').split(',').map(s=>s.trim())
  app.use(cors({
    origin: (origin, cb) => !origin || allowedEnv.includes(origin) ? cb(null,true) : cb(new Error('CORS blocked')),
    credentials: true
  }))
}

// Rate limit на API
const limiter = rateLimit({ windowMs: 15*60*1000, max: 300 })
app.use('/api/', limiter)

const PORT = Number(process.env.PORT || 8787)
const FALLBACK_SITE = process.env.VITE_SITE_URL || 'http://localhost:5173'
const getBaseUrl = (req: any) => (req.headers.origin as string) || FALLBACK_SITE

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// --- Stripe webhook (RAW body, до json-парсера) ---
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(500).send('Stripe not configured')
  const sig = req.headers['stripe-signature'] as string
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, whSecret)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
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
    return res.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err?.message || err)
    return res.status(400).send(`Webhook Error: ${err?.message || 'unknown'}`)
  }
})

// JSON для остальных API
app.use(express.json({ limit: '1mb' }))

// Создание Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe not configured (STRIPE_SECRET_KEY missing)' })
    const { items, contact, shipping, user_id } = req.body as any
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Empty items' })
    const line_items = items.map((it: any) => ({
      quantity: it.qty,
      price_data: { currency: 'rub', product_data: { name: it.title }, unit_amount: Math.round(it.price * 100) }
    }))
    const base = getBaseUrl(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${base}/checkout?success=1`,
      cancel_url: `${base}/checkout?canceled=1`,
      allow_promotion_codes: true,
      customer_email: contact?.email,
      metadata: { user_id: user_id || '', contact: JSON.stringify(contact || {}), shipping: JSON.stringify(shipping || {}) }
    })
    return res.json({ url: session.url })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'stripe error' })
  }
})

// Оформление заказа (наложенный платёж) + письмо
app.post('/api/place-order', async (req, res) => {
  try {
    const { items, amount, contact, shipping, user_id } = req.body as any
    const supabase = getSupabaseAdmin()
    let id = `MIRA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    if (supabase) {
      const { data, error } = await supabase.from('orders').insert({
        user_id: user_id || null,
        items, amount, currency: 'RUB', contact, shipping, status: 'new'
      }).select('id').single()
      if (!error && data?.id) id = data.id
    }
    if (contact?.email) {
      const html = renderEmailHtml(id, items, amount, shipping?.cost || 0)
      await sendOrderEmail(contact.email, `Ваш заказ ${id} — подтверждение`, html)
    }
    return res.json({ id })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'order error' })
  }
})

// OG image (SVG): /api/og?title=...&price=...&brand=...&theme=light|dark
app.get('/api/og', (req, res) => {
  const title = (req.query.title as string) || 'Mira'
  const price = (req.query.price as string) || ''
  const brand = (req.query.brand as string) || 'Mira'
  const theme = (req.query.theme as string) || 'light'
  const bg = theme === 'dark' ? '#0b1220' : '#ffffff'
  const fg = theme === 'dark' ? '#ffffff' : '#0b1220'
  const accent = '#3e7ff5'
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.15"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="40" y="40" width="1120" height="550" rx="32" fill="url(#g)"/>
  <text x="80" y="140" fill="${accent}" font-family="Inter,ui-sans-serif" font-size="42" font-weight="700">${escapeXml(brand)}</text>
  <text x="80" y="230" fill="${fg}" font-family="Inter,ui-sans-serif" font-size="60" font-weight="800">${escapeXml(title)}</text>
  ${price ? `<text x="80" y="300" fill="${fg}" font-family="Inter,ui-sans-serif" font-size="36" font-weight="600">${escapeXml(price)} ₽</text>`: ''}
  <text x="80" y="520" fill="${fg}" opacity="0.7" font-family="Inter,ui-sans-serif" font-size="28">mira.shop</text>
</svg>`
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
  res.send(svg)
})

// --- статика и SPA-фолбэк (не перехватывает /api/*) ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../dist')
app.use(express.static(distPath))
app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')))

// --- start ---
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))

function renderEmailHtml(orderId: string, items: any[], amount: number, shipping: number, paid = false) {
  const rows = items.map(i => `<tr><td style="padding:6px 12px;">${escapeXml(i.title)}</td><td style="padding:6px 12px;" align="right">× ${i.qty}</td></tr>`).join('')
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:#3e7ff5;color:#fff;padding:14px 18px;font-weight:700">Mira — подтверждение заказа</div>
    <div style="padding:16px">
      <p>Спасибо! Ваш заказ <b>${orderId}</b> ${paid ? 'оплачен' : 'создан'}.</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin-top:8px">Доставка: ${shipping} ₽</p>
      <p style="font-weight:700">Итого: ${amount} ₽</p>
      <p style="color:#6b7280">Мы свяжемся с вами по вопросам доставки.</p>
    </div>
  </div>`
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}
