"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userParamsSchema = exports.updateCompanySchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        email: zod_1.z.string().email('Correo inválido'),
        password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        role: zod_1.z.enum(['admin', 'seller'], {
            errorMap: () => ({ message: 'El rol debe ser admin o seller' }),
        }),
    }),
});
exports.updateCompanySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        ruc: zod_1.z.string().min(11).max(11).optional(),
        address: zod_1.z.string().optional(),
        logoUrl: zod_1.z.string().url('URL de logo inválida').optional(),
        phone: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Correo inválido').optional(),
    }),
});
exports.userParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'ID requerido'),
    }),
});
//# sourceMappingURL=config.validator.js.map