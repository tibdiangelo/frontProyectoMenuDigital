import { Link } from 'react-router'
import {
  obtenerSiguienteEstado,
} from '../../services/pedidosAdminService'
import formatoFechaHora from '../../utils/formatoFechaHora'
import formatoMoneda from '../../utils/formatoMoneda'
import numeroPedido from '../../utils/numeroPedido'
import BadgeEstado from './BadgeEstado'

export default function TarjetaPedido({
  pedido,
  actualizando,
  error,
  onAvanzar,
}) {
  const siguienteEstado = obtenerSiguienteEstado(pedido.estado)

  return (
    <article className="admin-pedido">
      <header className="admin-pedido-cabecera">
        <div>
          <p className="admin-pedido-numero">Pedido #{numeroPedido(pedido)}</p>
          <h2 className="admin-pedido-mesa">Mesa {pedido.mesa || '—'}</h2>
        </div>
        <BadgeEstado estado={pedido.estado} />
      </header>

      <div className="admin-pedido-meta">
        <span className="admin-pedido-dato">
          <strong>Cliente:</strong> {pedido.cliente || 'Sin nombre'}
        </span>
        <span className="admin-pedido-dato">
          <strong>Hora:</strong> {formatoFechaHora(pedido.fecha)}
        </span>
      </div>

      <ul className="admin-pedido-items">
        {pedido.items.map((item, indice) => (
          <li key={`${item.id}-${indice}`} className="admin-pedido-item">
            <span className="admin-pedido-cantidad">{item.cantidad}×</span>
            <span className="admin-pedido-item-nombre">{item.nombre}</span>
            <span className="admin-pedido-item-precio">
              {formatoMoneda.format(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>

      {pedido.notas ? (
        <p className="admin-pedido-notas">
          <strong>Notas:</strong> {pedido.notas}
        </p>
      ) : null}

      <footer className="admin-pedido-pie">
        <div className="admin-pedido-total">
          <span>Total</span>
          <strong>{formatoMoneda.format(pedido.total)}</strong>
        </div>

        <div className="admin-pedido-acciones">
          <Link
            to={`/admin/pedidos/${encodeURIComponent(pedido.id)}`}
            className="admin-boton admin-boton-secundario admin-boton-pequeno"
          >
            Ver detalle
          </Link>
          {siguienteEstado ? (
            <button
              type="button"
              className="admin-boton admin-boton-primario admin-boton-pequeno"
              onClick={() => onAvanzar(pedido)}
              disabled={actualizando}
            >
              {actualizando
                ? 'Actualizando…'
                : `Marcar ${siguienteEstado}`}
            </button>
          ) : null}
        </div>
      </footer>

      {error ? (
        <p className="admin-pedido-error" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  )
}
