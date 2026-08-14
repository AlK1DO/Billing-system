import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';
interface ProductQuery {
    search?: string;
    category?: string;
    status?: 'active' | 'inactive';
    page: number;
    limit: number;
}
export declare function getProducts(companyId: string, query: ProductQuery): Promise<import("../utils/pagination").PaginatedResponse<Product>>;
export declare function getProductById(id: string, companyId: string): Promise<Product>;
export declare function createProduct(data: CreateProductDto): Promise<Product>;
export declare function updateProduct(id: string, companyId: string, data: UpdateProductDto): Promise<{
    updatedAt: Date;
    name: string;
    companyId: string;
    status: import("../models/product.model").ProductStatus;
    sku: string;
    description: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    imageUrl?: string;
    id: string;
    createdAt: Date;
}>;
export declare function deleteProduct(id: string, companyId: string): Promise<void>;
export {};
//# sourceMappingURL=product.service.d.ts.map