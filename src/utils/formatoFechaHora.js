const formato = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function formatoFechaHora(valor) {
  if (!valor) return 'Sin fecha'

  const fecha = new Date(valor)

  if (Number.isNaN(fecha.getTime())) return 'Sin fecha'

  return formato.format(fecha)
}
