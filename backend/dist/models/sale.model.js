"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     SaleItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *         productName:
 *           type: string
 *         quantity:
 *           type: number
 *         unitPrice:
 *           type: number
 *         subtotal:
 *           type: number
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customerId:
 *           type: string
 *         customerName:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleItem'
 *         subtotal:
 *           type: number
 *         igv:
 *           type: number
 *         total:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *         sellerId:
 *           type: string
 *         companyId:
 *           type: string
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=sale.model.js.map