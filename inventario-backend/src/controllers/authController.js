const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registro = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    try {
        // Verificar si el email ya existe
        const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        // Hashear contraseña
        const hash = await bcrypt.hash(password, 10);

        // Insertar usuario
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
            [nombre, email, hash, rol || 'empleado']
        );

        res.status(201).json({ mensaje: 'Usuario registrado', usuario: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND activo = true', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
        }

        const usuario = result.rows[0];

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registro, login };