const pool = require('../config/db');

const getProductos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.activo = true
            ORDER BY p.id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
    }
};

const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = $1 AND p.activo = true
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
    }
};

const crearProducto = async (req, res) => {
    const { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id, imagen_url } = req.body;
    try {
        const existe = await pool.query('SELECT id FROM productos WHERE codigo = $1', [codigo]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El código ya existe' });
        }

        const result = await pool.query(`
            INSERT INTO productos (codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id, imagen_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [codigo, nombre, descripcion, precio, stock_minimo || 5, stock_actual || 0, categoria_id, imagen_url]);

        res.status(201).json({ mensaje: 'Producto creado', producto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id, imagen_url } = req.body;
    try {
        const result = await pool.query(`
            UPDATE productos SET codigo=$1, nombre=$2, descripcion=$3, precio=$4, 
            stock_minimo=$5, stock_actual=$6, categoria_id=$7, imagen_url=$8
            WHERE id=$9 AND activo=true RETURNING *
        `, [codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id, imagen_url, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto actualizado', producto: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
    }
};

const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE productos SET activo=false WHERE id=$1 RETURNING *', [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
    }
};

const getStockBajo = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.stock_actual < p.stock_minimo AND p.activo = true
            ORDER BY p.stock_actual ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos con stock bajo', error: error.message });
    }
};

module.exports = { getProductos, getProductoById, crearProducto, actualizarProducto, eliminarProducto, getStockBajo };