# TechLedger

Sistema web de gestión empresarial orientado a pequeñas y medianas empresas (PYME).

Permite administrar productos, clientes, ventas e inventario desde una sola plataforma.

## Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- React Router v6
- TanStack Query (React Query)
- React Hook Form + Zod
- Recharts
- Lucide React

### Backend
- Node.js + Express + TypeScript
- Prisma ORM
- SQL Server
- JWT (autenticación)
- Zod (validación)
- Swagger OpenAPI

## Arquitectura

```
React → Axios → Node.js + Express REST API → Prisma ORM → SQL Server
```

## Estructura del proyecto

```
techledger/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── routes/
│   └── ...
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── validators/
│   │   ├── models/
│   │   ├── config/
│   │   └── utils/
│   └── ...
└── README.md
```

## Módulos

- **Autenticación** — Login, registro, JWT, roles (Admin / Vendedor) con aislamiento multiempresa
- **Dashboard** — Resumen de ventas, alertas de stock bajo, clientes y gráficos interactivos
- **Productos** — CRUD con SKU, categoría relacional, stock, costo y precio
- **Categorías** — CRUD para organización del catálogo
- **Clientes** — CRUD con historial de compras acumuladas
- **Ventas** — Registro transaccional con actualización automática de stock, snapshots históricos e impresión de comprobantes
- **Inventario** — Registro de movimientos (entrada, venta, devolución, ajuste) y alertas de stock crítico
- **Comprobantes** — Generación e impresión de comprobantes
- **Reportes** — Reportes analíticos de ventas, inventario y clientes + exportación CSV
- **Configuración** — Datos de empresa, administración de usuarios y activación/desactivación de accesos

## Roles

| Permiso | Administrador | Vendedor |
|---|---|---|
| Ver todo | ✅ | ✅ |
| Crear productos | ✅ | ❌ |
| Eliminar productos | ✅ | ❌ |
| Administrar usuarios | ✅ | ❌ |
| Ver reportes | ✅ | ✅ |
| Crear ventas | ✅ | ✅ |
| Ver clientes | ✅ | ✅ |
| Consultar inventario | ✅ | ✅ |

## API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id

GET    /api/sales
GET    /api/sales/:id
POST   /api/sales
PATCH  /api/sales/:id/cancel

GET    /api/inventory
GET    /api/inventory/movements
POST   /api/inventory/movements

GET    /api/reports/sales
GET    /api/reports/inventory
GET    /api/reports/customers

GET    /api/config/company
PUT    /api/config/company
GET    /api/config/users
POST   /api/config/users
PATCH  /api/config/users/:id/deactivate
PATCH  /api/config/users/:id/activate
```

## Instalación

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar DATABASE_URL y JWT_SECRET en .env
npm run db:generate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
