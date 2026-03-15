-- SUPERMERCADO GRUPO 3 - Script Base de Datos

 
CREATE DATABASE inventario_supermercado;
 
\c inventario_supermercado;
 
-- USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'empleado')),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- CATEGORIAS
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);
 
-- PROVEEDORES
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- PRODUCTOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock_minimo INT NOT NULL DEFAULT 5,
    stock_actual INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(255),
    categoria_id INT REFERENCES categorias(id),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- ORDENES DE COMPRA
CREATE TABLE ordenes_compra (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(50) UNIQUE NOT NULL,
    proveedor_id INT REFERENCES proveedores(id),
    usuario_id INT REFERENCES usuarios(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_recepcion TIMESTAMP,
    observaciones TEXT
);
 
-- DETALLE DE ORDENES
CREATE TABLE detalle_orden (
    id SERIAL PRIMARY KEY,
    orden_id INT REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);
 
-- 
-- DATOS INICIALES
--
 
INSERT INTO categorias (nombre, descripcion) VALUES
('Lácteos', 'Leche, queso, yogurt'),
('Bebidas', 'Jugos, refrescos, agua'),
('Granos y Cereales', 'Arroz, frijoles, maíz'),
('Carnes', 'Res, pollo, cerdo'),
('Limpieza', 'Productos de aseo del hogar');
 
-- Usuarios (password = 'admin123' y 'empleado123')
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Principal', 'admin@supermercado.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uXutHqd2O', 'administrador'),
('Empleado Uno', 'empleado@supermercado.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uXutHqd2O', 'empleado');
 
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora La Colonia', 'Juan Pérez', '9999-1234', 'contacto@lacolonia.com', 'Boulevard Morazán, Tegucigalpa'),
('Lácteos Honduras S.A.', 'María López', '8888-5678', 'ventas@lacteos.hn', 'Col. Kennedy, Tegucigalpa'),
('Distribuidora El Rey', 'Carlos Martínez', '7777-9012', 'pedidos@elrey.hn', 'Ave. La Paz, San Pedro Sula'),
('Granos del Norte', 'Ana Rodríguez', '9876-5432', 'info@granosnorte.hn', 'Mercado Mayoreo, Tegucigalpa'),
('Limpieza Total HN', 'Roberto Flores', '8765-4321', 'ventas@limpiezatotal.hn', 'Col. Loarque, Tegucigalpa');
 
INSERT INTO productos (codigo, nombre, descripcion, precio, stock_minimo, stock_actual, categoria_id) VALUES
('LACT-001', 'Leche Entera 1L', 'Leche entera pasteurizada', 25.50, 10, 45, 1),
('LACT-002', 'Queso Blanco 500g', 'Queso fresco artesanal', 65.00, 8, 30, 1),
('LACT-003', 'Yogurt Natural 500ml', 'Yogurt natural sin azúcar', 38.00, 5, 4, 1),
('LACT-004', 'Mantequilla 250g', 'Mantequilla sin sal', 45.00, 5, 20, 1),
('BEB-001', 'Agua Purificada 1.5L', 'Agua purificada embotellada', 15.00, 20, 100, 2),
('BEB-002', 'Jugo de Naranja 1L', 'Jugo natural de naranja', 32.00, 10, 3, 2),
('BEB-003', 'Refresco Cola 2L', 'Refresco de cola', 28.00, 15, 60, 2),
('BEB-004', 'Jugo de Mango 500ml', 'Jugo natural de mango', 22.00, 10, 35, 2),
('GRAN-001', 'Arroz Blanquita 5lb', 'Arroz blanco de grano largo', 55.00, 15, 80, 3),
('GRAN-002', 'Frijoles Rojos 1lb', 'Frijoles rojos secos', 28.00, 20, 7, 3),
('GRAN-003', 'Avena en Hojuelas 500g', 'Avena integral en hojuelas', 35.00, 10, 40, 3),
('GRAN-004', 'Maíz Molido 2lb', 'Maíz molido para tortillas', 22.00, 15, 55, 3),
('CARN-001', 'Pechuga de Pollo 1lb', 'Pechuga de pollo fresca', 75.00, 10, 25, 4),
('CARN-002', 'Carne Molida 1lb', 'Carne molida de res', 95.00, 8, 2, 4),
('LIMP-001', 'Detergente 1kg', 'Detergente en polvo multiusos', 48.00, 10, 50, 5),
('LIMP-002', 'Cloro 1L', 'Cloro desinfectante', 18.00, 15, 6, 5),
('LIMP-003', 'Jabón de Platos 500ml', 'Jabón líquido para platos', 32.00, 10, 45, 5),
('LIMP-004', 'Papel Higiénico x4', 'Paquete de 4 rollos', 55.00, 20, 70, 5);