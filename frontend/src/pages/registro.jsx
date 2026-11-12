import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './registro.css';
import pizzaImg from '../assets/pizzaloggo.jpeg';

export default function Registro({ irALogin }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');

  const handleRegistrar = async (e) => {
    e.preventDefault();
    
    if (!usuario || !contrasena || !correo) {
      alert('⚠️ Faltan campos por llenar en el formulario');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          { 
            nombre: usuario, 
            email: correo, 
            password: contrasena,
            rol_id: 2
          }
        ]);

      if (error) {
        alert('❌ Error devuelto por Supabase: ' + error.message);
        console.error('Error:', error);
      } else {
        alert('✅ ¡ÉXITO! Se guardó en la base de datos');
        irALogin();
      }
    } catch (err) {
      alert('💥 Error grave en el código: ' + err.message);
    }
  };

  return (
    <div className="registro-container">
      <header>
        <div className="logopizza">
          <img src={pizzaImg} alt="logo-pizza" />
        </div>
      </header>
      <form onSubmit={handleRegistrar} >

        <div className="form-title">
          <h2>Registrar Usuario Squisita</h2>
        </div>

        <input 
          type="text" 
          placeholder="Escribe tu usuario" 
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Escribe tu contraseña" 
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Escribe tu correo" 
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}