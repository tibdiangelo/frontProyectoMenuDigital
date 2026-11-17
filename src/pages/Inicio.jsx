import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import logoImg from '../assets/pizzaloggo.jpeg'
import pizzaImg from '../assets/pizzaimg.jpg'
import sodasImg from '../assets/sodas.webp'
import carritoImg from '../assets/carrito.jpeg'
import { useCarrito } from '../context/CarritoContext'
import { obtenerMenu } from '../services/api'
import formatoMoneda from '../utils/formatoMoneda'
import './Inicio.css'

const IMAGENES_CATEGORIA = {
  pizzas: pizzaImg,
  sodas: sodasImg,
}

function imagenCategoria(nombre) {
  const clave = String(nombre ?? '').trim().toLowerCase()

  return IMAGENES_CATEGORIA[clave] ?? pizzaImg
}

export default function Inicio() {
  const navigate = useNavigate()
  const { agregarPlato, cantidadTotal } = useCarrito()

  const [menu, setMenu] = useState({ categorias: [], platos: [] })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let vigente = true

    async function cargarMenu() {
      setCargando(true)
      setError('')

      try {
        const datos = await obtenerMenu()

        if (vigente) {
          setMenu(datos)
        }
      } catch (errorCarga) {
        if (vigente) {
          setError(
            errorCarga.message ||
              'No se pudo cargar el menú. Inténtalo de nuevo.',
          )
        }
      } finally {
        if (vigente) {
          setCargando(false)
        }
      }
    }

    cargarMenu()

    return () => {
      vigente = false
    }
  }, [])

  const platosDisponibles = menu.platos.filter((plato) => plato.disponible)

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
          {cargando ? (
            <p className="subtitulo-inicio" role="status">
              Cargando menú…
            </p>
          ) : error ? (
            <p className="subtitulo-inicio" role="alert">
              {error}
            </p>
          ) : menu.categorias.length === 0 ? (
            <p className="subtitulo-inicio">
              El menú todavía no tiene categorías disponibles.
            </p>
          ) : (
            menu.categorias.map((categoria) => {
              const platosCategoria = platosDisponibles.filter(
                (plato) => plato.categoria === categoria.nombre,
              )

              return (
                <article key={categoria.id} className="tarjeta-inicio">
                  <div className="cabecera-tarjeta">
                    <h2 className="titulo-tarjeta">{categoria.nombre}</h2>
                    <span className="insignia-tarjeta">
                      {platosCategoria.length}{' '}
                      {platosCategoria.length === 1 ? 'opción' : 'opciones'}
                    </span>
                  </div>
                  <img
                    src={imagenCategoria(categoria.nombre)}
                    alt={categoria.nombre}
                    className="imagen-tarjeta"
                    loading="lazy"
                  />
                  {platosCategoria.length === 0 ? (
                    <p className="subtitulo-inicio">Sin platos disponibles.</p>
                  ) : (
                    <ul className="lista-inicio">
                      {platosCategoria.map((plato) => (
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
                  )}
                </article>
              )
            })
          )}
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
