import logoImg from '../assets/pizzaloggo.jpeg'
import './auth.css'

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <img src={logoImg} alt="Logo Menú Digital" className="auth-logo" />
          <h1 className="auth-title">Iniciar sesión</h1>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="auth-submit">
            Entrar
          </button>
        </form>

        <p className="auth-footer">Desarrollado por Grupo Menú Digital</p>
      </section>
    </div>
  )
}
