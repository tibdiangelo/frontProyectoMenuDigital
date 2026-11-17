import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import FormularioPlato from '../../components/admin/FormularioPlato'
import {
  actualizarPlato,
  crearPlato,
  listarCategorias,
  listarPlatos,
} from '../../services/platosService'

export default function PlatoFormularioAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [categorias, setCategorias] = useState([])
  const [platoInicial, setPlatoInicial] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let vigente = true

    async function cargarDatos() {
      setCargando(true)
      setErrorCarga('')

      try {
        const [categoriasCargadas, platos] = await Promise.all([
          listarCategorias(),
          editando ? listarPlatos() : Promise.resolve([]),
        ])

        let plato = null

        if (editando) {
          plato =
            platos.find((item) => String(item.id) === String(id)) ?? null

          if (!plato) {
            throw new Error(
              'No se encontró el plato que quieres editar. Puede que haya sido eliminado.',
            )
          }
        }

        const categoriasFinales = [...categoriasCargadas]

        if (
          plato &&
          plato.categoriaId !== '' &&
          !categoriasFinales.some(
            (categoria) => String(categoria.id) === String(plato.categoriaId),
          )
        ) {
          categoriasFinales.push({
            id: plato.categoriaId,
            nombre: plato.categoriaNombre || 'Sin categoría',
          })
        }

        if (vigente) {
          setCategorias(categoriasFinales)
          setPlatoInicial(plato)
        }
      } catch (error) {
        if (vigente) {
          setErrorCarga(
            error.message ||
              'No se pudieron cargar los datos del plato. Inténtalo de nuevo.',
          )
        }
      } finally {
        if (vigente) {
          setCargando(false)
        }
      }
    }

    cargarDatos()

    return () => {
      vigente = false
    }
  }, [id, editando, recarga])

  async function handleGuardar(datos) {
    if (guardando) return

    setGuardando(true)
    setErrorGuardar('')

    try {
      if (editando) {
        await actualizarPlato(id, datos)
      } else {
        await crearPlato(datos)
      }

      navigate('/admin/platos', {
        replace: true,
        state: {
          mensaje: editando
            ? 'El plato se actualizó correctamente.'
            : 'El plato se creó correctamente.',
        },
      })
    } catch (error) {
      setErrorGuardar(
        error.message ||
          'No se pudo guardar el plato. Revisa los datos e inténtalo de nuevo.',
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="admin-pagina admin-pagina-formulario">
      <header className="admin-encabezado">
        <div>
          <Link to="/admin/platos" className="admin-volver">
            ← Volver a platos
          </Link>
          <h1 className="admin-titulo">
            {editando ? 'Editar plato' : 'Nuevo plato'}
          </h1>
          <p className="admin-descripcion">
            {editando
              ? 'Actualiza los datos del plato. Los cambios se verán en el menú público.'
              : 'Completa los datos para agregar un plato al menú público.'}
          </p>
        </div>
      </header>

      <section className="admin-panel">
        {cargando ? (
          <div className="admin-estado admin-estado-carga" role="status">
            <span className="admin-cargador" aria-hidden="true" />
            <p>Cargando datos del plato…</p>
          </div>
        ) : errorCarga ? (
          <div className="admin-estado admin-estado-error" role="alert">
            <h2>No pudimos cargar el formulario</h2>
            <p>{errorCarga}</p>
            <div className="admin-acciones">
              <button
                type="button"
                className="admin-boton admin-boton-primario"
                onClick={() => setRecarga((valor) => valor + 1)}
              >
                Reintentar
              </button>
              <Link
                to="/admin/platos"
                className="admin-boton admin-boton-secundario"
              >
                Volver a platos
              </Link>
            </div>
          </div>
        ) : (
          <FormularioPlato
            platoInicial={platoInicial}
            categorias={categorias}
            textoBoton={editando ? 'Guardar cambios' : 'Crear plato'}
            enlaceCancelar="/admin/platos"
            guardando={guardando}
            errorGeneral={errorGuardar}
            cargandoCategorias={false}
            onGuardar={handleGuardar}
          />
        )}
      </section>
    </div>
  )
}
