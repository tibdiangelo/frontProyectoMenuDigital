import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import CarritoProvider from './context/CarritoProvider'
import router from './router/enrutador'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarritoProvider>
      <RouterProvider router={router} />
    </CarritoProvider>
  </StrictMode>,
)
