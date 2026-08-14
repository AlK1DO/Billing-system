import { z } from 'zod';
export declare const createSaleSchema: z.ZodObject<{
    body: z.ZodObject<{
        customerId: z.ZodString;
        items: z.ZodArray<z.ZodObject<{
            productId: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            productId: string;
            quantity: number;
        }, {
            productId: string;
            quantity: number;
        }>, "many">;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        customerId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
        notes?: string | undefined;
    }, {
        customerId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
        notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        customerId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
        notes?: string | undefined;
    };
}, {
    body: {
        customerId: string;
        items: {
            productId: string;
            quantity: number;
        }[];
        notes?: string | undefined;
    };
}>;
export declare const saleParamsSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const saleQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        customerId: z.ZodOptional<z.ZodString>;
        sellerId: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["pending", "completed", "cancelled"]>>;
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        status?: "pending" | "completed" | "cancelled" | undefined;
        customerId?: string | undefined;
        sellerId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    }, {
        status?: "pending" | "completed" | "cancelled" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        customerId?: string | undefined;
        sellerId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        limit: number;
        status?: "pending" | "completed" | "cancelled" | undefined;
        customerId?: string | undefined;
        sellerId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    };
}, {
    query: {
        status?: "pending" | "completed" | "cancelled" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        customerId?: string | undefined;
        sellerId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    };
}>;
//# sourceMappingURL=sale.validator.d.ts.map