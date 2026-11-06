import logoImg from '../assets/pizzaloggo.jpeg'
import pizzaImg from '../assets/pizzaimg.jpg'
import sodasImg from '../assets/sodas.webp'
import carritoImg from '../assets/carrito.jpeg'
import './home.css'

const pizzas = ['Hawaiana', 'Peperoni', 'Jamón y queso', 'Napolitana']
const sodas = ['Frutos rojos', 'Maracuyá', 'Mango biche']

export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>
          <em>Menú</em>
        </h1>
        <img src={logoImg} alt="Logo Menú Digital" className="logo-redondo" />
      </header>

      <section className="menu-categorias">
        <article className="targeta-categoria">
          <h2>
            <em>Pizzas</em>
          </h2>
          <img src={pizzaImg} alt="Pizzas" className="pizza-categoria" />
          <ul>
            {pizzas.map((pizza) => (
              <li key={pizza}>{pizza}</li>
            ))}
          </ul>
        </article>

        <article className="targeta-categoria">
          <h2>
            <em>Sodas</em>
          </h2>
          <img src={sodasImg} alt="Sodas" className="soda-categoria" />
          <ul>
            {sodas.map((soda) => (
              <li key={soda}>{soda}</li>
            ))}
          </ul>
        </article>

        <button type="button" className="carrito-icono">
          <img src={carritoImg} alt="Carrito de compras" />
          <span className="texto-carrito">Ver pedido</span>
        </button>
      </section>

      <footer>
        <h3>Redes Sociales</h3>
        <h4>Facebook | Instagram</h4>
      </footer>
    </div>
  )
}
