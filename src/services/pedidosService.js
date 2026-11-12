const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

function urlPedidos() {
  if (!API_URL) return '/api/orders'

  return API_URL.endsWith('/api') ? `${API_URL}/orders` : `${API_URL}/api/orders`
}

function normalizarPlatoId(id) {
  const numero = Number(id)

  return Number.isInteger(numero) ? numero : id
}

function normalizarEstado(estado) {
  if (!estado) return 'Pendiente'

  const texto = String(estado).trim()

  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

async function leerJson(respuesta) {
  const texto = await respuesta.text()

  if (!texto) return null

  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

export async function enviarPedido({ mesa, clienteNombre, notas, items }) {
  const cuerpo = {
    mesa,
    cliente_nombre: clienteNombre,
    notas,
    items: items.map((item) => ({
      plato_id: normalizarPlatoId(item.id),
      cantidad: item.cantidad,
      precio_unitario: item.precio,
    })),
  }

  let respuesta

  try {
    respuesta = await fetch(urlPedidos(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    })
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    )
  }

  const datos = await leerJson(respuesta)

  if (!respuesta.ok) {
    throw new Error(
      datos?.message || datos?.error || 'No se pudo enviar el pedido. Inténtalo de nuevo.',
    )
  }

  const pedido = datos?.data ?? datos?.pedido ?? datos ?? {}

  return {
    id: pedido.id ?? pedido.pedido_id ?? pedido.numero_pedido ?? null,
    estado: normalizarEstado(pedido.estado),
  }
}
