import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/store/auth'
import { toast } from 'sonner'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Schema = z.object({ email: z.string().email(), password: z.string().min(6) })
type Form = z.infer<typeof Schema>

export default function SignIn(){
  const { signIn } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<Form>({ resolver: zodResolver(Schema) })

  const onSubmit = async (v: Form) => {
    try { await signIn(v.email, v.password); toast.success('Добро пожаловать!'); nav((loc.state?.from) || '/') }
    catch(e:any){ toast.error(e.message || 'Не удалось войти') }
  }

  return (
    <div className="container-narrow mt-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Вход</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <input className="input" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        <input className="input" placeholder="Пароль" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Входим…' : 'Войти'}</button>
      </form>
      <p className="mt-3 text-sm">Нет аккаунта? <Link className="text-brand-700 underline" to="/sign-up">Регистрация</Link></p>
    </div>
  )
}
