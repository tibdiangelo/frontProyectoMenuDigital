import { NavLink, Outlet } from 'react-router'
import './display.css'

const claseEnlace = ({ isActive }) => (isActive ? 'activo' : undefined)

export default function Display() {
  return (
    <div className="disposicion-app">
      <nav className="barra-navegacion">
        <NavLink to="/" end className={claseEnlace}>
          Menú
        </NavLink>
        <NavLink to="/login" className={claseEnlace}>
          Admin
        </NavLink>
      </nav>
      <main className="contenido-principal">
        <Outlet />
      </main>
    </div>
  )
}
