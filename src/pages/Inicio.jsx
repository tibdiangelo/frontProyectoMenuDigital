import { useNavigate } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import pizzaImg from '../assets/pizzaimg.jpg'
import sodasImg from '../assets/sodas.webp'
import carritoImg from '../assets/carrito.jpeg'
import { useCarrito } from '../context/CarritoContext'
import formatoMoneda from '../utils/formatoMoneda'
import './Inicio.css'

const pizzas = [
  { id: 'pizza-hawaiana', nombre: 'Hawaiana', precio: 28900, categoria: 'Pizzas' },
  { id: 'pizza-peperoni', nombre: 'Peperoni', precio: 29900, categoria: 'Pizzas' },
  { id: 'pizza-jamon-queso', nombre: 'Jamón y queso', precio: 27900, categoria: 'Pizzas' },
  { id: 'pizza-napolitana', nombre: 'Napolitana', precio: 28900, categoria: 'Pizzas' },
]

const sodas = [
  { id: 'soda-frutos-rojos', nombre: 'Frutos rojos', precio: 7900, categoria: 'Sodas' },
  { id: 'soda-maracuya', nombre: 'Maracuyá', precio: 7900, categoria: 'Sodas' },
  { id: 'soda-mango-biche', nombre: 'Mango biche', precio: 7900, categoria: 'Sodas' },
]

export default function Inicio() {
  const navigate = useNavigate()
  const { agregarPlato, cantidadTotal } = useCarrito()

  return (
    <div className="pagina-inicio">
      <div className="contenedor-inicio">
        <header className="portada-inicio">
          <img src={logoImg} alt="Logo Menú Digital" className="logo-inicio" />
          <p className="antetitulo-inicio">Pizzería Squisita</p>
          <h1 className="titulo-inicio">Menú Digital</h1>
          <p className="subtitulo-inicio">Elige tus favoritos y arma tu pedido.</p>
        </header>

        <section className="categorias-inicio" aria-label="Categorías del menú">
          <article className="tarjeta-inicio">
            <div className="cabecera-tarjeta">
              <h2 className="titulo-tarjeta">Pizzas</h2>
              <span className="insignia-tarjeta">4 opciones</span>
            </div>
            <img
              src={pizzaImg}
              alt="Pizzas"
              className="imagen-tarjeta"
              loading="lazy"
            />
            <ul className="lista-inicio">
              {pizzas.map((plato) => (
                <li key={plato.id} className="elemento-lista">
                  <div className="datos-plato">
                    <span className="nombre-plato">{plato.nombre}</span>
                    <span className="precio-plato">
                      {formatoMoneda.format(plato.precio)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="boton-agregar"
                    onClick={() => agregarPlato(plato)}
                    aria-label={`Agregar ${plato.nombre} al pedido`}
                  >
                    + Agregar
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <article className="tarjeta-inicio">
            <div className="cabecera-tarjeta">
              <h2 className="titulo-tarjeta">Sodas</h2>
              <span className="insignia-tarjeta">3 opciones</span>
            </div>
            <img
              src={sodasImg}
              alt="Sodas"
              className="imagen-tarjeta"
              loading="lazy"
            />
            <ul className="lista-inicio">
              {sodas.map((plato) => (
                <li key={plato.id} className="elemento-lista">
                  <div className="datos-plato">
                    <span className="nombre-plato">{plato.nombre}</span>
                    <span className="precio-plato">
                      {formatoMoneda.format(plato.precio)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="boton-agregar"
                    onClick={() => agregarPlato(plato)}
                    aria-label={`Agregar ${plato.nombre} al pedido`}
                  >
                    + Agregar
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <button
          type="button"
          className="boton-carrito"
          onClick={() => navigate('/pedido')}
          aria-label={`Ver mi pedido${
            cantidadTotal > 0
              ? `, ${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'}`
              : ''
          }`}
        >
          <img src={carritoImg} alt="" className="icono-carrito" />
          <span>Ver mi pedido</span>
          {cantidadTotal > 0 ? (
            <span className="contador-carrito" aria-hidden="true">
              {cantidadTotal}
            </span>
          ) : null}
        </button>

        <footer className="pie-inicio">
          <p>Redes Sociales</p>
          <p className="enlaces-pie">Facebook · Instagram</p>
        </footer>
      </div>
    </div>
  )
}
