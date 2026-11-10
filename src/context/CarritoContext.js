import { createContext, useContext } from 'react'

export const CLAVE_CARRITO = 'menu-digital:carrito:v1'

export const CarritoContext = createContext(null)

export function useCarrito() {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  }

  return contexto
}
