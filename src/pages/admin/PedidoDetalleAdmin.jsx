import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import BadgeEstado from '../../components/admin/BadgeEstado'
import {
  cambiarEstadoPedido,
  obtenerPedido,
  obtenerSiguienteEstado,
} from '../../services/pedidosAdminService'
import formatoFechaHora from '../../utils/formatoFechaHora'
import formatoMoneda from '../../utils/formatoMoneda'
import numeroPedido from '../../utils/numeroPedido'

export default function PedidoDetalleAdmin() {
  const { id } = useParams()

  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [recarga, setRecarga] = useState(0)
  const [actualizando, setActualizando] = useState(false)
  const [errorAccion, setErrorAccion] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let vigente = true

    async function cargarPedido() {
      setCargando(true)
      setError('')

      try {
        const datos = await obtenerPedido(id)

        if (vigente) {
          setPedido(datos)
        }
      } catch (errorCarga) {
        if (vigente) {
          setError(
            errorCarga.message ||
              'No se pudo cargar el pedido. Inténtalo de nuevo.',
          )
        }
      } finally {
        if (vigente) {
          setCargando(false)
        }
      }
    }

    cargarPedido()

    return () => {
      vigente = false
    }
  }, [id, recarga])

  const siguienteEstado = pedido
    ? obtenerSiguienteEstado(pedido.estado)
    : null

  async function handleAvanzarEstado() {
    if (!pedido || !siguienteEstado || actualizando) return

    setActualizando(true)
    setErrorAccion('')
    setMensaje('')

    try {
      const resultado = await cambiarEstadoPedido(pedido.id, siguienteEstado)

      setPedido((previo) =>
        previo ? { ...previo, estado: resultado.estado } : previo,
      )
      setMensaje(`El pedido pasó a "${resultado.estado}".`)
    } catch (errorCambio) {
      setErrorAccion(
        errorCambio.message ||
          'No se pudo cambiar el estado del pedido. Inténtalo de nuevo.',
      )
    } finally {
      setActualizando(false)
    }
  }

  return (
    <div className="admin-pagina admin-pagina-detalle">
      <header className="admin-encabezado">
        <div>
          <Link to="/admin/pedidos" className="admin-volver">
            ← Volver a pedidos
          </Link>
          <h1 className="admin-titulo">
            Pedido #{pedido ? numeroPedido(pedido) : '—'}
          </h1>
          <p className="admin-descripcion">
            Consulta los platos, las notas y el estado del pedido.
          </p>
        </div>

        <div className="admin-acciones">
          <button
            type="button"
            className="admin-boton admin-boton-secundario"
            onClick={() => setRecarga((valor) => valor + 1)}
            disabled={cargando}
          >
            {cargando ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
      </header>

      {mensaje ? (
        <p className="admin-aviso admin-aviso-exito" role="status">
          {mensaje}
        </p>
      ) : null}

      {errorAccion ? (
        <p className="admin-aviso admin-aviso-error" role="alert">
          {errorAccion}
        </p>
      ) : null}

      {cargando && !pedido ? (
        <div className="admin-estado admin-estado-carga" role="status">
          <span className="admin-cargador" aria-hidden="true" />
          <p>Cargando pedido…</p>
        </div>
      ) : error && !pedido ? (
        <div className="admin-estado admin-estado-error" role="alert">
          <h2>No pudimos cargar el pedido</h2>
          <p>{error}</p>
          <div className="admin-acciones">
            <button
              type="button"
              className="admin-boton admin-boton-primario"
              onClick={() => setRecarga((valor) => valor + 1)}
            >
              Reintentar
            </button>
            <Link
              to="/admin/pedidos"
              className="admin-boton admin-boton-secundario"
            >
              Volver a pedidos
            </Link>
          </div>
        </div>
      ) : pedido ? (
        <div className="admin-detalle">
          {error ? (
            <p className="admin-aviso admin-aviso-error" role="alert">
              {error}
            </p>
          ) : null}

          <section className="admin-panel admin-detalle-resumen">
            <div className="admin-detalle-dato">
              <span className="admin-detalle-etiqueta">Mesa</span>
              <strong className="admin-detalle-valor">
                {pedido.mesa || '—'}
              </strong>
            </div>
            <div className="admin-detalle-dato">
              <span className="admin-detalle-etiqueta">Cliente</span>
              <strong className="admin-detalle-valor">
                {pedido.cliente || 'Sin nombre'}
              </strong>
            </div>
            <div className="admin-detalle-dato">
              <span className="admin-detalle-etiqueta">Hora</span>
              <strong className="admin-detalle-valor">
                {formatoFechaHora(pedido.fecha)}
              </strong>
            </div>
            <div className="admin-detalle-dato">
              <span className="admin-detalle-etiqueta">Estado</span>
              <BadgeEstado estado={pedido.estado} />
            </div>
          </section>

          <section className="admin-panel" aria-labelledby="titulo-platos-pedido">
            <h2 id="titulo-platos-pedido" className="admin-detalle-titulo">
              Platos del pedido
            </h2>

            {pedido.items.length === 0 ? (
              <p className="admin-detalle-vacio">
                Este pedido no tiene platos registrados.
              </p>
            ) : (
              <div className="admin-tabla-contenedor">
                <table className="admin-tabla admin-tabla-detalle">
                  <thead>
                    <tr>
                      <th scope="col">Plato</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Precio unitario</th>
                      <th scope="col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.items.map((item, indice) => (
                      <tr key={`${item.id}-${indice}`}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatoMoneda.format(item.precioUnitario)}</td>
                        <td className="admin-precio">
                          {formatoMoneda.format(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="admin-detalle-total">
              <span>Total</span>
              <strong>{formatoMoneda.format(pedido.total)}</strong>
            </div>
          </section>

          {pedido.notas ? (
            <section className="admin-panel admin-detalle-notas">
              <h2 className="admin-detalle-titulo">Notas</h2>
              <p>{pedido.notas}</p>
            </section>
          ) : null}

          <section className="admin-panel admin-detalle-acciones">
            <div>
              <h2 className="admin-detalle-titulo">Siguiente paso</h2>
              <p className="admin-descripcion">
                {siguienteEstado
                  ? `El pedido está en "${pedido.estado}".`
                  : 'El pedido ya fue entregado y salió de la lista de pedidos activos.'}
              </p>
            </div>

            {siguienteEstado ? (
              <button
                type="button"
                className="admin-boton admin-boton-primario"
                onClick={handleAvanzarEstado}
                disabled={actualizando}
              >
                {actualizando
                  ? 'Actualizando…'
                  : `Marcar ${siguienteEstado}`}
              </button>
            ) : (
              <p className="admin-detalle-mensaje" role="status">
                Pedido entregado
              </p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
