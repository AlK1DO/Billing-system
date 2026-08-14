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
const inventoryController = __importStar(require("../controllers/inventory.controller"));
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const validate_1 = require("../middlewares/validate");
const inventory_validator_1 = require("../validators/inventory.validator");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Alertas de stock — productos con stock bajo o agotado
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Listas de productos con stock bajo y agotados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     lowStock:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Product' }
 *                     outOfStock:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Product' }
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
 *         schema: { type: string }
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
 *       200:
 *         description: Lista paginada de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/InventoryMovement' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/movements', (0, validate_1.validate)(inventory_validator_1.movementQuerySchema), inventoryController.getMovements);
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
 *           schema:
 *             type: object
 *             required: [productId, type, quantity]
 *             properties:
 *               productId: { type: string }
 *               type:
 *                 type: string
 *                 enum: [entry, return, adjustment]
 *               quantity:
 *                 type: integer
 *                 description: Positivo para entrada, negativo para salida
 *               reason: { type: string }
 *     responses:
 *       201:
 *         description: Movimiento registrado y stock actualizado
 *       400:
 *         description: Stock insuficiente
 *       404:
 *         description: Producto no encontrado
 */
router.post('/movements', (0, authorize_1.authorize)('admin'), (0, validate_1.validate)(inventory_validator_1.createMovementSchema), inventoryController.createMovement);
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map