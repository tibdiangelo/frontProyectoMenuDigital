import { createBrowserRouter } from 'react-router'
import Display from '../components/Display'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import ErrorPage from '../pages/ErrorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Display />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'registro', element: <Registro /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
])

export default router
