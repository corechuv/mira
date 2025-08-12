import { writeFileSync } from 'node:fs'
const site = process.env.VITE_SITE_URL || 'https://example.com'
const routes = ['/', '/catalog', '/about', '/contact', '/policy', '/profile']
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r=>`  <url><loc>${site}${r}</loc></url>`).join('\n')}
</urlset>`
writeFileSync('public/sitemap.xml', xml)
console.log('sitemap.xml generated')
