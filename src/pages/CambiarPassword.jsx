import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../context/AuthContext'
import { cambiarPasswordApi } from '../services/apiAdmin'
import './auth.css'

const LONGITUD_MINIMA_PASSWORD = 8

export default function CambiarPassword() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const token = window.localStorage.getItem(CLAVE_TOKEN)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previos) => ({ ...previos, [name]: value }))
  }

  function validar() {
    if (!formData.actual) {
      return 'Ingresa tu contraseña actual.'
    }

    if (formData.nueva.length < LONGITUD_MINIMA_PASSWORD) {
      return `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres.`
    }

    if (formData.nueva === formData.actual) {
      return 'La nueva contraseña debe ser diferente de la actual.'
    }

    if (formData.nueva !== formData.confirmar) {
      return 'La nueva contraseña y su confirmación no coinciden.'
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
      const { token: nuevoToken, usuario } = await cambiarPasswordApi({
        passwordActual: formData.actual,
        passwordNueva: formData.nueva,
      })

      window.localStorage.setItem(CLAVE_TOKEN, nuevoToken)
      window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))

      navigate(
        usuario.rol === 'chef' ? '/admin/pedidos' : '/admin/platos',
        { replace: true },
      )
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto:
          error.message ||
          'No se pudo cambiar la contraseña. Inténtalo de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleCerrarSesion() {
    window.localStorage.removeItem(CLAVE_TOKEN)
    window.localStorage.removeItem(CLAVE_USUARIO)
    navigate('/login', { replace: true })
  }

  return (
    <div className="pagina-autenticacion">
      <section className="tarjeta-autenticacion">
        <header className="cabecera-autenticacion">
          <img src={logoImg} alt="Logo Menú Digital" className="logo-autenticacion" />
          <h1 className="titulo-autenticacion">Cambiar contraseña</h1>
        </header>

        <form className="formulario-autenticacion" onSubmit={handleSubmit} noValidate>
          <label htmlFor="actual">Contraseña actual</label>
          <input
            type="password"
            id="actual"
            name="actual"
            placeholder="Ingresa tu contraseña actual"
            autoComplete="current-password"
            value={formData.actual}
            onChange={handleChange}
            required
          />

          <label htmlFor="nueva">Nueva contraseña</label>
          <input
            type="password"
            id="nueva"
            name="nueva"
            placeholder="Ingresa tu nueva contraseña"
            autoComplete="new-password"
            value={formData.nueva}
            onChange={handleChange}
            minLength={LONGITUD_MINIMA_PASSWORD}
            required
          />

          <label htmlFor="confirmar">Confirmar nueva contraseña</label>
          <input
            type="password"
            id="confirmar"
            name="confirmar"
            placeholder="Repite tu nueva contraseña"
            autoComplete="new-password"
            value={formData.confirmar}
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
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>

          <button
            type="button"
            className="boton-secundario-autenticacion"
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
        </form>

        <p className="pie-autenticacion">
          Por seguridad debes cambiar tu contraseña antes de continuar.
        </p>
      </section>
    </div>
  )
}
