import { z } from 'zod';

const customerBodySchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  documentType: z.enum(['DNI', 'RUC', 'CE', 'PASSPORT']),
  documentNumber: z.string().min(8, 'Número de documento inválido'),
  phone: z.string().optional(),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  address: z.string().optional(),
});

export const createCustomerSchema = z.object({
  body: customerBodySchema,
});

export const updateCustomerSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
  body: customerBodySchema.partial(),
});

export const customerParamsSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

export const customerQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
