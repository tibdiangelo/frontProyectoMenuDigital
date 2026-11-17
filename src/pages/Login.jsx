import { useState } from 'react'
import { useNavigate } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import { CLAVE_TOKEN, CLAVE_USUARIO } from '../context/AuthContext'
import { iniciarSesionApi } from '../services/api'
import './auth.css'

export default function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setMensaje(null)

    try {
      const { token, usuario } = await iniciarSesionApi(formData)

      window.localStorage.setItem(CLAVE_TOKEN, token)
      window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
      setMensaje({ tipo: 'success', texto: 'Sesión iniciada correctamente' })
      navigate(
        usuario.rol === 'chef' ? '/admin/pedidos' : '/admin/platos',
        { replace: true },
      )
    } catch (error) {
      const texto =
        error instanceof TypeError
          ? 'No se pudo iniciar sesión.'
          : error.message
      setMensaje({ tipo: 'error', texto })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pagina-autenticacion">
      <section className="tarjeta-autenticacion">
        <header className="cabecera-autenticacion">
          <img src={logoImg} alt="Logo Menú Digital" className="logo-autenticacion" />
          <h1 className="titulo-autenticacion">Iniciar sesión</h1>
        </header>

        <form className="formulario-autenticacion" onSubmit={handleSubmit}>
          <label htmlFor="username">Correo</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Ingresa tu correo"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {mensaje && (
            <p className={`mensaje-${mensaje.tipo}`} role="alert">
              {mensaje.texto}
            </p>
          )}

          <button type="submit" className="boton-autenticacion" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="pie-autenticacion">Desarrollado por TyM</p>
      </section>
    </div>
  )
}
