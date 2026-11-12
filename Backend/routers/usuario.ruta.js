const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controlador.js');

// GET /api/usuarios - Listar todos los usuarios
router.get('/', usuarioController.listar);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', usuarioController.obtener);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', usuarioController.crear);

// PUT /api/usuarios/:id - Actualizar un usuario existente
router.put('/:id', usuarioController.actualizar);

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', usuarioController.eliminar);

module.exports = router;