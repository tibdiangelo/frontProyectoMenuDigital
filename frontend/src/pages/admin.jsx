import React, { useState } from 'react';
import './admin.css';
import { supabase } from '../supabaseClient';

export default function Admin({ irlogin }) {
    const [rol, setRol]= useState ('');
    const [usuario, setUsuario] = useState ('');
    const [contrasena, setContrasena] = useState ('');

    const handleRegistrarUsuario = async (e) =>{
        e.preventDefault();

        try{ 
            const { data ,error } = await supabase
            .from ('usuarios')
            .insert([{
                rol: rol, usuario: usuario, contrasena: contrasena}
            ]);
            if (error){
                console.error('Error al registrar:', error.message);
                alert('hubo un error al registrar el usuario');
            } else {
                 alert('¡Usuario resgistrado con exito!');
                 setRol('');
                 setUsuario('');
                 setContrasena('');
            }
        } catch (err) {
            console.error('Error inesperado: err');
         }
        };

    return ( 
        <div className="admin-container"> 
            <header className="admin-header">
                <h1>Panel de Administración - PizCzería Squisita</h1>
                
            </header>

            <main className="admin-main">
                {/* Sección 1: Control de Disponibilidad del Menú */}
                <section className="admin-seccion">
                    <h2>Gestión de Disponibilidad del Menú</h2>
                    <p>Activa o desactiva los productos según el inventario actual.</p>
                    {/* Aquí pondremos la lista de pizzas y sodas con sus botones */}
                </section>
D
                {/* Sección 2: Monitoreo de Pedidos */}
                <section className="admin-seccion">
                    <h2>Monitoreo de Pedidos Generales</h2>
                    <p>Visualiza el flujo de órdenes en tiempo real.</p>
                    {/* Aquí mostraremos los pedidos que van llegando */}
                </section>
                 
            </main>

            <footer className="admin-footer">
                <form onSubmit={handleRegistrarUsuario} className=' form-admin' >
                    
                        <div className='titulo-nuevo-usuario'>
                            <span><em>Registrar Nuevo Usuario</em></span>
                       
                         </div>
                        
                    
                    <input type ="text" id="username"
                     placeholder="Ingresa un rol"/>
                     value ={ rol}
                     onChange={(e) => setRol(e.target.value)}
                     required


                    <input type="text" id="username" 
                    placeholder="Ingresa un usuario" />
                    value ={ usuario}
                     onChange={(e) => setUsuario(e.target.value)}
                     required

                    <input type="password" id="password"
                     placeholder="Ingresa una contraseña" />
                     value ={ contrasena}
                     onChange={(e) => setContrasena(e.target.value)}
                     required

                    <button type="submit">Registrar</button>
                </form>

            <button onClick className="btn-salir">
                Cerrar Sesión
                </button>
                

            </footer>
            

        </div>
    );
}