export default function Stars({ rating, outOf = 5, className = '' }: { rating: number; outOf?: number; className?: string }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className={`stars ${className}`} aria-label={`Рейтинг ${rating} из ${outOf}`}>
      {Array.from({ length: outOf }).map((_, i) => {
        const isFull = i < full
        const isHalf = i === full && half
        return (
          <span key={i} className={isFull ? '' : isHalf ? '' : 'dim'}>
            {isHalf ? '★' : '★'}
          </span>
        )
      })}
    </div>
  )
}
