/**
 * @swagger
 * components:
 *   schemas:
 *     SaleItem:
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
 *         quantity:
 *           type: integer
 *         unitPrice:
 *           type: number
 *         subtotal:
 *           type: number
 *     Sale:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         customerId:
 *           type: integer
 *         customerName:
 *           type: string
 *         customerDocument:
 *           type: string
 *         sellerId:
 *           type: integer
 *         sellerName:
 *           type: string
 *         receiptNumber:
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
 *         companyId:
 *           type: integer
 */

export type SaleStatus = 'pending' | 'completed' | 'cancelled';

export interface SaleItem {
  id?: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  customerId: number;
  customerName: string;
  customerDocument: string;
  items: SaleItem[];
  subtotal: number;
  igv: number;
  total: number;
  status: SaleStatus;
  sellerId: number;
  sellerName: string;
  companyId: number;
  receiptNumber: string;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSaleItemDto {
  productId: number;
  quantity: number;
}

export interface CreateSaleDto {
  customerId: number;
  items: CreateSaleItemDto[];
  notes?: string;
}
