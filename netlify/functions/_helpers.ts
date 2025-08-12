import type { HandlerEvent, HandlerResponse } from '@netlify/functions'
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,Stripe-Signature',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}

export function okJSON(data: any, status = 200): HandlerResponse {
  return { statusCode: status, headers: { 'Content-Type': 'application/json', ...corsHeaders }, body: JSON.stringify(data) }
}
export function errJSON(message: string, status = 500): HandlerResponse {
  return okJSON({ error: message }, status)
}
export function handleOptions(): HandlerResponse {
  return { statusCode: 204, headers: corsHeaders, body: '' }
}
export function getBaseUrl(event: HandlerEvent) {
  return (event.headers?.origin || process.env.VITE_SITE_URL || 'http://localhost:5173') as string
}
export function bodyBuffer(event: HandlerEvent) {
  const b = event.body || ''
  return Buffer.from(b, event.isBase64Encoded ? 'base64' : 'utf8')
}
