const express = require ('express');
const { obtenerPedidos, crearPedido } =require ('../controllers/pedido.controlador.js');

const router = express.Router();
router.get('/', obtenerPedidos);
router.post('/', crearPedido);

module.exports = router;

