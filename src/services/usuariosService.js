import { peticionAdmin } from './apiAdmin'

export async function crearChef({ nombre, email, password }) {
  return peticionAdmin('/api/usuarios', {
    metodo: 'POST',
    cuerpo: {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
  })
}
