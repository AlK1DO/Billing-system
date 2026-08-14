import { Router } from 'express';
import * as saleController from '../controllers/sale.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  createSaleSchema,
  saleParamsSchema,
  saleQuerySchema,
} from '../validators/sale.validator';

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
 *         schema: { type: string }
 *       - in: query
 *         name: sellerId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [completed, cancelled] }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *         description: Fecha inicio (ISO 8601)
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *         description: Fecha fin (ISO 8601)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
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
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Datos de la venta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Sale' }
 *       404:
 *         description: Venta no encontrada
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
 *           schema:
 *             type: object
 *             required: [customerId, items]
 *             properties:
 *               customerId:
 *                 type: string
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201:
 *         description: Venta creada. Actualiza stock e inventario automáticamente.
 *       400:
 *         description: Stock insuficiente o producto inactivo
 *       404:
 *         description: Cliente o producto no encontrado
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
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Venta cancelada. Stock revertido automáticamente.
 *       400:
 *         description: La venta ya está cancelada
 *       404:
 *         description: Venta no encontrada
 */
router.patch('/:id/cancel', validate(saleParamsSchema), saleController.cancelSale);

export default router;
