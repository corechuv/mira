export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-label="Mira">
      <svg viewBox="0 0 120 36" className="h-8 w-auto">
        <rect width="120" height="36" rx="10" className="fill-brand-600"/>
        <text x="16" y="24" className="fill-white" style={{font: '700 18px/1 Inter, system-ui'}}>
          Mira
        </text>
      </svg>
    </div>
  )
}
