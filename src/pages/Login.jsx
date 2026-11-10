import { Link } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import './auth.css'

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault()
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
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />

          <button type="submit" className="boton-autenticacion">
            Entrar
          </button>

          <Link to="/registro" className="boton-secundario-autenticacion">
            ¿No tienes cuenta? Registrarme
          </Link>
        </form>

        

        <p className="pie-autenticacion">Desarrollado por Grupo Menú Digital</p>
      </section>
    </div>
  )
}
