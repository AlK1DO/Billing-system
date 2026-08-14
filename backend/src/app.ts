import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { setupSwagger } from './config/swagger';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import customerRoutes from './routes/customer.routes';
import saleRoutes from './routes/sale.routes';
import inventoryRoutes from './routes/inventory.routes';
import reportRoutes from './routes/report.routes';
import configRoutes from './routes/config.routes';

const app = express();

// ── Seguridad y parsers ──────────────────────────────────────────────────────
app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
app.use(helmet());

const allowedOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// Prevent oversized JSON/form payloads from consuming server resources.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Logger ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  // Do not log request bodies or authorization headers.
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Swagger docs ─────────────────────────────────────────────────────────────
setupSwagger(app);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/config', configRoutes);

// ── Manejo de errores ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
