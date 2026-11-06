import { NavLink, Outlet } from 'react-router'
import './display.css'

const claseEnlace = ({ isActive }) => (isActive ? 'activo' : undefined)

export default function Display() {
  return (
    <div className="disposicion-app">
      <nav className="barra-navegacion">
        <NavLink to="/" end className={claseEnlace}>
          Inicio
        </NavLink>
        <NavLink to="/login" className={claseEnlace}>
          Login
        </NavLink>
        <NavLink to="/registro" className={claseEnlace}>
          Registro
        </NavLink>
      </nav>
      <main className="contenido-principal">
        <Outlet />
      </main>
    </div>
  )
}
