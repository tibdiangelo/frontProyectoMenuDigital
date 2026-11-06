import logoImg from '../assets/pizzaloggo.jpeg'
import pizzaImg from '../assets/pizzaimg.jpg'
import sodasImg from '../assets/sodas.webp'
import carritoImg from '../assets/carrito.jpeg'
import './Inicio.css'

const pizzas = ['Hawaiana', 'Peperoni', 'Jamón y queso', 'Napolitana']
const sodas = ['Frutos rojos', 'Maracuyá', 'Mango biche']

export default function Inicio() {
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
              {pizzas.map((pizza) => (
                <li key={pizza} className="elemento-lista">
                  <span>{pizza}</span>
                  <span className="punto-lista" aria-hidden="true" />
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
              {sodas.map((soda) => (
                <li key={soda} className="elemento-lista">
                  <span>{soda}</span>
                  <span className="punto-lista" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </article>
        </section>

        <button type="button" className="boton-carrito">
          <img src={carritoImg} alt="" className="icono-carrito" />
          <span>Ver mi pedido</span>
        </button>

        <footer className="pie-inicio">
          <p>Redes Sociales</p>
          <p className="enlaces-pie">Facebook · Instagram</p>
        </footer>
      </div>
    </div>
  )
}
