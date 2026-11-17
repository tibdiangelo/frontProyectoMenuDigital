import { normalizarEstado } from '../../services/pedidosAdminService'

const CLASES_ESTADO = {
  Pendiente: 'admin-estado-pendiente',
  'En preparación': 'admin-estado-preparacion',
  Listo: 'admin-estado-listo',
  Entregado: 'admin-estado-entregado',
}

export default function BadgeEstado({ estado }) {
  const estadoNormalizado = normalizarEstado(estado)
  const clase = CLASES_ESTADO[estadoNormalizado] ?? 'admin-estado-neutro'

  return (
    <span className={`admin-insignia-estado ${clase}`}>
      {estadoNormalizado}
    </span>
  )
}
