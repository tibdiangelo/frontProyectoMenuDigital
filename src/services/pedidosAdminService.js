import { extraerLista, extraerObjeto, peticionAdmin } from './apiAdmin'

export const ESTADOS_PEDIDO = [
  'Pendiente',
  'En preparación',
  'Listo',
  'Entregado',
]

const SIGUIENTE_ESTADO = {
  Pendiente: 'En preparación',
  'En preparación': 'Listo',
  Listo: 'Entregado',
  Entregado: null,
}

function quitarTildes(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function normalizarEstado(estado) {
  const texto = String(estado ?? '').trim()

  if (!texto) return 'Pendiente'

  switch (quitarTildes(texto)) {
    case 'pendiente':
      return 'Pendiente'
    case 'en preparacion':
    case 'preparando':
    case 'en proceso':
      return 'En preparación'
    case 'listo':
      return 'Listo'
    case 'entregado':
      return 'Entregado'
    default:
      return texto.charAt(0).toUpperCase() + texto.slice(1)
  }
}

export function obtenerSiguienteEstado(estado) {
  return SIGUIENTE_ESTADO[normalizarEstado(estado)] ?? null
}

function normalizarItem(item = {}) {
  const plato =
    item.plato && typeof item.plato === 'object' ? item.plato : null

  const nombre =
    (typeof item.plato === 'string' ? item.plato : null) ??
    item.nombre_plato ??
    item.nombre ??
    plato?.nombre ??
    'Plato'

  const cantidad = Math.max(1, Number(item.cantidad ?? 1) || 1)
  const precioUnitario = Number(
    item.precio_unitario ?? item.precio ?? plato?.precio ?? 0,
  ) || 0
  const subtotal = Number(item.subtotal ?? item.total ?? 0) || precioUnitario * cantidad

  return {
    id: item.id ?? item.plato_id ?? plato?.id ?? nombre,
    nombre,
    cantidad,
    precioUnitario,
    subtotal,
  }
}

function normalizarFecha(valor) {
  if (!valor) return null

  const fecha = new Date(valor)

  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString()
}

export function normalizarPedido(datos = {}) {
  const itemsBrutos =
    datos.items ??
    datos.detalles ??
    datos.detalle_pedidos ??
    datos.detalle ??
    datos.platos ??
    []

  const items = Array.isArray(itemsBrutos)
    ? itemsBrutos.map(normalizarItem)
    : []

  const totalCalculado = items.reduce((suma, item) => suma + item.subtotal, 0)
  const cliente =
    datos.cliente_nombre ??
    datos.nombre_cliente ??
    datos.cliente?.nombre ??
    ''

  return {
    id: datos.id ?? datos._id ?? datos.pedido_id ?? '',
    numero: datos.numero_pedido ?? datos.numero ?? datos.codigo ?? datos.id ?? '',
    mesa: datos.mesa ?? datos.numero_mesa ?? '',
    cliente,
    notas: datos.notas ?? datos.observaciones ?? '',
    items,
    total: Number(datos.total ?? datos.total_pedido ?? 0) || totalCalculado,
    estado: normalizarEstado(datos.estado ?? datos.status),
    fecha: normalizarFecha(
      datos.creado_en ??
        datos.created_at ??
        datos.fecha_creacion ??
        datos.fecha ??
        datos.fecha_pedido,
    ),
  }
}

function compararPedidos(a, b) {
  const fechaA = a.fecha ? new Date(a.fecha).getTime() : Number.NaN
  const fechaB = b.fecha ? new Date(b.fecha).getTime() : Number.NaN

  if (Number.isFinite(fechaA) && Number.isFinite(fechaB) && fechaA !== fechaB) {
    return fechaA - fechaB
  }

  return String(a.id).localeCompare(String(b.id), 'es', { numeric: true })
}

function numeroMesa(mesa) {
  if (!mesa) return ''

  const valor = mesa.numero ?? mesa.nombre ?? mesa.id ?? ''

  return String(valor).replace(/^mesa\s*/i, '').trim()
}

function buscarPorId(lista, id) {
  return lista.find((item) => String(item.id) === String(id)) ?? null
}

async function cargarReferencias() {
  const [detallesDatos, platosDatos, mesasDatos] = await Promise.all([
    peticionAdmin('/api/detalles'),
    peticionAdmin('/api/platos'),
    peticionAdmin('/api/mesas'),
  ])

  return {
    detalles: extraerLista(detallesDatos, ['detalles']),
    platos: extraerLista(platosDatos, ['platos']),
    mesas: extraerLista(mesasDatos, ['mesas']),
  }
}

function componerPedido(pedido, referencias) {
  const items = referencias.detalles
    .filter((detalle) => String(detalle.pedido_id) === String(pedido.id))
    .map((detalle) => {
      const plato = buscarPorId(referencias.platos, detalle.plato_id)

      return {
        ...detalle,
        plato: plato?.nombre ?? 'Plato',
        nombre: plato?.nombre ?? 'Plato',
        precio: detalle.precio_unitario,
      }
    })

  const mesa = buscarPorId(referencias.mesas, pedido.mesa_id)

  return normalizarPedido({
    ...pedido,
    mesa: numeroMesa(mesa) || pedido.mesa_id,
    items,
  })
}

export async function listarPedidos(estado) {
  const filtro = estado && estado !== 'Todos' ? estado : null

  const [datos, referencias] = await Promise.all([
    peticionAdmin('/api/pedidos'),
    cargarReferencias(),
  ])

  const pedidos = extraerLista(datos, ['pedidos'])

  return pedidos
    .map((pedido) => componerPedido(pedido, referencias))
    .filter((pedido) => pedido.estado !== 'Entregado')
    .filter((pedido) => !filtro || pedido.estado === filtro)
    .sort(compararPedidos)
}

export async function obtenerPedido(id) {
  const [datos, referencias] = await Promise.all([
    peticionAdmin(`/api/pedidos/${encodeURIComponent(id)}`),
    cargarReferencias(),
  ])

  const pedido = extraerObjeto(datos, ['pedido'])

  if (!pedido || pedido.id === undefined || pedido.id === null) {
    throw new Error('No se encontró el pedido solicitado.')
  }

  return componerPedido(pedido, referencias)
}

export async function cambiarEstadoPedido(id, estado) {
  await peticionAdmin(`/api/pedidos/${encodeURIComponent(id)}`, {
    metodo: 'PUT',
    cuerpo: { estado },
  })

  return {
    estado: normalizarEstado(estado),
  }
}
