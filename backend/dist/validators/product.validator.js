"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.productParamsSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const productBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre es requerido'),
    sku: zod_1.z.string().min(1, 'El SKU es requerido'),
    description: zod_1.z.string().optional().default(''),
    category: zod_1.z.string().min(1, 'La categoría es requerida'),
    price: zod_1.z.number().positive('El precio debe ser mayor a 0'),
    cost: zod_1.z.number().nonnegative('El costo no puede ser negativo'),
    stock: zod_1.z.number().int().nonnegative('El stock no puede ser negativo'),
    minStock: zod_1.z.number().int().nonnegative().default(5),
    imageUrl: zod_1.z.string().url().optional(),
    status: zod_1.z.enum(['active', 'inactive']).default('active'),
});
exports.createProductSchema = zod_1.z.object({
    body: productBodySchema,
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string() }),
    body: productBodySchema.partial(),
});
exports.productParamsSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
});
exports.productQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        search: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive']).optional(),
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    }),
});
//# sourceMappingURL=product.validator.js.map