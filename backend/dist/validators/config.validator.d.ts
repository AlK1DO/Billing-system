import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodEnum<["admin", "seller"]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        role: "admin" | "seller";
        password: string;
    }, {
        name: string;
        email: string;
        role: "admin" | "seller";
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        role: "admin" | "seller";
        password: string;
    };
}, {
    body: {
        name: string;
        email: string;
        role: "admin" | "seller";
        password: string;
    };
}>;
export declare const updateCompanySchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        ruc: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        logoUrl: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        ruc?: string | undefined;
        logoUrl?: string | undefined;
    }, {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        ruc?: string | undefined;
        logoUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        ruc?: string | undefined;
        logoUrl?: string | undefined;
    };
}, {
    body: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        ruc?: string | undefined;
        logoUrl?: string | undefined;
    };
}>;
export declare const userParamsSchema: z.ZodObject<{
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
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>['body'];
//# sourceMappingURL=config.validator.d.ts.map