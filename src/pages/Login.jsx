import { useState } from 'react'
import { Link } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import './auth.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/usuarios'

export default function Login() {
 
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
    const response = await fetch(`${API_URL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error || data.mensaje || 'Error al iniciar sesión')
    }


    setMensaje({ tipo: 'success', texto: 'Sesión iniciada correctamente' })
  } catch (error) {
    const texto =
      error instanceof TypeError
        ? 'Error en el servidor. No se pudo iniciar sesión.'
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
          <h1 className="titulo-autenticacion">Iniciar sesión Admin</h1>
        </header>

        <form className="formulario-autenticacion" onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Ingresa tu usuario"
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

        <p className="pie-autenticacion">Desarrollado por Grupo Menú Digital</p>
      </section>
    </div>
  )
}
