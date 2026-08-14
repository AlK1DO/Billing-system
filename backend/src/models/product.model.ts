/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryRef:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         categoryId:
 *           type: integer
 *           nullable: true
 *         category:
 *           $ref: '#/components/schemas/CategoryRef'
 *         price:
 *           type: number
 *         cost:
 *           type: number
 *         stock:
 *           type: integer
 *         minStock:
 *           type: integer
 *         imageUrl:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         companyId:
 *           type: integer
 */

export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
  } | null;
  price: number;
  cost: number | null;
  stock: number;
  minStock: number;
  imageUrl?: string | null;
  status: ProductStatus;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>;
export type UpdateProductDto = Partial<CreateProductDto>;
