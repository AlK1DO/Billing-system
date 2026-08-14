import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        companyName: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        email: string;
        password: string;
        companyName: string;
        confirmPassword: string;
    }, {
        name: string;
        email: string;
        password: string;
        companyName: string;
        confirmPassword: string;
    }>, {
        name: string;
        email: string;
        password: string;
        companyName: string;
        confirmPassword: string;
    }, {
        name: string;
        email: string;
        password: string;
        companyName: string;
        confirmPassword: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        email: string;
        password: string;
        companyName: string;
        confirmPassword: string;
    };
}, {
    body: {
        name: string;
        email: string;
        password: string;
        companyName: string;
        confirmPassword: string;
    };
}>;
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RegisterInput = z.infer<typeof registerSchema>['body'];
//# sourceMappingURL=auth.validator.d.ts.map