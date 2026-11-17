import { urlApi } from './api'
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../context/AuthContext'

export class ErrorApi extends Error {
  constructor(mensaje, estado) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
  }
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

function leerMensaje(datos) {
  if (!datos || typeof datos !== 'object') return ''

  return (
    datos.message ||
    datos.mensaje ||
    datos.error ||
    datos.detalle ||
    ''
  )
}

export async function peticionAdmin(
  ruta,
  { metodo = 'GET', cuerpo, parametros } = {},
) {
  const token = window.localStorage.getItem(CLAVE_TOKEN)

  if (!token) {
    throw new ErrorApi(
      'Tu sesión no está iniciada. Inicia sesión para continuar.',
      401,
    )
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const opciones = { method: metodo, headers }

  if (cuerpo !== undefined) {
    headers['Content-Type'] = 'application/json'
    opciones.body = JSON.stringify(cuerpo)
  }

  let respuesta

  try {
    respuesta = await fetch(urlApi(ruta, parametros), opciones)
  } catch {
    throw new ErrorApi(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
      0,
    )
  }

  const datos = await leerCuerpo(respuesta)

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      window.localStorage.removeItem(CLAVE_TOKEN)
      window.localStorage.removeItem(CLAVE_USUARIO)
      window.dispatchEvent(new Event('admin:sesion-expirada'))
    }

    const mensaje =
      respuesta.status === 401
        ? 'Tu sesión expiró. Inicia sesión de nuevo.'
        : leerMensaje(datos) ||
          'No se pudo completar la solicitud. Inténtalo de nuevo.'

    throw new ErrorApi(mensaje, respuesta.status)
  }

  return datos
}

export function extraerLista(datos, claves = []) {
  if (Array.isArray(datos)) return datos

  if (!datos || typeof datos !== 'object') return []

  if (Array.isArray(datos.data)) return datos.data

  for (const clave of claves) {
    if (Array.isArray(datos[clave])) return datos[clave]
  }

  return []
}

export function extraerObjeto(datos, claves = []) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return null

  if (datos.data && typeof datos.data === 'object' && !Array.isArray(datos.data)) {
    return datos.data
  }

  for (const clave of claves) {
    if (datos[clave] && typeof datos[clave] === 'object' && !Array.isArray(datos[clave])) {
      return datos[clave]
    }
  }

  return datos
}
