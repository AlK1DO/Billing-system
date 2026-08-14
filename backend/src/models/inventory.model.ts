/**
 * @swagger
 * components:
 *   schemas:
 *     InventoryMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         productId:
 *           type: integer
 *         productName:
 *           type: string
 *         productSku:
 *           type: string
 *         type:
 *           type: string
 *           enum: [entry, sale, return, adjustment]
 *         quantity:
 *           type: integer
 *         previousStock:
 *           type: integer
 *         currentStock:
 *           type: integer
 *         reason:
 *           type: string
 *         saleId:
 *           type: integer
 *           nullable: true
 *         userId:
 *           type: integer
 *         userName:
 *           type: string
 *         companyId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export type MovementType = 'entry' | 'sale' | 'return' | 'adjustment';

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  type: MovementType;
  quantity: number;          // positivo = entrada, negativo = salida
  previousStock: number;
  currentStock: number;
  reason?: string | null;
  saleId?: number | null;
  userId: number;
  userName: string;
  companyId: number;
  createdAt: Date;
}

export interface CreateMovementDto {
  productId: number;
  type: MovementType;
  quantity: number;
  reason?: string;
  saleId?: number;
}
