import { useState } from 'react'
import { Link } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import { crearChef } from '../services/usuariosService'
import './auth.css'

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LONGITUD_MINIMA_PASSWORD = 8

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previos) => ({ ...previos, [name]: value }))
  }

  function validar() {
    if (formData.nombre.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.'
    }

    if (!CORREO_VALIDO.test(formData.email.trim())) {
      return 'Ingresa un correo válido.'
    }

    if (formData.password.length < LONGITUD_MINIMA_PASSWORD) {
      return `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
    }

    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) return

    const errorValidacion = validar()

    if (errorValidacion) {
      setMensaje({ tipo: 'error', texto: errorValidacion })
      return
    }

    setLoading(true)
    setMensaje(null)

    try {
      const respuesta = await crearChef(formData)
      const nombre = respuesta?.data?.nombre ?? formData.nombre.trim()

      setMensaje({
        tipo: 'success',
        texto: `Chef "${nombre}" creado correctamente.`,
      })
      setFormData({ nombre: '', email: '', password: '' })
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.message || 'No se pudo crear el chef. Inténtalo de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pagina-autenticacion">
      <section className="tarjeta-autenticacion">
        <header className="cabecera-autenticacion">
          <img src={logoImg} alt="Logo Menú Digital" className="logo-autenticacion" />
          <h1 className="titulo-autenticacion">Agregar nuevo chef</h1>
        </header>

        <form className="formulario-autenticacion" onSubmit={handleSubmit} noValidate>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Nombre del chef"
            autoComplete="name"
            value={formData.nombre}
            onChange={handleChange}
            maxLength={80}
            required
          />

          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ingrese su correo"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={120}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Asigne su contraseña"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            minLength={LONGITUD_MINIMA_PASSWORD}
            required
          />

          {mensaje && (
            <p className={`mensaje-${mensaje.tipo}`} role="alert">
              {mensaje.texto}
            </p>
          )}

          <button type="submit" className="boton-autenticacion" disabled={loading}>
            {loading ? 'Creando chef...' : 'Crear chef'}
          </button>

          <Link to="/admin/platos" className="boton-secundario-autenticacion">
            Volver al panel
          </Link>
        </form>

        <p className="pie-autenticacion">Desarrollado por Grupo Menú Digital</p>
      </section>
    </div>
  )
}
