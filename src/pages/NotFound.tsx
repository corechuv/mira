import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="container-narrow mt-12 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-slate-600">Страница не найдена</p>
      <Link to="/" className="btn btn-primary mt-4">На главную</Link>
    </div>
  )
}
