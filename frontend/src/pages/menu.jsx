import React from 'react';
import './menu.css';
import pizzaa from '../assets/pizzaloggo.jpeg';
import sodas from '../assets/sodas.webp';
import carro from '../assets/carrito.jpeg';
import loggo from '../assets/logofacebook.jpg';
import insta from '../assets/instalogo.webp';    
import pizza from '../assets/pizzaimg.jpg';



export default function Menu(){
    return (
    <div className='menu-container'>
        <header>
                    <h1><em>Menu Squisita</em></h1>
                    <img src={pizzaa} alt="logo" className="logo-redondo" />
                </header>
                <main>
                    
                   
                     <div className="Menu-categorias">
                        <div className="targeta-categoria">
                            <h2><em>Pizzas</em></h2>
                            <img src={pizza} alt="imagenpzz" className="pizza-categoria" />
                            <ul>
                                <li>Hawaiana</li>
                                <li>Peperoni</li>
                                <li>Jamon y queso</li>
                                <li>Napolitana</li>
                            </ul>
                        </div>
    
                        <div className="targeta-categoria">
                            <h2><em>Sodas</em></h2>
                            <img src={sodas} alt="imgsoda" className="soda-categoria" />
                            <ul>
                                <li>Frutos rojos</li>
                                <li>Maracuyá</li>
                                <li>Mango biche</li>
                            </ul>
                        </div>
    
                        <div className="carrito-icono">
                            <img src={carro} alt="carrito" style={{ width: '50px', height: '50px' }} />
                            <span className="Texto-carrito">Ver pedido</span>
                        </div>
                    </div>
                </main>
    
                <footer className="redes-sociales">
                    <div className="logo-redes">
                        <img src={loggo} alt="Facebook" />
                        <img src={insta} alt="Instagram" />
                    </div>
                </footer>
           
           </div>
        
        );
    }

