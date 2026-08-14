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
export type MovementType = 'entry' | 'sale' | 'return' | 'adjustment';
export interface InventoryMovement {
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    type: MovementType;
    quantity: number;
    previousStock: number;
    currentStock: number;
    reason?: string;
    referenceId?: string;
    userId: string;
    userName: string;
    companyId: string;
    createdAt: Date;
}
export interface CreateMovementDto {
    productId: string;
    type: MovementType;
    quantity: number;
    reason?: string;
    referenceId?: string;
}
//# sourceMappingURL=inventory.model.d.ts.map