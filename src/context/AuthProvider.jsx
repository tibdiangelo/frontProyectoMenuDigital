import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext, CLAVE_TOKEN, CLAVE_USUARIO } from './AuthContext'

function leerTokenGuardado() {
  try {
    return window.localStorage.getItem(CLAVE_TOKEN) ?? ''
  } catch {
    return ''
  }
}

function leerUsuarioGuardado() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_USUARIO)

    if (!guardado) return null

    const usuario = JSON.parse(guardado)

    if (!usuario || !usuario.rol) return null

    return usuario
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(leerTokenGuardado)
  const [usuario, setUsuario] = useState(leerUsuarioGuardado)

  useEffect(() => {
    function sincronizarSesion() {
      setToken(leerTokenGuardado())
      setUsuario(leerUsuarioGuardado())
    }

    function expirarSesion() {
      setToken('')
      setUsuario(null)
    }

    window.addEventListener('storage', sincronizarSesion)
    window.addEventListener('admin:sesion-expirada', expirarSesion)

    return () => {
      window.removeEventListener('storage', sincronizarSesion)
      window.removeEventListener('admin:sesion-expirada', expirarSesion)
    }
  }, [])

  const iniciarSesion = useCallback((nuevoToken, nuevoUsuario) => {
    const tokenLimpio = String(nuevoToken ?? '').trim()

    if (!tokenLimpio || !nuevoUsuario?.rol) return

    window.localStorage.setItem(CLAVE_TOKEN, tokenLimpio)
    window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify(nuevoUsuario))
    setToken(tokenLimpio)
    setUsuario(nuevoUsuario)
  }, [])

  const cerrarSesion = useCallback(() => {
    window.localStorage.removeItem(CLAVE_TOKEN)
    window.localStorage.removeItem(CLAVE_USUARIO)
    setToken('')
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({
      token,
      usuario,
      rol: usuario?.rol ?? '',
      esAdmin: usuario?.rol === 'admin',
      esChef: usuario?.rol === 'chef',
      estaAutenticado: Boolean(token && usuario),
      iniciarSesion,
      cerrarSesion,
    }),
    [token, usuario, iniciarSesion, cerrarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
