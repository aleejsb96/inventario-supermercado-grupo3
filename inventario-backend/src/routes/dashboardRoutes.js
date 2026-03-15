const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, getDashboard);

module.exports = router;