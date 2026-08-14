import { z } from 'zod';

const productBodySchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().optional().default(''),
  categoryId: z.number().int().positive('ID de categoría inválido').nullable().optional(),
  price: z.number().positive('El precio debe ser mayor a 0'),
  cost: z.number().nonnegative('El costo no puede ser negativo').optional().default(0),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  minStock: z.number().int().nonnegative().optional().default(5),
  imageUrl: z.string().url('URL de imagen inválida').optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export const createProductSchema = z.object({
  body: productBodySchema,
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
  body: productBodySchema.partial(),
});

export const productParamsSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido') }),
});

export const productQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});
