"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Correo inválido'),
        password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        companyName: zod_1.z.string().min(2, 'El nombre de empresa es requerido'),
        email: zod_1.z.string().email('Correo inválido'),
        password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: zod_1.z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    }),
});
//# sourceMappingURL=auth.validator.js.map