import pizzaImg from '../assets/pizza.png'
import './auth.css'

export default function Registro() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="auth-page">
      <section className="auth-card">
        <header className="auth-header">
          <img src={pizzaImg} alt="Logo pizza" className="auth-logo" />
          <h1 className="auth-title">Registrar Usuario</h1>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            placeholder="Escribe tu usuario"
            autoComplete="username"
            required
          />

          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            placeholder="Escribe tu contraseña"
            autoComplete="new-password"
            required
          />

          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="Escribe tu correo"
            autoComplete="email"
            required
          />

          <button type="submit" className="auth-submit">
            Registrar
          </button>
        </form>

        <p className="auth-footer">Desarrollado por Grupo Menú Digital</p>
      </section>
    </div>
  )
}
