import { useState } from 'react'
import { Link } from 'react-router'
import carritoImg from '../assets/carrito.jpeg'
import { useCarrito } from '../context/CarritoContext'
import { enviarPedido } from '../services/pedidosService'
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
  const [enviando, setEnviando] = useState(false)
  const [pedidoEnviado, setPedidoEnviado] = useState(null)
  const [errorEnvio, setErrorEnvio] = useState('')

  function handleVaciar() {
    const confirmado = window.confirm('¿Seguro que quieres vaciar tu pedido?')

    if (confirmado) {
      vaciarCarrito()
    }
  }

  async function handleEnviarPedido() {
    if (estaVacio || enviando) return

    const confirmado = window.confirm('¿Enviar tu pedido a la cocina?')

    if (!confirmado) return

    setEnviando(true)
    setErrorEnvio('')

    try {
      const pedido = await enviarPedido({ items, total })
      setPedidoEnviado(pedido)
      vaciarCarrito()
    } catch {
      setErrorEnvio('No se pudo enviar el pedido. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
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
            {pedidoEnviado
              ? 'Pedido enviado a la cocina'
              : estaVacio
                ? 'Aún no has agregado platos.'
                : `${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'} en tu pedido`}
          </p>
        </header>

        {pedidoEnviado ? (
          <section className="pedido-enviado" aria-live="polite">
            <span className="icono-enviado" aria-hidden="true">
              ✓
            </span>
            <h2>¡Pedido enviado a la cocina!</h2>
            <p>
              Tu pedido <strong>#{pedidoEnviado.id.slice(-6).toUpperCase()}</strong>{' '}
              fue recibido y está en estado <strong>{pedidoEnviado.estado}</strong>.
            </p>
            <Link to="/" className="boton-primario">
              Volver al menú
            </Link>
          </section>
        ) : estaVacio ? (
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

              

              {errorEnvio ? (
                <p className="error-envio" role="alert">
                  {errorEnvio}
                </p>
              ) : null}

              <div className="acciones-resumen">
                <Link to="/" className="boton-secundario">
                  Seguir eligiendo
                </Link>
                <button type="button" className="boton-vaciar" onClick={handleVaciar}>
                  Vaciar pedido
                </button>
              </div>
              <button
                type="button"
                className="boton-enviar"
                onClick={handleEnviarPedido}
                disabled={enviando}
              >
                {enviando ? 'Enviando pedido…' : 'Enviar pedido a la cocina'}
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
