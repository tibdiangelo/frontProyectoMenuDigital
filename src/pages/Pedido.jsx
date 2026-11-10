import { Link } from 'react-router'
import carritoImg from '../assets/carrito.jpeg'
import { useCarrito } from '../context/CarritoContext'
import formatoMoneda from '../utils/formatoMoneda'
import './Pedido.css'

function CantidadItem({ item, alCambiarCantidad }) {
  return (
    <div
      className="control-cantidad"
      role="group"
      aria-label={`Cantidad de ${item.nombre}`}
    >
      <button
        type="button"
        className="boton-cantidad"
        onClick={() => alCambiarCantidad(item.id, item.cantidad - 1)}
        disabled={item.cantidad <= 1}
        aria-label={`Quitar una unidad de ${item.nombre}`}
      >
        −
      </button>
      <span className="cantidad-item" aria-live="polite">
        {item.cantidad}
      </span>
      <button
        type="button"
        className="boton-cantidad"
        onClick={() => alCambiarCantidad(item.id, item.cantidad + 1)}
        aria-label={`Agregar una unidad de ${item.nombre}`}
      >
        +
      </button>
    </div>
  )
}

export default function Pedido() {
  const {
    items,
    cantidadTotal,
    total,
    cambiarCantidad,
    eliminarPlato,
    vaciarCarrito,
  } = useCarrito()

  const estaVacio = items.length === 0

  function handleVaciar() {
    const confirmado = window.confirm('¿Seguro que quieres vaciar tu pedido?')

    if (confirmado) {
      vaciarCarrito()
    }
  }

  return (
    <div className="pagina-pedido">
      <div className="contenedor-pedido">
        <header className="cabecera-pedido">
          <Link to="/" className="enlace-volver">
            ← Volver al menú
          </Link>
          <h1 className="titulo-pedido">Tu pedido</h1>
          <p className="subtitulo-pedido" aria-live="polite">
            {estaVacio
              ? 'Aún no has agregado platos.'
              : `${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'} en tu pedido`}
          </p>
        </header>

        {estaVacio ? (
          <section className="pedido-vacio">
            <img src={carritoImg} alt="" className="icono-vacio" />
            <h2>Tu pedido está vacío</h2>
            <p>Agrega tus platos favoritos desde el menú para verlos aquí.</p>
            <Link to="/" className="boton-primario">
              Ver el menú
            </Link>
          </section>
        ) : (
          <>
            <ul className="lista-pedido">
              {items.map((item) => (
                <li key={item.id} className="item-pedido">
                  <div className="info-item">
                    <h2 className="nombre-item">{item.nombre}</h2>
                    <p className="precio-unitario">
                      {formatoMoneda.format(item.precio)} c/u
                    </p>
                  </div>

                  <div className="acciones-item">
                    <CantidadItem item={item} alCambiarCantidad={cambiarCantidad} />
                    <p className="subtotal-item">
                      {formatoMoneda.format(item.precio * item.cantidad)}
                    </p>
                    <button
                      type="button"
                      className="boton-eliminar"
                      onClick={() => eliminarPlato(item.id)}
                      aria-label={`Eliminar ${item.nombre} del pedido`}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <section className="resumen-pedido" aria-label="Resumen del pedido">
              <div className="fila-resumen">
                <span>Productos</span>
                <span>{cantidadTotal}</span>
              </div>
              <div className="fila-resumen fila-total">
                <span>Total</span>
                <strong>{formatoMoneda.format(total)}</strong>
              </div>

              <div className="acciones-resumen">
                <Link to="/" className="boton-secundario">
                  Seguir eligiendo
                </Link>
                <button type="button" className="boton-vaciar" onClick={handleVaciar}>
                  Vaciar pedido
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
