import { z } from 'zod';

const saleItemSchema = z.object({
  productId: z.number().int().positive('ID de producto inválido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

export const createSaleSchema = z.object({
  body: z.object({
    customerId: z.number().int().positive('El cliente es requerido'),
    items: z
      .array(saleItemSchema)
      .min(1, 'La venta debe tener al menos un producto')
      .superRefine((items, ctx) => {
        const seen = new Set<number>();
        items.forEach((item, index) => {
          if (seen.has(item.productId)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, 'productId'],
              message: 'El producto no puede repetirse en la misma venta',
            });
          }
          seen.add(item.productId);
        });
      }),
    notes: z.string().max(500, 'Las notas no pueden superar los 500 caracteres').optional(),
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
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
