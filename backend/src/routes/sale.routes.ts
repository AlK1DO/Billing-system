import { Router } from 'express';
import * as saleController from '../controllers/sale.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { createSaleSchema, saleParamsSchema, saleQuerySchema } from '../validators/sale.validator';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Listar ventas con paginación y filtros
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema: { type: integer }
 *       - in: query
 *         name: sellerId
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, completed, cancelled] }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de ventas
 */
router.get('/', validate(saleQuerySchema), saleController.getSales);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Obtener venta por ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Venta encontrada }
 *       404: { description: Venta no encontrada }
 */
router.get('/:id', validate(saleParamsSchema), saleController.getSale);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Registrar nueva venta
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateSaleRequest' }
 *           example:
 *             customerId: 1
 *             notes: Venta mostrador
 *             items:
 *               - productId: 1
 *                 quantity: 2
 *     responses:
 *       201: { description: Venta creada; stock e inventario actualizados mediante transacción }
 *       400: { description: Stock insuficiente o producto inactivo }
 *       404: { description: Cliente o producto no encontrado }
 */
router.post('/', validate(createSaleSchema), saleController.createSale);

/**
 * @swagger
 * /api/sales/{id}/cancel:
 *   patch:
 *     summary: Cancelar venta y revertir stock
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Venta cancelada y stock revertido }
 *       400: { description: La venta ya está cancelada }
 *       404: { description: Venta no encontrada }
 */
router.patch('/:id/cancel', validate(saleParamsSchema), saleController.cancelSale);

export default router;
