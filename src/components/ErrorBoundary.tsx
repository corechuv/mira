import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  const msg = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Что-то пошло не так'
  return (
    <div className="container-narrow mt-12 text-center">
      <h1 className="text-2xl font-semibold mb-2">Упс!</h1>
      <p className="text-slate-600 mb-6">{msg}</p>
      <Link to="/" className="btn btn-primary">На главную</Link>
    </div>
  )
}
