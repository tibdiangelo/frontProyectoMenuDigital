import React, { useState, useEffect } from 'react';

function Home() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(error => console.error('Error cargando el menú:', error));
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%', 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'Arial' 
    }}>
      <h1>Menú Digital 🍕</h1>
      
      {/* Contenedor en columna para que se vea ordenado uno debajo del otro */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
        {menu.map(item => (
          <div key={item.id} style={{ 
            border: '2px solid #ff4757', 
            padding: '15px', 
            borderRadius: '8px', 
            background: '#1a1a1a', 
            color: '#fff',
            textAlign: 'center' 
          }}>
            <h3>{item.nombre}</h3>
            <p>Precio: ${item.precio}</p>
            <button style={{ 
              background: '#ff4757', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Pedir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;