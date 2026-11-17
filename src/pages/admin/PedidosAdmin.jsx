import { useCallback, useEffect, useRef, useState } from 'react'
import TarjetaPedido from '../../components/admin/TarjetaPedido'
import {
  cambiarEstadoPedido,
  listarPedidos,
  obtenerSiguienteEstado,
} from '../../services/pedidosAdminService'
import formatoFechaHora from '../../utils/formatoFechaHora'
import numeroPedido from '../../utils/numeroPedido'

const FILTROS = ['Todos', 'Pendiente', 'En preparación', 'Listo']
const INTERVALO_ACTUALIZACION = 30000

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)
  const [actualizandoId, setActualizandoId] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')

  const solicitudRef = useRef(0)

  const cargarPedidos = useCallback(
    async ({ silencioso = false } = {}) => {
      const solicitud = solicitudRef.current + 1
      solicitudRef.current = solicitud

      await Promise.resolve()

      if (silencioso) {
        setActualizando(true)
      } else {
        setCargando(true)
      }

      setError('')

      try {
        const lista = await listarPedidos(filtro)

        if (solicitud !== solicitudRef.current) return

        setPedidos(lista)
        setUltimaActualizacion(new Date())
      } catch (errorCarga) {
        if (solicitud !== solicitudRef.current) return

        setError(
          errorCarga.message ||
            'No se pudieron cargar los pedidos. Inténtalo de nuevo.',
        )
      } finally {
        if (solicitud === solicitudRef.current) {
          setCargando(false)
          setActualizando(false)
        }
      }
    },
    [filtro],
  )

  useEffect(() => {
    let vigente = true

    async function iniciarCarga() {
      await Promise.resolve()

      if (vigente) {
        cargarPedidos()
      }
    }

    iniciarCarga()

    return () => {
      vigente = false
      solicitudRef.current += 1
    }
  }, [cargarPedidos])

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      cargarPedidos({ silencioso: true })
    }, INTERVALO_ACTUALIZACION)

    return () => {
      window.clearInterval(intervalo)
    }
  }, [cargarPedidos])

  async function handleAvanzarEstado(pedido) {
    if (actualizandoId !== null) return

    const siguienteEstado = obtenerSiguienteEstado(pedido.estado)

    if (!siguienteEstado) return

    setActualizandoId(pedido.id)
    setErrorAccion('')
    setMensaje('')

    try {
      const resultado = await cambiarEstadoPedido(pedido.id, siguienteEstado)
      const estadoFinal = resultado.estado

      setPedidos((previos) => {
        if (estadoFinal === 'Entregado') {
          return previos.filter(
            (item) => String(item.id) !== String(pedido.id),
          )
        }

        if (filtro !== 'Todos' && estadoFinal !== filtro) {
          return previos.filter(
            (item) => String(item.id) !== String(pedido.id),
          )
        }

        return previos.map((item) =>
          String(item.id) === String(pedido.id)
            ? { ...item, estado: estadoFinal }
            : item,
        )
      })

      setMensaje(
        `Pedido #${numeroPedido(pedido)} actualizado a "${estadoFinal}".`,
      )
      setUltimaActualizacion(new Date())
    } catch (errorCambio) {
      setErrorAccion(
        errorCambio.message ||
          'No se pudo cambiar el estado del pedido. Inténtalo de nuevo.',
      )
    } finally {
      setActualizandoId(null)
    }
  }

  function handleCambiarFiltro(nuevoFiltro) {
    setFiltro(nuevoFiltro)
    setMensaje('')
    setErrorAccion('')
  }

  return (
    <div className="admin-pagina">
      <header className="admin-encabezado">
        <div>
          <p className="admin-antetitulo">Cocina</p>
          <h1 className="admin-titulo">Pedidos activos</h1>
          <p className="admin-descripcion">
            
          </p>
        </div>

        <div className="admin-acciones">
          <span className="admin-ultima-actualizacion">
            {ultimaActualizacion
              ? `Actualizado: ${formatoFechaHora(ultimaActualizacion)}`
              : 'Sin actualizar'}
          </span>
          <button
            type="button"
            className="admin-boton admin-boton-secundario"
            onClick={() => cargarPedidos({ silencioso: true })}
            disabled={cargando || actualizando}
          >
            {actualizando ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
      </header>

      {mensaje ? (
        <p className="admin-aviso admin-aviso-exito" role="status">
          {mensaje}
        </p>
      ) : null}

      {error && pedidos.length > 0 ? (
        <p className="admin-aviso admin-aviso-error" role="alert">
          {error}
        </p>
      ) : null}

      {errorAccion ? (
        <p className="admin-aviso admin-aviso-error" role="alert">
          {errorAccion}
        </p>
      ) : null}

      <section className="admin-panel" aria-label="Filtros de pedidos">
        <div className="admin-filtros-estado" role="group" aria-label="Filtrar por estado">
          {FILTROS.map((opcion) => (
            <button
              key={opcion}
              type="button"
              className={
                filtro === opcion
                  ? 'admin-filtro-estado admin-filtro-estado-activo'
                  : 'admin-filtro-estado'
              }
              onClick={() => handleCambiarFiltro(opcion)}
              aria-pressed={filtro === opcion}
            >
              {opcion}
            </button>
          ))}
        </div>
      </section>

      {cargando ? (
        <div className="admin-estado admin-estado-carga" role="status">
          <span className="admin-cargador" aria-hidden="true" />
          <p>Cargando pedidos…</p>
        </div>
      ) : error && pedidos.length === 0 ? (
        <div className="admin-estado admin-estado-error" role="alert">
          <h2>No pudimos cargar los pedidos</h2>
          <p>{error}</p>
          <button
            type="button"
            className="admin-boton admin-boton-primario"
            onClick={() => cargarPedidos()}
          >
            Reintentar
          </button>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="admin-estado admin-estado-vacio">
          <h2>No hay pedidos activos</h2>
          <p>
            {filtro === 'Todos'
              ? 'Cuando entre un pedido nuevo, aparecerá aquí automáticamente.'
              : `No hay pedidos en estado "${filtro}" en este momento.`}
          </p>
        </div>
      ) : (
        <div className="admin-lista-pedidos">
          {pedidos.map((pedido) => (
            <TarjetaPedido
              key={pedido.id}
              pedido={pedido}
              actualizando={String(actualizandoId) === String(pedido.id)}
              error=""
              onAvanzar={handleAvanzarEstado}
            />
          ))}
        </div>
      )}
    </div>
  )
}
