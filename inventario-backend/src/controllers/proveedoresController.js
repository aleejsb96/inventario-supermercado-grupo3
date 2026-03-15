const pool = require('../config/db');

const getProveedores = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM proveedores WHERE activo = true ORDER BY id ASC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proveedores', error: error.message });
    }
};

const getProveedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM proveedores WHERE id = $1 AND activo = true', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proveedor', error: error.message });
    }
};

const crearProveedor = async (req, res) => {
    const { nombre, contacto, telefono, email, direccion } = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [nombre, contacto, telefono, email, direccion]);

        res.status(201).json({ mensaje: 'Proveedor creado', proveedor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear proveedor', error: error.message });
    }
};

const actualizarProveedor = async (req, res) => {
    const { id } = req.params;
    const { nombre, contacto, telefono, email, direccion } = req.body;
    try {
        const result = await pool.query(`
            UPDATE proveedores SET nombre=$1, contacto=$2, telefono=$3, email=$4, direccion=$5
            WHERE id=$6 AND activo=true RETURNING *
        `, [nombre, contacto, telefono, email, direccion, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }
        res.json({ mensaje: 'Proveedor actualizado', proveedor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar proveedor', error: error.message });
    }
};

const eliminarProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE proveedores SET activo=false WHERE id=$1 RETURNING *', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
        }
        res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar proveedor', error: error.message });
    }
};

module.exports = { getProveedores, getProveedorById, crearProveedor, actualizarProveedor, eliminarProveedor };