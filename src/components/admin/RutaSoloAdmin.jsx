import { Navigate } from 'react-router'
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../../context/AuthContext'

function leerUsuario() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_USUARIO)

    if (!guardado) return null

    const usuario = JSON.parse(guardado)

    return usuario && usuario.rol ? usuario : null
  } catch {
    return null
  }
}


export default function RutaSoloAdmin({ children }) {
  const token = window.localStorage.getItem(CLAVE_TOKEN)
  const usuario = leerUsuario()

  if (!token || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (usuario.rol !== 'admin') {
    return <Navigate to="/admin/pedidos" replace />
  }

  return children
}
