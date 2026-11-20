const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export function urlApi(ruta, parametros) {
  const rutaNormalizada = ruta.startsWith('/') ? ruta : `/${ruta}`
  const busqueda = new URLSearchParams()

  Object.entries(parametros ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      busqueda.set(clave, String(valor))
    }
  })

  const consulta = busqueda.toString() ? `?${busqueda.toString()}` : ''

  if (!API_URL) return `${rutaNormalizada}${consulta}`

  if (API_URL.endsWith('/api') && rutaNormalizada.startsWith('/api/')) {
    return `${API_URL}${rutaNormalizada.slice(4)}${consulta}`
  }

  return `${API_URL}${rutaNormalizada}${consulta}`
}

async function leerCuerpo(respuesta) {
  const texto = await respuesta.text()

  if (!texto) return null

  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

async function peticionPublica(ruta, { metodo = 'GET', cuerpo, parametros } = {}) {
  const headers = { Accept: 'application/json' }
  const opciones = { method: metodo, headers }

  if (cuerpo !== undefined) {
    headers['Content-Type'] = 'application/json'
    opciones.body = JSON.stringify(cuerpo)
  }

  let respuesta

  try {
    respuesta = await fetch(urlApi(ruta, parametros), opciones)
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    )
  }

  const datos = await leerCuerpo(respuesta)

  if (!respuesta.ok) {
    throw new Error(
      datos?.error ||
        datos?.mensaje ||
        'No se pudo completar la solicitud. Inténtalo de nuevo.',
    )
  }

  return datos
}

function extraerLista(datos) {
  if (Array.isArray(datos)) return datos
  if (Array.isArray(datos?.data)) return datos.data
  if (Array.isArray(datos?.platos)) return datos.platos
  if (Array.isArray(datos?.categorias)) return datos.categorias

  return []
}

function normalizarPlato(datos, categoriasPorId) {
  const categoriaId = datos.categoria_id ?? ''
  const categoria = categoriasPorId.get(String(categoriaId)) ?? ''

  return {
    id: String(datos.id ?? ''),
    nombre: datos.nombre ?? '',
    descripcion: datos['descripción'] ?? datos.descripcion ?? '',
    precio: Number(datos.precio) || 0,
    imagen: datos.imagen ?? '',
    disponible: datos.disponible !== false,
    categoriaId,
    categoria,
  }
}

export async function obtenerMenu() {
  const [platosDatos, categoriasDatos] = await Promise.all([
    peticionPublica('/api/platos'),
    peticionPublica('/api/categorias'),
  ])

  const categorias = extraerLista(categoriasDatos).map((categoria) => ({
    id: categoria.id ?? '',
    nombre: categoria.nombre ?? '',
  }))

  const categoriasPorId = new Map(
    categorias.map((categoria) => [String(categoria.id), categoria.nombre]),
  )

  const platos = extraerLista(platosDatos)
    .map((plato) => normalizarPlato(plato, categoriasPorId))
    .filter((plato) => plato.nombre)

  return { categorias, platos }
}

export async function iniciarSesionApi({ username, password }) {
  const datos = await peticionPublica('/api/usuarios/login', {
    metodo: 'POST',
    cuerpo: { username, password },
  })

  const usuario = datos?.usuario ?? datos?.data?.usuario
  const token = datos?.token

  if (!token || !usuario || usuario.id === undefined || usuario.id === null) {
    throw new Error('El servidor no devolvió la sesión autenticada.')
  }

  return {
    token: String(token),
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre ?? '',
      email: usuario.email ?? '',
      rol: usuario.rol === 'chef' ? 'chef' : 'admin',
      debeCambiarPassword: Boolean(usuario.debe_cambiar_password),
    },
  }
}

export async function crearPedidoApi({ mesa, clienteNombre, notas, items }) {
  const datos = await peticionPublica('/api/pedidos/completo', {
    metodo: 'POST',
    cuerpo: {
      mesa_id: Number(mesa),
      usuario_id: null,
      estado: 'Pendiente',
      cliente_nombre: clienteNombre,
      notas,
      detalles: items.map((item) => ({
        plato_id: Number(item.id),
        cantidad: Number(item.cantidad),
      })),
    },
  })

  const pedido = datos?.data ?? datos?.pedido ?? datos

  if (!pedido || pedido.id === undefined || pedido.id === null) {
    throw new Error('El servidor no devolvió el pedido creado.')
  }

  return {
    id: pedido.id,
    estado: pedido.estado ?? 'Pendiente',
  }
}
