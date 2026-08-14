import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Reporte de ventas — resumen, por día, por vendedor, top productos
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *         description: Fecha inicio (ISO 8601)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *         description: Fecha fin (ISO 8601)
 *     responses:
 *       200:
 *         description: Datos del reporte de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalSales: { type: integer }
 *                         totalRevenue: { type: number }
 *                         totalIgv: { type: number }
 *                     byDay:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date: { type: string }
 *                           count: { type: integer }
 *                           revenue: { type: number }
 *                     bySeller:
 *                       type: array
 *                     topProducts:
 *                       type: array
 */
router.get('/sales', reportController.salesReport);

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Reporte de inventario — resumen, stock bajo y por categoría
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Datos del reporte de inventario
 */
router.get('/inventory', reportController.inventoryReport);

/**
 * @swagger
 * /api/reports/customers:
 *   get:
 *     summary: Reporte de clientes — resumen y top 10 por compras
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Datos del reporte de clientes
 */
router.get('/customers', reportController.customerReport);

export default router;
