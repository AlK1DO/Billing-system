/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         documentType:
 *           type: string
 *           enum: [DNI, RUC, CE]
 *         documentNumber:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         companyId:
 *           type: string
 */
export type DocumentType = 'DNI' | 'RUC' | 'CE';
export interface Customer {
    id: string;
    name: string;
    documentType: DocumentType;
    documentNumber: string;
    phone?: string;
    email?: string;
    address?: string;
    totalPurchased: number;
    lastPurchaseAt?: Date;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}
export type CreateCustomerDto = Omit<Customer, 'id' | 'totalPurchased' | 'lastPurchaseAt' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDto = Partial<CreateCustomerDto>;
//# sourceMappingURL=customer.model.d.ts.map