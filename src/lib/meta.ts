import { useEffect } from 'react'

function upsertMeta(selector: string, attrs: Record<string,string>) {
  let el = document.querySelector(selector) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    Object.entries(attrs).forEach(([k,v]) => (el as any)[k] = v)
    document.head.appendChild(el)
  } else {
    Object.entries(attrs).forEach(([k,v]) => (el as any)[k] = v)
  }
  return el
}

export function usePageMeta({ title, description, ogImage }: { title?: string; description?: string; ogImage?: string }) {
  useEffect(() => {
    if (title) {
      document.title = title
      upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    }
    if (description) {
      let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!el) { el = document.createElement('meta'); el.name = 'description'; document.head.appendChild(el) }
      el.content = description
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    }
    if (ogImage) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })
      upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    }
  }, [title, description, ogImage])
}
