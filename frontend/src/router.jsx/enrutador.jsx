import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registro from './pages/registro'; // O tu archivo de registro
import Login from './pages/Login';     // Tu archivo de login
import Menu from './pages/menu';       // Tu nuevo archivo de menú limpio

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
               
               
                
                {/* La ruta para tu menú de pizzas y sodas */}
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </BrowserRouter>
    );
}