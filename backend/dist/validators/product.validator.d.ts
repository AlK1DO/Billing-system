import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        sku: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        category: z.ZodString;
        price: z.ZodNumber;
        cost: z.ZodNumber;
        stock: z.ZodNumber;
        minStock: z.ZodDefault<z.ZodNumber>;
        imageUrl: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["active", "inactive"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "active" | "inactive";
        sku: string;
        description: string;
        category: string;
        price: number;
        cost: number;
        stock: number;
        minStock: number;
        imageUrl?: string | undefined;
    }, {
        name: string;
        sku: string;
        category: string;
        price: number;
        cost: number;
        stock: number;
        status?: "active" | "inactive" | undefined;
        description?: string | undefined;
        minStock?: number | undefined;
        imageUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        status: "active" | "inactive";
        sku: string;
        description: string;
        category: string;
        price: number;
        cost: number;
        stock: number;
        minStock: number;
        imageUrl?: string | undefined;
    };
}, {
    body: {
        name: string;
        sku: string;
        category: string;
        price: number;
        cost: number;
        stock: number;
        status?: "active" | "inactive" | undefined;
        description?: string | undefined;
        minStock?: number | undefined;
        imageUrl?: string | undefined;
    };
}>;
export declare const updateProductSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        sku: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
        category: z.ZodOptional<z.ZodString>;
        price: z.ZodOptional<z.ZodNumber>;
        cost: z.ZodOptional<z.ZodNumber>;
        stock: z.ZodOptional<z.ZodNumber>;
        minStock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["active", "inactive"]>>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        status?: "active" | "inactive" | undefined;
        sku?: string | undefined;
        description?: string | undefined;
        category?: string | undefined;
        price?: number | undefined;
        cost?: number | undefined;
        stock?: number | undefined;
        minStock?: number | undefined;
        imageUrl?: string | undefined;
    }, {
        name?: string | undefined;
        status?: "active" | "inactive" | undefined;
        sku?: string | undefined;
        description?: string | undefined;
        category?: string | undefined;
        price?: number | undefined;
        cost?: number | undefined;
        stock?: number | undefined;
        minStock?: number | undefined;
        imageUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        status?: "active" | "inactive" | undefined;
        sku?: string | undefined;
        description?: string | undefined;
        category?: string | undefined;
        price?: number | undefined;
        cost?: number | undefined;
        stock?: number | undefined;
        minStock?: number | undefined;
        imageUrl?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        status?: "active" | "inactive" | undefined;
        sku?: string | undefined;
        description?: string | undefined;
        category?: string | undefined;
        price?: number | undefined;
        cost?: number | undefined;
        stock?: number | undefined;
        minStock?: number | undefined;
        imageUrl?: string | undefined;
    };
}>;
export declare const productParamsSchema: z.ZodObject<{
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
export declare const productQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive"]>>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        status?: "active" | "inactive" | undefined;
        category?: string | undefined;
        search?: string | undefined;
    }, {
        status?: "active" | "inactive" | undefined;
        category?: string | undefined;
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        limit: number;
        status?: "active" | "inactive" | undefined;
        category?: string | undefined;
        search?: string | undefined;
    };
}, {
    query: {
        status?: "active" | "inactive" | undefined;
        category?: string | undefined;
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    };
}>;
//# sourceMappingURL=product.validator.d.ts.map