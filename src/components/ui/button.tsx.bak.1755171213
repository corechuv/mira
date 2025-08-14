import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant='solid', size='md', ...props }, ref
) {
  const base = variant === 'solid'
    ? 'btn'
    : variant === 'outline'
      ? 'btn-outline'
      : 'btn-ghost'
  return <button ref={ref} className={cn(base, sizes[size], className)} {...props} />
})

// Совместимость со старым импортом
export const ButtonOutline = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function ButtonOutline(
  { className, ...props }, ref
) {
  return <button ref={ref} className={cn('btn-outline', className)} {...props} />
})
