import { z } from 'zod';
export declare const createMovementSchema: z.ZodObject<{
    body: z.ZodObject<{
        productId: z.ZodString;
        type: z.ZodEnum<["entry", "return", "adjustment"]>;
        quantity: z.ZodEffects<z.ZodNumber, number, number>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "entry" | "return" | "adjustment";
        productId: string;
        quantity: number;
        reason?: string | undefined;
    }, {
        type: "entry" | "return" | "adjustment";
        productId: string;
        quantity: number;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: "entry" | "return" | "adjustment";
        productId: string;
        quantity: number;
        reason?: string | undefined;
    };
}, {
    body: {
        type: "entry" | "return" | "adjustment";
        productId: string;
        quantity: number;
        reason?: string | undefined;
    };
}>;
export declare const movementQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        productId: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["entry", "sale", "return", "adjustment"]>>;
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        type?: "entry" | "sale" | "return" | "adjustment" | undefined;
        productId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    }, {
        type?: "entry" | "sale" | "return" | "adjustment" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        productId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        limit: number;
        type?: "entry" | "sale" | "return" | "adjustment" | undefined;
        productId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    };
}, {
    query: {
        type?: "entry" | "sale" | "return" | "adjustment" | undefined;
        page?: number | undefined;
        limit?: number | undefined;
        productId?: string | undefined;
        from?: string | undefined;
        to?: string | undefined;
    };
}>;
//# sourceMappingURL=inventory.validator.d.ts.map