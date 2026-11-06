import { Link, useRouteError } from 'react-router'
import './errorPage.css'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="error-page">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      {error ? <p className="error-detail">{error.statusText || error.message}</p> : null}
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}
