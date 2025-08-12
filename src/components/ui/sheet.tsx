import { PropsWithChildren, useEffect } from 'react'

export function Sheet({ open, onClose, children }: PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col">
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  )
}

export function SheetBody({ children }: PropsWithChildren) {
  return <div className="flex-1 overflow-auto p-4">{children}</div>
}

export function SheetFooter({ children }: PropsWithChildren) {
  return <div className="border-t p-4">{children}</div>
}
