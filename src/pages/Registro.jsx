import { Link } from 'react-router'
import pizzaImg from '../assets/pizzaloggo.jpeg'
import './auth.css'


export default function Registro() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <div className="pagina-autenticacion">
      <section className="tarjeta-autenticacion">
        <header className="cabecera-autenticacion">
          <img src={pizzaImg} alt="Logo pizza" className="logo-autenticacion" />
          <h1 className="titulo-autenticacion">Registrar Usuario</h1>
        </header>

        <form className="formulario-autenticacion" onSubmit={handleSubmit}>
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

          <button type="submit" className="boton-autenticacion">
            Registrar
          </button>

          <Link to="/login" className="boton-secundario-autenticacion">
            ¿Ya tienes cuenta? Iniciar sesión
          </Link>
        </form>
        
        

        <p className="pie-autenticacion">Desarrollado por Grupo Menú Digital</p>
      </section>
    </div>
  )
}
