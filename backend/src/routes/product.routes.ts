import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
  productQuerySchema,
} from '../validators/product.validator';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos con paginación y filtros
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Buscar por nombre o SKU
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, minimum: 1 }
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Product' } }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', validate(productQuerySchema), productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema: { type: object, properties: { success: { type: boolean }, data: { $ref: '#/components/schemas/Product' } } }
 *       404: { description: Producto no encontrado }
 */
router.get('/:id', validate(productParamsSchema), productController.getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto (solo admin)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *           example:
 *             name: Laptop Lenovo IdeaPad
 *             sku: LEN-001
 *             description: Laptop para oficina
 *             price: 2499.90
 *             cost: 2000.00
 *             stock: 10
 *             minStock: 3
 *             categoryId: 1
 *             imageUrl: https://example.com/laptop.jpg
 *     responses:
 *       201: { description: Producto creado }
 *       409: { description: SKU ya existe }
 */
router.post('/', authorize('admin'), validate(createProductSchema), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto (solo admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateProductRequest' }
 *     responses:
 *       200: { description: Producto actualizado }
 *       404: { description: Producto no encontrado }
 */
router.put('/:id', authorize('admin'), validate(updateProductSchema), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto (solo admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Producto eliminado }
 *       404: { description: Producto no encontrado }
 */
router.delete('/:id', authorize('admin'), validate(productParamsSchema), productController.deleteProduct);

export default router;
