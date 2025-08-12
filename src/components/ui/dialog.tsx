import { PropsWithChildren } from 'react'

export function Dialog({ open, onClose, children }: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  )
}
