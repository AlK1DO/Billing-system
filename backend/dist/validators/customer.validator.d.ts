import { z } from 'zod';
export declare const createCustomerSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        documentType: z.ZodEnum<["DNI", "RUC", "CE"]>;
        documentNumber: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        documentType: "DNI" | "RUC" | "CE";
        documentNumber: string;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }, {
        name: string;
        documentType: "DNI" | "RUC" | "CE";
        documentNumber: string;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        documentType: "DNI" | "RUC" | "CE";
        documentNumber: string;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    };
}, {
    body: {
        name: string;
        documentType: "DNI" | "RUC" | "CE";
        documentNumber: string;
        email?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    };
}>;
export declare const updateCustomerSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        documentType: z.ZodOptional<z.ZodEnum<["DNI", "RUC", "CE"]>>;
        documentNumber: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        email?: string | undefined;
        documentType?: "DNI" | "RUC" | "CE" | undefined;
        documentNumber?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }, {
        name?: string | undefined;
        email?: string | undefined;
        documentType?: "DNI" | "RUC" | "CE" | undefined;
        documentNumber?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        email?: string | undefined;
        documentType?: "DNI" | "RUC" | "CE" | undefined;
        documentNumber?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        email?: string | undefined;
        documentType?: "DNI" | "RUC" | "CE" | undefined;
        documentNumber?: string | undefined;
        phone?: string | undefined;
        address?: string | undefined;
    };
}>;
export declare const customerParamsSchema: z.ZodObject<{
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
export declare const customerQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        search?: string | undefined;
    }, {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        limit: number;
        search?: string | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    };
}>;
//# sourceMappingURL=customer.validator.d.ts.map