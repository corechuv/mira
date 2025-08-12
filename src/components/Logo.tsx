export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/icons/mira.png" alt="Mira" className="h-7 w-7 rounded-xl border object-cover" onError={(e)=>{ (e.target as HTMLImageElement).src = '/icons/mira.svg' }} />
      <span className="font-bold tracking-tight">Mira</span>
    </div>
  )
}
