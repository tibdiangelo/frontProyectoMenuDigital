import { Link, useRouteError } from 'react-router'
import './errorPage.css'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="pagina-error">
      <h1>Error 404</h1>
      <p>La página que buscas no existe.</p>
      {error ? <p className="detalle-error">{error.statusText || error.message}</p> : null}
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}
