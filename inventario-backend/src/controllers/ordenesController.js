const pool = require('../config/db');

const getOrdenes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, p.nombre as proveedor_nombre, u.nombre as usuario_nombre
            FROM ordenes_compra o
            LEFT JOIN proveedores p ON o.proveedor_id = p.id
            LEFT JOIN usuarios u ON o.usuario_id = u.id
            ORDER BY o.id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener órdenes', error: error.message });
    }
};

const getOrdenById = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await pool.query(`
            SELECT o.*, p.nombre as proveedor_nombre, u.nombre as usuario_nombre
            FROM ordenes_compra o
            LEFT JOIN proveedores p ON o.proveedor_id = p.id
            LEFT JOIN usuarios u ON o.usuario_id = u.id
            WHERE o.id = $1
        `, [id]);

        if (orden.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }

        const detalle = await pool.query(`
            SELECT d.*, pr.nombre as producto_nombre, pr.codigo,
            (d.cantidad * d.precio_unitario) as subtotal
            FROM detalle_orden d
            LEFT JOIN productos pr ON d.producto_id = pr.id
            WHERE d.orden_id = $1
        `, [id]);

        const total = detalle.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        res.json({ 
            ...orden.rows[0], 
            detalle: detalle.rows,
            items: detalle.rows,
            total: total.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener orden', error: error.message });
    }
};

const crearOrden = async (req, res) => {
    const { proveedor_id, productos, observaciones } = req.body;
    const usuario_id = req.usuario.id;

    try {
        // Generar número de orden
        const count = await pool.query('SELECT COUNT(*) FROM ordenes_compra');
        const numero_orden = `ORD-${String(parseInt(count.rows[0].count) + 1).padStart(4, '0')}`;

        // Crear la orden
        const orden = await pool.query(`
            INSERT INTO ordenes_compra (numero_orden, proveedor_id, usuario_id, observaciones)
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [numero_orden, proveedor_id, usuario_id, observaciones]);

        const orden_id = orden.rows[0].id;

        // Insertar detalle
        for (const item of productos) {
            await pool.query(`
                INSERT INTO detalle_orden (orden_id, producto_id, cantidad, precio_unitario)
                VALUES ($1, $2, $3, $4)
            `, [orden_id, item.producto_id, item.cantidad, item.precio_unitario]);
        }

        res.status(201).json({ mensaje: 'Orden creada', orden: orden.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear orden', error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        // Si se completa la orden, actualizar stock
        if (estado === 'completada') {
            const detalle = await pool.query(
                'SELECT * FROM detalle_orden WHERE orden_id = $1', [id]
            );

            for (const item of detalle.rows) {
                await pool.query(`
                    UPDATE productos 
                    SET stock_actual = stock_actual + $1 
                    WHERE id = $2
                `, [item.cantidad, item.producto_id]);
            }
        }

        const result = await pool.query(`
            UPDATE ordenes_compra 
            SET estado = $1, fecha_recepcion = $2
            WHERE id = $3 RETURNING *
        `, [estado, estado === 'completada' ? new Date() : null, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }

        res.json({ mensaje: `Orden ${estado} correctamente`, orden: result.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cambiar estado', error: error.message });
    }
};

module.exports = { getOrdenes, getOrdenById, crearOrden, cambiarEstado };