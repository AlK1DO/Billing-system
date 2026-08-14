"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleQuerySchema = exports.saleParamsSchema = exports.createSaleSchema = void 0;
const zod_1 = require("zod");
exports.createSaleSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().min(1, 'El cliente es requerido'),
        items: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string().min(1),
            quantity: zod_1.z.number().int().positive('La cantidad debe ser mayor a 0'),
        }))
            .min(1, 'La venta debe tener al menos un producto'),
        notes: zod_1.z.string().optional(),
    }),
});
exports.saleParamsSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
});
exports.saleQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        customerId: zod_1.z.string().optional(),
        sellerId: zod_1.z.string().optional(),
        status: zod_1.z.enum(['pending', 'completed', 'cancelled']).optional(),
        from: zod_1.z.string().optional(),
        to: zod_1.z.string().optional(),
        page: zod_1.z.coerce.number().int().positive().default(1),
        limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    }),
});
//# sourceMappingURL=sale.validator.js.map