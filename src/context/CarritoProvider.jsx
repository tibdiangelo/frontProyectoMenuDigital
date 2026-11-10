import { useCallback, useEffect, useMemo, useState } from 'react'
import { CarritoContext, CLAVE_CARRITO } from './CarritoContext'

function normalizarItem(item) {
  if (!item || typeof item.id !== 'string' || typeof item.nombre !== 'string') {
    return null
  }

  const precio = Number(item.precio)
  const cantidad = Number(item.cantidad)

  if (!Number.isFinite(precio) || precio < 0) return null
  if (!Number.isInteger(cantidad) || cantidad < 1) return null

  return {
    id: item.id,
    nombre: item.nombre,
    precio,
    cantidad,
    categoria: typeof item.categoria === 'string' ? item.categoria : '',
  }
}

function leerCarritoInicial() {
  if (typeof window === 'undefined') return []

  try {
    const guardado = window.localStorage.getItem(CLAVE_CARRITO)
    if (!guardado) return []

    const datos = JSON.parse(guardado)
    if (!Array.isArray(datos)) return []

    return datos.map(normalizarItem).filter(Boolean)
  } catch {
    return []
  }
}

export default function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarritoInicial)

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
    } catch {
      // Si el almacenamiento no está disponible, el carrito sigue funcionando en memoria.
    }
  }, [items])

  const agregarPlato = useCallback((plato) => {
    setItems((actuales) => {
      const existente = actuales.find((item) => item.id === plato.id)

      if (existente) {
        return actuales.map((item) =>
          item.id === plato.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      }

      return [...actuales, { ...plato, cantidad: 1 }]
    })
  }, [])

  const cambiarCantidad = useCallback((id, cantidad) => {
    setItems((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item,
      ),
    )
  }, [])

  const eliminarPlato = useCallback((id) => {
    setItems((actuales) => actuales.filter((item) => item.id !== id))
  }, [])

  const vaciarCarrito = useCallback(() => {
    setItems([])
  }, [])

  const cantidadTotal = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items],
  )

  const total = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [items],
  )

  const valor = useMemo(
    () => ({
      items,
      agregarPlato,
      cambiarCantidad,
      eliminarPlato,
      vaciarCarrito,
      cantidadTotal,
      total,
    }),
    [
      items,
      agregarPlato,
      cambiarCantidad,
      eliminarPlato,
      vaciarCarrito,
      cantidadTotal,
      total,
    ],
  )

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}
