export default function numeroPedido(pedido) {
  const valor = pedido?.numero ?? pedido?.id ?? ''

  if (valor === null || valor === undefined || valor === '') return '—'

  const texto = String(valor)

  return texto.length > 8 ? texto.slice(-6).toUpperCase() : texto
}
