import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function SmartImage({ src, alt, className, aspect = 'aspect-[4/3]' }: { src: string; alt: string; className?: string; aspect?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={cn('relative overflow-hidden rounded-2xl', aspect, className)}>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn('h-full w-full object-cover transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}
