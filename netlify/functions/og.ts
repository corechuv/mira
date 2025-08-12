import type { Handler } from '@netlify/functions'
export const handler: Handler = async (event) => {
  const q = event.queryStringParameters || {}
  const title = (q.title as string) || 'Mira'
  const price = (q.price as string) || ''
  const brand = (q.brand as string) || 'Mira'
  const theme = (q.theme as string) || 'light'
  const bg = theme === 'dark' ? '#0b1220' : '#ffffff'
  const fg = theme === 'dark' ? '#ffffff' : '#0b1220'
  const accent = '#3e7ff5'
  const esc = (s:string)=>s.replace(/[<>&'"]/g,c=>({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' } as any)[c])
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}" stop-opacity="0.15"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="40" y="40" width="1120" height="550" rx="32" fill="url(#g)"/>
  <text x="80" y="140" fill="${accent}" font-family="Inter,ui-sans-serif" font-size="42" font-weight="700">${esc(brand)}</text>
  <text x="80" y="230" fill="${fg}" font-family="Inter,ui-sans-serif" font-size="60" font-weight="800">${esc(title)}</text>
  ${price ? `<text x="80" y="300" fill="${fg}" font-family="Inter,ui-sans-serif" font-size="36" font-weight="600">${esc(price)} €</text>`: ''}
  <text x="80" y="520" fill="${fg}" opacity="0.7" font-family="Inter,ui-sans-serif" font-size="28">mira.shop</text>
</svg>`
  return { statusCode: 200, headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }, body: svg }
}
