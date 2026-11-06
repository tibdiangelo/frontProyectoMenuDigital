import pizzaImg from '../assets/pizza.png'
import './registro.css'

export default function Registro() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="registro-page">
      <header>
        <div className="logopizza">
          <h1>
            <img src={pizzaImg} alt="Logo pizza" />
          </h1>
        </div>
      </header>

      <main>
        <form id="formRegistro" onSubmit={handleSubmit}>
          <h1>Registrar Usuario Squisita</h1>

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

          <button type="submit">Registrar</button>
        </form>
      </main>

      <footer>
        <p className="desarrollado">Desarrollado por Grupo Menú Digital</p>
      </footer>
    </div>
  )
}
