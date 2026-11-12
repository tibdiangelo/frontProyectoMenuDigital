import { useNavigate } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import pizzaImg from '../assets/pizzaimg.jpg'
import sodasImg from '../assets/sodas.webp'
import carritoImg from '../assets/carrito.jpeg'
import { useCarrito } from '../context/CarritoContext'
import formatoMoneda from '../utils/formatoMoneda'
import './Inicio.css'

const pizzas = [
  { id: '1', nombre: 'Hawaiana', precio: 35000, categoria: 'Pizzas' },
  { id: '2', nombre: 'Peperoni', precio: 35000, categoria: 'Pizzas' },
  { id: '3', nombre: 'Jamón y queso', precio: 35000, categoria: 'Pizzas' },
  { id: '4', nombre: 'Napolitana', precio: 35000, categoria: 'Pizzas' },
]

const sodas = [
  { id: '6', nombre: 'Soda de Frutos Rojos', precio: 9000, categoria: 'Sodas' },
  { id: '5', nombre: 'Soda de Maracuyá', precio: 9000, categoria: 'Sodas' },
  { id: '7', nombre: 'Soda de Mango', precio: 9000, categoria: 'Sodas' },
]

export default function Inicio() {
  const navigate = useNavigate()
  const { agregarPlato, cantidadTotal } = useCarrito()

  return (
    <div className="pagina-inicio">
      <div className="contenedor-inicio">
        <header className="portada-inicio">
          <img src={logoImg} alt="Logo Menú Digital" className="logo-inicio" />
          <p className="antetitulo-inicio">Menú Digital</p>
          <h1 className="titulo-inicio">Pizzería Squisita</h1>
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
