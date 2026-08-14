import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createCustomerSchema,
  updateCustomerSchema,
  customerParamsSchema,
  customerQuerySchema,
} from '../validators/customer.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Listar clientes con paginación y búsqueda
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Buscar por nombre, correo o número de documento
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista paginada de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get('/', validate(customerQuerySchema), customerController.getCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Datos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Customer' }
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', validate(customerParamsSchema), customerController.getCustomer);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Crear cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, documentType, documentNumber]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               documentType: { type: string, enum: [DNI, RUC, CE, PASSPORT] }
 *               documentNumber: { type: string }
 *     responses:
 *       201:
 *         description: Cliente creado
 *       409:
 *         description: Número de documento ya registrado
 */
router.post('/', validate(createCustomerSchema), customerController.createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
router.put('/:id', validate(updateCustomerSchema), customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Eliminar cliente (solo admin)
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete(
  '/:id',
  authorize('admin'),
  validate(customerParamsSchema),
  customerController.deleteCustomer
);

export default router;
