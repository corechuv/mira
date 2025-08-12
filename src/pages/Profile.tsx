import { useAuth } from '@/store/auth'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, signOut } = useAuth()
  if (!user) {
    return (
      <div className="container-narrow mt-6">
        <h1 className="text-2xl font-semibold">Профиль</h1>
        <p className="mt-2 text-slate-600">Вы не авторизованы.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/sign-in" className="btn btn-primary">Войти</Link>
          <Link to="/sign-up" className="btn btn-outline">Регистрация</Link>
        </div>
      </div>
    )
  }
  const name = (user.user_metadata as any)?.name || 'Пользователь'
  return (
    <div className="container-narrow mt-6">
      <h1 className="text-2xl font-semibold">Здравствуйте, {name}</h1>
      <p className="mt-2 text-slate-600">Email: {user.email}</p>
      <div className="mt-4 flex gap-3">
        <Link to="/orders" className="btn btn-outline">Мои заказы</Link>
        <button onClick={signOut} className="btn btn-outline">Выйти</button>
      </div>
    </div>
  )
}
