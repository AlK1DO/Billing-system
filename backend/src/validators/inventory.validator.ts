import { z } from 'zod';

export const createMovementSchema = z.object({
  body: z.object({
    productId: z.number().int().positive('El producto es requerido'),
    type: z.enum(['entry', 'return', 'adjustment']),
    quantity: z.number().int().refine((v) => v !== 0, { message: 'La cantidad no puede ser 0' }),
    reason: z.string().optional(),
  }),
});

export const movementQuerySchema = z.object({
  query: z.object({
    productId: z.coerce.number().int().positive().optional(),
    type: z.enum(['entry', 'sale', 'return', 'adjustment']).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
