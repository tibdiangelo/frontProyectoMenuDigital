import React from 'react';
import './login.css'
import pizzaa from '../assets/pizzaloggo.jpeg'
import pizalogo3 from '../assets/pizzalogo3.avif'

export default function Login( {irRegistro, irAdmin}) {
    return ( 
        
    <div className="login-container">
                <div className="logopizza">
                
                    <img src={pizzaa} alt="logopizza" className="logo-redondo" />
                
                </div>
            
         <form onSubmit={(e) =>{ e.preventDefault(); irAdmin (); }}>
                    
                        <div className='titulo-iniciar'>
                            <span><em>iniciar sesion Squisita</em></span>
                       
                         </div>
                        
                    
                    <input type ="text" id="username" placeholder="Ingresa tu rol"/>
                    <input type="text" id="username" placeholder="Ingresa tu usuario" />
                    <input type="password" id="password" placeholder="Ingresa tu contraseña" />
                    <button type="submit">entrar</button>
                </form>
                
           </div>
    );
}