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
export type SaleStatus = 'pending' | 'completed' | 'cancelled';
export interface SaleItem {
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}
export interface Sale {
    id: string;
    customerId: string;
    customerName: string;
    customerDocument: string;
    items: SaleItem[];
    subtotal: number;
    igv: number;
    total: number;
    status: SaleStatus;
    sellerId: string;
    sellerName: string;
    companyId: string;
    receiptNumber: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateSaleItemDto {
    productId: string;
    quantity: number;
}
export interface CreateSaleDto {
    customerId: string;
    items: CreateSaleItemDto[];
    notes?: string;
}
//# sourceMappingURL=sale.model.d.ts.map