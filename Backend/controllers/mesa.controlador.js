// backend/controllers/mesa.controlador.js
const  { supabase } = require ('../services/supabaseClient.js');

// Obtener todas las mesas
const obtenerMesas = async (req, res) => {
  try {
    const { data, error } = await supabase.from('mesa').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear o registrar una mesa nueva
 const crearMesa = async (req, res) => {
  try {
    const { numero_mesa, estado } = req.body;
    const { data, error } = await supabase
      .from('mesa')
      .insert([{ numero_mesa, estado }]);

    if (error) throw error;
    res.status(201).json({ mensaje: 'Mesa registrada con éxito', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { obtenerMesas,crearMesa};