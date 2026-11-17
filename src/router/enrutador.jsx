import { createBrowserRouter, Navigate } from 'react-router'
import Display from '../components/Display'
import AdminLayout from '../components/admin/AdminLayout'
import RutaSoloAdmin from '../components/admin/RutaSoloAdmin'
import Inicio from '../pages/Inicio'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import ErrorPage from '../pages/ErrorPage'
import Pedido from '../pages/Pedido'
import PedidoDetalleAdmin from '../pages/admin/PedidoDetalleAdmin'
import PedidosAdmin from '../pages/admin/PedidosAdmin'
import PlatoFormularioAdmin from '../pages/admin/PlatoFormularioAdmin'
import PlatosAdmin from '../pages/admin/PlatosAdmin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Display />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Inicio/> },
      { path: 'login', element: <Login /> },
      {
        path: 'registro',
        element: (
          <RutaSoloAdmin>
            <Registro />
          </RutaSoloAdmin>
        ),
      },
      { path: '*', element: <ErrorPage /> },
      { path: 'pedido', element: <Pedido /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/platos" replace /> },
      {
        path: 'platos',
        element: (
          <RutaSoloAdmin>
            <PlatosAdmin />
          </RutaSoloAdmin>
        ),
      },
      {
        path: 'platos/nuevo',
        element: (
          <RutaSoloAdmin>
            <PlatoFormularioAdmin />
          </RutaSoloAdmin>
        ),
      },
      {
        path: 'platos/:id/editar',
        element: (
          <RutaSoloAdmin>
            <PlatoFormularioAdmin />
          </RutaSoloAdmin>
        ),
      },
      { path: 'pedidos', element: <PedidosAdmin /> },
      { path: 'pedidos/:id', element: <PedidoDetalleAdmin /> },
    ],
  },
])

export default router
