import { Product } from '../models/product.model';
export declare function getSalesReport(companyId: string, from?: string, to?: string): Promise<{
    summary: {
        totalSales: number;
        totalRevenue: number;
        averageTicket: number;
    };
    byDay: {
        total: number;
        count: number;
        date: string;
    }[];
    bySeller: {
        name: string;
        total: number;
        count: number;
    }[];
    topProducts: {
        name: string;
        quantity: number;
        total: number;
        id: string;
    }[];
}>;
export declare function getInventoryReport(companyId: string): Promise<{
    summary: {
        totalProducts: number;
        activeProducts: number;
        totalValue: number;
        totalCostValue: number;
    };
    lowStock: Product[];
    outOfStock: Product[];
    byCategory: {
        count: number;
        totalValue: number;
        category: string;
    }[];
}>;
export declare function getCustomerReport(companyId: string): Promise<{
    summary: {
        total: number;
        newThisMonth: number;
    };
    topCustomers: {
        id: string;
        name: string;
        documentNumber: string;
        totalPurchased: number;
        lastPurchaseAt: Date | undefined;
    }[];
}>;
//# sourceMappingURL=report.service.d.ts.map