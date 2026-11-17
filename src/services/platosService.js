import { extraerLista, peticionAdmin } from './apiAdmin'

function aNumero(valor, valorPorDefecto = 0) {
  const numero = Number(valor)

  return Number.isFinite(numero) ? numero : valorPorDefecto
}

function normalizarCategoria(categoria, idRespaldo) {
  if (!categoria) {
    return {
      id: idRespaldo ?? '',
      nombre: 'Sin categoría',
    }
  }

  if (typeof categoria === 'string') {
    return {
      id: idRespaldo ?? '',
      nombre: categoria,
    }
  }

  return {
    id: categoria.id ?? idRespaldo ?? '',
    nombre: categoria.nombre ?? 'Sin categoría',
  }
}

export function normalizarPlato(datos = {}) {
  const categoria = normalizarCategoria(datos.categoria, datos.categoria_id)

  return {
    id: datos.id ?? datos._id ?? '',
    nombre: datos.nombre ?? '',
    descripcion: datos.descripcion ?? datos['descripción'] ?? '',
    precio: aNumero(datos.precio),
    imagen: datos.imagen ?? datos.imagen_url ?? '',
    disponible:
      datos.disponible === true ||
      datos.disponible === 1 ||
      datos.disponible === '1' ||
      datos.disponible === 'true',
    activo: datos.activo !== false,
    categoriaId: datos.categoria_id ?? categoria.id,
    categoriaNombre: datos.categoria_nombre ?? categoria.nombre,
  }
}

function normalizarCategorias(datos) {
  return extraerLista(datos, ['categorias', 'categories'])
    .map((categoria) => {
      if (!categoria || typeof categoria !== 'object') return null

      return {
        id: categoria.id ?? categoria._id ?? '',
        nombre: categoria.nombre ?? 'Sin nombre',
        activa: categoria.activo !== false,
      }
    })
    .filter((categoria) => categoria && categoria.activa)
}

export async function listarCategorias() {
  const datos = await peticionAdmin('/api/categorias')
  return normalizarCategorias(datos)
}

function aPayloadPlato(datos) {
  const categoriaId = String(datos.categoria_id ?? '')
  const categoriaNormalizada = /^\d+$/.test(categoriaId)
    ? Number(categoriaId)
    : categoriaId

  return {
    nombre: datos.nombre.trim(),
    'descripción': datos.descripcion.trim(),
    precio: Number(datos.precio),
    imagen: datos.imagen.trim(),
    categoria_id: categoriaNormalizada,
    disponible: Boolean(datos.disponible),
  }
}

export async function listarPlatos() {
  const [datos, categoriasDatos] = await Promise.all([
    peticionAdmin('/api/platos'),
    peticionAdmin('/api/categorias'),
  ])

  const categorias = normalizarCategorias(categoriasDatos)
  const categoriasPorId = new Map(
    categorias.map((categoria) => [String(categoria.id), categoria.nombre]),
  )

  const platos = extraerLista(datos, ['platos', 'dishes'])

  return platos
    .map((plato) =>
      normalizarPlato({
        ...plato,
        categoria_nombre: categoriasPorId.get(String(plato.categoria_id)),
      }),
    )
    .filter((plato) => plato.activo)
}

export async function crearPlato(datos) {
  return peticionAdmin('/api/platos', {
    metodo: 'POST',
    cuerpo: aPayloadPlato(datos),
  })
}

export async function actualizarPlato(id, datos) {
  return peticionAdmin(`/api/platos/${encodeURIComponent(id)}`, {
    metodo: 'PUT',
    cuerpo: aPayloadPlato(datos),
  })
}

export async function eliminarPlato(id) {
  return peticionAdmin(`/api/platos/${encodeURIComponent(id)}`, {
    metodo: 'DELETE',
  })
}
