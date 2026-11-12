const usuarioService = require('../services/usuario.servicio.js');

const listar = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodos();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Detalle del error:", error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

const obtener = (req, res) => {
  try {
    const { id } = req.params;
    const usuario = usuarioService.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

const crear = (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: 'El nombre y el email son obligatorios' });
    }
    const nuevoUsuario = usuarioService.crear({ nombre, email });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

const actualizar = (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    const usuarioActualizado = usuarioService.actualizarUsuario(id, datos);
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const eliminar = (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = usuarioService.eliminar(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };