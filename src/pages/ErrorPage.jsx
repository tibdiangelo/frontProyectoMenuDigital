import { Link, useRouteError } from 'react-router'
import './errorPage.css'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="pagina-error">
      <h1>Error 404: Fuera de carta</h1>
      <p>Esta página no salió del horno. Revisa la dirección o regresa a nuestra selección.</p>
      {error ? <p className="detalle-error">{error.statusText || error.message}</p> : null}
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}
