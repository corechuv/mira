import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/store/auth'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'

const Schema = z.object({
  name: z.string().min(2,'Имя слишком короткое'),
  email: z.string().email(),
  password: z.string().min(6,'Минимум 6 символов')
})
type Form = z.infer<typeof Schema>

export default function SignUp(){
  const { signUp } = useAuth()
  const nav = useNavigate()
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<Form>({ resolver: zodResolver(Schema) })

  const onSubmit = async (v: Form) => {
    try { await signUp(v.email, v.password, v.name); toast.success('Проверьте почту для подтверждения'); nav('/sign-in') }
    catch(e:any){ toast.error(e.message || 'Не удалось зарегистрироваться') }
  }

  return (
    <div className="container-narrow mt-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <input className="input" placeholder="Имя" {...register('name')} />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        <input className="input" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        <input className="input" placeholder="Пароль" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Создаём…' : 'Создать аккаунт'}</button>
      </form>
      <p className="mt-3 text-sm">Уже есть аккаунт? <Link className="text-brand-700 underline" to="/sign-in">Войти</Link></p>
    </div>
  )
}
