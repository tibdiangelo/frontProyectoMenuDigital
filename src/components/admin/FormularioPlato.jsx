import { useRef, useState } from 'react'
import { Link } from 'react-router'

function valoresIniciales(plato) {
  return {
    nombre: plato?.nombre ?? '',
    descripcion: plato?.descripcion ?? '',
    precio: plato ? String(plato.precio ?? '') : '',
    imagen: plato?.imagen ?? '',
    categoria_id:
      plato?.categoriaId !== undefined && plato?.categoriaId !== null
        ? String(plato.categoriaId)
        : '',
    disponible: plato ? Boolean(plato.disponible) : true,
  }
}

export default function FormularioPlato({
  platoInicial,
  categorias,
  textoBoton,
  enlaceCancelar,
  guardando,
  errorGeneral,
  cargandoCategorias,
  onGuardar,
}) {
  const [valores, setValores] = useState(() => valoresIniciales(platoInicial))
  const [errores, setErrores] = useState({})

  const nombreRef = useRef(null)
  const precioRef = useRef(null)
  const categoriaRef = useRef(null)

  function handleChange(event) {
    const { name, type, value, checked } = event.target

    setValores((previos) => ({
      ...previos,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errores[name]) {
      setErrores((previos) => ({ ...previos, [name]: undefined }))
    }
  }

  function validar() {
    const nuevosErrores = {}
    const precio = Number(valores.precio)

    if (!valores.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del plato es obligatorio.'
    }

    if (valores.precio === '' || !Number.isFinite(precio) || precio <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor que 0.'
    }

    if (!valores.categoria_id) {
      nuevosErrores.categoria_id = 'Selecciona una categoría.'
    }

    return nuevosErrores
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (guardando) return

    const nuevosErrores = validar()
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      if (nuevosErrores.nombre) {
        nombreRef.current?.focus()
      } else if (nuevosErrores.precio) {
        precioRef.current?.focus()
      } else if (nuevosErrores.categoria_id) {
        categoriaRef.current?.focus()
      }

      return
    }

    onGuardar({
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      imagen: valores.imagen.trim(),
      categoria_id: valores.categoria_id,
      disponible: Boolean(valores.disponible),
    })
  }

  return (
    <form className="admin-formulario" onSubmit={handleSubmit} noValidate>
      {errorGeneral ? (
        <p className="admin-error-general" role="alert">
          {errorGeneral}
        </p>
      ) : null}

      <div className="admin-campos-grid">
        <div className="admin-campo admin-campo-ancho">
          <label className="admin-label" htmlFor="plato-nombre">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            ref={nombreRef}
            id="plato-nombre"
            name="nombre"
            type="text"
            className="admin-input"
            value={valores.nombre}
            onChange={handleChange}
            placeholder="Ej. Pizza Hawaiana"
            maxLength={80}
            aria-invalid={errores.nombre ? 'true' : undefined}
            aria-describedby={errores.nombre ? 'error-plato-nombre' : undefined}
            required
          />
          {errores.nombre ? (
            <p id="error-plato-nombre" className="admin-error-campo">
              {errores.nombre}
            </p>
          ) : null}
        </div>

        <div className="admin-campo admin-campo-ancho">
          <label className="admin-label" htmlFor="plato-descripcion">
            Descripción
          </label>
          <textarea
            id="plato-descripcion"
            name="descripcion"
            className="admin-textarea"
            value={valores.descripcion}
            onChange={handleChange}
            placeholder="Ingredientes o descripción breve del plato"
            rows="3"
            maxLength={200}
          />
        </div>

        <div className="admin-campo">
          <label className="admin-label" htmlFor="plato-precio">
            Precio <span aria-hidden="true">*</span>
          </label>
          <input
            ref={precioRef}
            id="plato-precio"
            name="precio"
            type="number"
            className="admin-input"
            value={valores.precio}
            onChange={handleChange}
            placeholder="Ej. 35000"
            min="1"
            step="1"
            inputMode="numeric"
            aria-invalid={errores.precio ? 'true' : undefined}
            aria-describedby={
              errores.precio ? 'error-plato-precio' : 'ayuda-plato-precio'
            }
            required
          />
          {errores.precio ? (
            <p id="error-plato-precio" className="admin-error-campo">
              {errores.precio}
            </p>
          ) : (
            <p id="ayuda-plato-precio" className="admin-ayuda">
              Valor en pesos colombianos, sin puntos ni comas.
            </p>
          )}
        </div>

        <div className="admin-campo">
          <label className="admin-label" htmlFor="plato-categoria">
            Categoría <span aria-hidden="true">*</span>
          </label>
          <select
            ref={categoriaRef}
            id="plato-categoria"
            name="categoria_id"
            className="admin-select"
            value={valores.categoria_id}
            onChange={handleChange}
            disabled={cargandoCategorias}
            aria-invalid={errores.categoria_id ? 'true' : undefined}
            aria-describedby={
              errores.categoria_id ? 'error-plato-categoria' : undefined
            }
            required
          >
            <option value="">
              {cargandoCategorias ? 'Cargando categorías…' : 'Selecciona una categoría'}
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errores.categoria_id ? (
            <p id="error-plato-categoria" className="admin-error-campo">
              {errores.categoria_id}
            </p>
          ) : null}
        </div>

        <div className="admin-campo admin-campo-ancho">
          <label className="admin-label" htmlFor="plato-imagen">
            URL de la imagen
          </label>
          <input
            id="plato-imagen"
            name="imagen"
            type="url"
            className="admin-input"
            value={valores.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/plato.jpg"
          />
          <p className="admin-ayuda">
            Opcional. Se usa la imagen del plato en el menú público.
          </p>
        </div>

        <div className="admin-campo admin-campo-ancho">
          <label className="admin-checkbox" htmlFor="plato-disponible">
            <input
              id="plato-disponible"
              name="disponible"
              type="checkbox"
              checked={valores.disponible}
              onChange={handleChange}
            />
            <span>
              Disponible
              <small>Si está desmarcado, el plato aparecerá como agotado.</small>
            </span>
          </label>
        </div>
      </div>

      <div className="admin-acciones-formulario">
        <Link to={enlaceCancelar} className="admin-boton admin-boton-secundario">
          Cancelar
        </Link>
        <button
          type="submit"
          className="admin-boton admin-boton-primario"
          disabled={guardando || cargandoCategorias}
        >
          {guardando ? 'Guardando…' : textoBoton}
        </button>
      </div>
    </form>
  )
}
