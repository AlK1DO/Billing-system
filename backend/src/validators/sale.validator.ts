import { z } from 'zod';

export const createSaleSchema = z.object({
  body: z.object({
    customerId: z.number().int().positive('El cliente es requerido'),
    items: z
      .array(
        z.object({
          productId: z.number().int().positive('ID de producto inválido'),
          quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
        })
      )
      .min(1, 'La venta debe tener al menos un producto'),
    notes: z.string().optional(),
  }),
});

export const saleParamsSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

export const saleQuerySchema = z.object({
  query: z.object({
    customerId: z.coerce.number().int().positive().optional(),
    sellerId: z.coerce.number().int().positive().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
