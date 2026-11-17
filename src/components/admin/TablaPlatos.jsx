import { useState } from 'react'
import formatoMoneda from '../../utils/formatoMoneda'

function ImagenPlato({ plato }) {
  const [errorImagen, setErrorImagen] = useState(false)

  if (!plato.imagen || errorImagen) {
    return (
      <span className="admin-imagen-respaldo" aria-hidden="true">
        {plato.nombre.charAt(0).toUpperCase() || '?'}
      </span>
    )
  }

  return (
    <img
      src={plato.imagen}
      alt={`Imagen de ${plato.nombre}`}
      className="admin-imagen-plato"
      loading="lazy"
      onError={() => setErrorImagen(true)}
    />
  )
}

export default function TablaPlatos({ platos, onEditar, onEliminar }) {
  return (
    <div className="admin-tabla-contenedor">
      <table className="admin-tabla">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
            <th scope="col">Disponibilidad</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {platos.map((plato) => (
            <tr key={plato.id}>
              <td className="admin-celda-imagen">
                <ImagenPlato plato={plato} />
              </td>
              <td>
                <span className="admin-nombre-plato">{plato.nombre}</span>
                {plato.descripcion ? (
                  <span className="admin-descripcion-plato">
                    {plato.descripcion}
                  </span>
                ) : null}
              </td>
              <td>{plato.categoriaNombre}</td>
              <td className="admin-precio">
                {formatoMoneda.format(plato.precio)}
              </td>
              <td>
                <span
                  className={
                    plato.disponible
                      ? 'admin-insignia admin-insignia-disponible'
                      : 'admin-insignia admin-insignia-agotado'
                  }
                >
                  {plato.disponible ? 'Disponible' : 'Agotado'}
                </span>
              </td>
              <td>
                <div className="admin-acciones-fila">
                  <button
                    type="button"
                    className="admin-boton admin-boton-secundario admin-boton-pequeno"
                    onClick={() => onEditar(plato)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-boton admin-boton-peligro admin-boton-pequeno"
                    onClick={() => onEliminar(plato)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
