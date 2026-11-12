// backend/controllers/pedido.controlador.js
const { supabase } = require ('../services/supabaseClient.js'); // O la ruta donde tengas tu conexión

// Obtener todos los pedidos
 const obtenerPedidos = async (req, res) => {
  try {
    const { data, error } = await supabase.from('pedido').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo pedido
 const crearPedido = async (req, res) => {
  try {
    const { id_mesa, total, estado } = req.body;
    const { data, error } = await supabase
      .from('pedido')
      .insert([{ id_mesa, total, estado }]);

    if (error) throw error;
    res.status(201).json({ mensaje: 'Pedido creado con éxito', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports ={
    obtenerPedidos,
    crearPedido
};