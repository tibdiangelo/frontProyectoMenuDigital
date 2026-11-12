const express = require ("express");
const  { obtenerMesas, crearMesa } = require('../controllers/mesa.controlador.js');

const router = express.Router();
router.get('/', obtenerMesas);
router.post('/', crearMesa);


module.exports = router;