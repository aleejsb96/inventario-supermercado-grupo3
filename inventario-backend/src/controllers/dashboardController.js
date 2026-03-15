const pool = require('../config/db');

const getDashboard = async (req, res) => {
    try {
        const totalProductos = await pool.query(
            'SELECT COUNT(*) FROM productos WHERE activo = true'
        );

        const totalProveedores = await pool.query(
            'SELECT COUNT(*) FROM proveedores WHERE activo = true'
        );

        const totalOrdenes = await pool.query(
            'SELECT COUNT(*) FROM ordenes_compra'
        );

        const ordenesPendientes = await pool.query(
            'SELECT COUNT(*) FROM ordenes_compra WHERE estado = $1', ['pendiente']
        );

        const stockBajo = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.stock_actual < p.stock_minimo AND p.activo = true
            ORDER BY p.stock_actual ASC
        `);

        const ordenesPorMes = await pool.query(`
            SELECT 
                TO_CHAR(fecha_orden, 'MM-YYYY') as mes,
                COUNT(*) as total
            FROM ordenes_compra
            GROUP BY TO_CHAR(fecha_orden, 'MM-YYYY')
            ORDER BY mes ASC
        `);

        res.json({
            totales: {
                productos: parseInt(totalProductos.rows[0].count),
                proveedores: parseInt(totalProveedores.rows[0].count),
                ordenes: parseInt(totalOrdenes.rows[0].count),
                ordenes_pendientes: parseInt(ordenesPendientes.rows[0].count)
            },
            stock_bajo: stockBajo.rows,
            ordenes_por_mes: ordenesPorMes.rows
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener dashboard', error: error.message });
    }
};

module.exports = { getDashboard };