import { crearPedidoApi } from './api'

export async function enviarPedido({ mesa, clienteNombre, notas, items }) {
  return crearPedidoApi({ mesa, clienteNombre, notas, items })
}
