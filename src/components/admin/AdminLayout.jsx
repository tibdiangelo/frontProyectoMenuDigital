import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router'
import logoImg from '../../assets/pizzaloggo.jpeg'
import { useAuth } from '../../context/AuthContext'
import AuthProvider from '../../context/AuthProvider'
import './admin.css'

const claseEnlace = ({ isActive }) =>
  isActive ? 'admin-enlace admin-enlace-activo' : 'admin-enlace'

function PanelAdmin() {
  const { token, usuario, esAdmin, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  if (!token || !usuario) {
    return <Navigate to="/login" replace />
  }

  function handleCerrarSesion() {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-app">
      <header className="admin-barra">
        <div className="admin-marca">
          <img
            src={logoImg}
            alt="Logo Menú Digital"
            className="admin-logo"
          />
          <div className="admin-marca-texto">
            <span className="admin-marca-titulo">Menú Digital</span>
            <span className="admin-marca-subtitulo">Panel de administración</span>
          </div>
        </div>

        <nav className="admin-navegacion" aria-label="Secciones de administración">
          {esAdmin ? (
            <NavLink to="/admin/platos" className={claseEnlace}>
              Platos
            </NavLink>
          ) : null}
          <NavLink to="/admin/pedidos" className={claseEnlace}>
            Pedidos
          </NavLink>
        </nav>

        {esAdmin ? (
          <Link
            to="/registro"
            className="admin-boton admin-boton-secundario admin-boton-pequeno"
          >
            Agregar nuevo chef
          </Link>
        ) : null}

        {token ? (
          <button
            type="button"
            className="admin-cerrar-sesion"
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
        ) : null}
      </header>

      <main className="admin-contenido">
        <Outlet />
      </main>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AuthProvider>
      <PanelAdmin />
    </AuthProvider>
  )
}
