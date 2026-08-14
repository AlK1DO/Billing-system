import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createMovementSchema, movementQuerySchema } from '../validators/inventory.validator';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Alertas de stock — productos con stock bajo o agotado
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Listas de productos con stock bajo y agotados
 */
router.get('/', inventoryController.getInventory);

/**
 * @swagger
 * /api/inventory/movements:
 *   get:
 *     summary: Historial de movimientos de inventario
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [entry, sale, return, adjustment] }
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
 *       200: { description: Lista paginada de movimientos }
 */
router.get('/movements', validate(movementQuerySchema), inventoryController.getMovements);

/**
 * @swagger
 * /api/inventory/movements:
 *   post:
 *     summary: Registrar ajuste manual de inventario (solo admin)
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateMovementRequest' }
 *           example:
 *             productId: 1
 *             type: entry
 *             quantity: 10
 *             reason: Compra de mercadería
 *     responses:
 *       201: { description: Movimiento registrado y stock actualizado }
 *       400: { description: Stock insuficiente }
 *       404: { description: Producto no encontrado }
 */
router.post('/movements', authorize('admin'), validate(createMovementSchema), inventoryController.createMovement);

export default router;
