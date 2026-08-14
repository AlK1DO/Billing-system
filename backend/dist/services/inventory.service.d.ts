import { InventoryMovement, CreateMovementDto } from '../models/inventory.model';
import { Product } from '../models/product.model';
import { JwtPayload } from '../middlewares/authenticate';
interface MovementQuery {
    productId?: string;
    type?: string;
    from?: string;
    to?: string;
    page: number;
    limit: number;
}
export declare function getMovements(companyId: string, query: MovementQuery): Promise<import("../utils/pagination").PaginatedResponse<InventoryMovement>>;
export declare function getLowStockProducts(companyId: string): Promise<{
    lowStock: Product[];
    outOfStock: Product[];
}>;
export declare function createMovement(data: CreateMovementDto, user: JwtPayload): Promise<{
    companyId: string;
    createdAt: Date;
    type: import("../models/inventory.model").MovementType;
    productId: string;
    productName: string;
    productSku: string;
    quantity: number;
    previousStock: number;
    currentStock: number;
    reason?: string | undefined;
    referenceId?: string | undefined;
    userId: string;
    userName: string;
    id: string;
}>;
export {};
//# sourceMappingURL=inventory.service.d.ts.map