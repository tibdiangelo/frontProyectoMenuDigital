import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import ModalConfirmacion from '../../components/admin/ModalConfirmacion'
import TablaPlatos from '../../components/admin/TablaPlatos'
import {
  eliminarPlato,
  listarPlatos,
} from '../../services/platosService'

export default function PlatosAdmin() {
  const navigate = useNavigate()
  const location = useLocation()

  const [platos, setPlatos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState(location.state?.mensaje ?? '')

  const [filtroCategoria, setFiltroCategoria] = useState('todas')
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState('todos')

  const [platoAEliminar, setPlatoAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState('')

  const solicitudRef = useRef(0)

  const cargarPlatos = useCallback(async ({ silencioso = false } = {}) => {
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
      const lista = await listarPlatos()

      if (solicitud !== solicitudRef.current) return

      setPlatos(lista)
    } catch (errorCarga) {
      if (solicitud !== solicitudRef.current) return

      setError(
        errorCarga.message ||
          'No se pudieron cargar los platos. Inténtalo de nuevo.',
      )
    } finally {
      if (solicitud === solicitudRef.current) {
        setCargando(false)
        setActualizando(false)
      }
    }
  }, [])

  useEffect(() => {
    let vigente = true

    async function iniciarCarga() {
      await Promise.resolve()

      if (vigente) {
        cargarPlatos()
      }
    }

    iniciarCarga()

    return () => {
      vigente = false
      solicitudRef.current += 1
    }
  }, [cargarPlatos])

  const categorias = useMemo(() => {
    const mapa = new Map()

    platos.forEach((plato) => {
      const clave = String(plato.categoriaId || plato.categoriaNombre)

      if (!mapa.has(clave)) {
        mapa.set(clave, {
          clave,
          nombre: plato.categoriaNombre || 'Sin categoría',
        })
      }
    })

    return Array.from(mapa.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es'),
    )
  }, [platos])

  const platosFiltrados = useMemo(() => {
    return platos.filter((plato) => {
      const categoriaPlato = String(
        plato.categoriaId || plato.categoriaNombre,
      )
      const coincideCategoria =
        filtroCategoria === 'todas' || categoriaPlato === filtroCategoria
      const coincideDisponibilidad =
        filtroDisponibilidad === 'todos' ||
        (filtroDisponibilidad === 'disponibles' && plato.disponible) ||
        (filtroDisponibilidad === 'agotados' && !plato.disponible)

      return coincideCategoria && coincideDisponibilidad
    })
  }, [platos, filtroCategoria, filtroDisponibilidad])

  function handleEditar(plato) {
    navigate(`/admin/platos/${encodeURIComponent(plato.id)}/editar`)
  }

  function handleSolicitarEliminar(plato) {
    setPlatoAEliminar(plato)
    setErrorEliminar('')
  }

  function handleCancelarEliminar() {
    if (eliminando) return

    setPlatoAEliminar(null)
    setErrorEliminar('')
  }

  async function handleConfirmarEliminar() {
    if (!platoAEliminar || eliminando) return

    setEliminando(true)
    setErrorEliminar('')

    try {
      await eliminarPlato(platoAEliminar.id)
      setMensaje(`El plato "${platoAEliminar.nombre}" fue eliminado.`)
      setPlatoAEliminar(null)
      await cargarPlatos({ silencioso: true })
    } catch (errorDelete) {
      setErrorEliminar(
        errorDelete.message ||
          'No se pudo eliminar el plato. Inténtalo de nuevo.',
      )
    } finally {
      setEliminando(false)
    }
  }

  function limpiarFiltros() {
    setFiltroCategoria('todas')
    setFiltroDisponibilidad('todos')
  }

  return (
    <div className="admin-pagina">
      <header className="admin-encabezado">
        <div>
          <p className="admin-antetitulo">Administración</p>
          <h1 className="admin-titulo">Platos</h1>
          <p className="admin-descripcion">
            Crea, edita y administra los platos que aparecen en el menú público.
          </p>
        </div>

        <div className="admin-acciones">
          <button
            type="button"
            className="admin-boton admin-boton-secundario"
            onClick={() => cargarPlatos({ silencioso: true })}
            disabled={cargando || actualizando}
          >
            {actualizando ? 'Actualizando…' : 'Actualizar'}
          </button>
          <Link
            to="/admin/platos/nuevo"
            className="admin-boton admin-boton-primario"
          >
            + Nuevo Plato
          </Link>
        </div>
      </header>

      {mensaje ? (
        <p className="admin-aviso admin-aviso-exito" role="status">
          {mensaje}
        </p>
      ) : null}

      {error && platos.length > 0 ? (
        <p className="admin-aviso admin-aviso-error" role="alert">
          {error}
        </p>
      ) : null}

      <section className="admin-panel" aria-label="Listado de platos">
        <div className="admin-filtros">
          <label className="admin-campo-filtro" htmlFor="filtro-categoria">
            Categoría
            <select
              id="filtro-categoria"
              className="admin-select"
              value={filtroCategoria}
              onChange={(event) => setFiltroCategoria(event.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.clave} value={categoria.clave}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-campo-filtro" htmlFor="filtro-disponibilidad">
            Disponibilidad
            <select
              id="filtro-disponibilidad"
              className="admin-select"
              value={filtroDisponibilidad}
              onChange={(event) => setFiltroDisponibilidad(event.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="disponibles">Disponibles</option>
              <option value="agotados">Agotados</option>
            </select>
          </label>

          <span className="admin-contador" aria-live="polite">
            {platosFiltrados.length} de {platos.length}{' '}
            {platos.length === 1 ? 'plato' : 'platos'}
          </span>
        </div>

        {cargando ? (
          <div className="admin-estado admin-estado-carga" role="status">
            <span className="admin-cargador" aria-hidden="true" />
            <p>Cargando platos…</p>
          </div>
        ) : error && platos.length === 0 ? (
          <div className="admin-estado admin-estado-error" role="alert">
            <h2>No pudimos cargar los platos</h2>
            <p>{error}</p>
            <button
              type="button"
              className="admin-boton admin-boton-primario"
              onClick={() => cargarPlatos()}
            >
              Reintentar
            </button>
          </div>
        ) : platos.length === 0 ? (
          <div className="admin-estado admin-estado-vacio">
            <h2>Todavía no hay platos</h2>
            <p>Agrega el primer plato para que aparezca en el menú público.</p>
            <Link
              to="/admin/platos/nuevo"
              className="admin-boton admin-boton-primario"
            >
              Crear el primer plato
            </Link>
          </div>
        ) : platosFiltrados.length === 0 ? (
          <div className="admin-estado admin-estado-vacio">
            <h2>No hay platos con esos filtros</h2>
            <p>Prueba con otra categoría u otra disponibilidad.</p>
            <button
              type="button"
              className="admin-boton admin-boton-secundario"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <TablaPlatos
            platos={platosFiltrados}
            onEditar={handleEditar}
            onEliminar={handleSolicitarEliminar}
          />
        )}
      </section>

      <ModalConfirmacion
        abierto={Boolean(platoAEliminar)}
        titulo="Eliminar plato"
        mensaje={
          platoAEliminar
            ? `¿Seguro que quieres eliminar "${platoAEliminar.nombre}"? Si tiene pedidos asociados, dejará de mostrarse en el menú público.`
            : ''
        }
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        procesando={eliminando}
        error={errorEliminar}
        onConfirmar={handleConfirmarEliminar}
        onCancelar={handleCancelarEliminar}
      />
    </div>
  )
}
