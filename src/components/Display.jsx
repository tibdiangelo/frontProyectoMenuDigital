import { NavLink, Outlet } from 'react-router'
import './display.css'

export default function Display() {
  return (
    <div className="app-layout">
      <nav className="app-nav">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/registro">Registro</NavLink>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
