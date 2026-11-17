import { createContext, useContext } from 'react'

export const CLAVE_TOKEN = 'token'
export const CLAVE_USUARIO = 'usuario'

export const AuthContext = createContext(null)

export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }

  return contexto
}
