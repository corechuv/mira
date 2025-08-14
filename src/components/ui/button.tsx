import { cn } from '@/lib/utils'
type Variant = 'primary'|'outline'|'ghost'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
export function Button({ className='', variant='primary', ...props }: Props) {
  const base = variant==='primary' ? 'btn-primary' : variant==='outline' ? 'btn-outline' : 'btn-ghost'
  return <button className={cn(base, className)} {...props} />
}
export default Button
