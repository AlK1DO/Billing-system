import { Sale, CreateSaleDto, SaleItem } from '../models/sale.model';
import { JwtPayload } from '../middlewares/authenticate';
interface SaleQuery {
    customerId?: string;
    sellerId?: string;
    status?: string;
    from?: string;
    to?: string;
    page: number;
    limit: number;
}
export declare function getSales(companyId: string, query: SaleQuery): Promise<import("../utils/pagination").PaginatedResponse<Sale>>;
export declare function getSaleById(id: string, companyId: string): Promise<Sale>;
export declare function createSale(input: CreateSaleDto, seller: JwtPayload): Promise<{
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("../models/sale.model").SaleStatus;
    customerId: string;
    sellerId: string;
    customerName: string;
    customerDocument: string;
    items: SaleItem[];
    subtotal: number;
    igv: number;
    total: number;
    sellerName: string;
    receiptNumber: string;
    notes?: string | undefined;
    id: string;
}>;
export declare function cancelSale(id: string, companyId: string, userId: string, userEmail: string): Promise<{
    status: string;
    updatedAt: Date;
    id: string;
    customerId: string;
    customerName: string;
    customerDocument: string;
    items: SaleItem[];
    subtotal: number;
    igv: number;
    total: number;
    sellerId: string;
    sellerName: string;
    companyId: string;
    receiptNumber: string;
    notes?: string;
    createdAt: Date;
}>;
export {};
//# sourceMappingURL=sale.service.d.ts.map