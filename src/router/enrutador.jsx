import { createBrowserRouter } from 'react-router'
import Display from '../components/Display'
import Inicio from '../pages/Inicio'
import Pedido from '../pages/Pedido'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import ErrorPage from '../pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Display />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Inicio /> },
      { path: 'pedido', element: <Pedido /> },
      { path: 'login', element: <Login /> },
      { path: 'registro', element: <Registro /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
])

export default router
