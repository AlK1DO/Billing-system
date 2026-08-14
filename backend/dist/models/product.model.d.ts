/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         sku:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         cost:
 *           type: number
 *         stock:
 *           type: number
 *         minStock:
 *           type: number
 *         imageUrl:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         companyId:
 *           type: string
 */
export type ProductStatus = 'active' | 'inactive';
export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    imageUrl?: string;
    status: ProductStatus;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}
export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDto = Partial<CreateProductDto>;
//# sourceMappingURL=product.model.d.ts.map