const express = require('express');
const router = express.Router();
const { getOrdenes, getOrdenById, crearOrden, cambiarEstado } = require('../controllers/ordenesController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, getOrdenes);
router.get('/:id', verificarToken, getOrdenById);
router.post('/', verificarToken, crearOrden);
router.patch('/:id/estado', verificarToken, cambiarEstado);

module.exports = router;