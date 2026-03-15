const express = require('express');
const router = express.Router();
const { getProveedores, getProveedorById, crearProveedor, actualizarProveedor, eliminarProveedor } = require('../controllers/proveedoresController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, getProveedores);
router.get('/:id', verificarToken, getProveedorById);
router.post('/', verificarToken, crearProveedor);
router.put('/:id', verificarToken, actualizarProveedor);
router.delete('/:id', verificarToken, eliminarProveedor);

module.exports = router;