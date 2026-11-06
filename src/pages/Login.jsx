import logoImg from '../assets/pizzaloggo.jpeg'
import './login.css'

export default function Login() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <img src={logoImg} alt="Logo Menú Digital" className="logo-redondo" />

        <div className="borde-iniciar">
          <span>
            <em>Iniciar sesión</em>
          </span>
        </div>

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

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
