/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         documentType:
 *           type: string
 *           enum: [DNI, RUC, CE, PASSPORT]
 *         documentNumber:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         companyId:
 *           type: integer
 */

export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASSPORT';

export interface Customer {
  id: number;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  totalPurchased: number;
  lastPurchaseAt?: Date | null;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCustomerDto = Omit<
  Customer,
  'id' | 'totalPurchased' | 'lastPurchaseAt' | 'createdAt' | 'updatedAt'
>;
export type UpdateCustomerDto = Partial<CreateCustomerDto>;
