"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movementQuerySchema = exports.createMovementSchema = void 0;
const zod_1 = require("zod");
exports.createMovementSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string().min(1, 'El producto es requerido'),
        type: zod_1.z.enum(['entry', 'return', 'adjustment']),
        quantity: zod_1.z.number().int().refine((v) => v !== 0, { message: 'La cantidad no puede ser 0' }),
        reason: zod_1.z.string().optional(),
    }),
});
exports.movementQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        productId: zod_1.z.string().optional(),
        type: zod_1.z.enum(['entry', 'sale', 'return', 'adjustment']).optional(),
        from: zod_1.z.string().optional(),
        to: zod_1.z.string().optional(),
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    }),
});
//# sourceMappingURL=inventory.validator.js.map