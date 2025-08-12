export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/icons/mira.png"
        alt="Mira"
        className="h-8 w-8 rounded-full border border-black/10 ring-1 ring-black/5 object-cover bg-white"
        onError={(e)=>{ (e.target as HTMLImageElement).src = '/icons/mira.svg' }}
      />
      <span className="text-lg font-extrabold tracking-tight text-slate-900">Mira</span>
    </div>
  )
}
