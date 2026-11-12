import { useRef, useState } from 'react'
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

function numeroPedido(id) {
  if (id === null || id === undefined) return '—'

  const texto = String(id)

  return texto.length > 8 ? texto.slice(-6).toUpperCase() : texto
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

  const [paso, setPaso] = useState('carrito')
  const [enviando, setEnviando] = useState(false)
  const [pedidoEnviado, setPedidoEnviado] = useState(null)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [clienteNombre, setClienteNombre] = useState('')
  const [mesa, setMesa] = useState('')
  const [notas, setNotas] = useState('')
  const [errores, setErrores] = useState({})

  const nombreRef = useRef(null)
  const mesaRef = useRef(null)

  const estaVacio = items.length === 0
  const enConfirmacion = paso === 'confirmar'

  function handleVaciar() {
    const confirmado = window.confirm('¿Seguro que quieres vaciar tu pedido?')

    if (confirmado) {
      vaciarCarrito()
    }
  }

  function validarFormulario() {
    const nuevosErrores = {}

    if (clienteNombre.trim().length < 2) {
      nuevosErrores.clienteNombre = 'Ingresa un nombre de al menos 2 caracteres.'
    }

    const numeroMesa = Number(mesa)

    if (
      mesa.trim() === '' ||
      !Number.isInteger(numeroMesa) ||
      numeroMesa < 1 ||
      numeroMesa > 10
    ) {
      nuevosErrores.mesa = 'La mesa debe ser un número entero entre 1 y 10.'
    }

    return nuevosErrores
  }

  async function handleConfirmarPedido(event) {
    event.preventDefault()

    if (enviando) return

    const nuevosErrores = validarFormulario()
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      if (nuevosErrores.clienteNombre) {
        nombreRef.current?.focus()
      } else if (nuevosErrores.mesa) {
        mesaRef.current?.focus()
      }

      return
    }

    const nombreLimpio = clienteNombre.trim()
    const numeroMesa = Number(mesa)

    setEnviando(true)
    setErrorEnvio('')

    try {
      const pedido = await enviarPedido({
        mesa: numeroMesa,
        clienteNombre: nombreLimpio,
        notas: notas.trim(),
        items,
      })

      setPedidoEnviado({ ...pedido, mesa: numeroMesa, clienteNombre: nombreLimpio })
      vaciarCarrito()
      setPaso('enviado')
      setErrores({})
    } catch (error) {
      setErrorEnvio(
        error.message || 'No se pudo enviar el pedido. Inténtalo de nuevo.',
      )
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
          <h1 className="titulo-pedido">
            {enConfirmacion ? 'Confirmar pedido' : 'Tu pedido'}
          </h1>
          <p className="subtitulo-pedido" aria-live="polite">
            {paso === 'enviado'
              ? 'Pedido enviado a la cocina'
              : enConfirmacion
                ? 'Ingresa tu nombre y el número de mesa.'
                : estaVacio
                  ? 'Aún no has agregado platos.'
                  : `${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'} en tu pedido`}
          </p>
        </header>

        {paso === 'enviado' && pedidoEnviado ? (
          <section className="pedido-enviado" aria-live="polite">
            <span className="icono-enviado" aria-hidden="true">
              ✓
            </span>
            <h2>¡Pedido enviado a la cocina!</h2>
            <p>
              Pedido <strong>#{numeroPedido(pedidoEnviado.id)}</strong> · Estado{' '}
              <strong>{pedidoEnviado.estado}</strong>
            </p>
            <p className="detalle-entrega">
              Mesa {pedidoEnviado.mesa} · {pedidoEnviado.clienteNombre}
            </p>
            <a href="/" className="boton-primario">
              Hacer otro pedido
            </a>
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

            {enConfirmacion ? (
              <form
                className="formulario-confirmacion"
                onSubmit={handleConfirmarPedido}
                noValidate
              >
                <h2 className="titulo-confirmacion">Datos de entrega</h2>
                <p className="texto-confirmacion">
                  Completa los datos para que la cocina sepa a nombre de quién y a
                  qué mesa llevar el pedido.
                </p>

                <div className="campo-formulario">
                  <label htmlFor="cliente-nombre">Nombre del cliente</label>
                  <input
                    ref={nombreRef}
                    type="text"
                    id="cliente-nombre"
                    name="cliente_nombre"
                    value={clienteNombre}
                    onChange={(event) => setClienteNombre(event.target.value)}
                    placeholder="Nombre"
                    autoComplete="name"
                    maxLength={60}
                    aria-invalid={errores.clienteNombre ? 'true' : undefined}
                    aria-describedby={
                      errores.clienteNombre ? 'error-cliente-nombre' : undefined
                    }
                    required
                  />
                  {errores.clienteNombre ? (
                    <p id="error-cliente-nombre" className="mensaje-error-campo">
                      {errores.clienteNombre}
                    </p>
                  ) : null}
                </div>

                <div className="campo-formulario">
                  <label htmlFor="mesa">Número de mesa</label>
                  <input
                    ref={mesaRef}
                    type="number"
                    id="mesa"
                    name="mesa"
                    value={mesa}
                    onChange={(event) => setMesa(event.target.value)}
                    placeholder="Ej. 5"
                    min="1"
                    max="10"
                    step="1"
                    inputMode="numeric"
                    aria-invalid={errores.mesa ? 'true' : undefined}
                    aria-describedby={errores.mesa ? 'error-mesa' : undefined}
                    required
                  />
                  {errores.mesa ? (
                    <p id="error-mesa" className="mensaje-error-campo">
                      {errores.mesa}
                    </p>
                  ) : null}
                </div>

                <div className="campo-formulario">
                  <label htmlFor="notas">Notas (opcional)</label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={notas}
                    onChange={(event) => setNotas(event.target.value)}
                    rows="3"
                    maxLength={300}
                    placeholder="Ej. Sin cebolla, sin picante…"
                  />
                </div>

                <div className="total-confirmacion">
                  <span>Total</span>
                  <strong>{formatoMoneda.format(total)}</strong>
                </div>

                {errorEnvio ? (
                  <p className="error-envio" role="alert">
                    {errorEnvio}
                  </p>
                ) : null}

                <div className="acciones-confirmacion">
                  <button
                    type="button"
                    className="boton-secundario"
                    onClick={() => {
                      setPaso('carrito')
                      setErrorEnvio('')
                    }}
                    disabled={enviando}
                  >
                    Volver al pedido
                  </button>
                  <button type="submit" className="boton-enviar" disabled={enviando}>
                    {enviando ? 'Enviando pedido…' : 'Confirmar pedido'}
                  </button>
                </div>
              </form>
            ) : (
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
                  <button
                    type="button"
                    className="boton-vaciar"
                    onClick={handleVaciar}
                  >
                    Vaciar pedido
                  </button>
                </div>

                <button
                  type="button"
                  className="boton-enviar"
                  onClick={() => {
                    setPaso('confirmar')
                    setErrorEnvio('')
                  }}
                >
                  Enviar pedido a la cocina
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
