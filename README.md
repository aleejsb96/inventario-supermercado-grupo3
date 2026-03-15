# 🛒 StockMart - Sistema de Gestión de Inventarios y Compras
### Grupo 3 | Proyecto de Investigación Aplicada

## Descripción
Sistema web completo para la gestión interna de inventarios y el proceso de compra de materiales de un supermercado. Permite administrar productos, proveedores, órdenes de compra y control de stock.

## Tecnologías
- **Backend:** Node.js + Express + PostgreSQL + JWT + Bcrypt
- **Frontend:** Angular 21 + Bootstrap 5 + Chart.js

## Requisitos previos
- Node.js v18+
- PostgreSQL v14+
- Angular CLI v21

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/aleejsb96/inventario-supermercado-grupo3.git
cd inventario-supermercado-grupo3
```

### 2. Configurar la base de datos
1. Abrir DBeaver
2. Crear la base de datos: `inventario_supermercado`
3. Ejecutar el script: `schema.sql`

### 3. Configurar el Backend
```bash
cd inventario-backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npm run dev
```

### 4. Configurar el Frontend
```bash
cd inventario-frontend
npm install
ng serve
```

### 5. Acceder al sistema
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Credenciales de prueba
- **Administrador:** admin@supermercado.com / admin123
- **Empleado:** empleado@supermercado.com / empleado123

## Estructura del proyecto
```
inventario-supermercado-grupo3/
├── inventario-backend/
│   ├── src/
│   │   ├── config/         # Configuración BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middlewares/    # JWT Auth
│   │   ├── routes/         # Rutas API
│   │   └── index.js        # Servidor principal
│   ├── .env.example
│   └── package.json
├── inventario-frontend/
│   ├── src/app/
│   │   ├── components/     # Componentes Angular
│   │   ├── services/       # Servicios HTTP
│   │   └── guards/         # Route Guards
│   └── package.json
├── schema.sql
└── README.md
```

## Módulos del sistema
1. **Autenticación** - Login/Registro con JWT y roles
2. **Productos** - CRUD completo con control de stock y filtros
3. **Proveedores** - CRUD completo
4. **Órdenes de Compra** - Crear, gestionar estados, actualizar stock automáticamente
5. **Dashboard** - Estadísticas y gráficos en tiempo real
