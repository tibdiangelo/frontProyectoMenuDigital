import { useEffect, useId, useRef } from 'react'

export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  procesando = false,
  error = '',
  onConfirmar,
  onCancelar,
}) {
  const tituloId = useId()
  const cancelarRef = useRef(null)

  useEffect(() => {
    if (!abierto) return undefined

    cancelarRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !procesando) {
        onCancelar()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [abierto, procesando, onCancelar])

  if (!abierto) return null

  function handleFondo(event) {
    if (event.target === event.currentTarget && !procesando) {
      onCancelar()
    }
  }

  return (
    <div className="admin-modal-fondo" onMouseDown={handleFondo}>
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >
        <h2 id={tituloId} className="admin-modal-titulo">
          {titulo}
        </h2>
        <p className="admin-modal-texto">{mensaje}</p>

        {error ? (
          <p className="admin-modal-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="admin-modal-acciones">
          <button
            ref={cancelarRef}
            type="button"
            className="admin-boton admin-boton-secundario"
            onClick={onCancelar}
            disabled={procesando}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className="admin-boton admin-boton-peligro"
            onClick={onConfirmar}
            disabled={procesando}
          >
            {procesando ? 'Eliminando…' : textoConfirmar}
          </button>
        </div>
      </section>
    </div>
  )
}
