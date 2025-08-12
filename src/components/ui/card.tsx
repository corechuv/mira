import { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('card', className)} />
}

export function CardBody({ className, ...props }: PropsWithChildren & HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('card-body', className)} />
}
