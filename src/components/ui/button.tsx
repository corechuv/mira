import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn('btn btn-primary', className)} />
  )
}

export function ButtonOutline({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn('btn btn-outline', className)} />
  )
}
