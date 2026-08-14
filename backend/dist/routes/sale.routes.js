"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saleController = __importStar(require("../controllers/sale.controller"));
const authenticate_1 = require("../middlewares/authenticate");
const validate_1 = require("../middlewares/validate");
const sale_validator_1 = require("../validators/sale.validator");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
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
router.get('/', (0, validate_1.validate)(sale_validator_1.saleQuerySchema), saleController.getSales);
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
router.get('/:id', (0, validate_1.validate)(sale_validator_1.saleParamsSchema), saleController.getSale);
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
router.post('/', (0, validate_1.validate)(sale_validator_1.createSaleSchema), saleController.createSale);
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
router.patch('/:id/cancel', (0, validate_1.validate)(sale_validator_1.saleParamsSchema), saleController.cancelSale);
exports.default = router;
//# sourceMappingURL=sale.routes.js.map