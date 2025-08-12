import type { Handler } from '@netlify/functions'
import { handleOptions, okJSON, errJSON } from './_helpers'
import { sendOrderEmail } from '../../server/email'
import { getSupabaseAdmin } from '../../server/supabaseAdmin'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions()
  try {
    const body = JSON.parse(event.body || '{}')
    const { items, amount, contact, shipping, user_id } = body
    const supabase = getSupabaseAdmin()
    let id = `MIRA-${Math.random().toString(36).slice(2,8).toUpperCase()}`
    if (supabase) {
      const { data, error } = await supabase.from('orders').insert({
        user_id: user_id || null, items, amount, currency: 'RUB', contact, shipping, status: 'new'
      }).select('id').single()
      if (!error && data?.id) id = data.id
    }
    if (contact?.email) {
      const html = renderEmailHtml(id, items, amount, shipping?.cost || 0)
      await sendOrderEmail(contact.email, `Ваш заказ ${id} — подтверждение`, html)
    }
    return okJSON({ id })
  } catch (e:any) {
    console.error(e); return errJSON(e.message || 'order error', 500)
  }
}

function renderEmailHtml(orderId: string, items: any[], amount: number, shipping: number) {
  const rows = (items||[]).map((i:any)=>`<tr><td style="padding:6px 12px;">${i.title}</td><td style="padding:6px 12px;" align="right">× ${i.qty}</td></tr>`).join('')
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:#3e7ff5;color:#fff;padding:14px 18px;font-weight:700">Mira — подтверждение заказа</div>
    <div style="padding:16px">
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin-top:8px">Доставка: ${shipping} ₽</p>
      <p style="font-weight:700">Итого: ${amount} ₽</p>
    </div>
  </div>`
}
