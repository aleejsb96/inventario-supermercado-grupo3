const express = require('express');
const router = express.Router();
const { getProductos, getProductoById, crearProducto, actualizarProducto, eliminarProducto, getStockBajo } = require('../controllers/productosController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, getProductos);
router.get('/stock-bajo', verificarToken, getStockBajo);
router.get('/:id', verificarToken, getProductoById);
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;