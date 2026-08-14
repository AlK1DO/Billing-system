"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         productId:
 *           type: string
 *         productName:
 *           type: string
 *         type:
 *           type: string
 *           enum: [entry, sale, return, adjustment]
 *         quantity:
 *           type: number
 *         previousStock:
 *           type: number
 *         currentStock:
 *           type: number
 *         reason:
 *           type: string
 *         referenceId:
 *           type: string
 *         userId:
 *           type: string
 *         companyId:
 *           type: string
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=inventory.model.js.map