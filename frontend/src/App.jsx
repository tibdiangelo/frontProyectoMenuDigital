import { useState } from 'react';
import Login from "./pages/Login";
import Admin from "./pages/admin";
import Menu from "./pages/menu";
import Registro from './pages/registro';

export default function App() {
  const [vista, setVista] = useState('login'); // Estado para controlar la vista actual

  return (
    <div>
      
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        
      </div>

      {/* Control de vistas */}
      {vista === 'menu' && <Menu />}
      {vista === 'login' && <Login irAdmin={() => setVista('admin')} />}
      {vista === 'admin' && <Admin irLogin={() => setVista('login')} />}
    </div>
  );
}