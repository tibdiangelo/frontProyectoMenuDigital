const CLAVE_PEDIDOS = 'menu-digital:pedidos:v1'

function crearId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `pedido-${Date.now()}`
}

function leerPedidosGuardados() {
  try {
    const guardados = JSON.parse(window.localStorage.getItem(CLAVE_PEDIDOS) ?? '[]')
    return Array.isArray(guardados) ? guardados : []
  } catch {
    return []
  }
}

export async function enviarPedido({ items, total }) {
  const pedido = {
    id: crearId(),
    items: items.map(({ id, nombre, precio, cantidad }) => ({
      id,
      nombre,
      precio,
      cantidad,
    })),
    total,
    estado: 'Pendiente',
    creadoEn: new Date().toISOString(),
  }

  // Sin backend disponible, el pedido se guarda localmente para poder probar
  // el flujo. Aquí se reemplazará por POST /api/orders cuando exista la API.
  const pedidos = leerPedidosGuardados()
  window.localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify([...pedidos, pedido]))

  return pedido
}
