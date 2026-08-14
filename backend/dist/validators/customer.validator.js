"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerQuerySchema = exports.customerParamsSchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const customerBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre es requerido'),
    documentType: zod_1.z.enum(['DNI', 'RUC', 'CE']),
    documentNumber: zod_1.z.string().min(8, 'Número de documento inválido'),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    address: zod_1.z.string().optional(),
});
exports.createCustomerSchema = zod_1.z.object({
    body: customerBodySchema,
});
exports.updateCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string() }),
    body: customerBodySchema.partial(),
});
exports.customerParamsSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
});
exports.customerQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    }),
});
//# sourceMappingURL=customer.validator.js.map