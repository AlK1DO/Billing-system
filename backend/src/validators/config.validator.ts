import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['admin', 'seller'], {
      errorMap: () => ({ message: 'El rol debe ser admin o seller' }),
    }),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    ruc: z.string().min(11).max(11).optional(),
    address: z.string().optional(),
    logoUrl: z.string().url('URL de logo inválida').optional(),
    phone: z.string().optional(),
    email: z.string().email('Correo inválido').optional(),
  }),
});

export const userParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('ID inválido'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>['body'];
