import { createBrowserRouter } from 'react-router'
import Display from '../components/Display'
import Inicio from '../pages/Inicio'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import ErrorPage from '../pages/ErrorPage'
import Pedido from '../pages/Pedido'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Display />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Inicio/> },
      { path: 'login', element: <Login /> },
      { path: 'registro', element: <Registro /> },
      { path: '*', element: <ErrorPage /> },
      { path: 'pedido', element: <Pedido /> },
    ],
  },
])

export default router
